const { app, BrowserView, ipcMain, screen: display } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const { findIndex, sortBy, find, findLast } = require('lodash');

const MainWindow = require('./main_window');
const ViewWindow = require('./view_window');

let iconPath = path.join(app.getAppPath(), '/public/browsync2.ico');
let searchEngineDefault = 'https://github.com';
let screen;
let topBarHeight = 63; // 51
let sideBarWidth = 250;
let isSideBarActive = true;
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
        frame: false,
    });
     
    main.loadURL(
        isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    
    screen.width -= 400;
    main.webContents.openDevTools();
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
    // TODO VIEWS Resize error when making 3 window & close the first view
    // console.log(views.length, '\n)
    tabs.map(tab => {
        // console.log(tab.viewId);
        let viewPosX;
        let viewWidth;
        if (isSideBarActive) {
            viewPosX = sideBarWidth + ((screen.width - sideBarWidth) / views.length) * tab.viewId;
            viewWidth = (screen.width - sideBarWidth) / views.length;
        } else{
            viewPosX = (screen.width / views.length) * tab.viewId;
            viewWidth = screen.width / views.length;
        }
        tab.setBounds({ 
            x: viewPosX,
            y: topBarHeight,
            width: viewWidth,
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

function createTab(viewId, url) { 
    const tabNew = new ViewWindow(viewId);
    let urlLoaded;
    if (url) {
        urlLoaded = url;
    } else {
        urlLoaded = searchEngineDefault;
    }
    tabNew.webContents.loadURL(urlLoaded).then(() => {
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

ipcMain.on('new-tab', (_, { viewId, url }) => {
    createTab(viewId, url);
})

ipcMain.on('switch-tab', (_, { viewId, tabId }) => {
    switchTab(viewId, tabId);
})

ipcMain.on('remove-tab', (_, { viewId, tabId }) => {
    removeTab(viewId, tabId);
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

ipcMain.on('toggle-sidebar', () => {
    isSideBarActive = !isSideBarActive;
    resizeViews();
})