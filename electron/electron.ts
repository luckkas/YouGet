import path from 'path';
import { app, BrowserWindow } from 'electron';

const isDev = process.env.ENVIRONMENT === 'development' ? true : false;

class Window {
   mainWindow: BrowserWindow;

   create() {
      //create the browser window
      this.mainWindow = new BrowserWindow({
         width: 800,
         height: 600,
         webPreferences: {
            preload: path.join(__dirname, 'preload.ts'),
            nodeIntegration: true,
         },
      });

      this.load();
   }

   load() {
      this.mainWindow.loadURL(
         isDev
            ? `http://localhost:${process.env.PORT}`
            : `file://${path.join(__dirname, '../dist/index.html')}`
      );

      if (isDev) this.mainWindow.webContents.openDevTools();
   }
}

const window = new Window();

app.whenReady().then(() => {
   window.create();
   app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) window.create();
   });
});

app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') app.quit();
});
