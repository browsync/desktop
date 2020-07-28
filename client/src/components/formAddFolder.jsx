import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Axios from "axios";

export default (props) => {
  const { data, getNewFolder, getFolder } = props;
  const folder = data.data;
  const [name, setName] = useState("");
  const [selectFolder, setSelectFolder] = useState(null);

  const onChange = (e) => {
    setName(e.target.value);
  };



  const onSelectFolder = (e) => {
    console.log(e.target.value);
    setSelectFolder(e.target.value);
  };

  const onSubmit = (e) => {
    if(selectFolder !== null){
        e.preventDefault()
        Axios({
        method: "post",
        url: `http://localhost:5000/folder?id=${selectFolder}`,
        data: {
            name : name
        },
        headers: {
            access_token: localStorage.access_token,
        },
        })
        .then(({ data }) => {
            // getNewFolder(data)
            getFolder()
        })
        .catch((err) => {
            console.log(err);
        });
    }
    else{
        e.preventDefault();
        Axios({
        method: "post",
        url: `http://localhost:5000/folder?id=`,
        data: {
            name : name
        },
        headers: {
            access_token: localStorage.access_token,
        },
        })
        .then(({ data }) => {
            getFolder()
            getNewFolder(data)
        })
        .catch((err) => {
            console.log(err);
        });
    }
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Folder Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter folder name"
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
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};
