import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "..";
import { HubConnectionState } from "@microsoft/signalr";
import { IconButton, Slide, SlideProps, Snackbar } from "@mui/material";

const SlideTransition = (props: SlideProps) => <Slide {...props} direction="down" />

function HubNotificationMessage() {
    const connectionState = useSelector((state: RootState) => state.foohub.connectionState);
    const [message, setMessage] = useState('')
    const [timeout, setTimeout] = useState<number | null>()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (connectionState === HubConnectionState.Connecting || connectionState === HubConnectionState.Reconnecting) {
            setMessage('Connecting to hub...')
            setTimeout(null)
            setOpen(true)
        }
        else if (connectionState === HubConnectionState.Connected) {
            setMessage('Hub connected')
            setTimeout(1000)
            setOpen(true)
        }
    }, [connectionState])

    const handleClose = () => {
        setMessage('')
        setOpen(false)
    }

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
            open={open}
            autoHideDuration={timeout}
            onClose={handleClose}
            message={message}
            TransitionComponent={SlideTransition}
            action={<IconButton aria-label="close" color="inherit" onClick={handleClose} />}
        />)
}

export default React.memo(HubNotificationMessage);