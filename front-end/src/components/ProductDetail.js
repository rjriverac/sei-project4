/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useHistory } from 'react-router-dom'
import { getTokenFromLocalStorage, userIsAuthenticated, userIsOwner } from './helpers/auth'

const ProductDetail = () => {
  const { id } = useParams()
  const [item, setItem] = useState({})
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
    // setAdded(inCart.cart.map(item=>item.id).filter(cartId => cartId === id).length)
    // setAdded(Object.values(inCart).every(x=>!!x))
  }, [inCart])
  console.log(inCart.cart.map(item=>item.id))
  console.log('added', added)
  return (
    <h1>hello world</h1>
  )
}

export default ProductDetail