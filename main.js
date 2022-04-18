const {app, BrowserWindow, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state')
const readItem = require('./readItem')


let mainWindow

function createWindow() {

    let state = windowStateKeeper({defaultWidth: 500, defaultHeight: 600})

    mainWindow = new BrowserWindow({
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        minWidth: 350,
        maxWidth: 650,
        minHeight: 300,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    })


    mainWindow.loadFile('renderer/main.html')
    state.manage(mainWindow)
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => mainWindow = null)
}

ipcMain.on('new-item', (e, itemUrl) => {
    console.log(`Main received ${itemUrl}`)
    readItem(itemUrl, (item) => {
        e.sender.send('new-item-success', item)
    })
})

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) createWindow()
})
