const { findIndex } = require('lodash');

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
      console.log(`Create View: ${payload.viewId}, ${payload.id}`);
      if (!payload.name) payload.name = `tab-${payload.viewId}.${payload.id}`;
      viewNew = { id: state.views.length, name: `view-${payload.id}`, isOpen: true };
      return {
        ...state,
        views: state.views.concat(viewNew),
        tabs: state.tabs.concat(payload),
        viewActive: viewNew,
        tabActive: payload,
      }

    case 'REMOVE_VIEW':
      console.log(`Remove View: ${payload.viewId}`);
      const viewsFiltered = state.views.filter(view => view.id !== payload.viewId );
      return { ...state, views: viewsFiltered }

    case 'TOGGLE_VIEW':
      console.log(`Toggle View: ${payload.viewId}`);
      const viewUpdated = [...state.views];
      viewUpdated.forEach((view, idx) => {
        if (view.id === payload.viewId) {
          viewUpdated[idx].isOpen = !viewUpdated[idx].isOpen;
        }
      })
      return { ...state, views: viewUpdated }

    case 'CREATE_TAB':
      console.log(`Create Tab: ${payload.viewId}, ${payload.id}`);
      if (!payload.name) payload.name = `tab-${payload.viewId}.${payload.id}`;
      return { ...state, tabs: state.tabs.concat(payload), tabActive: payload };

    case 'UPDATE_TAB':
      console.log(`Update Tab: ${payload.viewId}, ${payload.id}`);
      if (!payload.name) payload.name = `tab-${payload.viewId}.${payload.id}`;
      tabUpdatedIndex = findIndex(state.tabs, { id: payload.id, viewId: payload.viewId });
      tabsUpdated = [ ...state.tabs ]
      tabsUpdated.splice(tabUpdatedIndex, 1, payload);
      return { ...state, tabs: tabsUpdated, tabActive: payload }
    
    case 'SWITCH_TAB':
      ({ viewId, tabId } = payload);
      console.log(`Switch tab: ${viewId}, ${tabId}`);
      viewActive = state.views.find(view => view.id === viewId);
      tabActive = state.tabs.find(tab => tab.id === tabId);
      return { ...state, viewActive: viewActive, tabActive: tabActive };

    case 'REMOVE_TAB':
      console.log(`Remove Tab: ${payload.viewId}, ${payload.id}`);
      const tabsFiltered = state.tabs.filter(tab => tab.id !== payload.tabId );
      return { ...state, tabs: tabsFiltered }

    default: 
      return state;
  }
}

export default browserReducer;