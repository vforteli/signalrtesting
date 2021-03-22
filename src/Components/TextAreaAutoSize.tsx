import React, { useState } from "react"
import TextArea, { TextAreaProps } from "antd/lib/input/TextArea";

export interface TextAreaAutoSizeProps {
    minRows?: number
}

export default function TextAreaAutoSize(props: TextAreaProps & TextAreaAutoSizeProps) {
    const { onChange, minRows, ...rest } = props;
    const [lineHeight, setLineHeight] = useState<number | null>(null)

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.currentTarget.rows = minRows ?? 1;

        if (lineHeight === null) {
            setLineHeight(parseFloat(window.getComputedStyle(event.currentTarget).lineHeight))
        }

        event.currentTarget.rows = ~~(event.currentTarget.scrollHeight / lineHeight!)

        if (onChange) {
            onChange(event)
        }
    }

    return (
        <TextArea {...rest} onChange={e => handleChange(e)} />
    )
}
