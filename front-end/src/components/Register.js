import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { Alert, Button, Col, Container, Form } from 'react-bootstrap'

const Register = () => {
  const [displayMessage, setMessage] = useState(false)
  const history = useHistory()
  const [error, setError] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  })

  const handleChange = (event) => {
    const newData = { ...formData, [event.target.id]: event.target.value }
    setFormData(newData)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      await axios.post('/api/auth/register/', formData)
      setMessage(true)
      setTimeout(()=> (history.push('/login')),1500)
    } catch (error) {
      console.log(error)
      setMessage(false)
      setError(error.response.data)
      console.log(error.response.data)
    }
  }

  const submissionErrors = () => {
    // return (Object.keys(error) === 0) && (!displayMessage)
    return Object.values(error).every(val => !!val) && (!displayMessage)
      
  }
  


  return (
    <Container>
      <Col md='auto'>
        <Form
          // validated={true}
          onSubmit={handleSubmit}
        >
          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='text' onChange={handleChange} />
            {submissionErrors() && <Alert variant='warning'>{error.username}</Alert>}
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' onChange={handleChange} />
            {submissionErrors() && <Alert variant='warning'>{error.email}</Alert>}
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' onChange={handleChange} />
            {submissionErrors() && <Alert variant='warning'>{error.password}</Alert>}
          </Form.Group>
          <Form.Group controlId='password_confirmation'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type='password' onChange={handleChange} />
            {submissionErrors() && <Alert variant='warning'>{error.password_confirmation}</Alert>}
          </Form.Group>
          <br />
          <Button variant="info" type="submit">
            Submit
          </Button>
          {displayMessage ? (
            <Alert variant='success'> Registration Successful!</Alert>
          ) : submissionErrors() && (<Alert variant='warning'>Please check that all fields are correct</Alert>)
          }
        </Form>

      </Col>

    </Container>
  )
}

export default Register