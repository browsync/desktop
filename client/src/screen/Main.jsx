import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createView, updateTab, createTab, switchTab } from '../utils/actions/browser.action';

const { ipcRenderer } = window.require("electron");

export default function Main() {
  const dispatch = useDispatch();
  const views = useSelector(state => state.browser.views);
  const tabs = useSelector(state => state.browser.tabs);
  const viewSelected = useSelector(state => state.browser.viewSelected);
  const tabSelected = useSelector(state => state.browser.tabSelected);

  const urlSearchBar = useRef(null);

  useEffect(() => {
    // TODO BOOKMARK Fetch bookmark data from server
    dispatch(createView(1));
    
    ipcRenderer.on('browser-history', (event, tabUpdated) => {
      tabUpdated.viewId = viewSelected.id;
      urlSearchBar.current.value = tabUpdated.urlCurrent;
      dispatch(updateTab(tabUpdated));
      // if (isInitialMount()) urlSearchBar.current.value = '';
    })
  }, [])

  // const initialMount = useRef(true);
  // const isInitialMount = () => {
  //   if (initialMount.current) {
  //     initialMount.current = false; 
  //     return true;
  //   }
  // }

  const handleSearch = (event) => {
    event.preventDefault();

    const urlInput = event.target.url.value;
    const urlFormatted = `http://${urlInput}`; //TODO SEARCH Check wether user already include http / https or not
    const webUrlRegex = RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i);

    if (webUrlRegex.test(urlFormatted)) {
      ipcRenderer.send('search-url', urlFormatted);
    } else {
      const urlGoogleSearch = 'https://www.google.com/search?q=' + urlInput.replace(/ /g, "+");
      ipcRenderer.send('search-url', urlGoogleSearch);
    }
  }

  const handleCreateTab = (viewId) => {
    dispatch(createTab(viewId)); // TODO VIEW Change to async (ipcRenderer after success) 
    ipcRenderer.send('new-tab', viewId);
  }

  const handleSwitchTab = (viewId, tab) => {
    urlSearchBar.current.value = tab.urlCurrent;
    dispatch(switchTab(viewId, tab.id));
    ipcRenderer.send('switch-tab', { viewId, tabId: tab.id });
  }

  const handleSwitchView = (viewId) => {

    console.log(`View ID: ${viewId}`)
  }

  const goBack = () => {
    ipcRenderer.send('go-back');
  }

  const goForward = () => {
    ipcRenderer.send('go-forward');
  }

  const goHome = () => {
    ipcRenderer.send('go-home');
  }

  const reloadPage = () => {
    ipcRenderer.send('reload');
  }

  const addToBookmark = () => {
    console.log("Add to bookmark"); // TODO BOOKMARK Add url to bookmark both local & server
  }

  const createNewViewWindow = () => {
    ipcRenderer.send('new-viewWindow');
  }

  return (
    <div>
      <button 
        onClick={() => goBack()}
        disabled={ tabSelected.indexCurrent === 0 ? true : false }
        >Back</button>
      <button 
        onClick={() => goForward()} 
        disabled={ tabSelected.indexCurrent === tabSelected.indexLast ? true : false }
        >Forward</button>
      <button onClick={() => goHome()}>Home</button>
      <button onClick={() => reloadPage()}>Reload</button>

      <form style={{ display: 'inline' }} onSubmit={handleSearch}>
        <input ref={urlSearchBar} style={{ width: 500 }} type="text" name="url" placeholder="Enter url" />
        <button type="submit" >Search</button>
      </form>
      <button style={{ display: 'inline' }} onClick={() => addToBookmark()}>Add Bookmark</button>
      <button style={{ display: 'block' }} onClick={() => createNewViewWindow()}>New Window</button>
      
      {
        views.map(view => {
          return (
            <div key={view.id}>
              {
                tabs.map(tab => {
                    return <button disabled={tabSelected.id === tab.id ? true : false} key={tab.title} onClick={() => handleSwitchTab(view.id, tab)}>{ tab.title }</button>
                  
                })
              }
              <button onClick={() => handleCreateTab(view.id)}>New Tab</button>
              <button onClick={() => handleSwitchView(view.id)}>Switch View</button>
            </div>
          )
        })
      }
    </div>
  )
}
