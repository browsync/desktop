export function createView(viewNew) {
  return ({
    type: 'CREATE_VIEW',
    payload: viewNew,
  })
}

<<<<<<< HEAD
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
=======
export function removeView(viewId) {
  return ({
    type: 'REMOVE_VIEW',
    payload: { viewId },
  })
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
}

export function createTab(tab) {
  return ({
    type: 'CREATE_TAB',
    payload: tab,
<<<<<<< HEAD
=======
  })
}

export function updateTab(tabUpdated) {
  return ({
    type: 'UPDATE_TAB',
    payload: tabUpdated,
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
  })
}

export function switchTab(viewId, tabId) {
  return ({
    type: 'SWITCH_TAB',
    payload: { viewId, tabId },
  })
}

<<<<<<< HEAD
// export function setActiveView(viewId, tabId) {
//   return ({
//     type: 'SWITCH_TAB',
//     payload: { viewId, tabId },
//   })
// }
=======
export function removeTab(tabId) {
  return ({
    type: 'REMOVE_TAB',
    payload: { tabId },
  })
}
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
