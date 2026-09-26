// trim.js：去行尾空白（仅行尾的空格与制表符；行内空白与制表符原样保留）。
// 制表符（码 9）以外、码小于 32 的控制字符一律报 E_BAD_CHAR。

export class BadCharError extends Error {
  constructor(index, charCode) {
    super("第 " + (index + 1) + " 个字符是不允许的控制字符（字符码 " + charCode + "）");
    this.name = "BadCharError";
    this.code = "E_BAD_CHAR";
    this.index = index;
    this.charCode = charCode;
  }
}

export function trimEnd(line) {
  const text = String(line);
  let end = text.length;
  // 倒着剥掉行尾的空格（32）与制表符（9），这段字符合法、无需再校验。
  while (end > 0) {
    const code = text.charCodeAt(end - 1);
    if (code !== 32 && code !== 9) break;
    end -= 1;
  }
  // 剩余部分正向扫一遍：除制表符外，字符码小于 32 立即报错。
  for (let i = 0; i < end; i += 1) {
    const code = text.charCodeAt(i);
    if (code < 32 && code !== 9) throw new BadCharError(i, code);
  }
  return text.slice(0, end);
}
