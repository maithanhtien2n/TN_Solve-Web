const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");

// Nạp file .env (Nếu bạn đã cài dotenv: npm install dotenv)
require("dotenv").config({ path: path.join(app.getAppPath(), ".env") });

let nitroServer;

function createWindow() {
  try {
    // Lệnh này tìm và tắt các tiến trình node.exe đang chạy (trừ tiến trình Electron hiện tại)
    // /F là ép buộc, /T là tắt cả tiến trình con
    execSync("taskkill /F /IM node.exe /T");
    console.log("Đã dọn dẹp các server cũ.");
  } catch (e) {
    // Nếu không có tiến trình nào để tắt thì bỏ qua lỗi này
    console.log("Không có server chạy ngầm nào cần tắt.");
  }

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "TN Solve",
    autoHideMenuBar: true,
  });

  // ƯU TIÊN LẤY PORT TỪ .ENV, NẾU KHÔNG CÓ THÌ DÙNG 5173
  const PORT = process.env.NITRO_PORT || 5173;
  const HOST = process.env.NITRO_HOST || "localhost";
  const VITE_API_URL = "http://localhost:3000";

  const serverPath = path.join(
    app.getAppPath(),
    ".output",
    "server",
    "index.mjs"
  );

  // Khởi động server với biến môi trường chuẩn
  nitroServer = exec(`node "${serverPath}"`, {
    env: {
      ...process.env,
      PORT: PORT,
      HOST: HOST,
      NODE_ENV: "production",
      VITE_API_URL,
    },
  });

  nitroServer.stderr.on("data", (data) => {
    console.error(`Server Error: ${data}`);
  });

  const loadApp = () => {
    win.loadURL(`http://${HOST}:${PORT}`).catch(() => {
      console.log("Đang kết nối lại...");
      setTimeout(loadApp, 1000);
    });
  };

  loadApp();

  win.on("closed", () => {
    if (nitroServer) nitroServer.kill();
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
