export function createView(viewNew) {
  return ({
    type: 'CREATE_VIEW',
    payload: viewNew,
  })
}

export function removeView(viewId) {
  return ({
    type: 'REMOVE_VIEW',
    payload: { viewId },
  })
}

export function createTab(tab) {
  return ({
    type: 'CREATE_TAB',
    payload: tab,
  })
}

export function updateTab(tabUpdated) {
  return ({
    type: 'UPDATE_TAB',
    payload: tabUpdated,
  })
}

export function switchTab(viewId, tabId) {
  return ({
    type: 'SWITCH_TAB',
    payload: { viewId, tabId },
  })
}

export function removeTab(tabId) {
  return ({
    type: 'REMOVE_TAB',
    payload: { tabId },
  })
}

export function toggleView(viewId) {
  return ({
    type: 'TOGGLE_VIEW',
    payload: { viewId },
  })
}
