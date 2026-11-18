# Development

Keep this library independent of application domains, API transports, analytics and URL policies. React and Quickstate own the existing workflow. Public API changes update README and the working documentation examples together.

One root package.json/package-lock.json owns the library and documentation dependencies. Use Node 22 and `npm ci --include=dev`. Run `npm run docs:build`, `npm run typecheck`, `npm test`, `npm run test:browser` (install Chromium with `npx playwright install chromium`) and `npm run check:pack`. The pack check installs the built artifact into an isolated consumer and verifies Bundler/NodeNext declarations and runtime exports.

Run `npm audit --include=dev --audit-level=low` against the final lockfile before every commit, push and release. Any finding or registry error blocks that action; do not suppress or force-fix advisories. CI covers the complete root graph, package, docs, browser behavior and packed consumer.

Preserve instance isolation, stale-response guards, query intent, error recovery, keyboard access, focus and reduced motion. Keep standalone CSS scoped to the instance, including portals. Use synthetic examples. Never publish credentials, local context, source application history or files under work/.
