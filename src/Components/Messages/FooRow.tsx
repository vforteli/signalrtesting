import React, { } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteMessage, setMessageActive, } from "../../store/messages/messagesSlice";
import { Button, TableCell, TableRow } from "@material-ui/core";
import { Message } from "./FooTypes";
import { useMemo } from "react";
import { RootState } from "../..";


function FooRow(props: { row: Message }) {
    const dispatch = useDispatch();

    const derp = useSelector((state: RootState) => state.messages.selectedMessages)
    const active = derp.includes(props.row.messageId)

    // const active = useSelector((state: RootState) => state.messages.selectedMessages.includes(props.row.messageId))

    console.debug('foo' + props.row.messageId)
    console.debug(active)

    return useMemo(() =>
        <TableRow key={props.row.messageId}>
            <TableCell>{props.row.timeSent}</TableCell>
            <TableCell align="right">{props.row.name}</TableCell>
            <TableCell>{props.row.message}</TableCell>
            <TableCell><Button onClick={() => dispatch(setMessageActive({ active: !active, messageId: props.row.messageId }))}>{active ? 'active' : 'nope'}</Button></TableCell>
            <TableCell align="right"><Button onClick={() => dispatch(deleteMessage(props.row.messageId))}> Delete</Button></TableCell>
        </TableRow>,
        [props.row, dispatch, active]
    )
}

export default React.memo(FooRow)
