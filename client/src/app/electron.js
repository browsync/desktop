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
    const tab = new BrowserView();
    // view.setAutoResize({ width: true, height: true });
    main.setBrowserView(tab); // TODO SPLIT SCREEN addBrowserView instead og set
    resizeViewWindow(tab); 
    tab.webContents.loadURL(searchEngineDefault) //TODO SEARCH ENGINE Change to default search engine from config
    
    tab.webContents.on('navigation-entry-commited', () => {
        const { history, currentIndex } = tab.webContents;
        main.webContents.send('browser-history', {
            id: tab.id,
            urlCurrent: history[currentIndex],
            indexCurrent: currentIndex,
            indexLast: history.length - 1,
        });
    })
}

function resizeViewWindow() {
    const views = main.getBrowserViews();
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
    const tabSelected = findTab(tabId); 
    views.forEach(view => {
        main.removeBrowserView(view);
    });
    views.splice(viewId - 1, 1, tabSelected);
    views.forEach(view => {
        main.addBrowserView(view);
    });
}

function findTab(tabId) {
    const tabs = BrowserView.getAllViews();
    const tabSelected = tabs.find(tab => tab.id === tabId);
    return tabSelected;
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

ipcMain.on('search-url', (_, { tabId, url }) => {
    const tabSelected = findTab(tabId);
    tabSelected.webContents.loadURL(url);
})

ipcMain.on('new-tab', () => {
    createViewWindow();
})

ipcMain.on('switch-tab', (_, { viewId, tabId }) => {
    switchViewWindow(viewId, tabId);
})

ipcMain.on('go-back', (_, { tabId }) => {
    const tabSelected = findTab(tabId);
    if (tabSelected.webContents.canGoBack()) {
        return tabSelected.webContents.goBack();
    }
})

ipcMain.on('go-forward', (_, { tabId }) => {
    const tabSelected = findTab(tabId);
    if (tabSelected.webContents.canGoForward()){
        tabSelected.webContents.goForward();
    }
})

ipcMain.on('go-home', (_, { tabId }) => {
    const tabSelected = findTab(tabId);
    tabSelected.webContents.goToIndex(0);
})

ipcMain.on('reload', (_, { tabId }) => {
    const tabSelected = findTab(tabId);
    tabSelected.webContents.reload();
})