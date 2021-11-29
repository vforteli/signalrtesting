import React, { } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteMessage, setMessageActive, } from "../../store/messages/messagesSlice";
import { RootState } from "../..";
import { MessageModel } from "../../apiclient";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';


function MessageRow(props: { row: MessageModel }) {
    const dispatch = useDispatch();


    const derliveryStatusIcon = (status: number) => {
        if (status === 0) {
            return <PendingOutlinedIcon />
        }
        else if (status === 1) {
            return <CheckCircleOutlinedIcon />
        }
        else if (status === 2) {
            return <><CheckCircleOutlinedIcon /><CheckCircleOutlinedIcon style={{ marginLeft: '-15px' }} /></>
        }
    }


    const selectedMessages = useSelector((state: RootState) => state.messages.selectedMessages)
    const user = useSelector((state: RootState) => state.currentUser.user)
    const active = selectedMessages.includes(props.row.messageId)

    // todo fix this.. should be in the messagemodel to show it instantly, this is completely daft
    const ownMessage = props.row.name === user?.sub || props.row.name === ''
    const derp: SxProps<Theme> = { bgcolor: 'info.main', color: 'info.contrastText' }

    return (
        <Box padding={2} sx={{ display: 'flex', justifyContent: ownMessage ? 'flex-end' : 'flex-start' }}>
            <Card sx={ownMessage ? derp : {}} style={{ maxWidth: '90%' }} key={props.row.messageId}>
                <CardHeader>
                    {props.row.name}
                </CardHeader>
                <CardContent>
                    {props.row.message}
                </CardContent>
                <CardActions>
                    {/* <small>{props.row.timeSent}</small> */}
                    <Button onClick={() => dispatch(deleteMessage(props.row.messageId))}> Delete</Button>
                    <Button onClick={() => dispatch(setMessageActive({ active: !active, messageId: props.row.messageId }))}>{active ? 'active' : 'nope'}</Button>
                    {ownMessage && derliveryStatusIcon(props.row.timeSent ? 1 : 0)}
                </CardActions>
            </Card>
        </Box>)
}

export default React.memo(MessageRow)
