const { app, BrowserView, ipcMain, screen: display } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const findIndex = require('lodash/findIndex');
const sortBy = require('lodash/sortBy');

const MainWindow = require('./main_window');
const ViewWindow = require('./view_window');

let searchEngineDefault = 'https://github.com';
let screen;
let topBarHeight = 50;
let main;
let isViewCreated;
let isTabCreated;

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
    
    // main.webContents.openDevTools();
    main.on("closed", () => (main = null));
}

function createView() {
    const viewNew = new ViewWindow();
    main.addBrowserView(viewNew);

    const views = main.getBrowserViews();
    const viewActiveIndex = findIndex(views, { id: viewNew.id });
    viewNew.setViewId(viewActiveIndex);

    viewNew.webContents.loadURL(searchEngineDefault).then(() => {
        resizeViews();
    });

    isViewCreated = true;

    viewNew.webContents.on('navigation-entry-commited', () => {
        const views = main.getBrowserViews();
        const viewActiveIndex = findIndex(views, { id: viewNew.id });
        const { history, currentIndex } = viewNew.webContents;
        const payload = {
            id: viewNew.id,
            viewId: viewActiveIndex,
            urlCurrent: history[currentIndex],
            indexCurrent: currentIndex,
            indexLast: history.length - 1,
        };
        if (isViewCreated) {
            main.webContents.send('new-view-resp', payload);
            isViewCreated = false;
        } else {
            main.webContents.send('tab-history', payload);
        }
    })
}

function resizeViews() {
    const views = main.getBrowserViews();
    const tabs = BrowserView.getAllViews();
    tabs.map(tab => {
        tab.setBounds({ 
            x: (screen.width / views.length) * tab.viewId,
            y: topBarHeight,
            width: screen.width / views.length,
            height: screen.height - topBarHeight,
        })
    })
}

function updateViews(viewId, tabInserted) {
    const views = main.getBrowserViews();
    if (views.length > 0) {
        views.forEach(view => {
            main.removeBrowserView(view);
        });
    }
    const viewsSorted = sortBy(views, ['viewId']);
    viewsSorted.splice(viewId, 1, tabInserted); // sort
    viewsSorted.forEach(view => {
        main.addBrowserView(view);
    });
}

function createTab(viewId) { 
    const tabNew = new ViewWindow(viewId);
    tabNew.webContents.loadURL(searchEngineDefault).then(() => {
        updateViews(viewId, tabNew);
        resizeViews();
    })
    
    isTabCreated = true;
    
    tabNew.webContents.on('navigation-entry-commited', () => {
        const { history, currentIndex } = tabNew.webContents;
        const payload = {
            id: tabNew.id,
            viewId: viewId,
            urlCurrent: history[currentIndex],
            indexCurrent: currentIndex,
            indexLast: history.length - 1,
        }
        if (isTabCreated) {
            main.webContents.send('new-tab-resp', payload);
            isTabCreated = false;
        } else {
            main.webContents.send('tab-history', payload);
        }
    })
}

function switchTab(viewId, tabId) {
    const tabActive = findTab(tabId, viewId);
    updateViews(viewId, tabActive);
}

function findTab(tabId, viewId) {
    const tabs = BrowserView.getAllViews();
    const tabActive = tabs.find(tab => tab.id === tabId);
    return tabActive;
}

ipcMain.on('new-view', () => {
    createView();
})

ipcMain.on('search-url', (_, { tabId, url }) => {
    const tabActive = findTab(tabId);
    tabActive.webContents.loadURL(url);
})

ipcMain.on('new-tab', (_, { viewId }) => {
    createTab(viewId);
})

ipcMain.on('switch-tab', (_, { viewId, tabId }) => {
    switchTab(viewId, tabId);
})

ipcMain.on('go-back', (_, { tabId }) => {
    const tabActive = findTab(tabId);
    if (tabActive.webContents.canGoBack()) {
        return tabActive.webContents.goBack();
    }
})

ipcMain.on('go-forward', (_, { tabId }) => {
    const tabActive = findTab(tabId);
    if (tabActive.webContents.canGoForward()){
        tabActive.webContents.goForward();
    }
})

ipcMain.on('go-home', (_, { tabId }) => {
    const tabActive = findTab(tabId);
    tabActive.webContents.goToIndex(0);
})

ipcMain.on('reload', (_, { tabId }) => {
    const tabActive = findTab(tabId);
    tabActive.webContents.reload();
})