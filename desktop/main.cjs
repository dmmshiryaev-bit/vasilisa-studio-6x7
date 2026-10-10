const {app, BrowserWindow, shell, session} = require('electron');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const GAME = pathToFileURL(path.join(__dirname, '../build/web/index.html')).href;
const external = raw => {
  try { const url = new URL(raw); if (url.protocol === 'https:' && ['music.apple.com','open.spotify.com','github.com','vasilisa-studio-6x7.vercel.app'].includes(url.hostname)) shell.openExternal(url.href); } catch {}
};
app.setName('Василиса в кадре');
function createWindow() {
  const win = new BrowserWindow({width:1200,height:900,minWidth:390,minHeight:600,backgroundColor:'#10112c',title:'Василиса в кадре — Студия 6×7',icon:path.join(__dirname,'../img/icon-512.png'),webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
  win.removeMenu();
  win.webContents.setWindowOpenHandler(({url}) => {external(url);return {action:'deny'}});
  win.webContents.on('will-navigate', (event,url) => { if (url.split('#')[0] !== GAME) {event.preventDefault();external(url)} });
  win.loadURL(GAME);
}
app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_contents,_permission,callback) => callback(false));
  createWindow();
  app.on('activate', () => {if (!BrowserWindow.getAllWindows().length) createWindow()});
});
app.on('window-all-closed', () => {if(process.platform !== 'darwin') app.quit()});
