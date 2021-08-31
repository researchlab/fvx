import React from 'react'
import './app.scss'

const image = require('./assets/images/logo.png')


function App(){

                 
	return <div className="page" >
    <div className="content" >
      <img src={image} />
      <p className="title" >⭐️  Fvx, an automatic, convenience and flexible scaffold Tooling for React Development. ⭐️</p>
    </div>
  </div>

}

export default App
