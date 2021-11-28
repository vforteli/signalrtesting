import React, { } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteMessage, setMessageActive, } from "../../store/messages/messagesSlice";
import { useMemo } from "react";
import { RootState } from "../..";
import { MessageModel } from "../../apiclient";
import { Box, Button, Card, CardActions, CardContent, Theme } from "@mui/material";
import { SxProps } from "@mui/system";


function MessageRow(props: { row: MessageModel }) {
    const dispatch = useDispatch();

    const selectedMessages = useSelector((state: RootState) => state.messages.selectedMessages)
    const user = useSelector((state: RootState) => state.currentUser.user)
    const active = selectedMessages.includes(props.row.messageId)

    // todo fix this.. should be in the messagemodel to show it instantly, this is completely daft
    const ownMessage = props.row.name === user?.sub || props.row.name === ''
    const derp: SxProps<Theme> = { bgcolor: 'info.main', color: 'info.contrastText' }

    return useMemo(() =>
        <Box padding={2} sx={{ display: 'flex', justifyContent: ownMessage ? 'flex-end' : 'flex-start' }}>
            <Card sx={ownMessage ? derp : {}} style={{ maxWidth: '90%' }} key={props.row.messageId}>
                <CardContent>
                    <small>{props.row.name}</small>
                    {props.row.message}
                </CardContent>
                <CardActions>
                    <small>{props.row.timeSent}</small>
                    <Button onClick={() => dispatch(deleteMessage(props.row.messageId))}> Delete</Button>
                    <Button onClick={() => dispatch(setMessageActive({ active: !active, messageId: props.row.messageId }))}>{active ? 'active' : 'nope'}</Button>
                </CardActions>
            </Card>
        </Box >

        ,
        [props.row, dispatch, active]
    )
}

export default React.memo(MessageRow)
