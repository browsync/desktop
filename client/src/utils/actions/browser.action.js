export function createView(viewNew) {
  return ({
    type: 'CREATE_VIEW',
    payload: viewNew,
  })
}

export function updateTab(tabUpdated) {
  return ({
    type: 'UPDATE_TAB',
    payload: tabUpdated,
  })
}

export function createTab(tab) {
  return ({
    type: 'CREATE_TAB',
    payload: tab,
  })
}

export function switchTab(viewId, tabId) {
  return ({
    type: 'SWITCH_TAB',
    payload: { viewId, tabId },
  })
}

// export function setActiveView(viewId, tabId) {
//   return ({
//     type: 'SWITCH_TAB',
//     payload: { viewId, tabId },
//   })
// }