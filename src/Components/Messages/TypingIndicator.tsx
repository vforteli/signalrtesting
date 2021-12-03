import React, { } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../..";
import { Box } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function TypingIndicator(props: { chatId: string }) {

    const typing = useSelector((state: RootState) => state.messages.typing)
    const typingUser = useSelector((state: RootState) => state.messages.typingUser)

    return (
        <Box padding={0} sx={{ display: 'flex', justifyContent: 'flex-start', fontSize: 15 }}>
            {typing && <><MoreHorizIcon /> {typingUser} is typing</>}
        </Box>)
}

export default React.memo(TypingIndicator)
