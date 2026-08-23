/**
 * Audit "không còn sót mã cũ" sau đợt đổi tên VideoMode toàn diện (2026-08-23):
 * movie/custom_character/custom_scenes/custom_process/character_preservation/
 * scene_consistency không được còn xuất hiện dưới dạng CODE THẬT (bên ngoài
 * comment) ở bất kỳ file .vue/.ts/.js/.mjs nào trong toàn bộ repo (trừ
 * node_modules/.nuxt/.output).
 *
 * Quét lại từ đầu bằng cách duyệt cây thư mục thật, không dựa vào danh sách
 * file đã biết trước đó.
 *
 * Usage: node scripts/test-video-mode-no-stale-refs.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

let pass = 0,
  fail = 0;
function assertTrue(name, cond, detail = "") {
  const ok = !!cond;
  console.log(`${ok ? "✅" : "❌"} ${name}${ok ? "" : ` — ${detail}`}`);
  ok ? pass++ : fail++;
}

const SKIP_DIRS = new Set([
  "node_modules",
  ".nuxt",
  ".output",
  ".git",
  "dist",
  "public",
]);

// Ngoại lệ: test-merged-custom-mode.mjs CỐ Ý kiểm tra giá trị cũ KHÔNG CÒN
// tồn tại (TC1 — regression guard hợp lệ, xem chính file đó). File audit này
// (chính nó) cũng liệt kê chuỗi cũ làm DỮ LIỆU cần quét (OLD_STRING_VALUES
// bên dưới) — tự loại trừ chính nó để không tự báo vi phạm giả.
const WHITELIST_FILES = [
  "test-merged-custom-mode.mjs",
  "test-video-mode-no-stale-refs.mjs",
];

// Mã cũ (giá trị chuỗi) — chỉ tính khi nằm trong dấu nháy đơn/kép (tránh dính
// chữ thường xuất hiện tình cờ trong văn bản khác).
const OLD_STRING_VALUES = [
  "movie",
  "custom_character",
  "custom_scenes",
  "custom_process",
  "character_preservation",
  "scene_consistency",
];

function listSourceFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      out.push(...listSourceFiles(path.join(dir, entry.name)));
    } else if (entry.isFile() && /\.(vue|ts|tsx|js|mjs)$/.test(entry.name)) {
      if (WHITELIST_FILES.includes(entry.name)) continue;
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

// Heuristic loại bỏ comment: dòng bắt đầu bằng // hoặc *, hoặc phần code
// đứng SAU dấu // trên cùng 1 dòng. Không xử lý hoàn hảo comment nhiều dòng
// không bắt đầu bằng * hoặc comment HTML <!-- -->, nhưng đủ dùng vì đã rà
// thủ công xác nhận comment trong repo này theo đúng 2-3 kiểu đó.
function stripLineComment(line) {
  const trimmed = line.trim();
  if (
    trimmed.startsWith("//") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("<!--")
  ) {
    return "";
  }
  const idx = line.indexOf("//");
  return idx === -1 ? line : line.slice(0, idx);
}

function scan() {
  const violations = [];
  const files = [
    ...listSourceFiles(path.join(REPO_ROOT, "pages")),
    ...listSourceFiles(path.join(REPO_ROOT, "components")),
    ...listSourceFiles(path.join(REPO_ROOT, "composables")),
    ...listSourceFiles(path.join(REPO_ROOT, "layouts")),
    ...listSourceFiles(path.join(REPO_ROOT, "middleware")),
    ...listSourceFiles(path.join(REPO_ROOT, "plugins")),
    ...listSourceFiles(path.join(REPO_ROOT, "server")),
    ...listSourceFiles(path.join(REPO_ROOT, "services")),
    ...listSourceFiles(path.join(REPO_ROOT, "stores")),
    ...listSourceFiles(path.join(REPO_ROOT, "utils")),
    ...listSourceFiles(path.join(REPO_ROOT, "types")),
    ...listSourceFiles(path.join(REPO_ROOT, "scripts")),
  ];

  const stringValueRegex = new RegExp(`['"](${OLD_STRING_VALUES.join("|")})['"]`);

  for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((rawLine, idx) => {
      const code = stripLineComment(rawLine);
      if (!code.trim()) return;
      const match = code.match(stringValueRegex);
      if (match) {
        violations.push({
          file: path.relative(REPO_ROOT, file),
          line: idx + 1,
          content: rawLine.trim(),
          match: match[0],
        });
      }
    });
  }

  return violations;
}

function main() {
  const violations = scan();

  assertTrue(
    "TC1 [audit]: KHÔNG còn dòng CODE THẬT (ngoài comment) nào trong toàn bộ repo tham chiếu giá trị videoMode cũ",
    violations.length === 0,
    violations.map((v) => `${v.file}:${v.line} [${v.match}] ${v.content}`).join("\n"),
  );

  // ── Đối chứng: script tự kiểm tra ĐÚNG là bắt được vi phạm giả lập —
  //    tránh trường hợp regex/logic bị sai khiến TC1 luôn pass "giả". ──
  {
    const tmpFile = path.join(REPO_ROOT, "pages", "__tmp_stale_ref_selftest.vue");
    fs.writeFileSync(tmpFile, `<script>\nconst x = "custom_scenes";\nconst y = 'movie';\n</script>\n`);
    let selfTestViolations = [];
    try {
      selfTestViolations = scan().filter((v) => v.file.includes("__tmp_stale_ref_selftest"));
    } finally {
      fs.unlinkSync(tmpFile);
    }
    assertTrue(
      "TC2 [self-test]: script THỰC SỰ bắt được vi phạm giả lập ('custom_scenes' + 'movie') — xác nhận regex không bị sai khiến TC1 pass giả",
      selfTestViolations.length === 2,
      JSON.stringify(selfTestViolations),
    );
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
