import { app, BrowserWindow } from 'electron';
import * as path from 'path';
const remoteMain = require('@electron/remote/main');

let mainWindow: BrowserWindow | null = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  remoteMain.initialize();
  remoteMain.enable(mainWindow.webContents);
  mainWindow.loadFile(path.join(__dirname, '../public/index.html'));
  mainWindow.on('closed', () => (mainWindow = null));
});
