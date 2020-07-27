import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import FileBookmark from "./table.jsx";
import Axios from "axios";

export default (props) => {
  const { data } = props;
  const [childData, setChildData] = useState([]);
  const fetchData = [];
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
      fetchData.push(data);
      setChildData(fetchData);
    });
  };
  useEffect(() => {
    if (data.Child) {
      for (let i = 0; i < data.Child.length; i++) {
        fetchFolder(data.Child[i].id);
      }
    }
  }, []);

  return (
    <div>
      {JSON.stringify(childData)}

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Note</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.bookmarks?.map((bookmark, idx) => {
              return (
                <tr>
                  <td>{bookmark.name}</td>
                  <td>{bookmark.url}</td>
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
          {/* {childData && childData?.map((child,idx) => {
                    return(
                        <tr key={idx}>
                            <td>
                                <FileBookmark data={childData}>
                                    {child.name}
                                </FileBookmark>
                            </td>
                        </tr>
                    )
                })} */}
        </tbody>
      </Table>
    </div>
  );
};
