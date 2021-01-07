import React, { useEffect } from "react"
import { useSelector } from "react-redux";
import { RootState } from "..";
import { message } from "antd";
import { HubConnectionState } from "@microsoft/signalr";


function HubNotificationMessage() {
    const connectionState = useSelector((state: RootState) => state.foohub.connectionState);

    useEffect(() => {
        if (connectionState === HubConnectionState.Connecting || connectionState === HubConnectionState.Reconnecting) {
            message.loading({ content: 'Connecting to hub...', key: 'hubconnecting', duration: 0 });
        }
        else if (connectionState === HubConnectionState.Connected) {            
            message.success({ content: 'Hub connected', key: 'hubconnecting', duration: 1 });
        }
    }, [connectionState])

    return (<></>)
}

export default React.memo(HubNotificationMessage);