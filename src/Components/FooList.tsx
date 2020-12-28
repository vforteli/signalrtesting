import React, { } from "react"
import { Table, Button } from 'antd'
import { Message } from "./FooTypes"


type FooListProps = {
    messages: Message[]
}

function FooList(props: FooListProps) {

    const handleDelete = async (messageId: string) => {
        await fetch(`https://localhost:5001/api/messages/${messageId}`, { method: 'DELETE' })
        // await props.hub.send('deleteMessage', key)
    }

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
            render: (text: any, record: Message) =>
                <Button onClick={() => handleDelete(record.messageId)}>Delete</Button>
        }
    ]

    return (
        <Table
            dataSource={props.messages}
            columns={columns}
            rowKey={o => o.messageId}
        />
    )
}

export default React.memo(FooList)

/* <table>
    <TransitionGroup className="todo-list" component="tbody">


        {props.messages.map(o => (
            <CSSTransition
                key={o.name + o.message}
                timeout={500}
                classNames="fade"
            >
                <tr><td>{o.name}</td><td>{o.message}</td><td><Button onClick={() => handleDelete(o.name + o.message)}>Delete</Button></td></tr>
            </CSSTransition>
        ))}
    </TransitionGroup>
</table> */