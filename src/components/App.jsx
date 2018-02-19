import React from 'react';
import Navbar from './Navbar';
import routes from '../routes';


const App = () => (
    <div>
        <Navbar />
        { routes }
    </div>
);


export default App;
