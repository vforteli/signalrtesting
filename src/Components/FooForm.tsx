import React, { useState } from "react"
import * as signalR from "@microsoft/signalr";
import { Button, Input } from 'antd'


type FooFormProps = {
    hub: signalR.HubConnection | null,
}

function FooForm(props: FooFormProps) {
    const [message, setMessage] = useState('')

    const handleClick = async () => {
        if (props.hub) {
            await props.hub.send('broadcastMessage', message)
            setMessage('')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleClick()
        }
    }

    return (
        <>
            <Input type="text" onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={e => handleKeyPress(e)}></Input> <Button onClick={() => handleClick()}>clicky</Button>
        </>
    )
}

export default React.memo(FooForm)