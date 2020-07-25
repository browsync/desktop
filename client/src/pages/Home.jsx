import React, { useEffect, useRef } from 'react';

const { ipcRenderer } = window.require("electron");

export default function Home() {
  const urlSearchBar = useRef(null);
  const initialMount = useRef(true);

  useEffect(() => {
    ipcRenderer.on('browser-history', (event, url) => {
      if (initialMount.current) {
        initialMount.current = false; 
        return;
      }
      urlSearchBar.current.value = url;
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

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input ref={urlSearchBar} className={urlSearchBar} type="text" name="url" placeholder="Enter url" />
        <button type="submit" >Search</button>
      </form>
    </div>
  )
}
