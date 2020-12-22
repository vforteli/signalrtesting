import React, { useState } from "react"
import * as signalR from "@microsoft/signalr";
import { Message } from "../App";
import { Table, Button, Input } from 'antd'
import { Content } from "antd/lib/layout/layout";
import { CSSTransition, TransitionGroup } from 'react-transition-group';


type FooProps = {
    hub: signalR.HubConnection,
    messages: Message[]
}

function Foo(props: FooProps) {
    const [message, setMessage] = useState('')

    const handleClick = async () => {
        await props.hub.send('broadcastMessage', props.hub.connectionId, message)
        setMessage('')
    }

    const handleDelete = async (key: string) => {
        await fetch(`https://localhost:5001/api/messages/${key}`, { method: 'DELETE' })
        // await props.hub.send('deleteMessage', key)
    }

    const columns = [
        {
            title: 'name',
            dataIndex: 'name',
            width: '100px',
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
        <Content>
            <Input type="text" onChange={(e) => setMessage(e.target.value)} value={message}></Input> <Button onClick={() => handleClick()}>clicky</Button>
            <br />
            <br />
            <Table
                dataSource={props.messages.map(o => { return { name: o.name, message: o.message, key: o.name + o.message } })}
                columns={columns}
            />

            <table>
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
            </table>
        </Content >
    )
}

export default Foo;