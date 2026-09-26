// clean.js：清理
// 一次扫描完成全部工作（预算 50000 行，每行只处理一次）：
// 逐行去行尾空白，非空行原样保留；连续空行只保留 maxBlank 条，
// maxBlank 为 0 时空行全部丢掉。控制字符错误由 trimEnd 抛出（E_BAD_CHAR）。
import { trimEnd } from "./trim.js";

export function cleanStats(lines, maxBlank) {
  const limit = Math.max(0, Number(maxBlank) || 0);
  const source = Array.isArray(lines) ? lines : [];
  const cleaned = [];
  let blankRun = 0;
  let trimmed = 0;
  for (const raw of source) {
    const line = trimEnd(raw);
    if (line !== String(raw)) trimmed += 1;
    if (line === "") {
      if (blankRun < limit) {
        cleaned.push(line);
        blankRun += 1;
      }
    } else {
      blankRun = 0;
      cleaned.push(line);
    }
  }
  return { cleaned: cleaned, trimmed: trimmed };
}

export function cleanLines(lines, maxBlank) {
  return cleanStats(lines, maxBlank).cleaned;
}
