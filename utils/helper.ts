import { useLocale } from "vuetify";
import { langs } from "~/utils/constants";

export function setLanguageByBrowser() {
  const router = useRouter();
  const localeVuetify = useLocale();

  const raw = navigator.language.split("-")[0];

  const lang = langs.includes(raw as any)
    ? (raw as (typeof langs)[number])
    : "lo";

  localeVuetify.current.value = lang;
  router.push(`/${lang}`);
}

export function updateBodyLangClass(locale: string) {
  if (locale === "lo") document.body.classList.add("lang-la");
  else document.body.classList.remove("lang-la");
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export async function isBlob(blob: Blob): Promise<boolean> {
  const headerSize = 5;
  const slice = blob.slice(0, headerSize);
  const buffer = await slice.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const signature = [0x50, 0x4b, 0x03, 0x04, 0x14];

  for (let i = 0; i < signature.length; i++) {
    if (bytes[i] !== signature[i]) {
      return false;
    }
  }

  return true;
}

export function downloadBlobFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

export async function downloadVideo(
  url: string,
  title: string,
  callBack?: (e: string) => void
) {
  function formatFileName(title: string, originalUrl: string) {
    // Lấy đuôi file từ URL
    const extension = originalUrl.split(".").pop() || "mp4";

    // Chuyển tên thành lowercase, bỏ dấu, thay khoảng trắng và ký tự đặc biệt bằng "-"
    const formatted = title
      .normalize("NFD") // tách dấu
      .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // thay ký tự không phải chữ số/chữ cái bằng "-"
      .replace(/^-+|-+$/g, ""); // xóa "-" thừa ở đầu/cuối

    return `${formatted}.${extension}`;
  }

  try {
    if (callBack) callBack("download");

    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch video: ${response.statusText}`);

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const fileName = formatFileName(title, url);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(blobUrl);
    console.log(`✅ Video đã tải xuống: ${fileName}`);

    if (callBack) callBack("");
  } catch (err) {
    console.error("❌ Lỗi khi tải video:", err);
  }
}

export function formatCurrency(amount: number | string) {
  if (!amount) amount = 0;
  return amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VNĐ";
}

export function getRankColor(rank: number) {
  if (rank === 1) return "amber-darken-2";
  if (rank === 2) return "blue-grey-lighten-1";
  if (rank === 3) return "brown-lighten-1";
  return "grey-lighten-2";
}
