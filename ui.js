// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  let maxBlank = spec.max_blank || 1;
  parts.log.textContent = "行数 " + (spec.lines || []).length + "，允许连续空行 " + maxBlank + "。";

  function draw() {
    let view = null;
    try {
      view = render(Object.assign({}, spec, { max_blank: maxBlank }));
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    view.cleaned.forEach(function (line, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = (spot + 1) + ".";
      row.appendChild(head);
      const mark = document.createElement("span");
      mark.className = "chip ok";
      mark.textContent = line === "" ? "空行" : line;
      row.appendChild(mark);
      const count = document.createElement("span");
      count.className = "chip";
      count.textContent = line.length + " 字符";
      row.appendChild(count);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "清理后 " + view.count + " 行，去掉空行 " + view.dropped;
    parts.log.textContent = "去掉了行尾空白 " + view.trimmed + " 处";
  }

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "清理行";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const moreButton = document.createElement("button");
  moreButton.textContent = "允许空行加一";
  moreButton.addEventListener("click", function () {
    maxBlank = maxBlank + 1;
    draw();
  });
  parts.controls.appendChild(moreButton);

  const lessButton = document.createElement("button");
  lessButton.textContent = "允许空行减一";
  lessButton.addEventListener("click", function () {
    maxBlank = Math.max(0, maxBlank - 1);
    draw();
  });
  parts.controls.appendChild(lessButton);

  const label = document.createElement("label");
  label.textContent = "允许连续空行";
  parts.controls.appendChild(label);

  const box = document.createElement("input");
  box.type = "number";
  box.value = String(maxBlank);
  box.addEventListener("input", function () {
    const parsed = Number(box.value);
    if (parsed >= 0) { maxBlank = parsed; draw(); }
  });
  parts.controls.appendChild(box);

  const readButton = document.createElement("button");
  readButton.textContent = "只看去掉几行";
  readButton.addEventListener("click", function () {
    const view = render(Object.assign({}, spec, { max_blank: maxBlank }));
    parts.out.textContent = "清理后 " + view.count + " 行，去掉 " + view.dropped + " 行";
  });
  parts.controls.appendChild(readButton);

  draw();
}
