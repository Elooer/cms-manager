import React from 'react'
import './assets/base.css'
import { Button } from 'antd'
import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div>
      <Button type="primary">Primary Button</Button>
      <Outlet/>
    </div>
  )
}
