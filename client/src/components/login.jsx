import React, {useState} from "react";
import { Container, Form, Button } from "react-bootstrap";
import {login} from "../store/action" 
import {useDispatch, } from "react-redux"

export default ({ loggedIn }) => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onPasswordChange = (e) => {
        e.preventDefault()
        setPassword(e.target.value)
    }
    const onEmailChange = (e) => {
        e.preventDefault()
        setEmail(e.target.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()
        dispatch(login(email, password, loggedIn))
    }

  return (
    <div className="px-2 py-2">
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={onEmailChange}/>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password"  onChange={onPasswordChange}/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};
