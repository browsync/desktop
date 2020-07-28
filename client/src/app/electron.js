const { app, BrowserView, ipcMain, screen: display } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
<<<<<<< HEAD
const findIndex = require('lodash/findIndex');
=======
const { findIndex, sortBy, find, findLast } = require('lodash');
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60

const MainWindow = require('./main_window');
const ViewWindow = require('./view_window');

let iconPath = path.join(app.getAppPath(), '/public/browsync2.ico');
let searchEngineDefault = 'https://github.com';
let screen;
<<<<<<< HEAD
let topBarHeight = 350;
=======
let topBarHeight = 50;
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
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
        icon: iconPath,
    });
     
    main.loadURL(
        isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    
<<<<<<< HEAD
=======
    // screen.width -= 500;
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
    // main.webContents.openDevTools();
    main.on("closed", () => (main = null));
}

<<<<<<< HEAD
function createTab(viewId) { // TODO Add argument for split screen
    const tabNew = new ViewWindow(viewId);
    tabNew.webContents.loadURL(searchEngineDefault); //TODO SEARCH ENGINE Change to default search engine from config
    updateViews(viewId, tabNew);
    resizeViews();

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
=======
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
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
        } else {
            main.webContents.send('tab-history', payload);
        }
    })
}

<<<<<<< HEAD
function switchTab(viewId, tabId) {
    const tabActive = findTab(tabId);
    updateViews(viewId, tabActive);
}

function createView() {
    const viewNew = new ViewWindow();
    viewNew.webContents.loadURL(searchEngineDefault); // TODO SEARCH ENGINE Change to default search engine from config
    main.addBrowserView(viewNew);

    const views = main.getBrowserViews();
    const viewActiveIndex = findIndex(views, { id: viewNew.id });
    viewNew.setViewId(viewActiveIndex);

    resizeViews();

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
=======
function resizeViews() {
    const views = main.getBrowserViews();
    const tabs = BrowserView.getAllViews();
    // TODO VIEWS Resize error when making 3 window & close the first view
    // console.log(views.length)
    // console.log("");
    tabs.map(tab => {
        // console.log(tab.viewId);
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
        tab.setBounds({ 
            x: (screen.width / views.length) * tab.viewId,
            y: topBarHeight,
            width: screen.width / views.length,
            height: screen.height - topBarHeight,
        })
    })
}

<<<<<<< HEAD
function findTab(tabId) {
    const tabs = BrowserView.getAllViews();
    const tabActive = tabs.find(tab => tab.id === tabId);
    return tabActive;
}

=======
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
function updateViews(viewId, tabInserted) {
    const views = main.getBrowserViews();
    if (views.length > 0) {
        views.forEach(view => {
            main.removeBrowserView(view);
        });
    }
<<<<<<< HEAD
    
    views.splice(viewId, 1, tabInserted);
    views.forEach(view => {
        main.addBrowserView(view);
    });
}

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

ipcMain.on('new-view', () => {
    createView();
=======
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
    const tabActive = findTab(tabId);
    updateViews(viewId, tabActive);
}

function findTab(tabId) {
    const tabs = BrowserView.getAllViews();
    const tabActive = tabs.find(tab => tab.id === tabId);
    return tabActive;
}

function removeTab(viewId, tabId) {
    // TODO TAB Remove last tab of view? Remove last tab of entire view?
    const tabs = BrowserView.getAllViews();
    const tabDestroyed = tabs.find(tab => tab.id === tabId);

    const views = main.getBrowserViews();
    const viewActive = find(views, { viewId });

    const viewsSorted = sortBy(views, ['viewId']);
    const viewActiveIndex = findIndex(viewsSorted, viewActive);

    if (viewActive.id === tabId) {
        const tabsAfterDestroy = tabs.filter(tab => tab.id !== tabDestroyed.id);
        const tabSelectedAfterDestroyed = findLast(tabsAfterDestroy, { viewId });
        if (tabSelectedAfterDestroyed) {
            updateViews(viewId, tabSelectedAfterDestroyed);
        } else {
            if (BrowserView.getAllViews().length === 1) {
                app.quit();
            } else {
                main.removeBrowserView(viewActive);
                resizeViews(); // TODO VIEW Remove first view
                main.webContents.send('remove-view', viewActiveIndex);
            }
        }
    }
    
    tabDestroyed.destroy();
    // viewActive.id === tabId ? !tabSelectedAfterDestroyed : !BrowserView.getAllViews().length === 1 ? resizeViews() : ''
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

ipcMain.on('remove-tab', (_, { viewId, tabId }) => {
    removeTab(viewId, tabId);
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
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