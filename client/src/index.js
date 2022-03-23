import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";

import './index.scss';
import Wrapper from './component/Wrapper';
import ViewPoll from './component/ViewPoll'
import CreatePoll from './component/CreatePoll'
import Dashboard from './component/Dashboard'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Wrapper />}>
                <Route index element={<Dashboard />} />
                <Route path="create" element={<CreatePoll />} />
                <Route path="view/:pollid" element={<ViewPoll />} />
            </Route>
        </Routes>
    </BrowserRouter>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
