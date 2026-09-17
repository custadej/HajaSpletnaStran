// Builds the static demo and pushes it to the `gh-pages` branch (GitHub Pages).
// Usage: npm run deploy:pages
//
// The build runs in a throw-away copy of the sources (.pages-build/) so the
// working tree and a running `next dev` are never touched. In the copy the
// proxy (language detection), the contact API route and the dynamic 404 route
// are left out because a static site has no server.
import { execSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const remote = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
const repoName = process.env.PAGES_REPO || remote.replace(/\.git$/, "").split("/").pop();
const owner = remote.match(/github\.com[:/]([^/]+)\//)?.[1] ?? "";
const basePath = `/${repoName}`;
const siteUrl = `https://${owner}.github.io${basePath}`;

const build = join(root, ".pages-build");
const out = join(build, "out");

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: true, ...opts, env: { ...process.env, ...(opts.env || {}) } });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed`);
}

// 1. Fresh copy of the sources (node_modules are resolved from the parent folder).
rmSync(build, { recursive: true, force: true });
mkdirSync(build);
for (const item of ["src", "public", "messages", "scripts", "package.json", "next.config.ts", "tsconfig.json", "postcss.config.mjs", "eslint.config.mjs"]) {
  cpSync(join(root, item), join(build, item), { recursive: true });
}
for (const drop of ["src/proxy.ts", "src/app/api", "src/app/[locale]/[...rest]"]) {
  rmSync(join(build, drop), { recursive: true, force: true });
}

// 2. Static build.
run("npx", ["next", "build"], {
  cwd: build,
  env: {
    STATIC_EXPORT: "true",
    NEXT_PUBLIC_STATIC_EXPORT: "true",
    BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
});
run("node", ["scripts/finish-static-export.mjs", basePath], { cwd: build });
if (!existsSync(join(out, "sl", "index.html"))) throw new Error("Static export did not produce out/sl/index.html");

// 3. Publish `out` as the gh-pages branch (force-pushed, history is not needed).
const name = execSync("git config user.name", { encoding: "utf8" }).trim();
const email = execSync("git config user.email", { encoding: "utf8" }).trim();
writeFileSync(join(out, ".nojekyll"), "");
run("git", ["-C", `"${out}"`, "init", "-q", "-b", "gh-pages"]);
run("git", ["-C", `"${out}"`, "add", "-A"]);
run("git", ["-C", `"${out}"`, "-c", `"user.name=${name}"`, "-c", `"user.email=${email}"`, "commit", "-q", "-m", '"Deploy static demo to GitHub Pages"']);
run("git", ["-C", `"${out}"`, "push", "-f", remote, "HEAD:gh-pages"]);
rmSync(build, { recursive: true, force: true });
console.log(`\nDeployed. The demo will be available at ${siteUrl}/ in a minute or two.`);
