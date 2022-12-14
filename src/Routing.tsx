import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { SearchResults } from "./SearchResults";

export const Routing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const routesKey = location.pathname.split("/").slice(0,2).join("/");

    return (
        <Routes location={location} key={routesKey}>

            <Route path="/search-results" element={
                    <SearchResults key={"search-results"} navigate={navigate} location={location} />
            }/>
            <Route path="/search-results/:id" element={
                    <SearchResults key={"search-results"} navigate={navigate} location={location} />
            }/>

            <Route path="/about" element={<div>asdfasdf</div>}/>
            <Route path="*" element={
                <div>
                    <Link to="/search-results">Go to /search-results</Link>
                </div>
            }/>

        </Routes>
    );
}

