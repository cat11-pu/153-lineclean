import fs from "node:fs";
import { trimEnd } from "./trim.js";
import { cleanLines } from "./clean.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/lines.json", "utf8"));
const view = render(spec);

emit("清理后的行 =", JSON.stringify(view.cleaned));
emit("清理后行数 =", view.count);
emit("去掉的行数 =", view.dropped);
emit("去掉行尾空白的行数 =", view.trimmed);
emit("允许连续空行 =", view.max_blank);
emit("控制字符的错误码 =", spec.char_error_code);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  cleanLines(["ok", "bad\u0007"], 1);
  emit("控制字符的错误码", "没有报错");
} catch (error) {
  emit("控制字符的错误码", error && error.code ? error.code : String(error.message));
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "清理后的行": [
    "alpha",
    "beta",
    "",
    "gamma"
  ],
  "清理后行数": 4,
  "去掉的行数": 2,
  "去掉行尾空白的行数": 2,
  "允许连续空行": 1,
  "控制字符的错误码": "E_BAD_CHAR"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
