import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <h1 className='text-center pt-4 text-3xl'>PERN w/Supabase - Client side w/React</h1>
      <RouterProvider router={router} />
    </>
  </StrictMode>
)
