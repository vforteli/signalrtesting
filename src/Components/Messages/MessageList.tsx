import React, { } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../..";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import MessageRow from "./MessageRow";
import Skeleton from '@material-ui/lab/Skeleton';

function MessageList() {
    const messagesLoading = useSelector((state: RootState) => state.messages.messagesLoading);
    const items = useSelector((state: RootState) => state.messages.items);

    return (
        messagesLoading
            ? <Skeleton animation="wave" />
            : <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sent</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((row) => (
                            <MessageRow key={row.messageId} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
    )
}

export default React.memo(MessageList)
