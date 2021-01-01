import React, { } from "react"
import { Table, Button } from 'antd'
import { Message } from "./FooTypes"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from ".."
import { deleteMessage } from "../store/messages/messagesSlice"


function FooList() {
    const { items, messagesLoading } = useSelector((state: RootState) => state.messages);
    const dispatch = useDispatch();

    const columns = [
        {
            title: 'Sent',
            dataIndex: 'timeSent',
            width: '150px',
        },
        {
            title: 'name',
            dataIndex: 'name',
            width: '200px',
        },
        {
            title: 'message',
            dataIndex: 'message',
            width: '400px',
        },
        {
            title: "action",
            dataIndex: "action",
            render: (text: any, record: Message) => <Button onClick={() => dispatch(deleteMessage(record.messageId))}> Delete</Button >
        }
    ]

    return (
        <Table
            loading={messagesLoading}
            dataSource={items}
            columns={columns}
            rowKey={o => o.messageId}
        />
    )
}

export default React.memo(FooList)
