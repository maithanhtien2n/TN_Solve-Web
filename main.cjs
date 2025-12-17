const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");

let nitroServer;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "TN Solve App",
    autoHideMenuBar: true,
  });

  // XÁC ĐỊNH ĐƯỜNG DẪN CHUẨN:
  // Nếu đang chạy app (.exe), app.getAppPath() sẽ trỏ vào thư mục chứa code
  const serverPath = path.join(
    app.getAppPath(),
    ".output",
    "server",
    "index.mjs"
  );

  // Log ra để bạn kiểm tra trong DevTools xem đường dẫn đúng chưa
  console.log("Khởi động server tại:", serverPath);

  nitroServer = exec(`node "${serverPath}"`, {
    env: {
      NITRO_PORT: 5173,
      NITRO_HOST: "localhost",
      VITE_API_URL: "http://localhost:3000",
    },
  });

  // Lắng nghe lỗi từ server nếu có
  nitroServer.stderr.on("data", (data) => {
    console.error(`Server Error: ${data}`);
  });

  win.webContents.openDevTools();

  const loadURL = () => {
    win.loadURL("http://localhost:5173").catch(() => {
      console.log("Server chưa sẵn sàng, đang thử lại...");
      setTimeout(loadURL, 1000);
    });
  };

  loadURL();

  win.on("closed", () => {
    if (nitroServer) nitroServer.kill();
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
