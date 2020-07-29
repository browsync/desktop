import React, { useEffect, useState } from "react";
import { Table, Dropdown } from "react-bootstrap";
import FileBookmark from "./table.jsx";
import Axios from "axios";

export default (props) => {
  const { data } = props;
  const promise = [];
  const fetchData = [];
  const [childData, setChildData] = useState([]);

  const fetchFolder = (id) => {
    // const resp = await fetch(`http://localhost:5000/folder/${id}`)
    // const result = resp.json()
    // setChildData(fetchData.concat(result))
    Axios({
      method: "get",
      url: `http://localhost:5000/folder/${id}`,
      headers: {
        access_token: localStorage.access_token,
      },
    }).then(({ data }) => {
      // fetchData.push(data);
      // console.log("fetch", fetchData);
      // setChildData(fetchData);
    });
  };

  const fetchAllChild = () => {
    // if (data.Child) {
    //   for (let i = 0; i < data.Child.length; i++) {
    //     promise.push(fetchFolder(data.Child[i].id));
    //     console.log(data.Child[i].id);
    //   }
    //   Promise.all(promise)
    //   .then(({data}) => setChildData(data))
    // }
    const promises = data.Child.map((folder) => {
      return Axios({
        method: "get",
        url: `http://localhost:5000/folder/${folder.id}`,
        headers: {
          access_token: localStorage.access_token,
        },
      });
    });
    Promise.all(promises).then((results) => {
      for (let i = 0; i < results.length; i++) {
        fetchData.push(results[i].data.data);
      }
      setChildData(fetchData);
    });
  };

  useEffect(() => {
    fetchAllChild();
  }, [props.data]);

  return (
    <div>
      {/* {childData?.length && JSON.stringify(childData)} */}

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
        {/*
          {JSON.stringify(data)}
            */}

          {data &&
            data.Bookmarks?.map((bookmark, idx) => {
              return ( 
                <tr key={bookmark.id}>
                  <td><button className="btn btn-light" onClick={() => props.createNew(bookmark.url)}>{bookmark.url}</button></td>
              </tr>
              );
            })}
        </tbody>
      </Table>

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Sub Folder</th>
          </tr>
        </thead>
        <tbody>
          {childData &&
            childData?.map((child, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {child.name}
                        
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <FileBookmark createNew={(url) => props.createNew(url)} data={child}></FileBookmark>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
};
