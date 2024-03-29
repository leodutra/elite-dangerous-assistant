// eslint-disable-next-line standard/object-curly-even-spacing
const { app, BrowserWindow, protocol, globalShortcut /* globalShortcut, ipcMain */ } = require('electron')
const path = require('path')
const os = require('os')

const DEFAULT_OVERLAY_OPTS = {
    transparent: true,
    width: 800,
    height: 600,
    frame: false,
    fullscreen: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    webPreferences: {
        nodeIntegration: true,
        webSecurity: false
    }
}

let overlay

function stripFileProtocol (url) {
    // all urls start with 'file://'
    // "file:///home/..."
    // "file:///C:/Users/..."
    if (os.platform() === 'win32') {
        return url.trim().replace(/^file:\/\/\//im, '')
    } else {
        return url.trim().replace(/^file:\/\//im, '')
    }
}

async function main () {
    // Install Vue.js devtools
    // require('vue-devtools').install()
    if (overlay == null) {
        const htmlRootDir = 'dist'
        const indexFile = 'index.html'

        protocol.interceptFileProtocol(
            'file',
            (request, callback) => {
                let url = stripFileProtocol(request.url)
                if (request.url.endsWith(indexFile)) {
                    callback(url)
                } else {
                    url = url.replace(/^(\w+:)?\//im, '')
                    callback(path.resolve(__dirname, htmlRootDir, url))
                }
            },
            error => console.error(error)
        )

        // TODO: hide window when Esc is pressed
        // let toggle = true
        // let counter = 0
        // globalShortcut.register('Escape', () => {
        //     overlay.webContents.executeJavaScript(
        //         `document.querySelector('button').innerText = '${counter++}';`,
        //         false,
        //         result => console.log('executeJS:', result)
        //     )
        //     // overlay.setIgnoreMouseEvents(toggle)
        //     // toggle = !toggle
        // })

        overlay = await createOverlayLinuxFix()

        // overlay.setAlwaysOnTop(true, 'screen-saver')

        overlay.webContents.once('dom-ready', () => {
            // overlay.setIgnoreMouseEvents(true)
            overlay.webContents.openDevTools()
            // overlay.webContents.executeJavaScript(
            //     `(${contentBindPointerControl.toString()})();`,
            //     false,
            //     result => console.log('executeJS:', result)
            // )
        })

        // await overlay.loadFile('dist/index.html')
        await overlay.loadURL(`file://${__dirname}/dist/index.html`)

        // Emitted when the window is closed.
        overlay.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            overlay = null
        })
    }
}

// const CLICKABLE_ELEMENTS = [
//     'a',
//     'input',
//     'button'
// ]

// function contentBindPointerControl () {
//     // const setIgnoreMouseEvents = require('electron').remote.getCurrentWindow().setIgnoreMouseEvents
//     addEventListener('pointerover', function mousePolicy (event) {
//         console.log('pointerover', event.target.tagName, event.target === document.documentElement)
//         // mousePolicy._canClick = event.target === document.documentElement
//         //     ? mousePolicy._canClick && setIgnoreMouseEvents(true, { forward: true })
//         //     : mousePolicy._canClick || setIgnoreMouseEvents(false) || true
//         // console.log('canClick', mousePolicy._canClick)
//     })
//     // setIgnoreMouseEvents(true, { forward: true }) // BUG: this must be triggered after the devtools loaded IF you load the console 'detached'
// }

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
    return window
}

async function createOverlayLinuxFix (opts) {
    await wait(1000) // XXX: Linux overlay fix (otherwise transparent is black)
    return createOverlayWindow(opts)
}

async function wait (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
