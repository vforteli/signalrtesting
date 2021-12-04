import { Fragment } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../..";
import { Box } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from "react";

function TypingIndicator(props: { chatId: string }) {
    const typing = useSelector((state: RootState) => state.messages.typing[props.chatId])

    return (
        <Box padding={0} sx={{ display: 'flex', justifyContent: 'flex-start', fontSize: 14 }}>
            {typing && typing.map(userId =>
                <Fragment key={userId}><MoreHorizIcon /> {userId} is typing</Fragment>
            )}
        </Box>)
}

export default React.memo(TypingIndicator)
