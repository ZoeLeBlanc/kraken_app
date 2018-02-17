import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../routes';

const App = () => (
    <div>
        <h1>Kraken</h1>
        { routes }
        <footer >
            <Link to="/">Filterable Table</Link>
            <Link to="/about">About</Link>
            <Link to="/people">People</Link>
        </footer>
    </div>
);


export default App;
