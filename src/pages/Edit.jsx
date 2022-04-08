import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { PageHeader, Button, Modal, Form, Input, message } from 'antd'
import moment from 'moment'
import E from 'wangeditor'
import {
  ArticleAddApi,
  ArticleSearchApi,
  ArticleUpdateApi,
} from '../request/api'

let editor = null

export default function Edit() {
  const [content, setContent] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [form] = Form.useForm()
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const showModal = () => {
    setIsModalVisible(true)
  }

  const dealData = (errCode, msg) => {
    // 关闭对话框
    setIsModalVisible(false)
    if (errCode === 0) {
      message.success(msg)
      // 跳回list页面
      navigate('/listlist')
    } else {
      message.error(msg)
    }
    // 关闭对话框
    setIsModalVisible(false)
  }

  // 对话框点击了提交
  const handleOk = () => {
    form
      .validateFields() //validate校验
      .then(values => {
        // form.resetFields()
        let { title, subTitle } = values
        if (params.id) {
          // 更新文章的请求
          ArticleUpdateApi({ title, subTitle, content, id: params.id }).then(
            res => dealData(res.errCode, res.message)
          )
        } else {
          // 添加文章的请求
          ArticleAddApi({ title, subTitle, content }).then(res =>
            dealData(res.errCode, res.message)
          )
        }
      })
      .catch(() => {
        return
      })
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // 模拟componentDidMount
  useEffect(() => {
    editor = new E('#div1')
    editor.config.onchange = newHtml => {
      setContent(newHtml)
    }
    editor.create()

    // 根据地址栏id做请求
    if (params.id) {
      ArticleSearchApi({ id: params.id }).then(res => {
        if (res.errCode === 0) {
          editor.txt.html(res.data.content)
          setTitle(res.data.title)
          setSubTitle(res.data.subTitle)
        }
      })
    }

    return () => {
      // 组件销毁时销毁编辑器
      editor.destroy()
    }
    // 这里监听路由是为了从主页到更新文章时，直接点文章编辑tab可以创建一个新的editor，是页面更新为无内容的富文本
  }, [location.pathname])

  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={params.id ? () => window.history.back() : null}
        title="文章编辑"
        subTitle={'当前日期：' + moment(new Date()).format('YYYY-MM-DD')}
        extra={
          <Button key="1" type="primary" onClick={showModal}>
            提交文章
          </Button>
        }
      ></PageHeader>
      <div
        id="div1"
        style={{ padding: '0 20px 20px', backgroundColor: '#fff' }}
      ></div>
      <Modal
        zIndex={99999}
        title="填写文章标题"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="提交"
        cancelText="取消"
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          autoComplete="off"
          initialValues={{ title, subTitle }}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[
              {
                required: true,
                message: '请填写标题',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="副标题" name="subTitle">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
