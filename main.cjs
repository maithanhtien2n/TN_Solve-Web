const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");

// Nạp file .env (Nếu bạn đã cài dotenv: npm install dotenv)
require("dotenv").config({ path: path.join(app.getAppPath(), ".env") });

let nitroServer;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "TN Solve App",
    autoHideMenuBar: true,
  });

  // ƯU TIÊN LẤY PORT TỪ .ENV, NẾU KHÔNG CÓ THÌ DÙNG 5173
  const PORT = process.env.NITRO_PORT || 5173;
  const HOST = process.env.NITRO_HOST || "localhost";

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
    },
  });

  nitroServer.stderr.on("data", (data) => {
    console.error(`Server Error: ${data}`);
  });

  win.webContents.openDevTools();

  const loadApp = () => {
    win.loadURL(`http://${HOST}:${PORT}`).catch(() => {
      console.log("Đang kết nối lại...");
      setTimeout(loadApp, 1000);
    });
  };

  loadApp();
  win.webContents.openDevTools();

  win.on("closed", () => {
    if (nitroServer) nitroServer.kill();
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
