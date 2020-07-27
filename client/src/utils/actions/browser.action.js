export function createView(viewNew) {
  return ({
    type: 'CREATE_VIEW',
    payload: viewNew,
  })
}

export function updateTab(tabUpdated) {
  return (
    async (dispatch, getState) => {
      try {
        tabUpdated.viewId = getState().browser.viewActive.id;
        tabUpdated.title = `tab-${tabUpdated.viewId}.${tabUpdated.id}`;
        dispatch({
          type: 'UPDATE_TAB',
          payload: tabUpdated,
        })
      } catch(err) {
        console.log(err.message)
      }
    }
  )
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