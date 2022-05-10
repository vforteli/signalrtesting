import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { HubConnectionState } from '@microsoft/signalr';
import { RootState } from '../..';
import { Divider, IconButton, InputBase, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useMessages } from './MessagesContext';

function SendMessageForm(props: { chatId: string }) {
    const [message, setMessage] = useState('');
    const hubState = useSelector((state: RootState) => state.signalr.connectionState);

    const messagesService = useMessages()

    const handleSendMessage = () => {
        if (message.length > 0) {
            messagesService.sendMessage(props.chatId, message)
            setMessage('')
        }
    }
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
        else {
            messagesService.indicateTyping(props.chatId)
        }
    }

    return (
        <>
            <Paper sx={{ padding: '2px 4px', display: 'flex', margin: '5px' }}>
                <InputBase sx={{ ml: 1, flex: 1 }} placeholder="New message" type="text" disabled={hubState !== HubConnectionState.Connected} onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={e => handleKeyPress(e)} />
                <Divider sx={{ height: 35, m: 0.5 }} orientation="vertical" />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="send" onClick={() => handleSendMessage()} disabled={hubState !== HubConnectionState.Connected}>
                    <SendIcon />
                </IconButton>
            </Paper>
        </>
    )
}

export default React.memo(SendMessageForm)
