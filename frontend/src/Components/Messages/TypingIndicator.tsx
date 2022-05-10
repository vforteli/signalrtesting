import { Fragment } from 'react'
import { Box } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from 'react';
import { useAppSelector } from '../../store/store';

function TypingIndicator(props: { chatId: string }) {
    const typing = useAppSelector(state => state.messages.typing[props.chatId])

    return (
        <Box padding={0} sx={{ display: 'flex', justifyContent: 'flex-start', fontSize: 14 }}>
            {typing && Object.keys(typing).map(k =>
                <Fragment key={k}><MoreHorizIcon /> {k} is typing</Fragment>
            )}
        </Box>)
}

export default React.memo(TypingIndicator)
