import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Icon from 'react-feather';
import $ from 'jquery'

<<<<<<< HEAD
import { createView, updateTab, createTab, switchTab, setActiveView } from '../utils/actions/browser.action';
import { findLastIndex } from 'lodash';
=======
import { createView, removeView, createTab, updateTab, switchTab, removeTab } from '../utils/actions/browser.action';
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60

const { ipcRenderer } = window.require("electron");

export default function Main() {
  const dispatch = useDispatch();
  const views = useSelector(state => state.browser.views);
  const tabs = useSelector(state => state.browser.tabs);
<<<<<<< HEAD
  const viewActive = useSelector(state => state.browser.viewActive);
=======
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
  const tabActive = useSelector(state => state.browser.tabActive);
  const urlSearchBar = useRef(null);

  useEffect(() => {
<<<<<<< HEAD
    // TODO BOOKMARK Fetch bookmark data from server
    ipcRenderer.send('new-view');

    ipcRenderer.on('tab-history', (event, tabUpdated) => {
      tabUpdated.viewId = viewActive.id;
=======
    // TODO BOOKMARK Fetch
    ipcRenderer.send('new-view');

    ipcRenderer.on('tab-history', (_, tabUpdated) => {
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
      urlSearchBar.current.value = tabUpdated.urlCurrent;
      urlSearchBar.current.focus();
      urlSearchBar.current.select();
      dispatch(updateTab(tabUpdated));
    })

<<<<<<< HEAD
    ipcRenderer.on('new-view-resp', (event, viewNew) => {
      dispatch(createView(viewNew));
    })

    ipcRenderer.on('new-tab-resp', (event, tabNew) => {
      dispatch(createTab(tabNew));
    })

=======
    ipcRenderer.on('new-view-resp', (_, viewNew) => {
      urlSearchBar.current.value = '';
      urlSearchBar.current.focus();
      dispatch(createView(viewNew));
    })

    ipcRenderer.on('new-tab-resp', (_, tabNew) => {
      urlSearchBar.current.value = '';
      urlSearchBar.current.focus();
      dispatch(createTab(tabNew));
    })

    ipcRenderer.on('remove-view', (_, viewId) => {
      dispatch(removeView(viewId));
    })
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
  }, [])

  const handleSearch = (event) => {
    event.preventDefault();

    const urlInput = event.target.url.value;
    const urlFormatted = `http://${urlInput}`; //TODO SEARCH Check wether user already include http / https or not
    const webUrlRegex = RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i);

    if (webUrlRegex.test(urlFormatted)) {
      ipcRenderer.send('search-url', { tabId: tabActive.id, url: urlFormatted });
    } else {
      const urlGoogleSearch = 'https://www.google.com/search?q=' + urlInput.replace(/ /g, "+");
      ipcRenderer.send('search-url', { tabId: tabActive.id, url: urlGoogleSearch });
    }
  }

<<<<<<< HEAD
=======
  const handleCreateView = () => {
    ipcRenderer.send('new-view');
  }

>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
  const handleCreateTab = (viewId) => {
    ipcRenderer.send('new-tab', { viewId });
  }

  const handleSwitchTab = (viewId, tab) => {
    urlSearchBar.current.value = tab.urlCurrent;
<<<<<<< HEAD
=======
    urlSearchBar.current.focus();
    urlSearchBar.current.select();
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
    dispatch(switchTab(viewId, tab.id));
    ipcRenderer.send('switch-tab', { viewId, tabId: tab.id });
  }

<<<<<<< HEAD
  const handleCreateView = () => {
    ipcRenderer.send('new-view');
=======
  const handleDeleteTab = (viewId, tabId) => {
    dispatch(removeTab(tabId));
    ipcRenderer.send('remove-tab', { viewId, tabId });
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
  }

  const goBack = () => {
    ipcRenderer.send('go-back', { tabId: tabActive.id });
  }

  const goForward = () => {
    ipcRenderer.send('go-forward', { tabId: tabActive.id });
  }

  const goHome = () => {
    ipcRenderer.send('go-home', { tabId: tabActive.id });
  }

  const reloadPage = () => {
    ipcRenderer.send('reload', { tabId: tabActive.id });
  }

  const addToBookmark = () => {
<<<<<<< HEAD
    console.log("Add to bookmark"); // TODO BOOKMARK Add url to bookmark both local & server
=======
    console.log("Add to bookmark"); // TODO BOOKMARK Add
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
  }

  return (
    <div>
<<<<<<< HEAD
    <div className="input-group">
        <div class="input-group-prepend">
          <button 
            className="btn btn-sm btn-info"
            onClick={() => goBack()}
            disabled={ tabActive.indexCurrent === 0 ? true : false }
            > <Icon.ChevronLeft />
          </button>

          <button 
            className="btn btn-sm btn-info ml-2"
            onClick={() => goForward()} 
            disabled={ tabActive.indexCurrent === tabActive.indexLast ? true : false }
            > <Icon.ChevronRight />
          </button>

          <button className="btn btn-sm btn-info ml-2" onClick={() => goHome()}> <Icon.Home /> </button>
          <button className="btn btn-sm btn-info ml-2" onClick={() => reloadPage()}> <Icon.RotateCw /> </button>
        </div>
        <form style={{ display: 'inline' }} onSubmit={handleSearch}>
          <input ref={urlSearchBar} style={{ width: 500, height: 35 }} type="text" name="url" placeholder="Enter url" className="form-control ml-2" />
        </form>
        <div className="input-group-prepend">
          <button className="btn btn-sm btn-info" onClick={() => handleSearch()}> <Icon.Search /> </button>
          <button className="btn btn-sm btn-info  ml-2" style={{ display: 'inline' }} onClick={() => addToBookmark()}> <Icon.Bookmark /> </button>
          <button className="btn btn-sm btn-info  ml-2" onClick={() => handleCreateView()}>New Window</button>

        </div>
      </div>

      <nav id="sidebar">
        <div class="sidebar-header">
          <button type="button" id="sidebarCollapse" class="btn btn-info" onClick={() => $("#sidebar").toggleClass("active")}>
            <h3 className="mx-3"> BrowSync </h3>
            <strong>BS</strong>
          </button>
        </div>
        <ul class="list-unstyled components" id="tab">
          <li>
            {
              views.map(view => {
                return (
                  <button className="btn btn-sm btn-info btn-block" onClick={() => handleCreateTab(view.id)}>
                    <Icon.PlusSquare /> {view.id + 1}
                  </button>
                )
              })
            }
          </li>
          <li>
            <input class="form-control" type="text" placeholder="Search" aria-label="Search" />
          </li>
          {
            views.map(view => {
              return (
                <li style={{ display: 'inline' }} key={view.title}>
                  {
                    tabs.map(tab => {
                      if (tab.viewId === view.id)
                        return (
                          <div key={tab.title} className="d-flex flex-row">
                            <button 
                              className="btn btn-sm btn-secondary btn-block" 
                              onClick={() => handleSwitchTab(view.id, tab)}
                              disabled={tabActive.id === tab.id ? true : false} 
                              >{ tab.title }
                            </button>

                            {/* tombo close tab */}
                            <button className="btn btn-sm btn-danger" >
                              <Icon.XSquare />
                            </button>
                          </div>
                        )
                    })
                  }
                </li>
              )
            })
          }
          <li className="text-center">
            v Bookmark v
          </li>
        </ul>
      </nav>
=======
      <button 
        onClick={() => goBack()}
        disabled={ tabActive.indexCurrent === 0 ? true : false }
        >Back
      </button>
      <button 
        onClick={() => goForward()} 
        disabled={ tabActive.indexCurrent === tabActive.indexLast ? true : false }
        >Forward
      </button>
      <button
        onClick={() => goHome()}
        >Home
      </button>
      <button 
        onClick={() => reloadPage()}
        >Reload
      </button>

      <form style={{ display: 'inline' }} onSubmit={handleSearch}>
        <input ref={urlSearchBar} style={{ width: 500 }} type="text" name="url" placeholder="Enter url" />
        <button type="submit" >Search</button>
      </form>
      <button onClick={() => addToBookmark()}>Add Bookmark</button>
      <button onClick={() => handleCreateView()}>New Window</button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {
        views.map(view => {
          return (
            <div style={{ display: 'inline' }} key={view.title}>
              {
                tabs.map(tab => {
                  if (tab.viewId === view.id)
                    return (
                      <div key={tab.title} style={{ display: 'inline'}}>
                        <button 
                          onClick={() => handleSwitchTab(view.id, tab)}
                          disabled={tabActive.id === tab.id ? true : false} 
                          >{ tab.title }
                        </button>
                        <button onClick={() => handleDeleteTab(view.id, tab.id)}>X</button>
                      </div>
                    )
                })
              }
              <button onClick={() => handleCreateTab(view.id)}>New Tab</button>
            </div>
          )
        })
      }
      </div>
>>>>>>> 68a1e0b7c7cc863966a38cebf074b47d729b5e60
  </div>
  )
}
