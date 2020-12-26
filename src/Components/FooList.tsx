import React, { } from "react"
import { Message } from "../App";
import { Table, Button } from 'antd'


type FooListProps = {
    messages: Message[]
}

function FooList(props: FooListProps) {

    const handleDelete = async (key: string) => {
        await fetch(`https://localhost:5001/api/messages/${key}`, { method: 'DELETE' })
        // await props.hub.send('deleteMessage', key)
    }

    const columns = [
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
            render: (text: any, record: any) =>
                <Button onClick={() => handleDelete(record.key)}>Delete</Button>
        }
    ]

    return (
        <Table
            dataSource={props.messages.map(o => { return { name: o.name, message: o.message, key: o.name + o.message } })}
            columns={columns}
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