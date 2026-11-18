import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
const root = process.cwd();
await mkdir("work", { recursive: true });
const result = JSON.parse(
  execFileSync("npm", ["pack", "--json", "--pack-destination", "work"], {
    encoding: "utf8",
  }),
)[0];
assert(
  result.files.every(({ path }) =>
    /^(dist\/|package\.json$|README\.md$|LICENSE$)/.test(path),
  ),
  "Unexpected private/source file in tarball",
);
for (const path of [
  "dist/index.js",
  "dist/index.d.ts",
  "dist/styles.css",
  "README.md",
  "LICENSE",
])
  assert(
    result.files.some((file) => file.path === path),
    `Missing ${path}`,
  );
const runtime = await readFile("dist/index.js", "utf8");
assert(runtime.startsWith('"use client";'));
assert(
  !/@common\/|@components\/|\/Users\/|alma-lunar/.test(runtime),
  "Application dependency or private path leaked",
);
const directory = resolve("work/packed-consumer");
await rm(directory, { recursive: true, force: true });
await mkdir(directory, { recursive: true });
const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
const versions = Object.fromEntries(
  [
    "react",
    "react-dom",
    "@quickstate/core",
    "typescript",
    "@types/react",
    "@types/react-dom",
  ].map((name) => [name, lock.packages[`node_modules/${name}`].version]),
);
await writeFile(
  resolve(directory, "package.json"),
  JSON.stringify(
    {
      private: true,
      type: "module",
      dependencies: {
        ...versions,
        "@patrykparcheta/react-search-and-filter": `file:${resolve("work", result.filename)}`,
      },
    },
    null,
    2,
  ),
);
execFileSync(
  "npm",
  [
    "install",
    "--include=dev",
    "--no-fund",
    "--fetch-timeout=30000",
    "--fetch-retries=1",
  ],
  { cwd: directory, stdio: "pipe" },
);
const consumer = `import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {SearchAndFilterModule,createInitialState,createStoreMethods,type Filter,type SearchAndFilterMessages} from '@patrykparcheta/react-search-and-filter';
import {makeStore} from '@quickstate/core';
const filters:Filter[]=[{type:'select',key:'kind',value:null,label:'Kind',options:[{value:1,label:'One'},{value:'1',label:'String one'},{value:'',label:'Empty'}]}];
const messages:Partial<SearchAndFilterMessages>={searchLabel:'Find a record'};
const state=createInitialState<string>({state:{filters,onDataFetch:async()=>({data:['installed'],total:1}),onRenderResultItem:item=>item,getResultItemKey:item=>item}});
const store=makeStore({initialState:state});await createStoreMethods({store}).retry();
const html=renderToStaticMarkup(createElement(SearchAndFilterModule<string>,{mode:'store',store,messages}));
if(!html.includes('installed')) throw new Error('Packed runtime failed');
console.log('Packed runtime and generic exports verified');
`;
await writeFile(resolve(directory, "consumer.ts"), consumer);
for (const resolution of ["Bundler", "NodeNext"]) {
  const module = resolution === "NodeNext" ? "NodeNext" : "ESNext";
  execFileSync(
    resolve(directory, "node_modules/.bin/tsc"),
    [
      "consumer.ts",
      "--target",
      "ES2022",
      "--module",
      module,
      "--moduleResolution",
      resolution,
      "--strict",
      "--esModuleInterop",
      "--outDir",
      `compiled-${resolution}`,
    ],
    { cwd: directory, stdio: "pipe" },
  );
}
execFileSync("node", ["compiled-NodeNext/consumer.js"], {
  cwd: directory,
  stdio: "inherit",
});
execFileSync("npm", ["audit", "--include=dev", "--audit-level=low"], {
  cwd: directory,
  stdio: "inherit",
});
console.log(
  `Verified ${result.files.length} packaged files, ${result.size} compressed bytes; isolated Bundler + NodeNext consumer passed.`,
);
