import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import {RegisterApi} from '../request/api'
import './less/Login.css'
import logoImg from '../assets/logo.png'

export default function Register() {

  const navigate = useNavigate()

  const onFinish = (values) => {
    RegisterApi({
      username: values.username,
      password: values.password
    }).then((res) => {
      console.log(res)
      if(res.errCode === 0) {
        message.success(res.message)
        // 跳到登录页
        setTimeout(() => navigate('/login'), 1500)
      } else {
        message.error(res.message)
      }
    })
  }
  return (
    <div className="login">
      <div className="login_box">
        <img src={logoImg} alt="" />
        <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input placeholder="请输入用户名" prefix={<UserOutlined className="site-form-item-icon" />} size='large' />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password placeholder="请输入密码" prefix={<LockOutlined className="site-form-item-icon" />} size='large' />
        </Form.Item>

        <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '请确认你的密码',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="请再次输入密码" prefix={<LockOutlined className="site-form-item-icon" />} size='large' />
      </Form.Item>

        <Form.Item>
          <Link to="/login">已有账号？前往登录</Link>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size='large'>
            立即注册
          </Button>
        </Form.Item>
        </Form>
    </div>
    </div>
  )
}
