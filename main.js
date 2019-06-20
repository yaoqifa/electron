const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const StoreData = require('./renderer/MusicDataStore')

const myStore = new StoreData({ name: 'Music data' })
class AppWindow extends BrowserWindow {
  constructor(config, fileUrl) {
    const baseConfig = {
      width: 1000,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
      },
      show: false,
    }
    const finalConfig = Object.assign(baseConfig, config)
    super(finalConfig)
    this.loadFile(fileUrl)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new AppWindow({}, 'renderer/index.html')

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.send('getTracks', myStore.getTracks())
  })
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  ipcMain.on('add-music-window', () => {
    const addWindow = new AppWindow({
      width: 500,
      height: 400,
      parent: mainWindow,
    }, 'renderer/add.html')
  })

  ipcMain.on('open-music-file', (event) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory', 'multiSelections'],
      filters: [{ name: 'Music', extensions: ['mp3'] }]
    }, (files) => {
      if (files) {
        event.sender.send('selected-files', files)
      }
    })
  })

  ipcMain.on('add-tracks', (event, tracks) => {
    const updatedTracks = myStore.addTracks(tracks).getTracks()
    mainWindow.send('getTracks', updatedTracks)
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

