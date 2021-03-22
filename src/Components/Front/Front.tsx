import React, { useState } from "react"
import { Content } from "antd/lib/layout/layout";
import TextAreaAutoSize from "../TextAreaAutoSize";


function Front() {
    const [value, setValue] = useState('')


    return (
        <Content>
            front...
            <TextAreaAutoSize value={value} onChange={e => setValue(e.currentTarget.value)} minRows={2} />
        </Content>
    )
}

export default React.memo(Front);