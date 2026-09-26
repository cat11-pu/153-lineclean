// clean.js：清理（逐行去行尾空白；连续空行只保留 maxBlank 条，为零则全丢；
// 制表符以外的控制字符报 E_BAD_CHAR。单次扫描，每行只处理一次。）
import { trimEnd } from "./trim.js";

function badChar(line) {
  const error = new Error("E_BAD_CHAR: 行里出现制表符以外的控制字符");
  error.code = "E_BAD_CHAR";
  error.line = line;
  return error;
}

export function cleanLines(lines, maxBlank) {
  const cleaned = [];
  let blanks = 0;
  for (let spot = 0; spot < lines.length; spot += 1) {
    const line = lines[spot];
    for (let at = 0; at < line.length; at += 1) {
      const code = line.charCodeAt(at);
      if (code < 32 && code !== 9) throw badChar(line);
    }
    const trimmed = trimEnd(line);
    if (trimmed === "") {
      blanks += 1;
      if (blanks > maxBlank) continue;
    } else {
      blanks = 0;
    }
    cleaned.push(trimmed);
  }
  return cleaned;
}
