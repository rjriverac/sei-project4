/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import axios from 'axios'
import CheckoutForm from './CheckoutForm'
// import '../assets/stripe.css'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const apiKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(apiKey)


export default function Pay(token, items) {
  const [clientSecret, setClientSecret] = useState('')

  // useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   fetch('/api/create-payment-intent', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ items: [{ id: 'xl-tshirt' }] })
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClientSecret(data.clientSecret))
  // }, [])

  useEffect(() => {
    const usertoken = token
    const cartItems = items

    const payFunc = async () => {
      try {
        const { data } = await axios.post('/api/create-payment-intent', { cartItems }, {
          headers: { Authorization: `Bearer ${usertoken}` }
        }
        )
        console.log(data)
        setClientSecret(data.clientsecret)
      } catch (error) {
        console.log(error)
      }
    }
    payFunc()

  }, [])

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

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  )
}