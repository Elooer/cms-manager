import React from 'react'
import './assets/base.less'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './components/Header'
import Aside from './components/Aside'
import Bread from './components/Bread'

export default function App() {
  return (
    <Layout id="app">
      <Header />
      <div className="container">
        <Aside />
        <div className="container_box">
          <Bread />
          <div className="container_content">
            <Outlet />
          </div>
        </div>
      </div>
      <footer>Footer</footer>
    </Layout>
  )
}
