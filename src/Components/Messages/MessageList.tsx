import React, { } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../..";
import MessageRow from "./MessageRow";
import { Grid, Skeleton } from "@mui/material";

function MessageList() {
    const messagesLoading = useSelector((state: RootState) => state.messages.messagesLoading);
    const items = useSelector((state: RootState) => state.messages.items);

    return (
        messagesLoading
            ? <Skeleton animation="wave" />
            : <Grid>
                {items.map((row) => (
                    <MessageRow key={row.messageId} row={row} />
                ))}
            </Grid>
    )
}

export default React.memo(MessageList)
