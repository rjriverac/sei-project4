/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useHistory } from 'react-router-dom'
import { getTokenFromLocalStorage, userIsAuthenticated } from './helpers/auth'
import { Container, Image, Placeholder, Row, Button, Col, Nav } from 'react-bootstrap'


const ProductDetail = () => {
  const { id } = useParams()
  const [item, setItem] = useState({})
  const history = useHistory()
  const [errors, setErrors] = useState(false)
  const [inCart, setInCart] = useState({})
  const [added, setAdded] = useState(false)

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

  console.log(item)
  return (

    <Container fluid style={{ position: 'relative' }}>
      <Row >
        <Col>
          {!isEmpty(item) ?
            <Image fluid src={item.big_image} />
            :
            <Placeholder as={Image} className='img-fluid' />
          }

        </Col>
      </Row>
      <Container
        style={{ position: 'absolute', left: '60%', top: '70%' }}
        className='mw-30'
      >
        <Button
          variant={!added ? 'success' : 'danger'}
          onClick={handleClick}
          disabled={!added ? false : true}
        >
          {!added ? 'Add to Cart' : 'Already in Cart!'}
        </Button>
      </Container>

    </Container>
  )
}

export default ProductDetail