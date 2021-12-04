import React, { } from "react"
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';

function DerliveryStatusIcon(props: { status: number }) {

    if (props.status === 0) {
        return <PendingOutlinedIcon />
    }
    else if (props.status === 1) {
        return <CheckCircleOutlinedIcon />
    }
    else if (props.status === 2) {
        return <><CheckCircleOutlinedIcon /><CheckCircleOutlinedIcon style={{ marginLeft: '-15px' }} /></>
    }
    return <></>
}

export default React.memo(DerliveryStatusIcon)
