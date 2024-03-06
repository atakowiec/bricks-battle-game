import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './style/main.module.scss'

ReactDOM.createRoot(document.getElementsByTagName('body')[0]!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
