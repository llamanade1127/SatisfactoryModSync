const {app, BrowserWindow, ipcMain} = require('electron')
const url = require("url");
const path = require("path");
const fs = require('fs');
var child = require('child_process').execFile;
const {download} = require('electron-dl')
let mainWindow
let modDir = ""
let dir = ""
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

ipcMain.on('loadMods', (event, args) => {
  loadMods(args);
})

ipcMain.on('launch', (event, args) => {
  launchGame(args);
})


app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})


async function loadMods(args){
  let mods = fs.readdirSync(args.gameDir + modDir,{ withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

  mods.filter(dir => !args.modsDir.includes(dir)).forEach(dir => {
    fs.rmSync(dir);
  })

  let newMods = fs.readdirSync(args.gameDir + modDir,{ withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .filter(dir => args.modsDir.includes(dir))
  .subtract(args.modsDir)


  newMods.forEach(mod => {
    if(!fs.existsSync(mod)){
      args.properties.onProgress = status => window.webContents.send('download progress', {status: status, mod: mod});
      await download(BrowserWindow.getFocusedWindow(), mod[0], {directory: dir});
    }
  })

  this.ipcMain.send("all download complete");

}

function launchGame(){
  child(args.path);
}




Array.prototype.subtract = function (array) {
  var hash = Object.create(null);
  array.forEach(function (a) {
      hash[a] = (hash[a] || 0) + 1;
  });
  return this.filter(function (a) {
     return !hash[a] || (hash[a]--, false);
  });
}