/* eslint-disable no-unused-vars */
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import NavBar from './components/NavBar'
import Register from './components/Register'
import Showcase from './components/Showcase'

const App = () => {

  return (
    <>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/register' component={Register}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/browse' component={Showcase} />
        </Switch>
      </Router>
    </>
  )
}

export default App