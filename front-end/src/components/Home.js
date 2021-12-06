/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import banner from '../assets/produce-top.png'
import { Button, Image, Container, Stack, Card, Placeholder } from 'react-bootstrap'
import axios from 'axios'

const Home = () => {

  const [products, setProdcuts] = useState(null)
  const [randIndex, setrandIndex] = useState(3)
  const [isHovered, setHover] = useState(false)
  let myInterval

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await axios.get('/api/products/')
        if (!data) throw new Error()
        setProdcuts(data)
      } catch (error) {
        console.log(error)
      }
    }
    getProducts()
  }, [])

  // todo random index selector, to render card on front page
  // useEffect(()=> {
  //   myInterval = setInterval(()=>{
  //     if (products){
  //       const index = Math.floor(Math.random() * products.length)
  //       setrandIndex(index)
  //       console.log(index)
  //     }
  //   },500)

  //   return () => clearInterval(myInterval)
  // },[products])

  

  return (
    <>
      <Stack gap={5}>
        <Container
          fluid
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            position: 'relative'
          }}
        >
          <Image
            src={banner}
            fluid
          />
          {
            isHovered && (
              <Button
                size="lg"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%'
                }}
                id="main-sign-up-button"
              >
                Sign Up!
              </Button>
            )
          }
        </Container>
        <Stack
          direction='horizontal'
        >
          <Card
            style={{ width: '12rem' }}
            border
            ms-auto
          >
            {products ? 
              <Card.Img 
                variant="bottom"
                src={products[randIndex].small_image}
              />
              :
              <Placeholder as={Card.Img} width='120' height= '120'/>
            }

          </Card>
        </Stack>
      </Stack>

    </>
  )
}

export default Home