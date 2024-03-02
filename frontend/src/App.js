import logo from './logo.svg';
import './App.css';

import React from 'react';
import CodeEditor from "./components/Editor";
import {Box} from "@chakra-ui/react";


// App component
function App() {
    return (
        <div className="App">
            <Box minH="100vh" bg="#171717" color="whitesmoke" px={6} py={8}>
                <CodeEditor />
            </Box>
        </div>
    );
}


export default App;