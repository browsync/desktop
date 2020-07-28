import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Icon from 'react-feather';
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import $ from 'jquery'

import { createView, removeView, createTab, updateTab, switchTab, removeTab } from '../utils/actions/browser.action';

const { ipcRenderer } = window.require("electron");

export default function Main() {
  const dispatch = useDispatch();
  const [isSideBarActive, toggleSideBar] = useState(true);
  const views = useSelector(state => state.browser.views);
  const tabs = useSelector(state => state.browser.tabs);
  const tabActive = useSelector(state => state.browser.tabActive);
  const urlSearchBar = useRef(null);
  const [isOpenTab, setIsOpenTab] = useState(false);
  const [isOpenBookmark, setIsOpenBookmark] = useState(false);


  useEffect(() => {
    // TODO BOOKMARK Fetch
    ipcRenderer.send('new-view');

    ipcRenderer.on('tab-history', (_, tabUpdated) => {
      urlSearchBar.current.value = tabUpdated.urlCurrent;
      urlSearchBar.current.focus();
      urlSearchBar.current.select();
      dispatch(updateTab(tabUpdated));
    })

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

  const handleCreateView = () => {
    ipcRenderer.send('new-view');
  }

  const handleCreateTab = (viewId) => {
    ipcRenderer.send('new-tab', { viewId });
  }

  const handleSwitchTab = (viewId, tab) => {
    urlSearchBar.current.value = tab.urlCurrent;
    urlSearchBar.current.focus();
    urlSearchBar.current.select();
    dispatch(switchTab(viewId, tab.id));
    ipcRenderer.send('switch-tab', { viewId, tabId: tab.id });
  }

  const handleDeleteTab = (viewId, tabId) => {
    dispatch(removeTab(tabId));
    ipcRenderer.send('remove-tab', { viewId, tabId });
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

  const handleToggleSideBar = () => {
    toggleSideBar(!isSideBarActive);
    ipcRenderer.send('toggle-sidebar');
  }

  const addToBookmark = () => {
    console.log("Add to bookmark"); // TODO BOOKMARK Add
  }


  const toggleTab = () => setIsOpenTab(!isOpenTab);

  const toggleBookmark = () => setIsOpenBookmark(!isOpenBookmark);

  return (
    <div>
      <div className="input-group py-2">
        <div className="input-group-prepend">
          <button
            className="btn btn-sm btn-info ml-2 rounded"
            onClick={() => handleToggleSideBar()}
          > <Icon.Menu />
          </button>

          <button
            className="btn btn-sm btn-info ml-2 rounded"
            onClick={() => goBack()}
            disabled={tabActive.indexCurrent === 0 ? true : false}
          > <Icon.ChevronLeft />
          </button>

          <button
            className="btn btn-sm btn-info ml-2 rounded"
            onClick={() => goForward()}
            disabled={tabActive.indexCurrent === tabActive.indexLast ? true : false}
          > <Icon.ChevronRight />
          </button>

          <button className="btn btn-sm btn-info ml-2 rounded" onClick={() => goHome()}> <Icon.Home /> </button>
          <button className="btn btn-sm btn-info ml-2 rounded" onClick={() => reloadPage()}> <Icon.RotateCw /> </button>
        </div>
        <form style={{ display: 'flex' }} onSubmit={handleSearch}>
          <input ref={urlSearchBar} style={{ width: 500, height: 35 }} type="text" name="url" placeholder="Enter url" className="form-control ml-2" />
          <button tupe="submit" className="btn btn-sm btn-info"><Icon.Search /></button>
        </form>
        <div className="input-group-prepend">
          <button className="btn btn-sm btn-info ml-2 rounded" style={{ display: 'inline' }} onClick={() => addToBookmark()}> <Icon.Bookmark /> </button>
          <button className="btn btn-sm btn-info ml-2 rounded" onClick={() => handleCreateView()}>New Window</button>
          <button className="btn btn-sm btn-info ml-2 rounded"><Icon.User /></button>
        </div>
      </div>
      <nav id="sidebar" className="px-3">
        <div className="sidebar-header">
          <button type="button" id="sidebarCollapse" className="btn btn-info" onClick={() => $("#sidebar").toggleClass("active")}>
            <h3>BrowSync</h3>
            <strong>BS</strong>
          </button>
        </div>
        <ul className="list-unstyled components" id="tab">
          <li>
            <input className="form-control" type="text" placeholder="Search" aria-label="Search" />
          </li>

          {/* Masih nggak bisa */}

          {
            views.map(view => {
              return (
                <div>
                  <a className="my-2" onClick={toggleTab}>{`  > Window ${view.id + 1}`}</a>
                  <Collapse isOpen={isOpenTab}>
                  <li style={{ display: 'inline' }} key={view.title}>
                    {
                      tabs.map(tab => {
                        if (tab.viewId === view.id)
                          return (
                            <div key={tab.title} className="d-flex flex-row">
                              <button
                                className="btn btn-sm btn-light btn-block"
                                onClick={() => handleSwitchTab(view.id, tab)}
                                disabled={tabActive.id === tab.id ? true : false}
                              >{tab.title}
                              </button>

                              <button onClick={() => handleDeleteTab(view.id, tab.id)} className="btn btn-sm btn-dark" >
                                X
                                  </button>
                            </div>
                          )
                      })
                    }
                  </li>
                  </Collapse>
                  <li>
                    <button className="btn btn-sm btn-info btn-block" onClick={() => handleCreateTab(view.id)}>
                      <Icon.PlusSquare />
                    </button>
                  </li>
                </div>
              )
            })
          }
          <li className="mt-3 mb-2">
            <a onClick={toggleBookmark}>{`  > Bookmark`}</a>
            <Collapse isOpen={isOpenBookmark}>
              <ul>
                <li>
                  Bookmark 1
                </li>
                <li>
                  Bookmark 2
                </li>
              </ul>
            </Collapse>
          </li>
        </ul>
      </nav>
    </div>
  )
}
