const { app, BrowserView, ipcMain, screen: display } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

const MainWindow = require('./main_window');

let searchEngineDefault = 'https://github.com';
let screen;
let topBarHeight = 400;
let main;

(setupApp = () => {
    app.on("ready", createMain);
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
    app.on("activate", () => {
        if (main === null) {
            createMain();
        }
    });
})();

function createMain() {
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
    
    createTab(1);
    main.on("closed", () => (main = null));
      
    main.webContents.openDevTools()
}

function createTab(viewId) { // TODO Add argument for split screen
    const tabNew = new BrowserView(); // TODO CLASS Create class 
    tabNew.webContents.loadURL(searchEngineDefault) //TODO SEARCH ENGINE Change to default search engine from config
    updateViews(viewId, tabNew);
    resizeViews();
    
    tabNew.webContents.on('navigation-entry-commited', () => {
        const { history, currentIndex } = tabNew.webContents;
        main.webContents.send('browser-history', {
            id: tabNew.id,
            urlCurrent: history[currentIndex],
            indexCurrent: currentIndex,
            indexLast: history.length - 1,
        });
    })
}

function switchTab(viewId, tabId) {
    const tabSelected = findTab(tabId);
    updateViews(viewId, tabSelected);
}

function createView(){
    // here tab mean view
    const tabNew = new BrowserView(); // TODO CLASS Create class 
    tabNew.webContents.loadURL(searchEngineDefault) //TODO SEARCH ENGINE Change to default search engine from config
    // updateViews(viewId, tabNew);
    main.addBrowserView(tabNew);
    resizeViews();
    
    tabNew.webContents.on('navigation-entry-commited', () => {
        const { history, currentIndex } = tabNew.webContents;
        main.webContents.send('browser-history', {
            id: tabNew.id,
            urlCurrent: history[currentIndex],
            indexCurrent: currentIndex,
            indexLast: history.length - 1,
        });
        console.log(main.webContents);
    })
}

function resizeViews() {
    const views = main.getBrowserViews();
    views.map((view, idx) => {
        view.setBounds({ 
            x: (screen.width / views.length) * idx,
            y: topBarHeight,
            width: 300,
            height: screen.height - topBarHeight,
        }) //TODO VIEW Resize properly & dynamically 
    })
}

function findTab(tabId) {
    const tabs = BrowserView.getAllViews();
    const tabSelected = tabs.find(tab => tab.id === tabId);
    return tabSelected;
}

function updateViews(viewId, tabInserted) {
    const views = main.getBrowserViews();
    if (views.length > 0) {
        views.forEach(view => {
            main.removeBrowserView(view);
        });
    }
    views.splice(viewId - 1, 1, tabInserted);
    views.forEach(view => {
        main.addBrowserView(view);
    });
}

ipcMain.on('search-url', (_, { tabId, url }) => {
    const tabSelected = findTab(tabId);
    tabSelected.webContents.loadURL(url);
})

ipcMain.on('new-tab', (_, { viewId }) => {
    createTab(viewId);
})

ipcMain.on('switch-tab', (_, { viewId, tabId }) => {
    switchTab(viewId, tabId);
})

ipcMain.on('new-view', () => {
    createView();
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