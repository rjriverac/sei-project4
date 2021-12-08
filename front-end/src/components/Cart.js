/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getTokenFromLocalStorage } from './helpers/auth'
import { Accordion, Col, Container, Image, Placeholder, Row, Button, Badge, Alert } from 'react-bootstrap'

const Cart = () => {

  const token = getTokenFromLocalStorage()
  const [cart, setCart] = useState({})
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const getCart = async () => {
      try {
        const { data: { order_items: cartItems, total } } = await axios.get('/api/cart/view/',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setCart({ items: [...cartItems] , total: total })
      } catch (error) {
        console.log(error)
        setHasError(true)
      }
    }
    getCart()
  }, [token])

  console.log(cart)

  return (
    <Container>
      <Row>
        <Col xs={12} md={8}>
          <Accordion>
            <Accordion.Item eventKey='0'>
              <Accordion.Header>TestHeader</Accordion.Header>
              <Accordion.Body>
                TestBody
              </Accordion.Body>
            </Accordion.Item>
            {(()=> Object.keys(cart).length !== 0)() && cart.items.map((item,index) => {
              return (
                <Accordion.Item eventKey={index + 1} key={index}>
                  <Accordion.Header>
                    <Col>
                      {item.name}
                    </Col>
                    <Col>
                      <span className='pull-right'><Image src={item.small_image} rounded /></span>
                    </Col>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={3}>
                        <Alert variant='success'>{`$${item.price}`}</Alert>
                      </Col>
                      <Col md={{ span: 3, offset: 3 }}>
                        <Button
                          variant='danger'
                          size='sm'
                        >
                          Remove from Cart
                        </Button>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              )
            })}
          </Accordion>
        </Col>
        <Col xs={6} md={4}>
          <Alert variant='success'>
            <Alert.Heading>Your Total:</Alert.Heading>
            {(()=> Object.keys(cart).length !== 0)() && (
              cart.items.map((item,index)=> {
                return (
                  <p key={index}>{item.name} ${item.price}</p>
                )
              })
            )}
            <hr/>
            <h3>{`$${cart.total}`}</h3>
          </Alert>
        </Col>

      </Row>

    </Container>
  )
}

export default Cart