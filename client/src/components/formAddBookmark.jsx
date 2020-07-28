import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Axios from "axios";

export default (props) => {
  const { data, getFolder } = props;
  const folder = data.data;
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
    
  },[])


  const onSubmit = (e) => {
    e.preventDefault();
    Axios({
      method: "post",
      url: `http://localhost:5000/bookmark/${selectFolder}`,
      data: {
        url: url,
      },
      headers:{
        access_token : localStorage.access_token
      }
    })
      .then(({ data }) => {
        getFolder()
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Form onSubmit={onSubmit} >
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Url</Form.Label>
          <Form.Control
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
              return <option value={folder.id}>{folder.name}</option>;
            })}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" >
          Submit
        </Button>
      </Form>
    </>
  );
};
