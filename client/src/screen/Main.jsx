import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectSearch from 'react-select-search';
import { Collapse } from 'reactstrap';
import { Dropdown } from "react-bootstrap";
import * as Icon from 'react-feather';
import Axios from "axios";

import FileBookmark from '../components/table'
import FormBookmark from "../components/formAddBookmark"
import FormFolder from "../components/formAddFolder"
import Login from "../components/login";
import { createView, toggleView, removeView, createTab, updateTab, switchTab, removeTab } from '../utils/actions/browser.action';

const { ipcRenderer } = window.require("electron");

export default function Main() {
  const dispatch = useDispatch();
  const [isLogin, setLogin] = useState(false);
  const [folder, setFolder] = useState([])

  const [ isSideBarActive, toggleSideBar] = useState(true);
  const [ tabsForSearch, setTabsForSearch ] = useState([]);
  const views = useSelector(state => state.browser.views);
  const tabs = useSelector(state => state.browser.tabs);
  const tabActive = useSelector(state => state.browser.tabActive);
  const urlSearchBar = useRef(null);

  const [isOpenView, setIsOpenView] = useState(true);
  const [isOpenBookmark, setIsOpenBookmark] = useState(true);
  const toggleAllView = () => setIsOpenView(!isOpenView);
  const handleToggleView = (viewId) => dispatch(toggleView(viewId));
  const toggleBookmark = () => setIsOpenBookmark(!isOpenBookmark);
  
  useEffect(() => {
    if (localStorage.access_token) {
      fetchFolder();
    }

    ipcRenderer.send('new-view');
    // TODO TAB Update always happen twice
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

    ipcRenderer.on('shortcut', (_, sideBarStatus) => {
      toggleSideBar(sideBarStatus);
      ipcRenderer.send('toggle-sidebar');
    })
  }, [])
  

  const fetchFolder = () => {
    Axios({
      method:'get',
      url:"http://localhost:5000/folder",
      headers:{
        access_token : localStorage.access_token
      }
    })
    .then(({data}) => {
      setFolder(data);
      setLogin(true);
    })
  }

  const handleSearch = (event) => {
    event.preventDefault();

    const urlInput = event.target.url.value;
    const urlFormatted = `http://${urlInput}`; //TODO SEARCH Check wether user already include http / https or not
    const webUrlRegex = RegExp(
      /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i
    );

    if (webUrlRegex.test(urlFormatted)) {
      ipcRenderer.send('search-url', { tabId: tabActive.id, url: urlFormatted });
    } else {
      const urlGoogleSearch = 'https://www.google.com/search?q=' + urlInput.replace(/ /g, "+");
      ipcRenderer.send('search-url', { tabId: tabActive.id, url: urlGoogleSearch });
    }
  };

  const handleCreateView = () => ipcRenderer.send('new-view');

  const handleCreateTab = (viewId, url) => {
    if (!viewId && viewId !== 0) {
      ipcRenderer.send('new-tab', { viewId: tabActive.viewId, url: url });
    } else {
      ipcRenderer.send('new-tab', { viewId });
    }
  }

  const handleSwitchTab = (viewId, tab) => {
    urlSearchBar.current.value = tab.urlCurrent;
    urlSearchBar.current.focus();
    urlSearchBar.current.select();
    dispatch(switchTab(viewId, tab.id));
    ipcRenderer.send("switch-tab", { viewId, tabId: tab.id });
  };

  const handleDeleteTab = (viewId, tabId) => {
    dispatch(removeTab(tabId));
    ipcRenderer.send('remove-tab', { viewId, tabId });
  }

  const goBack = () => ipcRenderer.send('go-back', { tabId: tabActive.id });
  const goForward = () => ipcRenderer.send('go-forward', { tabId: tabActive.id });
  const goHome = () => ipcRenderer.send('go-home', { tabId: tabActive.id });
  const reloadPage = () => ipcRenderer.send('reload', { tabId: tabActive.id });
  
  const handleToggleSideBar = () => {
    toggleSideBar(!isSideBarActive);
    ipcRenderer.send('toggle-sidebar');
  }

  const handleAddToBookmark = (bookmark) => {
    fetchFolder(); // TODO BOOKMARK Add
    // console.log(folder);
    // const folderUpdated = Object.assign({}, folder);
    // folderUpdated.data.forEach((folder, idx) => {
    //   if (folder.id === bookmark.data.FolderId) {
    //     folderUpdated.data[idx].Bookmarks.push(bookmark.data);
    //   }
    // })
    // setFolder(folderUpdated);
  };

  const handleAddFolder = (newFolder) => {
    fetchFolder(); // TODO FOLDER Add
    // newFolder.data.Bookmarks = [];
    // const incomingFolder = {...folder, data: folder.data.concat(newFolder.data)};
    // console.log(incomingFolder);
    // setFolder(incomingFolder);
  }

  const updateTabsForSearchOptions = () => {
    setTabsForSearch(tabs.map(tab => { 
        return { name: tab.name, value: JSON.stringify(tab)}
      })
    )
  }

  const handleSearchTab = (tab) => {
    const tabSearched = JSON.parse(tab);
    handleSwitchTab(tabSearched.viewId, tabSearched);
  }

  const logout = () => {
    localStorage.removeItem('access_token');
    setLogin(false);
    setFolder([]);
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      <div className="input-group pt-3 pb-2" style={{ backgroundColor: 'white' }}>
        <div className="input-group-prepend">
          {
            isLogin
              ? <button
                  className="btn btn-sm btn-warning ml-3 rounded"
                  onClick={() => logout()}
                  ><Icon.LogOut />
                </button>

              : <Dropdown className="ml-3">
                  <Dropdown.Toggle  variant="success" id="dropdown-basic">
                    <Icon.User />
                  </Dropdown.Toggle>
      
                  <Dropdown.Menu>
                    <Login loggedIn={() => fetchFolder()}></Login>
                  </Dropdown.Menu>
                </Dropdown>
          }
          
          <Dropdown className="ml-3">
            <Dropdown.Toggle variant="info" id="dropdown-basic" disabled={ isLogin ? false : true }>
              <Icon.Bookmark />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <FormBookmark url={tabActive.urlCurrent} addBookmarkLocal={(bookmark) => handleAddToBookmark(bookmark)} data={folder}></FormBookmark>
            </Dropdown.Menu>
          </Dropdown>

          <button
            className="btn btn-sm btn-info ml-3 rounded"
            onClick={() => handleToggleSideBar()}
            ><Icon.Menu />
          </button>
          
          <button className="btn btn-sm btn-info ml-3 rounded" onClick={() => handleCreateView()}><Icon.Columns /></button>
        </div>
        
        <form style={{ display: 'flex', flexGrow: 100 }} onSubmit={handleSearch}>
          <input ref={urlSearchBar} style={{ width: '100%', height: 35 }} type="text" name="url" placeholder="Enter url" className="form-control ml-3" />
          <button type="submit" className="btn btn-sm btn-info rounded ml-3"><Icon.Search /></button>
        </form>

        <div className="input-group-prepend">
          <button
            className="btn btn-sm btn-info ml-3 rounded"
            onClick={() => goBack()} 
            disabled={ tabActive.indexCurrent === 0 ? true : false }
            ><Icon.ChevronLeft />
          </button>

          <button
            className="btn btn-sm btn-info ml-3 rounded"
            onClick={() => goForward()}
            disabled={ tabActive.indexCurrent === tabActive.indexLast ? true : false }
            ><Icon.ChevronRight />
          </button>

          <button className="btn btn-sm btn-info ml-3 rounded" onClick={() => goHome()}><Icon.Home /></button>
          <button className="btn btn-sm btn-info mx-3 rounded" onClick={() => reloadPage()}><Icon.RotateCw /></button>
        </div>
      </div>

      {
        isSideBarActive && 
          <nav id="sidebar" style={{ height: '94vh', overflowY: 'auto', overflowX: 'hidden' }} onFocus={updateTabsForSearchOptions}>
            <div className="sidebar-header text-center">
              <button type="button" id="sidebarCollapse" className="btn btn-info">
                <h3>BrowSync</h3>
                <strong>BS</strong>
              </button>
            </div>

            <ul className="list-unstyled components px-3" id="tab">
              <li>
                <SelectSearch
                  placeholder="Search tab"
                  search
                  options={tabsForSearch}
                  onChange={(tab) => handleSearchTab(tab)}
                />
              </li>

              <li className="mt-3 mb-2" onClick={toggleAllView}>
                {'> View Window'}
              </li>
              
              <Collapse isOpen={isOpenView}>
              {
                views.map(view => {
                  return (
                    <div key={view.id}>
                      <li className="mt-2" onClick={() => handleToggleView(view.id)} >{`> Window ${view.id + 1}`}</li>

                      <Collapse isOpen={view.isOpen}>

                      <li style={{ display: 'inline' }} key={view.name}>
                        {
                          tabs.map(tab => {
                            if (tab.viewId === view.id)
                              return (
                                <div
                                  key={tab.id} 
                                  className="d-flex flex-row"
                                >
                                  <button 
                                    className="btn btn-sm btn-light btn-block text-left"
                                    disabled={tabActive.id === tab.id ? true : false} 
                                    onClick={() => handleSwitchTab(view.id, tab)}
                                    >{ tab.name }
                                  </button>

                                  <button 
                                    className="btn btn-sm btn-dark"
                                    onClick={() => handleDeleteTab(view.id, tab.id)}
                                    ><Icon.XSquare />
                                  </button>
                                </div>
                              )
                          })
                        }
                      </li>

                      <li>
                        <button 
                          className="btn btn-sm btn-info btn-block"
                          onClick={() => handleCreateTab(view.id)}
                          ><Icon.PlusSquare />
                        </button>
                      </li>

                      </Collapse>
                    </div>
                  )
                })
              }
              </Collapse>

              <li className="mt-3 mb-2" onClick={toggleBookmark}>
                {'> Bookmark Window'}
              </li>

              <Collapse isOpen={isOpenBookmark}>
                <li>
                    {folder.data && folder.data.map((listFolder, idx) => {
                      if(listFolder.FolderId === null){
                        return (
                          <Dropdown key={listFolder.id}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                              {`> ${listFolder.name}`}
                            </Dropdown.Toggle>
                            
                            <Dropdown.Menu className="py-0 rounded-bottom border-0" >
                              <FileBookmark createNew={(url) => handleCreateTab(null, url)} data={listFolder}></FileBookmark>      
                            </Dropdown.Menu>
                          </Dropdown>
                        )
                      }
                    })}
                </li>

                <li>
                  <Dropdown>
                    <Dropdown.Toggle variant="info" id="dropdown-basic" id="dropdown-basic" disabled={ isLogin ? false : true }>
                      Add Folder
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <FormFolder getNewFolder={(newFolder) => handleAddFolder(newFolder)} data={folder}></FormFolder>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              </Collapse>
            </ul>
          </nav>
      }
  </div>
  )
}
