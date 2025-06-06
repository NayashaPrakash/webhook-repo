// // import React, { useEffect, useState } from 'react';

// // function App() {
// //   const [events, setEvents] = useState([]);

// //   const fetchEvents = async () => {
// //     try {
// //       const res = await fetch("http://localhost:5000/events");
// //       const data = await res.json();
// //       setEvents(data);
// //     } catch (err) {
// //       console.error("Error fetching events:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchEvents();
// //     const interval = setInterval(fetchEvents, 15000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   return (
// //     <div style={{ fontFamily: "Arial", padding: "2rem" }}>
// //       <h2>GitHub Event Tracker</h2>
// //       <ul>
// //         {events.map((e, i) => (
// //           <li key={i} style={{ marginBottom: "1rem" }}>{e.message}</li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }

// // export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import EventList from './components/EventList';
// import './App.css';

// function App() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState(null);

//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/events');
//       if (response.data.status === 'success') {
//         setEvents(response.data.events);
//         setLastUpdated(new Date().toLocaleTimeString());
//         setError(null);
//       }
//     } catch (err) {
//       console.error('Error fetching events:', err);
//       setError('Failed to fetch events. Make sure the backend is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Initial fetch
//     fetchEvents();

//     // Set up polling every 15 seconds
//     const interval = setInterval(fetchEvents, 15000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>🔍 GitHub Repository Monitor</h1>
//         <p>Real-time tracking of repository activity</p>
//         {lastUpdated && (
//           <small>Last updated: {lastUpdated}</small>
//         )}
//       </header>

//       <main className="App-main">
//         {loading && <div className="loading">Loading events...</div>}

//         {error && (
//           <div className="error">
//             ⚠️ {error}
//             <button onClick={fetchEvents} className="retry-btn">
//               Retry
//             </button>
//           </div>
//         )}

//         {!loading && !error && (
//           <div className="events-container">
//             <div className="events-header">
//               <h2>Recent Activity</h2>
//               <span className="event-count">
//                 {events.length} event{events.length !== 1 ? 's' : ''}
//               </span>
//             </div>

//             <EventList events={events} />

//             {events.length === 0 && (
//               <div className="no-events">
//                 <p>No events recorded yet.</p>
//                 <p>Configure your GitHub repository webhook to see activity here!</p>
//                 <div className="setup-steps">
//                   <h3>Setup Steps:</h3>
//                   <ol>
//                     <li>Expose your backend with ngrok: <code>ngrok http 5000</code></li>
//                     <li>Go to your GitHub repository Settings → Webhooks</li>
//                     <li>Add webhook with URL: <code>https://your-ngrok-url.ngrok.io/webhook</code></li>
//                     <li>Select events: push, pull_request</li>
//                     <li>Make some commits to see events appear!</li>
//                   </ol>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventList from './components/EventList';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events');
      if (response.data.status === 'success') {
        setEvents(response.data.events);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEvents();

    // Set up polling every 15 seconds
    const interval = setInterval(fetchEvents, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔍 GitHub Repository Monitor</h1>
        <p>Real-time tracking of repository activity</p>
        {lastUpdated && (
          <small>Last updated: {lastUpdated}</small>
        )}
      </header>

      <main className="App-main">
        {loading && <div className="loading">Loading events...</div>}

        {error && (
          <div className="error">
            ⚠️ {error}
            <button onClick={fetchEvents} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="events-container">
            <div className="events-header">
              <h2>Recent Activity</h2>
              <span className="event-count">
                {events.length} event{events.length !== 1 ? 's' : ''}
              </span>
            </div>

            <EventList events={events} />

            {events.length === 0 && (
              <div className="no-events">
                <p>No events recorded yet.</p>
                <p>Configure your GitHub repository webhook to see activity here!</p>
                <div className="setup-steps">
                  <h3>Setup Steps:</h3>
                  <ol>
                    <li>Expose your backend with ngrok: <code>ngrok http 5000</code></li>
                    <li>Go to your GitHub repository Settings → Webhooks</li>
                    <li>Add webhook with URL: <code>https://your-ngrok-url.ngrok.io/webhook</code></li>
                    <li>Select events: push, pull_request, merge</li>
                    <li>Make some commits or create pull requests to see events appear!</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;