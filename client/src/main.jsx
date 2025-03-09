import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { persistor, store } from './Redux/store.js'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
    <App />
    </PersistGate>
  
  </Provider>
    
  
)
