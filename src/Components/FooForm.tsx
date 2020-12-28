import React, { useState } from "react"
import * as signalR from "@microsoft/signalr";
import { Button, Input } from 'antd'
import { useDispatch } from "react-redux";
import { sendMessage } from "../store/foo/fooSlice";


type FooFormProps = {
    hub: signalR.HubConnection | null,
}

function FooForm(props: FooFormProps) {
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()

    const handleSendMessage = async () => {
        dispatch(sendMessage(message))

        // todo this should be moved into dispatched sendMessage
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
            handleSendMessage()
        }
    }

    return (
        <>
            <Input type="text" onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={e => handleKeyPress(e)}></Input> <Button onClick={() => handleSendMessage()}>Send</Button>
            <Button onClick={() => clearMessages()}>Clear all</Button>
        </>
    )
}

export default React.memo(FooForm)