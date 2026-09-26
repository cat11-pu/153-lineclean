// trim.js：去行尾空白（空格与制表符算空白，行内空白原样保留）
export function trimEnd(line) {
  const text = String(line);
  let end = text.length;
  while (end > 0 && (text[end - 1] === " " || text[end - 1] === "\t")) end -= 1;
  return end === text.length ? text : text.slice(0, end);
}
