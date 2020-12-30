import React, { useEffect } from "react"
import { Content } from "antd/lib/layout/layout";
import FooList from "./FooList";
import FooForm from "./FooForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchPreviousMessages } from "../store/foo/fooSlice";
import { RootState } from "..";


function Foo() {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector((state: RootState) => state.currentUser.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchPreviousMessages())
        }
    }, [dispatch, isLoggedIn]);

    return (
        <Content>
            <FooForm />
            <br />
            <br />
            <FooList />
        </Content >
    )
}

export default React.memo(Foo);