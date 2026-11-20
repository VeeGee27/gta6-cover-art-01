// A small static file server for app/ (Node 22, standard library only), so
// the entry can be tried locally with no build step: `node serve.ts` puts
// app/ on http://localhost:8080. It answers with the MIME types an offline
// web app needs, refuses any path that climbs out of app/, and does nothing
// else clever: a development convenience, not a server for the internet.
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(fileURLToPath(new URL("./app", import.meta.url)));
const cliArgs = process.argv.slice(2);
const portFlag = cliArgs.indexOf("--port");
const wanted = portFlag === -1 ? 8080 : Number(cliArgs[portFlag + 1]);
const listenPort = Number.isInteger(wanted) && wanted > 0 && wanted < 65536 ? wanted : 8080;

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".bin": "application/octet-stream",
  ".wasm": "application/wasm",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".txt": "text/plain; charset=utf-8",
};

createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  let path: string;
  try {
    path = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400).end("bad request");
    return;
  }
  if (path.endsWith("/")) path += "index.html";
  const file = resolve(join(appRoot, normalize(path)));
  if (file !== appRoot && !file.startsWith(appRoot + sep)) {
    response.writeHead(403).end("forbidden");
    return;
  }
  let bytes: number;
  try {
    const info = statSync(file);
    if (!info.isFile()) throw new Error("not a file");
    bytes = info.size;
  } catch {
    response.writeHead(404).end("not found");
    return;
  }
  response.writeHead(200, {
    "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
    "content-length": bytes,
    "cache-control": "no-store",
  });
  createReadStream(file).pipe(response);
}).listen(listenPort, "127.0.0.1", () => {
  console.log(`app/ is on http://localhost:${listenPort}`);
});
