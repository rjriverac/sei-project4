import React from 'react'
import { Col, Container, ListGroup, Row, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faTwitter, faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {

  return (

    <>
      <style type='text/css'>
        {`
        #thefooter {
          background-color: #87ba52;
          position: absolute;
          width: 100%;
          bottom: 0;
        }
        `}
      </style>
      <Nav id='thefooter' className='py-3 border-top my-4'>
        
        <Container>
          <Row className='d-flex justify-content-between'>
            <Col md={4} xs={6}>
              <ListGroup horizontal variant='light'>
                <ListGroup.Item as={'a'} href='http://www.instagram.com'><FontAwesomeIcon icon={faInstagram} /></ListGroup.Item>
                <ListGroup.Item as={'a'} href='http://www.twitter.com'><FontAwesomeIcon icon={faTwitter} /></ListGroup.Item>
                <ListGroup.Item as={'a'} href='http://www.discord.com'><FontAwesomeIcon icon={faDiscord} /></ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4} xs={6} classname='d-flex justify-content-end'>
              <ListGroup horizontal className='align-self-end'>
                <ListGroup.Item>© 2021 myCart</ListGroup.Item>
                <ListGroup.Item as={'a'} href='https://github.com/rjriverac'><FontAwesomeIcon icon={faGithub} /></ListGroup.Item>
              </ListGroup>

            </Col>
          </Row>
        </Container>
      </Nav>

    </>

  )
}

export default Footer