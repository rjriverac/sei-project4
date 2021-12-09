import React, { useEffect } from 'react'
import { Navbar, Container, Offcanvas, Nav, NavDropdown } from 'react-bootstrap'
import { userIsAuthenticated } from './helpers/auth'
import { useHistory, useLocation } from 'react-router-dom'
// import logo from '../assets/lightlogo2.png'
import grnlogo from '../assets/greenlogo_gmdgkq.jpg'

const NavBar = () => {
  const history = useHistory()
  const location = useLocation()
  useEffect(() => {
    // trigger re-render of navbar on every page
  }, [location.pathname])

  const handleLogout = () => {
    window.localStorage.removeItem('token')
    history.push('/')
  }

  return (

    <>
      <style type='text/css'>
        {`
          #thenavbar {
            background-color: #87ba52;
          }
        `}
      </style>
      <Navbar variant='dark' expand={false} id='thenavbar'>
        <Container fluid>
          <Navbar.Brand>
            <img
              src={grnlogo}
              width="120"
              height="40"
              alt="myCart logo"
              className="d-inline-block align-top" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title
                id="offcanvasNavbarLabel"
              >myCart Navigation</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-2">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/browse">Browse</Nav.Link>
                {!userIsAuthenticated() ?
                  <>
                    <Nav.Link href="/register">Register</Nav.Link>
                    <Nav.Link href="/login">Login</Nav.Link>
                  </>
                  :
                  <>
                    <NavDropdown title="Your Account" id="offcanvasNavbarDropdown">
                      <NavDropdown.Item href="/cart">View your cart</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        as={'a'}
                        onClick={handleLogout}
                      >
                        Logout</NavDropdown.Item>
                    </NavDropdown>
                  </>}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  )
}

export default NavBar