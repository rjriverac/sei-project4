/* eslint-disable no-unused-vars */
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import NavBar from './components/NavBar'

const App = () => {

  return (
    <>
      <Router>
        <NavBar />
        <Switch>

        </Switch>
      </Router>
    </>
  )
}

export default App