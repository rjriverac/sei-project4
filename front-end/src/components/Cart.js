/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getTokenFromLocalStorage } from './helpers/auth'
import { Accordion, Col, Container, Image, Placeholder, Row, Button, Badge, Alert } from 'react-bootstrap'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'

const Cart = () => {
  const apiKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  const stripePromise = loadStripe(apiKey)
  const [clientSecret, setClientSecret] = useState('')

  const appearance = {
    theme: 'flat',
    variables: {
      colorPrimary: '#009257',
      colorBackground: '#cbeade'
    }
  }
  const options = {
    clientSecret,
    appearance
  }

  const token = getTokenFromLocalStorage()
  const [cart, setCart] = useState({})
  const [hasError, setHasError] = useState(false)
  const [isCheckingOut, setCheckout] = useState(false)

  useEffect(() => {
    const getCart = async () => {
      try {
        const { data: { order_items: cartItems, total } } = await axios.get('/api/cart/view/',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setCart({ items: [...cartItems], total: total })
      } catch (error) {
        console.log(error)
        setHasError(true)
      }
    }
    getCart()
  }, [token])

  useEffect(() => {
    const payIntent = async () => {
      if (Object.keys(cart).length !== 0) {
        try {
          const { data } = await axios.post(
            '/api/payments/create-payment-intent/',
            cart.items,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          setClientSecret(data.clientsecret)
        } catch (error) {
          console.log(error)
        }
      }
    }
    payIntent()
  }, [cart])


  const removeFromCart = async (item) => {
    try {
      const { data: { order_items: cartItems, total } } = await axios.put('/api/cart/view/',
        {
          operation: 'remove',
          order_items: [`${item}`]
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setCart({ items: [...cartItems], total: total })
    } catch (error) {
      console.log(error)
      setHasError(true)
    }
  }

  const clearCart = async () => {
    try {
      const { data: { order_items: cartItems, total } } = await axios.delete('/api/cart/view',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setCart({ items: [...cartItems], total: total })
    } catch (error) {
      console.log(error)
      setHasError(true)
    }
  }



  return (
    <Container>
      <Row>
        <Col xs={12} md={8}>
          <Accordion>
            <Accordion.Item eventKey='0'>
              <Accordion.Header>
                <Container>
                  <Row >
                    <Col>
                      Your Cart
                    </Col>
                    <Col>
                      <Button variant='danger' onClick={clearCart}>Empty Cart</Button>
                    </Col>
                  </Row>
                </Container>
              </Accordion.Header>
              <Accordion.Body>
                <Accordion>
                  {(() => Object.keys(cart).length !== 0)() && cart.items.map((item, index) => {
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
                              <Alert variant='primary'>{`$${item.price}`}</Alert>
                            </Col>
                            <Col md={{ span: 3, offset: 3 }}>
                              <Button
                                variant='danger'
                                size='sm'
                                onClick={() => removeFromCart(item.id)}
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
              </Accordion.Body>
            </Accordion.Item>

          </Accordion>
        </Col>
        <Col xs={6} md={4}>
          <Alert variant='success'>
            <Alert.Heading>Your Total:</Alert.Heading>
            {(() => Object.keys(cart).length !== 0 && Object.values(cart).every(val => !!val))() && (
              cart.items.map((item, index) => {
                return (
                  <p key={index}>{item.name} ${item.price}</p>
                )
              })
            )}
            <hr />
            <Row>
              <Col>
                <h3>{Object.values(cart).every(val => !!val) ? `$${cart.total}` : '$0.00'}</h3>
              </Col>
              <Col>
                <Button variant='success' onClick={() => setCheckout(!isCheckingOut)}>Check Out</Button>
              </Col>
            </Row>
          </Alert>

        </Col>
      </Row>
      {isCheckingOut &&
        (<Container id='money'>
          <div className="App" id="stripe-checkout">
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            )}
          </div>
        </Container>)
      }
    </Container>
  )
}

export default Cart