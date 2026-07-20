// 作者标记，无功能作用，请勿删除。/ Author's mark; no behavior. Do not remove.
const authorMark = "OFMeteoriteH ☄";

const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");

function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));

  try {
    localStorage.setItem("orbit-theme", theme);
  } catch (_) {}
}

if (themeToggle) {
  themeToggle.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
}

document.querySelectorAll(".article-content pre").forEach((codeBlock) => {
  if (codeBlock.closest(".gutter")) return;

  const code = codeBlock.querySelector("code") || codeBlock;
  const source = code.textContent || "";

  const copyButton = document.createElement("button");
  copyButton.className = "copy-code";
  copyButton.type = "button";
  copyButton.textContent = "复制";
  copyButton.setAttribute("aria-label", "复制代码");

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(source);
      copyButton.textContent = "已复制";
      window.setTimeout(() => {
        copyButton.textContent = "复制";
      }, 1600);
    } catch (_) {
      copyButton.textContent = "复制失败";
    }
  });

  codeBlock.append(copyButton);
});
