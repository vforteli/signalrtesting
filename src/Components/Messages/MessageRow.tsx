import React, { } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteMessage, setMessageActive, } from "../../store/messages/messagesSlice";
import { RootState } from "../..";
import { MessageModel } from "../../apiclient";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import DeliveryStatusIcon from "./DeliveryStatusIcon";


function MessageRow(props: { row: MessageModel }) {
    const dispatch = useDispatch();

    const selectedMessages = useSelector((state: RootState) => state.messages.selectedMessages)
    const messageAcked = useSelector((state: RootState) => state.messages.ackedMessages[props.row.messageId] ?? false)
    const user = useSelector((state: RootState) => state.currentUser.user)
    const active = selectedMessages.includes(props.row.messageId)

    const status = messageAcked
        ? 2
        : props.row.timeSent
            ? 1
            : 0

    const ownMessage = props.row.userId === user?.sub || props.row.userId === ''
    const derp: SxProps<Theme> = { bgcolor: 'info.main', color: 'info.contrastText' }

    return (
        <Box padding={2} sx={{ display: 'flex', justifyContent: ownMessage ? 'flex-end' : 'flex-start' }}>
            <Card sx={ownMessage ? derp : {}} style={{ maxWidth: '90%' }} key={props.row.messageId}>
                <CardHeader>
                    {props.row.userId}
                </CardHeader>
                <CardContent>
                    {props.row.message}
                </CardContent>
                <CardActions>
                    {/* <small>{props.row.timeSent}</small> */}
                    <Button onClick={() => dispatch(deleteMessage(props.row.messageId))}> Delete</Button>
                    <Button onClick={() => dispatch(setMessageActive({ active: !active, messageId: props.row.messageId }))}>{active ? 'active' : 'nope'}</Button>
                    {ownMessage && <DeliveryStatusIcon status={status} />}
                </CardActions>
            </Card>
        </Box>)
}

export default React.memo(MessageRow)
