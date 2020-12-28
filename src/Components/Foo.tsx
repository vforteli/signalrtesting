import React, { useEffect } from "react"
import * as signalR from "@microsoft/signalr";
import { Content } from "antd/lib/layout/layout";
import FooList from "./FooList";
import FooForm from "./FooForm";
import { useDispatch } from "react-redux";
import { fetchPreviousMessages } from "../store/foo/fooSlice";


type FooProps = {
    hub: signalR.HubConnection | null,
}

function Foo(props: FooProps) {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchPreviousMessages())
    }, []);     // todo add isauthenticated etc

    return (
        <Content>
            <FooForm hub={props.hub} />
            <br />
            <br />
            <FooList />
        </Content >
    )
}

export default React.memo(Foo);