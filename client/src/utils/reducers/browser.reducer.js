const findIndex = require('lodash/findIndex');

const initialState = {
  views: [],
  viewActive: {},
  tabs: [],
  tabActive: {},
  searchEngine: 'https://github.com',
}

const browserReducer = ( state = initialState, { type, payload }) => {
  let tabNew;
  let tabId;
  let viewId;
  let tabUpdatedIndex;
  let tabActive;
  let tabsUpdated;
  let viewActive;
  let viewNew;

  switch (type) {
    case 'CREATE_VIEW': 
      console.log("Create View");
      tabNew = { ...payload, title: `tab-${payload.viewId}.${payload.id}` }
      viewNew = { id: state.views.length, title: `view-${payload.id}`};
      return {
        ...state,
        views: state.views.concat(viewNew),
        tabs: state.tabs.concat(tabNew),
        viewActive: viewNew,
        tabActive: tabNew,
      }

    case 'UPDATE_TAB':
      console.log("Reducer Updated Tab");
      tabUpdatedIndex = findIndex(state.tabs, { id: payload.id, viewId: payload.viewId });
      tabsUpdated = [ ...state.tabs ]
      tabsUpdated.splice(tabUpdatedIndex, 1, payload);
      return { ...state, tabs: tabsUpdated, tabActive: payload }

    case 'CREATE_TAB':
      console.log("Reducer Create Tab");
      payload.title = `tab-${payload.viewId}.${payload.id}`;
      return { ...state, tabs: state.tabs.concat(payload), tabActive: payload };

    case 'SWITCH_TAB':
      console.log("Reducer Switch Tab");
      ({ viewId, tabId } = payload);
      viewActive = state.views.find(view => view.id === viewId);
      tabActive = state.tabs.find(tab => tab.id === tabId);
      console.log(viewActive, tabActive);
      return { ...state, viewActive: viewActive, tabActive: tabActive };

    default: 
      return state;
  }
}

export default browserReducer;