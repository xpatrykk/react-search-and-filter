import { build } from "esbuild";
import { readFile, rm, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const pkg = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
execFileSync("node_modules/.bin/tsc", ["-p", "tsconfig.json"], {
  stdio: "inherit",
});
await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  jsx: "automatic",
  banner: { js: '"use client";' },
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
  ],
  logLevel: "warning",
});
execFileSync(
  "node_modules/.bin/tailwindcss",
  ["-i", "src/styles.css", "-o", "dist/styles.css", "--minify"],
  { stdio: "inherit" },
);
// Scope optional utilities and theme tokens so importing CSS cannot restyle the host.
const { default: postcss } = await import("postcss");
const { writeFile } = await import("node:fs/promises");
let css = await readFile("dist/styles.css", "utf8");
css = css.replaceAll("--tw-", "--rsf-tw-");
const tree = postcss.parse(css);
const animationNames = [];
tree.walkAtRules("keyframes", (rule) => {
  animationNames.push(rule.params);
  rule.params = `rsf-${rule.params}`;
});
tree.walkDecls((decl) => {
  if (decl.prop === "animation" || decl.prop.startsWith("--animate-")) {
    for (const name of animationNames)
      decl.value = decl.value.replace(
        new RegExp(`\\b${name}\\b`, "g"),
        `rsf-${name}`,
      );
  }
});
tree.walkRules((rule) => {
  let parent = rule.parent;
  while (parent) {
    if (parent.type === "atrule" && /keyframes$/.test(parent.name)) return;
    parent = parent.parent;
  }
  if (rule.selectors.every((selector) => selector.startsWith(".rsf"))) return;
  if (
    rule.selectors.every(
      (selector) => selector === ":root" || selector === ":host",
    )
  ) {
    rule.selector = ".rsf";
    return;
  }
  rule.selector = rule.selectors
    .flatMap((selector) => [
      `:where(.rsf,.rsf-portal) ${selector}`,
      `:where(.rsf,.rsf-portal):is(${selector})`,
    ])
    .join(",");
});
await writeFile("dist/styles.css", tree.toString());
// NodeNext consumers need explicit JS specifiers in declarations, including directory barrels.
const { readdir, stat } = await import("node:fs/promises");
const { resolve, dirname } = await import("node:path");
async function fixDeclarations(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await fixDeclarations(path);
    else if (entry.name.endsWith(".d.ts")) {
      const contents = await readFile(path, "utf8");
      const matches = [
        ...contents.matchAll(/(?:from\s+|import\s*\(?\s*)["'](\.[^"']+)["']/g),
      ];
      let fixed = contents;
      for (const match of matches) {
        const specifier = match[1];
        const file = resolve(dirname(path), specifier);
        let next = specifier;
        if (!/\.[cm]?js$/.test(specifier)) {
          const isFile = await stat(`${file}.d.ts`).then(
            () => true,
            () => false,
          );
          next = isFile ? `${specifier}.js` : `${specifier}/index.js`;
        }
        fixed = fixed
          .replaceAll(`"${specifier}"`, `"${next}"`)
          .replaceAll(`'${specifier}'`, `'${next}'`);
      }
      await writeFile(path, fixed);
    }
  }
}
await fixDeclarations("dist");
