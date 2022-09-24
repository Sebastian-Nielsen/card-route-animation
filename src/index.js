import React from 'react';
import ReactDOM from 'react-dom';
import {Routing} from "./Routing";
import {BrowserRouter} from "react-router-dom";
import "./index.css";

ReactDOM.render(
	<BrowserRouter>
		<Routing />
	</BrowserRouter>
	,
	document.getElementById('root')
)