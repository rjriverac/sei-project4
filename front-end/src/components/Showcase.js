/* eslint-disable no-unused-vars */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Carousel, Container, Image, Row, Button, Stack } from 'react-bootstrap'

const Showcase = () => {

  const [products, setProducts] = useState([])
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const getProds = async () => {
      try {
        const { data } = await axios.get('/api/products/')
        setProducts(data)

      } catch (error) {
        console.log(error)
        setHasError(true)
      }
    }
    getProds()
  }, [])
  console.log(products)
  return (


    <Container className='vh-50'>
      <Row>
        {(() => {
          if (!hasError && products.length) return true
          else return false
        })() ?
          (<Carousel>
            { products.map((item,idx) => (
              <Carousel.Item key={idx}>
                <img 
                  className="d-block img-fluid"
                  src={item.big_image}
                  alt={`image of ${item.name}`}
                />
                {/* <Image 
                  
                /> */}
                <Carousel.Caption>
                  <h3>{item.name}</h3>
                  <p>{`Price: ${item.price}`}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>)
          :
          (
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="http://placekeanu.com/800"
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>Loading..</h3>
                  <p>Thank you for your patience</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          )
        }
      </Row>
      <br />
      <Row>
        <Button variant='info' href='/home'>Go Back Home</Button>
      </Row>

    </Container>
  )
}

export default Showcase