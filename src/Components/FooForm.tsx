import React, { useState } from "react"
import * as signalR from "@microsoft/signalr";
import { Button, Input } from 'antd'


type FooFormProps = {
    hub: signalR.HubConnection | null,
}

function FooForm(props: FooFormProps) {
    const [message, setMessage] = useState('')

    const sendMessage = async () => {
        if (props.hub) {
            await props.hub.send('broadcastMessage', message)
            setMessage('')
        }
    }

    const clearMessages = async () => {
        await fetch(`https://localhost:5001/api/messages/clear`, { method: 'DELETE' })
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage()
        }
    }

    return (
        <>
            <Input type="text" onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={e => handleKeyPress(e)}></Input> <Button onClick={() => sendMessage()}>Send</Button>
            <Button onClick={() => clearMessages()}>Clear all</Button>
        </>
    )
}

export default React.memo(FooForm)