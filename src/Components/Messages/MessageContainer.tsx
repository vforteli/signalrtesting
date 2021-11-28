import React, { useEffect } from "react"
import MessageList from "./MessageList";
import SendMessageForm from "./SendMessageForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchPreviousMessages } from "../../store/messages/messagesSlice";
import { RootState } from "../..";
import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";
import { setNotificationEnabled } from "../../store/app/appSlice";


function MessageContainer() {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector((state: RootState) => state.currentUser.isLoggedIn);
    const isNotificationsEnabled = useSelector((state: RootState) => state.app.notificationsEnabled)


    useEffect(() => {
        if (isLoggedIn) {
            // should this be called every time the page is opened? this decision depends on if the hub should be disconnected when leaving the page
            dispatch(fetchPreviousMessages());
        }
    }, [dispatch, isLoggedIn]);

    return (
        <>
            <FormGroup>
                <FormControlLabel control={<Switch checked={isNotificationsEnabled} onChange={e => dispatch(setNotificationEnabled(e.target.checked))} />} label="Notifications" />
            </FormGroup>
            <SendMessageForm />
            <br />
            <br />
            <MessageList />
        </>
    )
}

export default React.memo(MessageContainer);