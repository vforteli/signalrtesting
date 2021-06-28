import React, { useEffect } from "react"
import FooList from "./FooList";
import FooForm from "./FooForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchPreviousMessages } from "../../store/messages/messagesSlice";
import { RootState } from "../..";


function Foo() {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector((state: RootState) => state.currentUser.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            // should this be called every time the page is opened? this decision depends on if the hub should be disconnected when leaving the page
            dispatch(fetchPreviousMessages());
        }
    }, [dispatch, isLoggedIn]);

    return (
        <>
            <FooForm />
            <br />
            <br />
            <FooList />
        </>
    )
}

export default React.memo(Foo);