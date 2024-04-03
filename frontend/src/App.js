import React, { useState, createContext, useEffect } from 'react';
import { SERVER_URL, STATS_ENDPOINT } from './utils';
import defaultState from './defaultState';
import Dashboard from './Dashboard';
import './App.css';

// Create a context
const state = defaultState();
const AppContext = createContext(state);

const AppProvider = ({ children }) => {
    // Use useState to manage state
    const initialState = defaultState();
    const [state, setState] = useState(initialState);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${SERVER_URL}${STATS_ENDPOINT}`);
                const data = await response.json();
                if (!data || !data.node) {
                    console.error('Invalid data', data);
                    return;
                }
                setState(data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        
        const intervalId = setInterval(fetchData, 1_000);
        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []);
    
    return (
        <AppContext.Provider value={{ state, setState }}>
            {children}
        </AppContext.Provider>
    );
};

const App = () => (
    <AppProvider>
        <Dashboard />
    </AppProvider>
);

export { AppContext, AppProvider };
export default App;
