
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './views/pages/Signup'
import Login from './views/pages/Login'
import Home from './views/pages/Home'
import UpdateInformation from './views/pages/UpdateInformation'
import ProtectedRoute from './views/routes/ProtectedRoute'
import { ToastContainer } from "react-toastify";

const basename = import.meta.env.MODE === "development" ? "/" : `/${import.meta.env.VITE_PUBLIC_URL}`;


function App() {

  return (
    <>
      <BrowserRouter>
        <ToastContainer theme='light' />

        <Routes>
          <Route index path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/home' element={<Home />} />
            <Route path='/update-information' element={<UpdateInformation />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
