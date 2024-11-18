// Native
import { join } from "path";
import { format } from "url";
const path = require('path');

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
const express = require('express');
const cors = require('cors');

app.commandLine.appendSwitch('ignore-gpu-blacklist'); // GPU のブラックリストを無視
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-webgl'); // WebGL を有効化
app.commandLine.appendSwitch('enable-features', 'WebGL,WebGL2,WebXR,WebXRHandInput,WebGL2ComputeRenderingContext'); // WebXR を有効化
app.commandLine.appendSwitch('enable-unsafe-es3-apis');
app.commandLine.appendSwitch('enable-unsafe-webgpu');
app.commandLine.appendSwitch('no-sandbox');

console.log(app.getGPUFeatureStatus());

// app.disableHardwareAcceleration();

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  // Express サーバーを作成
  const server = express();
  server.use(cors());

  // public フォルダを静的ファイルとして提供
  const publicPath = path.join(__dirname, '../public');
  server.use(express.static(publicPath));

  // サーバーを起動
  const port = 3000; // 任意のポート
  server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
  });
  
  await prepareNext("./src");

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
      webgl: true, // enable webgl
      webSecurity: false,
      devTools: true, // enable devtools,
      experimentalFeatures: true,
    },
  });

  const url = isDev
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../src/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);
  mainWindow.webContents.openDevTools();
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});
