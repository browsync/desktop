import React, { useEffect, useRef, useState } from 'react';

const { ipcRenderer } = window.require("electron");

export default function Home() {
  let [historyIndexCurrent, setHistoryIndexCurrent] = useState(0);
  let [historyIndexLast, setHistoryIndexLast] = useState(0);

  const urlSearchBar = useRef(null);
  const initialMount = useRef(true);

  useEffect(() => {
    ipcRenderer.on('browser-history', (event, history) => {
      if (initialMount.current) {
        initialMount.current = false; 
        return;
      }
      urlSearchBar.current.value = history.urlCurrent;
      setHistoryIndexCurrent(history.indexCurrent);
      setHistoryIndexLast(history.indexLast);
    })
  }, [])

  const handleSearch = (event) => {
    event.preventDefault();

    const urlInput = event.target.url.value;
    const urlFormatted = `http://${urlInput}`;
    const webUrlRegex = RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i);

    if (webUrlRegex.test(urlFormatted)) {
      ipcRenderer.send('search-url', urlFormatted);
    } else {
      const urlGoogleSearch = 'https://www.google.com/search?q=' + urlInput.replace(/ /g, "+");
      ipcRenderer.send('search-url', urlGoogleSearch);
    }
  }

  const handleGoBack = () => {
    ipcRenderer.send('go-back');
  }

  const handleGoForward = () => {
    ipcRenderer.send('go-forward');
  }

  const handleGoHome = () => {
    ipcRenderer.send('go-home');
  }

  const handleReload = () => {
    ipcRenderer.send('reload');
  }

  return (
    <div>
      <button 
        onClick={() => handleGoBack()}
        disabled={ historyIndexCurrent === 0 ? true : false }
        >Back</button>
      <button 
        onClick={() => handleGoForward()} 
        disabled={ historyIndexCurrent === historyIndexLast ? true : false }
        >Forward</button>
      <button onClick={() => handleGoHome()}>Home</button>
      <button onClick={() => handleReload()}>Reload</button>

      <form onSubmit={handleSearch}>
        <input ref={urlSearchBar} className={urlSearchBar} type="text" name="url" placeholder="Enter url" />
        <button type="submit" >Search</button>
      </form>
    </div>
  )
}
