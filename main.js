// eslint-disable-next-line standard/object-curly-even-spacing
const { app, BrowserWindow, protocol /* globalShortcut, ipcMain */ } = require('electron')
const path = require('path')

const DEFAULT_OVERLAY_OPTS = {
    transparent: true,
    width: 800,
    height: 600,
    frame: false,
    fullscreen: true,
    alwaysOnTop: true,
    skipTaskbar: true
}

let overlay

// Use Ctrl+Q to quit

async function main () {
    if (overlay == null) {
        const htmlRootDir = 'dist/'
        const indexFile = 'index.html'

        protocol.interceptFileProtocol(
            'file',
            (request, callback) => {
                const url = request.url.substr(7) // all urls start with 'file://'
                if (request.url.endsWith(indexFile)) {
                    callback(url)
                } else {
                    callback(path.normalize(`${__dirname}/${htmlRootDir}/${url}`))
                }
            },
            error => console.error(error)
        )

        overlay = await createOverlayLinuxFix()
        await overlay.loadFile('dist/index.html')
        // overlay.webContents.openDevTools()

        // TODO: hide window when Esc is pressed
        // globalShortcut.register('Esc', () => {
        //     window.hide()
        // })

        // Emitted when the window is closed.
        overlay.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            overlay = null
        })
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', main)

// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', main)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

async function createOverlayWindow (opts) {
    const window = new BrowserWindow({
        ...DEFAULT_OVERLAY_OPTS,
        ...opts
    })
    window.setIgnoreMouseEvents(true)
    return window
}

async function createOverlayLinuxFix (opts) {
    await wait(300) // XXX: Linux overlay fix (otherwise transparent is black)
    return createOverlayWindow(opts)
}

async function wait (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
