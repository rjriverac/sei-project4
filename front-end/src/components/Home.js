/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import banner from '../assets/produce-top.png'
import { Button, Image, Container, Stack, Card, Placeholder, Col, Nav, ListGroup, ListGroupItem } from 'react-bootstrap'
import axios from 'axios'

const Home = () => {

  const [products, setProdcuts] = useState(null)
  const [randIndex, setrandIndex] = useState(0)
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
  //   },5000)

  //   return () => clearInterval(myInterval)
  // },[products])

  

  return (
    <>
      <Stack gap={5} id="main-page-container">
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
                href
                variant='success'
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '70%'
                }}
                id="main-sign-up-button"
              >
                Sign Up!
              </Button>
            )
          }
        </Container>
        <Container as={Nav} className="justify-content-around" >
          <Col xs={6} md={3}>
            <Card
              style={{ width: '14rem' }}
              border='success'
              xs={5}
            >
              <Card.Header>
                {products ? <Card.Title>{products[randIndex].name}</Card.Title> : <Placeholder as={Card.Title}/>}
              </Card.Header>
              {products ? 
                <Card.Body as={'a'} href={`products/${products[randIndex].id}`}>
                  <Card.Img
                    
                    variant='top'
                    src={products[randIndex].small_image}
                  />

                </Card.Body>
                :
                <Placeholder as={Card.Img} width='120' height= '120'/>
              }
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card
              style={{ width: '14rem' }}
              border='success'
              xs={5}
            >
              <>
                <Card.Header>
                  <Card.Title>Reviews</Card.Title>
                </Card.Header>
                <Card.Body>
                  {products ?
                    products[randIndex].review_set.length ? (
                      <ListGroup variant='flushed'>
                        {products[randIndex].review_set.map((review,index)=>{
                          return (
                            <ListGroupItem key={index}>{`${review.text}-${review.rating}/5`}</ListGroupItem>
                          )
                        })}
                      </ListGroup>
                    )
                      :
                      <Card.Text>Be the first to leave a review!</Card.Text>
                    :
                    <Card.Text>Be the first to leave a review!</Card.Text>
                  }
                </Card.Body>
              </>
            </Card>
          </Col>
        </Container>
        
      </Stack>

    </>
  )
}

export default Home