import React, { useEffect } from 'react'
import Navbar from './components/Navbar'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignupPage.jsx'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore.js'
import { useThemeStore } from './store/useThemeStore.js'

import {Loader} from 'lucide-react'
import {Toaster} from "react-hot-toast"
import ErrorBoundary from './hooks/error-boundary.jsx'


const App = () => {
  // call checkAuth function as soon  we visit our app
  const {authUser,checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
  const {theme} = useThemeStore()

  console.log({onlineUsers})
  useEffect(() => {
    checkAuth();
  },[checkAuth])

  console.log({authUser});
// loading state 
  if(isCheckingAuth && !authUser) 
    return(
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/> 
      {/* loader icon coming from package called lucid-react */}
    </div>
  )
// loads for split second if and renders the application

  return (
    <div data-theme={theme}>
      <Navbar/>
      <div  className="mt-16">
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        {/* if user is logged in they shouldn't be able to see the signupage or loginpage */}
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/>  : <Navigate to="/"/>}/>
        <Route path='/settings' element={<SettingsPage/>}/> 
        {/* we would like to open the setting to every one so no protection  */} 
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
      </Routes>
      </div>
    
    <Toaster/>
    {/* React Hot Toast is a library for showing notifications (toasts) in a React app. It helps display temporary messages like success, error, or info messages without manually managing state. */}
    </div>
  )
}

export default App
