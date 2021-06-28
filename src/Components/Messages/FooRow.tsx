import React, { } from "react"
import { useDispatch } from "react-redux"
import { deleteMessage } from "../../store/messages/messagesSlice";
import { Button, TableCell, TableRow } from "@material-ui/core";
import { Message } from "./FooTypes";
import { useMemo } from "react";


function FooRow(props: { row: Message }) {
    const dispatch = useDispatch();

    return useMemo(() =>
        <TableRow key={props.row.messageId}>
            <TableCell>{props.row.timeSent}</TableCell>
            <TableCell align="right">{props.row.name}</TableCell>
            <TableCell>{props.row.message}</TableCell>
            <TableCell align="right"><Button onClick={() => dispatch(deleteMessage(props.row.messageId))}> Delete</Button></TableCell>
        </TableRow>, [props.row, dispatch]
    )
}

export default React.memo(FooRow)
