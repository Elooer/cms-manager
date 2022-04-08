import React, { useEffect, useState } from 'react'
import { Form, Input, Button, message, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { GetUserDataApi, ChangeUserDataApi } from '../request/api'
import './less/Means.less'

// 限制图片大小只能是200KB
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('请上传小于200KB的图!')
  }
  return isJpgOrPng && isLt2M
}

// 将图片路径转base64
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default function Means() {
  // const [username, setUsername] = useState()
  // const [password, setPassword] = useState()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    GetUserDataApi().then(res => {
      const { username, password } = res.data
      if (res.errCode === 0) {
        message.success(res.message)
        // 这两行不生效，因为是异步的
        // setUsername(username)
        // setPassword(password)
        // 存sessionStorage
        sessionStorage.setItem('username', res.data.username)
      }
    })
  }, [])

  // 表单提交的事件
  const onFinish = values => {
    // 如果表单中的username有值，且不等于初始化时拿到的username，同时密码非空
    if (
      values.username &&
      values.username !== sessionStorage.getItem('username') &&
      values.password.trim() !== ''
    ) {
      // 做表单的提交
      ChangeUserDataApi({
        username: values.username,
        password: values.password,
      }).then(res => {
        console.log(res)
        // 修改成功记得登录
      })
    }
  }

  // 点击了上传图片
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        console.log(info.file)
        setLoading(false)
        setImageUrl(imageUrl)
        // 存储图片名称
        localStorage.setItem('avatar', info.file.response.data.filePath)
        window.location.reload()
      })
    }
  }

  // 上传按钮
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <div className="means">
      <Form
        name="basic"
        style={{ width: '400px' }}
        initialValues={
          {
            // username,
            // password,
          }
        }
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="修改用户名" name="username">
          <Input placeholder="请输入新用户名" />
        </Form.Item>

        <Form.Item label="修 改 密 码" name="password">
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
            提交
          </Button>
        </Form.Item>
      </Form>
      <p>点击下方修改头像：</p>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        headers={{ 'cms-token': localStorage.getItem('cms-token') }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </div>
  )
}
