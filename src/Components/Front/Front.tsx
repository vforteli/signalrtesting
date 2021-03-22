import React, { useState } from "react"
import { Content } from "antd/lib/layout/layout";
import TextArea from "antd/lib/input/TextArea";


function Front() {
    const [value, setValue] = useState('')


    const autoSizeRows = (event: React.ChangeEvent<HTMLTextAreaElement>, minRows: number = 1) => {
        event.currentTarget.rows = minRows;
        const lineHeight = parseFloat(window.getComputedStyle(event.currentTarget).lineHeight)  // todo this should probably be cached...
        event.currentTarget.rows = ~~(event.currentTarget.scrollHeight / lineHeight)
    }

    return (
        <Content>
            front...
            <TextArea value={value} onChange={e => { setValue(e.currentTarget.value); autoSizeRows(e, 2); }} />
        </Content >
    )
}

export default React.memo(Front);