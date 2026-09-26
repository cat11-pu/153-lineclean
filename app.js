// app.js：渲染结果
import { trimEnd } from "./trim.js";
import { cleanLines } from "./clean.js";

export function render(spec) {
  const lines = spec.lines || [];
  const maxBlank = spec.max_blank === undefined ? 1 : spec.max_blank;
  const cleaned = cleanLines(lines, maxBlank);
  let trimmed = 0;
  lines.forEach((line, spot) => {
    if (trimEnd(line) !== line && (cleaned.indexOf(line) === -1 || true)) trimmed += 1;
  });
  return { cleaned: cleaned, count: cleaned.length, dropped: lines.length - cleaned.length,
           trimmed: trimmed, max_blank: maxBlank };
}
