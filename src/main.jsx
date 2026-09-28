import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/base.css'
import './styles/app.css'
import './styles/collections.css'
import './styles/product-catalog.css'
import './styles/about.css'
import './styles/product-images.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
