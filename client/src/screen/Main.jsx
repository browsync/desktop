import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import Login from "../components/login";
import {Dropdown} from "react-bootstrap";
import FileBookmark from '../components/table'
import FormBookmark from "../components/formAddBookmark"
import FormFolder from "../components/formAddFolder"

import {
  createView,
  updateTab,
  createTab,
  switchTab,
} from "../utils/actions/browser.action";

const { ipcRenderer } = window.require("electron");

export default function Main() {
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.userData)
  const views = useSelector((state) => state.browser.views);
  const tabs = useSelector((state) => state.browser.tabs);
  const viewSelected = useSelector((state) => state.browser.viewSelected);
  const tabSelected = useSelector((state) => state.browser.tabSelected);
  const urlSearchBar = useRef(null);
  const [isLogin, setLogin] = useState(false);
  const [folder, setFolder] = useState([])
  const fetchFolder = () => {
    Axios({
      method:'get',
      url:"http://localhost:5000/folder",
      headers:{
        access_token : localStorage.access_token
      }
    })
    .then(({data}) => {
      setFolder(data)
    })
}
  
  useEffect(() => {
    // TODO BOOKMARK Fetch bookmark data from server
    fetchFolder()
    dispatch(createView(1));

    ipcRenderer.on("browser-history", (event, tabUpdated) => {
      tabUpdated.viewId = viewSelected.id;
      urlSearchBar.current.value = tabUpdated.urlCurrent;
      dispatch(updateTab(tabUpdated));
    });
  }, [folder.length]);

  const handleSearch = (event) => {
    event.preventDefault();

    const urlInput = urlSearchBar.current.value;
    const urlFormatted = `http://${urlInput}`; //TODO SEARCH Check wether user already include http / https or not
    const webUrlRegex = RegExp(
      /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i
    );

    if (webUrlRegex.test(urlFormatted)) {
      ipcRenderer.send("search-url", {
        tabId: tabSelected.id,
        url: urlFormatted,
      });
    } else {
      const urlGoogleSearch =
        "https://www.google.com/search?q=" + urlInput.replace(/ /g, "+");
      ipcRenderer.send("search-url", {
        tabId: tabSelected.id,
        url: urlGoogleSearch,
      });
    }
  };

  const handleCreateTab = (viewId) => {
    dispatch(createTab(viewId)); // TODO VIEW Change to async (ipcRenderer after success)
    ipcRenderer.send("new-tab", { viewId });
  };

  const handleSwitchTab = (viewId, tab) => {
    urlSearchBar.current.value = tab.urlCurrent;
    dispatch(switchTab(viewId, tab.id));
    ipcRenderer.send("switch-tab", { viewId, tabId: tab.id });
  };

  const handleCreateView = () => {
    // listen
    dispatch(createView(1));
    ipcRenderer.send("new-view");
  };

  const handleSwitchView = (viewId) => {
    // TODO VIEW Handle view switch focus;
    console.log(`View ID: ${viewId}`);
  };

  const goBack = () => {
    ipcRenderer.send("go-back", { tabId: tabSelected.id });
  };

  const goForward = () => {
    ipcRenderer.send("go-forward", { tabId: tabSelected.id });
  };

  const goHome = () => {
    ipcRenderer.send("go-home", { tabId: tabSelected.id });
  };

  const reloadPage = () => {
    ipcRenderer.send("reload", { tabId: tabSelected.id });
  };

  const login = () => {};

  const addToBookmark = () => {
    console.log("Add to bookmark"); // TODO BOOKMARK Add url to bookmark both local & server
    Axios({
      method: "POST",
      url: "http://localhost:5000/",
    });
  };

  const handleAddFolder = (newFolder) => {
    const incomingFolder = folder.concat(newFolder)
    console.log(newFolder,'>>>> parent terima data')
    setFolder(incomingFolder)
  }

  return (
    <div>
      <button
        onClick={() => goBack()}
        disabled={tabSelected.indexCurrent === 0 ? true : false}
      >
        Back
      </button>
      <button
        onClick={() => goForward()}
        disabled={
          tabSelected.indexCurrent === tabSelected.indexLast ? true : false
        }
      >
        Forward
      </button>
      <button onClick={() => goHome()}>Home</button>
      <button onClick={() => reloadPage()}>Reload</button>

      <form style={{ display: "inline" }} onSubmit={handleSearch}>
        <input
          ref={urlSearchBar}
          style={{ width: 500 }}
          type="text"
          name="url"
          placeholder="Enter url"
        />
        <button type="submit">Search</button>
      </form>
      <button onClick={() => addToBookmark()}>Add Bookmark</button>
      <button onClick={() => handleCreateView()}>New Window</button>
      <button onClick={() => login()}>Login</button>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Login
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Login></Login>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Add Bookmark
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <FormBookmark data={folder}></FormBookmark>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Add Folder
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <FormFolder getNewFolder={(newFolder) => handleAddFolder(newFolder)} data={folder}></FormFolder>
        </Dropdown.Menu>
      </Dropdown>
      {folder.data && folder.data.map((listFolder,idx) => {
        if(listFolder.FolderId === null){
          return (
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                 Folder {listFolder.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <FileBookmark data={listFolder}></FileBookmark>      
              </Dropdown.Menu>
            </Dropdown>
          
          )
        }
      })}
      {folder && JSON.stringify(folder)}

      {/* <Login></Login> */}
      {views.map((view) => {
        return (
          <div key={view.id} className="mb-5">
            {tabs.map((tab) => {
              return (
                <button
                  disabled={tabSelected.id === tab.id ? true : false}
                  key={tab.id}
                  onClick={() => handleSwitchTab(view.id, tab)}
                >
                  {tab.title}
                </button>
              );
            })}
            <button onClick={() => handleCreateTab(view.id)}>New Tab</button>
            <button onClick={() => handleSwitchView(view.id)}>
              Switch View
            </button>
          </div>
        );
      })}
    </div>
  );
}
