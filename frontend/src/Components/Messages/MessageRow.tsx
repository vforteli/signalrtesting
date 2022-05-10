import React, { } from 'react'
import { useDispatch } from 'react-redux'
import { deleteMessage, setMessageActive, } from '../../store/messages/messagesSlice';
import { MessageModel } from '../../apiclient';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import DeliveryStatusIcon, { DeliveryStatus } from './DeliveryStatusIcon';
import { useAppSelector } from '../../store/store';


function MessageRow(props: { row: MessageModel }) {
    const dispatch = useDispatch();

    const active = useAppSelector(state => state.messages.selectedMessages.includes(props.row.messageId))
    const messageAcked = useAppSelector(state => state.messages.ackedMessages[props.row.messageId] ?? false)
    const user = useAppSelector(state => state.currentUser.user)

    const status: DeliveryStatus = messageAcked
        ? 'Delivered'
        : props.row.timeSent
            ? 'Sent'
            : 'Sending'

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
