/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useParams, useHistory } from 'react-router-dom'
import { getTokenFromLocalStorage, userIsAuthenticated } from './helpers/auth'
import { Container, Image, Placeholder, Row, Button, Col, Nav, Card, Alert, Form, FloatingLabel, OverlayTrigger, Tooltip } from 'react-bootstrap'


const ProductDetail = () => {
  const { id } = useParams()
  const [item, setItem] = useState({})
  const history = useHistory()
  const [errors, setErrors] = useState(false)
  const [inCart, setInCart] = useState({})
  const [added, setAdded] = useState(false)

  const [range, setRange] = useState(1)
  const [rating, setRating] = useState({
    rating: '',
    text: '',
    product: id
  })
  const [reviewed,setReviewed] = useState(false)

  const handleRating = (event) => {
    const newData = { ...rating, [event.target.id]: event.target.value }
    setRating(newData)
  }

  const handleReview = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/review/',rating,
        { headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` } }
      )
      setReviewed(true)
    } catch (error) {
      console.log(error.response.data)
    }
  }

  const isEmpty = (object) => Object.keys(object).length === 0

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`)
        setItem(data)
      } catch (error) {
        console.log(error)
        setErrors(true)
      }
    }
    const getCart = async () => {
      if (userIsAuthenticated()) {
        try {
          const { data: { order_items: cart, total } } = await axios.get('/api/cart/view',
            {
              headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` }
            }
          )
          setInCart({ cart: cart, total: total })
        } catch (error) {
          console.log(error)
        }
      }
    }
    getProduct()
    getCart()
  }, [id])

  useEffect(() => {
    if (Object.values(inCart).every(x => !!x)) {
      if (inCart.cart) {
        if (inCart.cart.map(item => item.id).filter(cartId => cartId === parseInt(id)).length) {
          setAdded(true)
        } else setAdded(false)
      }
    }
  }, [inCart])

  const handleClick = async () => {
    console.log('click')
    if (!userIsAuthenticated()) history.push('/login')
    if (!added) {
      try {
        await axios.put('/api/cart/view/',
          {
            operation: 'add',
            order_items: [`${id}`]
          },
          {
            headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` }
          }
        )
        setAdded(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  console.log(rating)
  return (

    <Container>
      <Row>
        <Col>
          <Card>
            {!isEmpty(item) ?
              <Card.Img src={item.big_image} alt={`photo of ${item.name}`} />
              :
              <Placeholder as={Card.Img} />
            }
            <Card.Img />
            <Card.ImgOverlay className='d-flex justify-content-end align-items-end'>
              <div className='d-flex flex-column-reverse'>
                <Button
                  className=''
                  variant={!added ? 'success' : 'danger'}
                  onClick={handleClick}
                  disabled={!added ? false : true}
                >
                  {!added ? 'Add to Cart' : 'Already in Cart!'}
                </Button>
                <>
                  {!isEmpty(item) ?
                    <Alert variant='success'>
                      <Alert.Heading>{item.name}</Alert.Heading>
                      <hr />
                      <p>{`$${item.price}`}</p>
                    </Alert>
                    :
                    <Alert variant='secondary'>
                      <Alert.Heading>Product Loading</Alert.Heading>
                      <hr />
                      <p>Product Loading</p>
                    </Alert>
                  }
                </>
              </div>
            </Card.ImgOverlay>
          </Card>
        </Col>
      </Row>
      <hr />
      <Row className='justify-content-around'>
        {userIsAuthenticated() &&
          <>
            <Col xs={12} md={6}>
              {/* <Placeholder animation='glow' as={Card}>
                <Placeholder xs={12} />
                <Placeholder xs={12} />
                <Placeholder xs={12} />
                <Placeholder xs={12} />
              </Placeholder> */}
              <Form
                onSubmit={handleReview}
              >
                <Form.Group controlId='rating' onChange={handleRating}>
                  <Form.Label>Please Rate</Form.Label>
                  <OverlayTrigger
                    placement='left'
                    overlay={
                      <Tooltip>
                        {range}
                      </Tooltip>
                    }
                  >
                    <Form.Range
                      value={range}
                      onChange={e => setRange(e.target.value)}
                      min='1'
                      max='5'
                      step='1'
                    />
                  </OverlayTrigger>
                </Form.Group>
                <Form.Group onChange={handleRating}>
                  <FloatingLabel
                    label='Let us know what you think!'
                    controlId='text'
                  >
                    <Form.Control as='textarea' rows={2} placeholder='enter your review'/>
                  </FloatingLabel>
                </Form.Group>
                <br/>
                <Button
                  variant='info'
                  type='submit'
                >
                  Submit Review
                </Button>
              </Form>
            </Col>
            <Col xs={12} md={4}>
              <Placeholder animation='glow' as={Card}>
                <Placeholder xs={12} />
                <Placeholder xs={12} />
                <Placeholder xs={12} />
                <Placeholder xs={12} />
                <Placeholder xs={12} />
              </Placeholder>
            </Col>
          </>
        }
      </Row>
    </Container>
  )
}

export default ProductDetail