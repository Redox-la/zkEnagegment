import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Root from './pages/Root'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

const router = createBrowserRouter([
  { path: '/', element: <Root />, children: [
    { index: true, element: <SignIn /> },
    { path: 'app', element: <Dashboard /> },
    { path: 'profile', element: <Profile /> }
  ] }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
