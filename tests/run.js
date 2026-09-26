import assert from "node:assert";
import { trimEnd } from "../trim.js";
import { cleanLines } from "../clean.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("trimEnd returns text", () => {
  assert.strictEqual(typeof trimEnd("a  "), "string");
});

check("cleanLines returns a list", () => {
  assert.ok(Array.isArray(cleanLines(["a"], 1)));
});

check("cleanLines keeps one entry per line", () => {
  assert.strictEqual(cleanLines(["a", "b"], 1).length, 2);
});

check("render counts lines", () => {
  assert.strictEqual(typeof render({ lines: ["a"], max_blank: 1 }).count, "number");
});

check("render exposes dropped", () => {
  assert.strictEqual(typeof render({ lines: ["a"], max_blank: 1 }).dropped, "number");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
