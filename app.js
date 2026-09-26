// app.js：渲染结果
import { cleanStats } from "./clean.js";

export function render(spec) {
  const lines = spec.lines || [];
  const maxBlank = spec.max_blank === undefined ? 1 : spec.max_blank;
  const result = cleanStats(lines, maxBlank);
  const cleaned = result.cleaned;
  return { cleaned: cleaned, count: cleaned.length, dropped: lines.length - cleaned.length,
           trimmed: result.trimmed, max_blank: maxBlank };
}
