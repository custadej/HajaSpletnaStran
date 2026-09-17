// Builds the static demo and pushes it to the `gh-pages` branch (GitHub Pages).
// Usage: npm run deploy:pages
//
// The static demo has no server, so the proxy (language detection), the contact
// API route and the dynamic 404 route are moved aside for the build and restored
// afterwards. Nothing in the working tree is changed permanently.
import { execSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const repoName = process.env.PAGES_REPO || basenameOfRemote();
const basePath = `/${repoName}`;
const remote = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
const owner = remote.match(/github\.com[:/]([^/]+)\//)?.[1] ?? "";
const siteUrl = `https://${owner}.github.io${basePath}`;

const aside = join(root, ".pages-aside");
const moved = [
  ["src/proxy.ts", "proxy.ts"],
  ["src/app/api", "api"],
  ["src/app/[locale]/[...rest]", "rest"],
];

function basenameOfRemote() {
  const url = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
  return url.replace(/\.git$/, "").split("/").pop();
}

function run(cmd, args, env = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: true, env: { ...process.env, ...env } });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed`);
}

rmSync(aside, { recursive: true, force: true });
mkdirSync(aside);
for (const [from, to] of moved) {
  if (existsSync(join(root, from))) renameSync(join(root, from), join(aside, to));
}

try {
  rmSync(join(root, "out"), { recursive: true, force: true });
  run("npx", ["next", "build"], {
    STATIC_EXPORT: "true",
    NEXT_PUBLIC_STATIC_EXPORT: "true",
    BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  });
} finally {
  for (const [from, to] of moved) {
    if (existsSync(join(aside, to))) renameSync(join(aside, to), join(root, from));
  }
  rmSync(aside, { recursive: true, force: true });
}

run("node", ["scripts/finish-static-export.mjs", basePath]);

// Publish `out` as the gh-pages branch (force-pushed, history is not needed).
const out = join(root, "out");
const name = execSync("git config user.name", { encoding: "utf8" }).trim();
const email = execSync("git config user.email", { encoding: "utf8" }).trim();
rmSync(join(out, ".git"), { recursive: true, force: true });
writeFileSync(join(out, ".nojekyll"), "");
run("git", ["-C", out, "init", "-q", "-b", "gh-pages"]);
run("git", ["-C", out, "add", "-A"]);
run("git", ["-C", out, "-c", `user.name=${name}`, "-c", `user.email=${email}`, "commit", "-q", "-m", "Deploy static demo to GitHub Pages"]);
run("git", ["-C", out, "push", "-f", remote, "HEAD:gh-pages"]);
rmSync(join(out, ".git"), { recursive: true, force: true });
console.log(`\nDeployed. The demo will be available at ${siteUrl}/ in a minute or two.`);
