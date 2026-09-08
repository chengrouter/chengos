/**
 * Regression tests for the /downloads/ route in deploy/bin/ui-server.js.
 *
 * These exist because the bug they cover is invisible to manual testing. The
 * static handler answers any missing file with 200 + index.html, which is
 * correct for an SPA route. Applied to a download it means a user who clicks
 * "download the extension" — when the release forgot to build the artifact —
 * receives the HTML page saved under the name cheng-translate.zip, and the
 * server reports success. Clicking the link and seeing a file appear is exactly
 * the check that passes while the feature is broken.
 *
 * Run with:  node --test deploy/tests/ui-server-downloads.test.mjs
 * (no dependencies; uses the Node built-in test runner)
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import net from "node:net";

/**
 * Send a request line verbatim, bypassing client-side URL normalisation.
 *
 * fetch() resolves "../" segments before the request leaves the process, so a
 * traversal probe sent through fetch never reaches the server as written and the
 * test silently proves nothing. Raw sockets are the only way to assert what the
 * server does with a hostile path.
 */
function rawGet(path) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(PORT, "127.0.0.1", () => {
      socket.write(`GET ${path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n`);
    });
    let data = "";
    socket.setTimeout(5000, () => socket.destroy(new Error("raw request timed out")));
    socket.on("data", (chunk) => (data += chunk));
    socket.on("error", reject);
    socket.on("close", () => {
      const status = Number(data.split("\r\n", 1)[0].split(" ")[1]);
      const body = data.slice(data.indexOf("\r\n\r\n") + 4);
      resolve({ status, body });
    });
  });
}

const HERE = dirname(fileURLToPath(import.meta.url));
const SERVER = join(HERE, "..", "bin", "ui-server.js");
const PORT = 45231;
const BASE = `http://127.0.0.1:${PORT}`;

let uiDir;
let proc;

before(async () => {
  uiDir = await mkdtemp(join(tmpdir(), "ui-server-test-"));
  await writeFile(join(uiDir, "index.html"), "<!doctype html><title>app</title>");
  await mkdir(join(uiDir, "downloads"), { recursive: true });
  await writeFile(join(uiDir, "downloads", "cheng-translate.zip"), "PKfake-zip-body");
  await writeFile(join(uiDir, "downloads", "checksums.txt"), "abc123  cheng-translate.zip\n");

  proc = spawn(process.execPath, [SERVER], {
    env: { ...process.env, UI_PORT: String(PORT), UI_DIR: uiDir, BACKEND_URL: "http://127.0.0.1:1" },
    stdio: "ignore",
  });

  // Wait for the listener rather than sleeping a fixed amount.
  for (let i = 0; i < 100; i++) {
    try {
      await fetch(`${BASE}/index.html`);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 50));
    }
  }
  throw new Error("ui-server did not start");
});

after(async () => {
  proc?.kill();
  if (uiDir) await rm(uiDir, { recursive: true, force: true });
});

test("a missing download returns 404, not 200 with the SPA page", async () => {
  const res = await fetch(`${BASE}/downloads/does-not-exist.zip`);

  // The whole point: a release that forgot to build the artifact must fail
  // loudly instead of serving index.html under a .zip filename.
  assert.equal(res.status, 404);
  const body = await res.text();
  assert.ok(!body.includes("<!doctype html>"), "must not return the SPA page");
});

test("an existing download is served with the right type, length and disposition", async () => {
  const res = await fetch(`${BASE}/downloads/cheng-translate.zip`);

  assert.equal(res.status, 200);
  assert.equal(res.headers.get("content-type"), "application/zip");
  assert.equal(res.headers.get("content-length"), "17");
  assert.match(res.headers.get("content-disposition"), /attachment; filename="cheng-translate\.zip"/);
  // Release artifacts are replaced in place on upgrade, so they must not carry
  // the immutable policy used for hashed asset filenames.
  assert.ok(!/immutable/.test(res.headers.get("cache-control") ?? ""));
});

test("content type comes from the table, not a hardcoded application/zip", async () => {
  const res = await fetch(`${BASE}/downloads/checksums.txt`);

  assert.equal(res.status, 200);
  assert.equal(res.headers.get("content-type"), "text/plain; charset=utf-8");
});

test("directory traversal through /downloads/ is refused", async () => {
  // The download branch must sit after the traversal guard, never before it.
  // Sent raw: fetch() would rewrite these paths before the server ever saw them.
  for (const path of [
    "/downloads/../../../../etc/passwd",
    "/downloads/..%2f..%2f..%2f..%2fetc%2fpasswd",
  ]) {
    const res = await rawGet(path);
    assert.equal(res.status, 403, `${path} returned ${res.status}; expected 403`);
    assert.ok(!res.body.includes("root:"), `${path} leaked file contents`);
  }
});

test("SPA routing still works for application paths", async () => {
  const res = await fetch(`${BASE}/channels/abc-123`);

  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /text\/html/);
  assert.ok((await res.text()).includes("<title>app</title>"));
});
