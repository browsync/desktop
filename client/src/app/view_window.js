const { BrowserView } = require('electron');

class ViewWindow extends BrowserView {
  constructor(viewId = '') {
    super();    
    this.viewId = viewId;
  }

  setViewId(viewId) {
    this.viewId = viewId;
  }
  getViewId() {
    return this.viewId;
  }
}

module.exports = ViewWindow;
