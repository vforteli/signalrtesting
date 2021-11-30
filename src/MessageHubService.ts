import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { getCsrfTokenFromCookie } from "./Utils";

export class MessageHubService {
    



//     const connection: HubConnection = new HubConnectionBuilder()
//     .withAutomaticReconnect()
//     .withUrl(process.env.REACT_APP_SIGNALR_HUB_URL ?? '', { accessTokenFactory: getAccessTokenSilently, headers: { 'X-XSRF-TOKEN': getCsrfTokenFromCookie() } })
//     .build();

//   connection.on("broadcastMessage", (message: MessageModel) => dispatch(messageReceived(message)));
//   connection.on("deleteMessage", (messageId: string) => dispatch(messageDeleted(messageId)));
//   connection.on("clearMessages", () => dispatch(messagesCleared()));
//   connection.onreconnecting(() => dispatch(setHubConnectionState(connection.state)));
//   connection.onreconnected(() => {
//     dispatch(setHubConnectionState(connection.state));
//     dispatch(fetchPreviousMessages());
//   });
}