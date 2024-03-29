import React, { useEffect, useRef } from 'react'
import MessageRow from './MessageRow';
import { Grid, Skeleton } from '@mui/material';
import TypingIndicator from './TypingIndicator';
import { useAppSelector } from '../../store/store';

function MessageList(props: { chatId: string }) {
    const messagesLoading = useAppSelector(state => state.messages.messagesLoading)
    const items = useAppSelector(state => state.messages.items)
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
