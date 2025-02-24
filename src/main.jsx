import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'react-toastify/dist/ReactToastify.css';
import { DataProvider } from './hooks/CommonContext.jsx';
import { Provider } from 'react-redux';
import store from '../store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </DataProvider>
  </StrictMode>,
)
