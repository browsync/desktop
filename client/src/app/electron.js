const { app, BrowserView, ipcMain, screen: display } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

const MainWindow = require('./main_window');
const { forEach } = require("lodash");

let searchEngineDefault = 'https://github.com';
let screen;
let topBarHeight = 100;

let main;
// let view;

function createMainWindow() {
    screen = display.getPrimaryDisplay().workAreaSize;

    main = new MainWindow({ 
        width: screen.width, 
        height: screen.height,
    });
     
    main.loadURL(
        isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    
    createViewWindow();

    main.on("closed", () => (main = null));
    main.webContents.openDevTools();
}

function createViewWindow() { // TODO Add argument for split screen
    const view = new BrowserView();
    // view.setAutoResize({ width: true, height: true });
    main.setBrowserView(view); // TODO SPLIT SCREEN addBrowserView instead og set
    resizeViewWindow(); 
    view.webContents.loadURL(searchEngineDefault) //TODO SEARCH ENGINE Change to default search engine from config
    
    view.webContents.on('navigation-entry-commited', () => {
        const { history, currentIndex } = view.webContents;
        main.webContents.send('browser-history', {
            id: view.id,
            urlCurrent: history[currentIndex],
            indexCurrent: currentIndex,
            indexLast: history.length - 1,
        });
    })
}

function resizeViewWindow() {
    const views = [main.getBrowserView()];
    // const views = BrowserView.getAllViews();
    views.map((view, idx) => {
        view.setBounds({ 
            x: (screen.width / views.length) * idx,
            y: topBarHeight,
            width: screen.width / views.length - 400,
            height: screen.height - topBarHeight,
        }) //TODO VIEW Resize properly & dynamically 
    })
}

function switchViewWindow(viewId, tabId) {
    const views = main.getBrowserViews();
    const tabs = BrowserView.getAllViews();
    const tabSelected = tabs.find(tab => tab.id === tabId); 
    views.forEach(view => {
        main.removeBrowserView(view);
    });
    views.splice(viewId - 1, 1, tabSelected);
    views.forEach(view => {
        main.addBrowserView(view);
    });
}

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (main === null) {
        createMainWindow();
    }
});

ipcMain.on('search-url', (event, url) => {
    view.webContents.loadURL(url);
})

ipcMain.on('go-back', () => {
    if (view.webContents.canGoBack()) {
        return view.webContents.goBack();
    }
})

ipcMain.on('go-forward', () => {
    if (view.webContents.canGoForward()){
        view.webContents.goForward();
    }
})

ipcMain.on('go-home', () => {
    view.webContents.goToIndex(0);
})

ipcMain.on('reload', () => {
    view.webContents.reload();
})

ipcMain.on('new-tab', () => {
    createViewWindow();
})

ipcMain.on('switch-tab', (event, { viewId, tabId }) => {
    switchViewWindow(viewId, tabId);
})