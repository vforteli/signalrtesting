import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { HubConnectionState } from "@microsoft/signalr";
import { sendMessage } from "../../store/messages/messagesSlice";
import { RootState } from "../..";
import { Button, Input } from "@mui/material";


function SendMessageForm() {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const hubState = useSelector((state: RootState) => state.foohub.connectionState);

    const handleSendMessage = () => {
        if (message.length > 0) {
            dispatch(sendMessage(message));
            setMessage('');
        }
    }


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    }

    return (
        <>
            <Input type="text" disabled={hubState !== HubConnectionState.Connected} onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={e => handleKeyPress(e)}></Input>
            <Button onClick={() => handleSendMessage()} disabled={hubState !== HubConnectionState.Connected}>Send</Button>
        </>
    )
}

export default React.memo(SendMessageForm)