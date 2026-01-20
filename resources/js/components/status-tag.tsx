import type { ReactNode } from 'react';
import { Badge } from './ui/badge';


const StatusTag = ({ text }: { text: string }) => {
    const getBgColor = () => {
        switch (text) {
            case "UPCOMING":
            case "PENDING": return "#ead882ff";
            case "LOADING":
            case "ASSIGNED": return "#8dc9ecff";
            case "EN ROUTE": return "#d978e6ff";
            case "IN TRANSIT":
            case "DELIVERED": 
            case "DISPATCHED":
            case "PAID": return "#78e79fff";
            case "WAITING":
            case "CANCELLED": return "#e98780ff";   
            default: return "#e6e6e6";
        }
    }
    


    return (
        <Badge variant="secondary" style={{ backgroundColor: getBgColor(), color: 'black' }}>
            {text}
        </Badge>

    )
}

export default StatusTag