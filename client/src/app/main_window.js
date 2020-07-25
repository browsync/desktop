const { BrowserWindow } = require('electron');

class MainWindow extends BrowserWindow {
  constructor(options) {
    options.webPreferences = {
      backgroundThrottling: false,
      nodeIntegration: true,
    }
    super(options);
  }
}

module.exports = MainWindow;
