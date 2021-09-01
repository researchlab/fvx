import React from 'react'
import './app.scss'

const image = require('./assets/images/logo.png')


function App(){

                 
	return <div className="page" >
    <div className="content" >
      <img src={image} />
			<h1>Fvx</h1>
      <p className="title" >⭐️  An automatic, convenience and flexible scaffold Tooling for React Development. ⭐️</p>
    </div>
  </div>

}

export default App
