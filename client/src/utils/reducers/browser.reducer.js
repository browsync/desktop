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
  let viewId;
  let tabUpdatedIndex;
  let tabsUpdated;
  let tabSelected;
  let viewSelected;
  let viewNew;

  switch (type) {
    case 'CREATE_VIEW':
      tabNew = { id: 1, viewId: payload.id, title: `tab-${payload.id}.1`, urlCurrent: state.searchEngine, indexCurrent: 0, indexLast: 0 }
      viewNew = { id: payload.id, title: `view-${payload.id}`, tabLastId: 1};
      return { 
        ...state,
        views: state.views.concat(viewNew),
        tabs: state.tabs.concat(tabNew),
        viewSelected: viewNew,
        tabSelected: tabNew,
      }

    case 'UPDATE_TAB':
      tabUpdatedIndex = findIndex(state.tabs, { id: payload.id });
      tabsUpdated = [ ...state.tabs ]
      tabsUpdated.splice(tabUpdatedIndex, 1, payload);
      return { ...state, tabs: tabsUpdated, tabSelected: payload }

    case 'CREATE_TAB':
      tabId = state.tabs.length + 1;
      ({ viewId } = payload);
      tabNew = { id: tabId, viewId: viewId, title: `tab-${viewId}.${tabId}`, urlCurrent: state.searchEngine, indexCurrent: 0, indexLast: 0 }; // TODO REFACTOR Use Class
      return { ...state, tabs: state.tabs.concat(tabNew), tabSelected: tabNew };

    case 'SWITCH_TAB':
      ({ viewId, tabId } = payload);
      viewSelected = state.views.find(view => view.id === viewId); 
      tabSelected = state.tabs.find(tab => tab.id === tabId); 
      return { ...state, viewSelected: viewSelected, tabSelected: tabSelected };

    default: 
      return state;
  }
}

export default browserReducer;