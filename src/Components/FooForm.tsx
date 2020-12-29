import React, { useState } from "react"
import * as signalR from "@microsoft/signalr";
import { Button, Input } from 'antd'
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../store/foo/fooSlice";
import { RootState } from "..";
import { HubConnectionState } from "@microsoft/signalr";


type FooFormProps = {
    hub: signalR.HubConnection | null,
}

function FooForm(props: FooFormProps) {
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const hubState = useSelector((state: RootState) => state.foohub.connectionState);

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
            <Input type="text" disabled={hubState !== HubConnectionState.Connected} onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={e => handleKeyPress(e)}></Input> <Button onClick={() => handleSendMessage()} disabled={hubState !== HubConnectionState.Connected}>Send</Button>
            <Button onClick={() => clearMessages()} disabled={hubState !== HubConnectionState.Connected}>Clear all</Button>
        </>
    )
}

export default React.memo(FooForm)