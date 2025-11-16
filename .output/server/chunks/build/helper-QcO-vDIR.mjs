async function downloadVideo(url, title, callBack) {
  function formatFileName(title2, originalUrl) {
    const extension = originalUrl.split(".").pop() || "mp4";
    const formatted = title2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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
    const a = (void 0).createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    (void 0).body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
    console.log(`\u2705 Video \u0111\xE3 t\u1EA3i xu\u1ED1ng: ${fileName}`);
    if (callBack) callBack("");
  } catch (err) {
    console.error("\u274C L\u1ED7i khi t\u1EA3i video:", err);
  }
}
function formatCurrency(amount) {
  var _a;
  if (!amount) amount = 0;
  return ((_a = amount == null ? void 0 : amount.toString()) == null ? void 0 : _a.replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + " VN\u0110";
}
function getRankColor(rank) {
  if (rank === 1) return "amber-darken-2";
  if (rank === 2) return "blue-grey-lighten-1";
  if (rank === 3) return "brown-lighten-1";
  return "grey-lighten-2";
}

export { downloadVideo as d, formatCurrency as f, getRankColor as g };
//# sourceMappingURL=helper-QcO-vDIR.mjs.map
