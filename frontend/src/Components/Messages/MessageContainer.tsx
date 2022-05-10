import React, { useEffect } from 'react'
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';
import { useDispatch } from 'react-redux';
import { clearMessages } from '../../store/messages/messagesSlice';
import { getNotificationEnabled, setNotificationEnabled } from '../../store/app/appSlice';
import { FormGroup, FormControlLabel, Switch, Box, Button } from '@mui/material';
import { HubConnectionState } from '@microsoft/signalr';
import { useAppSelector } from '../../store/store';


function MessageContainer() {
    const chatId = '00000000-0000-0000-0000-000000000000'

    const dispatch = useDispatch()
    const isLoggedIn = useAppSelector(state => state.currentUser.isLoggedIn)
    const isNotificationsEnabled = useAppSelector(state => state.app.notificationsEnabled)
    const hubState = useAppSelector(state => state.signalr.connectionState)
    const clearMessagesLoading = useAppSelector(state => state.messages.clearMessagesLoading)

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getNotificationEnabled())
        }
    }, [dispatch, isLoggedIn])

    return (
        <>
            <FormGroup>
                <FormControlLabel control={<Switch checked={isNotificationsEnabled} onChange={e => dispatch(setNotificationEnabled(e.target.checked))} />} label="Notifications" />
                <Button onClick={() => dispatch(clearMessages())} disabled={hubState !== HubConnectionState.Connected || clearMessagesLoading}>Clear all</Button>
            </FormGroup>

            <br />
            <br />
            <Box sx={{ paddingBottom: '5em' }}>
                <MessageList chatId={chatId} />
            </Box>
            <Box sx={{ position: 'fixed', bottom: 0, height: '4em', backgroundColor: '#ddd', width: '100%', left: '0px' }}>
                <SendMessageForm chatId={chatId} />
            </Box>
        </>
    )
}

export default React.memo(MessageContainer);