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
  callBack?: (status: string) => void
) {
  function formatFileName(title: string, originalUrl: string) {
    const extension = originalUrl.split(".").pop()?.split("?")[0] || "mp4";
    const formatted = title
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `${formatted}.${extension}`;
  }

  // Detect iOS/iPadOS (iPadOS 13+ request desktop site → userAgent báo Macintosh nhưng có touch)
  const isIOS =
    typeof navigator !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1));

  try {
    if (callBack) callBack("download");

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

    const blob = await response.blob();
    const fileName = formatFileName(title, url);

    // iOS/iPadOS: dùng Web Share API → share sheet → lưu vào Files/Photos
    if (isIOS) {
      const mimeType = blob.type || "video/mp4";
      const file = new File([blob], fileName, { type: mimeType });
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        try {
          await navigator.share({ files: [file], title });
        } catch (shareErr: any) {
          if (shareErr?.name !== "AbortError") {
            // Lỗi thật (không phải user cancel) → mở tab mới
            window.open(url, "_blank");
          }
          // AbortError = user tự đóng share sheet → không làm gì thêm
        }
        if (callBack) callBack("");
        return;
      }
      // Thiết bị iOS quá cũ không hỗ trợ share files → mở tab mới, long-press để lưu
      window.open(url, "_blank");
      if (callBack) callBack("");
      return;
    }

    // Desktop / Android: blob URL + anchor click
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);

    if (callBack) callBack("");
  } catch (err) {
    console.error("❌ Lỗi tải video:", err);

    // Fetch thất bại (CORS / network) → fallback mở thẳng URL
    if (isIOS) {
      window.open(url, "_blank");
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.setAttribute("download", "");
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    if (callBack) callBack("");
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

export function getNowInLocalFormat() {
  const now = new Date();

  const year = now.getFullYear();
  // Tháng bắt đầu từ 0 nên cần +1
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function removeLocalePrefixStrict(fullPath: string): string {
  const localePrefixRegex = /^\/([a-z]{2,3})(\/|$)/i;

  if (localePrefixRegex.test(fullPath)) {
    const cleanPath = fullPath.replace(localePrefixRegex, "/");

    if (cleanPath === "//" || cleanPath === "") {
      return "/";
    }

    return cleanPath.startsWith("/") ? cleanPath : "/" + cleanPath;
  }

  return fullPath;
}

/**
 * input: "HH:mm DD/MM/YYYY" (vd: "00:17 04/02/2026")
 * now:   Date tuỳ chọn để test (mặc định = thời điểm hiện tại)
 */
export function timeAgoVi(input: string, now: Date = new Date()): string {
  // Parse "HH:mm DD/MM/YYYY"
  const m = input
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s+(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return "không rõ thời gian";

  const [, hhStr, mmStr, ddStr, MMStr, yyyyStr] = m;
  const hh = Number(hhStr);
  const mi = Number(mmStr);
  const dd = Number(ddStr);
  const MM = Number(MMStr);
  const yyyy = Number(yyyyStr);

  // Date(year, monthIndex, day, hour, minute)
  const dt = new Date(yyyy, MM - 1, dd, hh, mi, 0, 0);
  if (Number.isNaN(dt.getTime())) return "không rõ thời gian";

  const diffMs = now.getTime() - dt.getTime();
  const isFuture = diffMs < 0;
  const absSec = Math.floor(Math.abs(diffMs) / 1000);

  const suffix = isFuture ? "nữa" : "trước";

  // Ngưỡng "vừa xong"
  if (!isFuture && absSec < 10) return "vừa xong";

  if (absSec < 60) {
    const s = absSec;
    return `${s} giây ${suffix}`;
  }

  const absMin = Math.floor(absSec / 60);
  if (absMin < 60) {
    return `${absMin} phút ${suffix}`;
  }

  const absHour = Math.floor(absMin / 60);
  if (absHour < 24) {
    return `${absHour} giờ ${suffix}`;
  }

  const absDay = Math.floor(absHour / 24);
  if (absDay < 7) {
    return `${absDay} ngày ${suffix}`;
  }

  const absWeek = Math.floor(absDay / 7);
  if (absDay < 30) {
    return `${absWeek} tuần ${suffix}`;
  }

  const absMonth = Math.floor(absDay / 30);
  if (absDay < 365) {
    return `${absMonth} tháng ${suffix}`;
  }

  const absYear = Math.floor(absDay / 365);
  return `${absYear} năm ${suffix}`;
}

export async function getPosterFromVideoUrl(
  videoUrl: string,
  atSeconds = 0.1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous"; // chỉ có tác dụng nếu server video cho phép CORS
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = videoUrl;

    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
    };

    video.addEventListener("error", () => {
      cleanup();
      reject(new Error("Không tải được video để tạo poster"));
    });

    video.addEventListener("loadedmetadata", () => {
      // seek đến thời điểm cần chụp
      const t = Math.min(
        Math.max(atSeconds, 0),
        Math.max(video.duration - 0.05, 0)
      );
      video.currentTime = t;
    });

    video.addEventListener("seeked", () => {
      try {
        const canvas = document.createElement("canvas");
        const w = video.videoWidth;
        const h = video.videoHeight;

        // scale nhỏ cho nhẹ
        const targetW = 480;
        const targetH = Math.round((h / w) * targetW);

        canvas.width = targetW;
        canvas.height = targetH;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Không lấy được canvas context");

        ctx.drawImage(video, 0, 0, targetW, targetH);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        cleanup();
        resolve(dataUrl);
      } catch (e) {
        cleanup();
        reject(e);
      }
    });
  });
}

export async function getSettingValue(key: string): Promise<string> {
  const url = `${import.meta.env.VITE_API_URL}/api/common/get-system-setting`;
  const params = new URLSearchParams({ secret: "d98aeba92127b1cc2f7adfbe04dee7395fbebe84ec9052744b87ed5fa6a3bccc", key });

  return fetch(`${url}?${params}`)
    .then((res) => res.json())
    .then(({ data }) => data || null)
    .catch(() => null);
}
