import React, { useState } from 'react';

const EventContext = React.createContext();

const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  
  return (
    <EventContext.Provider value={{ events, setEvents }}>
      {children}
    </EventContext.Provider>
  );
};
export {EventProvider, EventContext };
