import React, { useState } from "react"
import { Button, Input } from 'antd'
import { useDispatch, useSelector } from "react-redux";
import { HubConnectionState } from "@microsoft/signalr";
import { clearMessages, sendMessage } from "../../store/messages/messagesSlice";
import { RootState } from "../..";


function FooForm() {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const hubState = useSelector((state: RootState) => state.foohub.connectionState);
    const clearMessagesLoading = useSelector((state: RootState) => state.messages.clearMessagesLoading);

    const handleSendMessage = () => {
        if (message.length > 0) {
            dispatch(sendMessage(message));
            setMessage('');
        }
    }


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    }

    return (
        <>
            <Input type="text" disabled={hubState !== HubConnectionState.Connected} onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={e => handleKeyPress(e)}></Input>
            <Button onClick={() => handleSendMessage()} disabled={hubState !== HubConnectionState.Connected}>Send</Button>
            <Button onClick={() => dispatch(clearMessages())} disabled={hubState !== HubConnectionState.Connected || clearMessagesLoading} loading={clearMessagesLoading}>Clear all</Button>
        </>
    )
}

export default React.memo(FooForm)