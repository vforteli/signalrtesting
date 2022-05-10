import React, { } from 'react'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';


export type DeliveryStatus = 'Sending' | 'Sent' | 'Delivered' | 'Read'

function DerliveryStatusIcon(props: { status: DeliveryStatus }) {
    if (props.status === 'Sending') {
        return <PendingOutlinedIcon />
    }
    else if (props.status === 'Sent') {
        return <CheckCircleOutlinedIcon />
    }
    else if (props.status === 'Delivered') {
        return <><CheckCircleOutlinedIcon /><CheckCircleOutlinedIcon style={{ marginLeft: '-15px' }} /></>
    }
    return <></>
}

export default React.memo(DerliveryStatusIcon)
