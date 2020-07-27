export function createView(id) {
  return ({
    type: 'CREATE_VIEW',
    payload: { id },
  })
}

export function updateTab(tabUpdated) {
  return (
    async (dispatch, getState) => {
      try {
        tabUpdated.viewId = getState().browser.viewSelected.id;
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

export function createTab(viewId) {
  return ({
    type: 'CREATE_TAB',
    payload: { viewId },
  })
}