import React from 'react';
import './EventItem.css';

function EventItem({ event, isLatest }) {
    const getEventIcon = (action) => {
        switch (action) {
            case 'push':
                return '📤';
            case 'pull_request':
                return '🔀';
            case 'merge':
                return '🔀';
            default:
                return '📋';
        }
    };

    const getEventColor = (action) => {
        switch (action) {
            case 'push':
                return '#28a745';
            case 'pull_request':
                return '#007bff';
            case 'merge':
                return '#6f42c1';
            default:
                return '#6c757d';
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        // Get day with ordinal suffix
        const day = date.getDate();
        const suffix = day % 10 === 1 && day !== 11 ? 'st' :
            day % 10 === 2 && day !== 12 ? 'nd' :
                day % 10 === 3 && day !== 13 ? 'rd' : 'th';

        // Format: "1st April 2021 - 9:30 PM UTC"
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;

        return `${day}${suffix} ${month} ${year} - ${displayHours}:${minutes} ${ampm} UTC`;
    };

    const getEventMessage = () => {
        const author = event.author || 'Unknown';
        const timestamp = formatTimestamp(event.timestamp);

        switch (event.action) {
            case 'push':
                return `"${author}" pushed to "${event.to_branch || 'unknown'}" on ${timestamp}`;

            case 'pull_request':
                return `"${author}" submitted a pull request from "${event.from_branch || 'unknown'}" to "${event.to_branch || 'unknown'}" on ${timestamp}`;

            case 'merge':
                return `"${author}" merged branch "${event.from_branch || 'unknown'}" to "${event.to_branch || 'unknown'}" on ${timestamp}`;

            default:
                return `"${author}" performed ${event.action || 'unknown action'} on ${timestamp}`;
        }
    };

    return (
        <div className={`event-item ${isLatest ? 'latest' : ''}`}>
            <div className="event-icon" style={{ color: getEventColor(event.action) }}>
                {getEventIcon(event.action)}
            </div>

            <div className="event-content">
                <div className="event-message">
                    {getEventMessage()}
                </div>

                <div className="event-meta">
                    <span className="event-repo">👤 {event.author || 'Unknown'}</span>
                    <span className="event-time">🕒 {formatTimestamp(event.timestamp)}</span>
                    <span
                        className="event-type"
                        style={{ backgroundColor: getEventColor(event.action) }}
                    >
                        {event.action || 'unknown'}
                    </span>
                </div>
            </div>

            {isLatest && <div className="latest-badge">LATEST</div>}
        </div>
    );
}

export default EventItem;