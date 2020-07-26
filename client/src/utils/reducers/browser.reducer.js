const findIndex = require('lodash/findIndex');

const initialState = {
  views: [],
  viewSelected: {},
  tabs: [],
  tabSelected: {},
  searchEngine: 'https://github.com',
}

const browserReducer = ( state = initialState, { type, payload }) => {
  let tabNew;
  let tabId;

  switch (type) {
    case 'CREATE_VIEW':
      tabNew = { id: 1, viewId: payload.id, title: `tab-${payload.id}.1`, urlCurrent: state.searchEngine, indexCurrent: 0, indexLast: 0 }
      const viewNew = { id: payload.id, title: `view-${payload.id}`, tabLastId: 1};
      // console.log("New Tab >>> ", tabNew);
      // console.log("New View >>> ", viewNew);
      return { 
        ...state,
        views: state.views.concat(viewNew),
        tabs: state.tabs.concat(tabNew),
        viewSelected: viewNew,
        tabSelected: tabNew,
      }

    case 'UPDATE_TAB':
      const tabUpdatedIndex = findIndex(state.tabs, { id: payload.id });
      const tabsUpdated = [ ...state.tabs ]
      tabsUpdated.splice(tabUpdatedIndex, 1, payload);
      // console.log("payload >>>", payload);
      // console.log("tabsNew >>>", tabsUpdated);
      return { ...state, tabs: tabsUpdated, tabSelected: payload }

    case 'CREATE_TAB':
      tabId = state.tabs.length + 1;
      const { viewId } = payload;
      tabNew = { id: tabId, viewId: viewId, title: `tab-${viewId}.${tabId}`, urlCurrent: state.searchEngine, indexCurrent: 0, indexLast: 0 }; // TODO REFACTOR Use Class
      console.log(state.tabs.concat(tabNew));
      return { ...state, tabs: state.tabs.concat(tabNew), tabSelected: tabNew };

    default: 
      return state;
  }
}

export default browserReducer;