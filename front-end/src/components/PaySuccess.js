/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { getTokenFromLocalStorage } from './helpers/auth'
import axios from 'axios'

const PaySuccess = () => {
  const history = useHistory()
  const [cleared, setCleared] = useState(false)
  const token = getTokenFromLocalStorage()

  useEffect(() => {
    const clearCart = async () => {
      try {
        const { data: { order_items: cartItems, total } } = await axios.delete('/api/cart/view',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setCleared(true)
      } catch (error) {
        console.log(error)
      }
    }
    clearCart()
  },[])

  useEffect(() => {
    setTimeout(() => {
      history.push('/')
    }, 4000)
  },[cleared])

  return (
    <Container className='min-vh-70 py-3'>
      <Alert variant='success' >
        <Alert.Heading className='text-center'>Payment Successful!</Alert.Heading>
        <hr />
        <p className='text-center'>You will be redirected shortly!</p>
        {/* {cleared && */}
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <p className='text-center'>
              <Spinner animation='border' variant='success'/>
            </p>
          </Col>
        </Row>
        {/* } */}
      </Alert>
    </Container>
  )
}

export default PaySuccess