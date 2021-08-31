import React from 'react';
import ReactDOM from 'react-dom';
import './styles/default.scss';
import App from './app'
ReactDOM.render(
    <App />,
    document.getElementById('app')
)

if (module.hot){
    module.hot.accept()
}