/* 
  App > List  + Edit + Means
  Login
  Register
*/
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import App from '../App'
import List from '../pages/List'
import Edit from '../pages/Edit'
import Means from '../pages/Means'
import Login from '../pages/Login'
import Register from '../pages/Register'


const BaseRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='/list' element={<List />}></Route>
        <Route path='/edit' element={<Edit />}></Route>
        <Route path='/means' element={<Means />}></Route>
      </Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/register' element={<Register />}></Route>
    </Routes>
  </BrowserRouter>
)

export default BaseRouter