import {NavigateFunction, useLocation, useNavigate, useParams} from "react-router";
import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import { NavLink } from "react-router-dom";
import React from "react";
import _, {debounce} from "underscore";

import { RandomPicture } from "random-picture";
import {SearchResult} from "./SearchResult";


export type Location = {
	pathname: string;
	state: {
		from: string;
		rightNavbarLinkOptionClick?: boolean;
		leftNavbarLinkOptionClick?: boolean;
		data: any;
		imgUrl: string;
		scrollTop?: number;
	};
	search: string;
	hash: string;
	key: string;
}
interface SearchResultsProps {
	navigate: NavigateFunction;
	location: Location;
}
export const SearchResults = ({navigate, location}: SearchResultsProps) => {
	const results = _.range(1020).map((i: number) => ({
		gender: "male",
		age: 4,
		username: `test${i}`,
	}))

	return <>
		<section id="search-results" style={{position: "relative", padding: "50px 100px 0 100px"}}>

			{results?.map((profilecarddata: any, i: number) =>
				<SearchResult key={i} data={profilecarddata} />
			)}

		</section>
	</>
}

