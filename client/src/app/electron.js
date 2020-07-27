const { app, BrowserView, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

const MainWindow = require('./main_window');

let mainWindow;
let viewWindow;

function createWindow() {
    mainWindow = new MainWindow({ 
        width: 1200, 
        height: 1000,
        icon: ""
    });
     
    mainWindow.loadURL(
        isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );

    viewWindow = new BrowserView()
    mainWindow.addBrowserView(viewWindow);
    viewWindow.setBounds({ x: 0, y: 250, width: 800, height: 1000 })
    viewWindow.webContents.loadURL('https://google.com') //TODO change to default search engine from config
    
    viewWindow.webContents.on('did-start-navigation', () => {
        const { history, currentIndex } = viewWindow.webContents;
        mainWindow.webContents.send('browser-history', {
            urlCurrent: history[currentIndex],
            indexCurrent: currentIndex,
            indexLast: history.length - 1,
        });
    })

    mainWindow.on("closed", () => (mainWindow = null));
    mainWindow.webContents.openDevTools();
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('search-url', (event, url) => {
    viewWindow.webContents.loadURL(url);
})

ipcMain.on('go-back', () => {
    if (viewWindow.webContents.canGoBack()) {
        return viewWindow.webContents.goBack();
    }
})

ipcMain.on('go-forward', () => {
    if (viewWindow.webContents.canGoForward()){
        viewWindow.webContents.goForward();
    }
})

ipcMain.on('go-home', () => {
    viewWindow.webContents.goToIndex(0);
})

ipcMain.on('reload', () => {
    viewWindow.webContents.reload();
})