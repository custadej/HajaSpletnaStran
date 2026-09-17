// Post-processing for the static export (GitHub Pages demo):
// - writes a root index.html that sends the visitor to their language,
// - adds .nojekyll so files starting with "_" (Next assets) are served.
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const basePath = (process.argv[2] || "").replace(/\/$/, "");
const out = "out";
if (!existsSync(out)) mkdirSync(out);

const html = `<!doctype html>
<html lang="sl">
<head>
<meta charset="utf-8">
<title>HAJA d.o.o.</title>
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="1; url=${basePath}/sl/">
<script>
(function () {
  var langs = (navigator.languages || [navigator.language || "en"]).map(function (l) { return l.slice(0, 2).toLowerCase(); });
  var target = "en";
  for (var i = 0; i < langs.length; i++) {
    if (langs[i] === "sl") { target = "sl"; break; }
    if (langs[i] === "de") { target = "de"; break; }
    if (langs[i] === "en") { target = "en"; break; }
  }
  location.replace("${basePath}/" + target + "/");
})();
</script>
</head>
<body></body>
</html>
`;

writeFileSync(join(out, "index.html"), html);
writeFileSync(join(out, ".nojekyll"), "");
console.log("Static export finished: root redirect + .nojekyll written to", out);
