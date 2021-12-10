import React,{ useState } from 'react'
import axios from 'axios'
import { Button, Col, Container, Form, Toast } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const Login = () => {

  const history = useHistory()

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const [errors, setErrors] = useState({
    username: '',
    password: ''
  })
  const [displayMessage, setdisplayMessage] = useState(false)

  const handleChange = event => {
    const newData = { ...formData, [event.target.id]: event.target.value }
    setFormData(newData)
  }
  const setToken = (token) => {
    window.localStorage.setItem('token', token)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (showToast) setShowToast(!showToast)
    try {
      const { data } = await axios.post('/api/auth/login/',formData)
      setToken(data.token)
      setdisplayMessage(true)
      toggleShowToast()
      setTimeout(() => {
        history.push('/browse')
      }, 2500)
    } catch (error) {
      console.log(error.response.data)
      setErrors(error.response.data)
      toggleShowToast()
    }
  }

  const submissionErrors = () => {
    return (Object.values(errors).every(x => !!x)) && (!displayMessage)
  }

  const [showToast, setShowToast] = useState(false)

  const toggleShowToast = () => setShowToast(!showToast)


  return (
    <Container>
      <Col md={{ span: 6, offset: 3 }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='input' placeholder='Enter your username' onChange={handleChange}/>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Enter your password'onChange={handleChange}/>
          </Form.Group>
          <br />
          <Button variant='info' type='submit'>Log Me In!</Button>
          <br/>
          <>
            {submissionErrors() && (
              <Toast bg='danger' show={showToast} onClose={toggleShowToast}>
                <Toast.Header>
                  <strong className="me-auto">myCart</strong>
                </Toast.Header>
                <Toast.Body>There was a problem logging you in 😔</Toast.Body>
              </Toast>
            )}
            {displayMessage && (
              <Toast bg='success' show={showToast} onClose={toggleShowToast}>
                <Toast.Header>
                  <strong className="me-auto">myCart</strong>
                </Toast.Header>
                <Toast.Body>Login Successful! Redirecting you to the main page</Toast.Body>
              </Toast>
            )}
          </>
        </Form>
      </Col>
    </Container>
  )
}

export default Login