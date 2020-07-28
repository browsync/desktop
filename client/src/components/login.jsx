import React, {useState} from "react";
import { Container, Form, Button } from "react-bootstrap";
import {login} from "../store/action" 
import {useDispatch, } from "react-redux"

export default () => {

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
        dispatch(login(email, password))
    }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={onEmailChange}/>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password"  onChange={onPasswordChange}/>
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};
