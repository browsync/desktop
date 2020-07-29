import React, { useRef, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Axios from "axios";

export default (props) => {
  const { data } = props;
  const folder = data.data;
  const urlBookmark = useRef('');
  const [url, setUrl] = useState("");
  const [selectFolder, setSelectFolder] = useState(null);

  const onChange = (e) => {
    setUrl(e.target.value);
  };

  const onSelectFolder = (e) => {
    console.log(e.target.value);
    setSelectFolder(e.target.value);
  };

  useEffect(() => {
    urlBookmark.current.value = props.url;
    setUrl(props.url);
  }, [props.url])


  const onSubmit = (e) => {
    e.preventDefault();
    console.log(selectFolder, url);
    Axios({
      method: "post",
      url: `http://localhost:5000/bookmark/${selectFolder}`,
      data: {
        url: url,
      },
      headers: {
        access_token : localStorage.access_token
      }
    })
      .then(({ data }) => {
        console.log(data);
        props.addBookmarkLocal(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="px-2 py-2">
      <Form onSubmit={onSubmit} >
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Url</Form.Label>
          <Form.Control
            ref={urlBookmark}
            type="text"
            placeholder="Enter url"
            onChange={onChange}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>Custom select</Form.Label>
          <Form.Control onChange={onSelectFolder} as="select" custom>
            {folder?.map((folder) => {
              return <option key={folder.id} value={folder.id}>{folder.name}</option>;
            })}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" >
          Add
        </Button>
      </Form>
    </div>
  );
};
