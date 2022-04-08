import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, Skeleton, Pagination, Button, message } from 'antd'
import { ArticleListApi, ArticleDelApi } from '../request/api'
import moment from 'moment'

export default function ListList() {
  const [list, setList] = useState([])
  const navigate = useNavigate()
  const [total, setTotal] = useState([])
  const [current, setCurrent] = useState([])
  const [pageSize, setPageSize] = useState([])
  // 此状态用于根据删除变化，用于刷新页面
  const [update, setUpdate] = useState(1)

  // 请求封装
  const getList = num => {
    ArticleListApi({
      num,
      count: pageSize,
    }).then(res => {
      if (res.errCode === 0) {
        let { arr, total, num, count } = res.data
        setList(arr)
        setTotal(total)
        setCurrent(num)
        setPageSize(count - 2)
      }
    })
  }

  // 请求列表数据 componentDidMount
  useEffect(() => {
    getList(current)
  }, [])

  // 请求列表数据 componentDidUpdate
  useEffect(() => {
    getList(current)
  }, [update])

  // 分页
  const onChange = pages => {
    getList(pages)
  }

  // 删除
  const delFn = id => {
    ArticleDelApi({ id }).then(res => {
      if (res.errCode === 0) {
        message.success(res.message)
        // 重新刷页面，要么重新请求这个列表的数据 window.reload 调用getList(1) 增加变量的监测
        setUpdate(update + 1)
      }
    })
  }

  return (
    <div className="list_table" style={{ padding: '20px' }}>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={item => (
          <List.Item
            actions={[
              <Button
                type="primary"
                onClick={() => navigate('/edit/' + item.id)}
              >
                编辑
              </Button>,
              <Button type="danger" onClick={() => delFn(item.id)}>
                删除
              </Button>,
            ]}
          >
            <Skeleton loading={false}>
              <List.Item.Meta
                title={<a href="!#">{item.title}</a>}
                description={item.subTitle}
              />
              <div>{moment(item.date).format('YYYY-MM-DD hh:mm:ss')}</div>
            </Skeleton>
          </List.Item>
        )}
      />
      <Pagination
        style={{ float: 'right', marginTop: '20px' }}
        onChange={onChange}
        total={total}
        current={current}
        pageSize={pageSize}
      />
    </div>
  )
}
