import React from "react"
import * as signalR from "@microsoft/signalr";
import { Message } from "../App";
import { Content } from "antd/lib/layout/layout";
import FooList from "./FooList";
import FooForm from "./FooForm";


type FooProps = {
    hub: signalR.HubConnection | null,
    messages: Message[]
}

function Foo(props: FooProps) {

    return (
        <Content>
            <FooForm hub={props.hub} />
            <br />
            <br />
            <FooList messages={props.messages} />
        </Content >
    )
}

export default Foo;