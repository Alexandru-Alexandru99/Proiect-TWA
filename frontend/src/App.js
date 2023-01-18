import React from "react"
import { Container } from "react-bootstrap"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import ForgotPassword from "./components/ForgotPassword"
import Signup from "./components/Signup"
import Home from "./components/Home"
import Shop from "./components/Shop"
import Profile from "./components/Profile"
import Refunds from "./components/Refunds"
import Users from "./components/Users"
import Transactions from "./components/Transactions"
import ManageEvents from "./components/ManageEvents"

import "./css/index.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
        <Route path='/shop' element={<Shop/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/refunds' element={<Refunds/>}></Route>
        <Route path='/adminusers' element={<Users/>}></Route>
        <Route path='/transactions' element={<Transactions/>}></Route>
        <Route path='/manageevents' element={<ManageEvents/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App