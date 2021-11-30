import React, { useEffect } from "react"
import MessageList from "./MessageList";
import SendMessageForm from "./SendMessageForm";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages, fetchPreviousMessages } from "../../store/messages/messagesSlice";
import { RootState } from "../..";
import { getNotificationEnabled, setNotificationEnabled } from "../../store/app/appSlice";
import { FormGroup, FormControlLabel, Switch, Box, Button } from "@mui/material";
import { HubConnectionState } from "@microsoft/signalr";


function MessageContainer() {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector((state: RootState) => state.currentUser.isLoggedIn);
    const isNotificationsEnabled = useSelector((state: RootState) => state.app.notificationsEnabled)
    const hubState = useSelector((state: RootState) => state.signalr.connectionState);
    const clearMessagesLoading = useSelector((state: RootState) => state.messages.clearMessagesLoading);

    useEffect(() => {
        if (isLoggedIn) {
            // should this be called every time the page is opened? this decision depends on if the hub should be disconnected when leaving the page
            dispatch(fetchPreviousMessages());
            dispatch(getNotificationEnabled())
        }
    }, [dispatch, isLoggedIn]);

    return (
        <>
            <FormGroup>
                <FormControlLabel control={<Switch checked={isNotificationsEnabled} onChange={e => dispatch(setNotificationEnabled(e.target.checked))} />} label="Notifications" />
                <Button onClick={() => dispatch(clearMessages())} disabled={hubState !== HubConnectionState.Connected || clearMessagesLoading}>Clear all</Button>
            </FormGroup>

            <br />
            <br />
            <Box sx={{ paddingBottom: '5em' }}>
                <MessageList />
            </Box>
            <Box sx={{ position: 'fixed', bottom: 0, height: '5em', backgroundColor: '#ddd', width: '100%', left: '0px' }}>
                <SendMessageForm />
            </Box>
        </>
    )
}

export default React.memo(MessageContainer);