import React, { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../..";
import MessageRow from "./MessageRow";
import { Grid, Skeleton } from "@mui/material";
import TypingIndicator from "./TypingIndicator";

function MessageList(props: { chatId: string }) {
    const messagesLoading = useSelector((state: RootState) => state.messages.messagesLoading)
    const items = useSelector((state: RootState) => state.messages.items)
    const ref = useRef<null | HTMLDivElement>(null)
    const scrolledToBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight

    useEffect(() => {
        if (ref.current && scrolledToBottom) {
            ref.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [items, scrolledToBottom])


    return (
        messagesLoading
            ? <Skeleton animation="wave" />
            : <Grid>
                {items.map((row) => <MessageRow key={row.messageId} row={row} />)}
                <TypingIndicator chatId={props.chatId} />
                <div ref={ref}></div>
            </Grid>
    )
}

export default React.memo(MessageList)
