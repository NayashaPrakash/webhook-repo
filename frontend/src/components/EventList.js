import React from 'react';
import EventItem from './EventItem';
import './Eventlist.css';

function EventList({ events }) {
    return (
        <div className="event-list">
            {events.map((event, index) => (
                <EventItem
                    key={event._id || index}
                    event={event}
                    isLatest={index === 0}
                />
            ))}
        </div>
    );
}

export default EventList;
