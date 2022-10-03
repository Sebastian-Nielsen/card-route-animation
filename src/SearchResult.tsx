import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router";
import {debounce} from "underscore";
import {NavLink} from "react-router-dom";
import {motion} from "framer-motion";

const scrollBarWidth = "17px";
const variants = {
	initial: (showProfile: any) => ({
		zIndex: showProfile.showProfile ? 123456 : 1,
		top: 0,
		left: 0,
		minWidth: "250px",
		minHeight: "400px",
	}),
	animate: (showProfile: any) => ({
		minWidth: showProfile.showProfile ? `${showProfile.expandedCardMinWidth}px` : "250px",
		minHeight: showProfile.showProfile ? "1500px" : "400px",

		top: showProfile.showProfile ? (showProfile.cardRef.current?.style.zIndex === "98765432" ? `${showProfile.searchResultsOffsetTop}px` : `${showProfile.animateTop}px`) : `0px`,
		left: showProfile.showProfile ? (showProfile.cardRef.current?.style.zIndex === "98765432" ? `${showProfile.expandedCardLeft}px` : `${showProfile.animateLeft}px`) : `0px`,
	}),
}

export const SearchResult = React.memo(({data}: any) => {

		const searchResultsOffsetTop = 50;
		const params = useParams();
		const showProfile = params.id === data.username;
		const cardRef = useRef<HTMLDivElement>(null);

		const [imgUrl, setImgUrl] = useState("");
		useEffect(() => {
			async function test() {
				// const pic = await RandomPicture();
				const pic = {url: undefined}
				setImgUrl(pic?.url ?? "");
			}
			test()
		}, [])

		const cardTop = cardRef?.current?.getBoundingClientRect().top ?? 0;
		const cardLeft = cardRef?.current?.getBoundingClientRect().left ?? 0;

		const expandedCardMinWidth = 800;
		const [expandedCardLeft, setExpandedCardLeft]  = useState((window.innerWidth - expandedCardMinWidth) / 2);
		useEffect(() => {
			const debouncedHandleResize = debounce(function handleResize() {
				setExpandedCardLeft((window.innerWidth - expandedCardMinWidth) / 2)
			}, 300)
			window.addEventListener('resize', debouncedHandleResize)
			return () => window.removeEventListener('resize', debouncedHandleResize)
		})

		const animateTop = (searchResultsOffsetTop ?? 0) - cardTop;
		const animateLeft = expandedCardLeft - cardLeft;

		const profileRef = useRef<HTMLDivElement>(null);
		const customProps = {
			showProfile, expandedCardMinWidth, searchResultsOffsetTop, animateTop,
			animateLeft, expandedCardLeft, cardRef
		};
		// const [startMotion, setStartMotion] = useState(false);
		const staticCard = <div
			id="static-card"
			style={{
				zIndex: 3495,
				cursor: "default",
				position: "absolute",
				display: "inline-block",
				overflow: "hidden",
				top: 0,
				left: 0,
				minWidth: "250px",
				minHeight: "400px",
			}}>
			<div style={{
				position: "absolute",
				width: `${expandedCardMinWidth}px`,
				minWidth: `${expandedCardMinWidth}px`,
				background: "rgb(25,25,25)",
				borderRadius: "1rem",
				top: 0,
				left: 0,
			}}>
				<div>
					<NavLink to={`/search-results/${data.username}`}
						// onMouseEnter={() => setStartMotion(true)}
						// onMouseLeave={() => setStartMotion(false)}
					>
						<img style={{minWidth: 250, minHeight: 376, maxWidth: 250, maxHeight: 376}} src={imgUrl} alt=""/>
					</NavLink>
				</div>
			</div>
		</div>
		const motionCard = <motion.div
			id="motion-card"
			ref={cardRef}
			style={{
				cursor: "default",
				position: "absolute",
				// display: "inline-block",
				display: "none",
				overflow: "hidden",

				// top: 0,
				// left: 0,
				// minWidth:"250px",
				// minHeight: "400px",
			}}
			transition={{duration: .2}}
			variants={variants}
			custom={customProps}
			animate={"animate"}
			onClick={() => {
				// console.log("onclick")
				// if (cardRef?.current && !showProfile) {
				// 	// cardRef.current.style.zIndex = "123456";
				// 	if (expandedCardAniFinished.current) {
				// 		expandedCardAniFinished.current = false
				// 		// setExpandedCardAniFinishedState(false)
				// 	}
				// }
			}}
			onAnimationStart={() => {
				console.log("onAnimationStart")
				if (!showProfile) {


					if (overlayMotionCardCopyRef.current) {
						overlayMotionCardCopyRef.current.style.display = "none";
					}

					document.documentElement.classList.remove("no-scroll");
					document.documentElement.style.marginRight = "0";
					document.documentElement.style.width = "100%";

				}
				if (showProfile) {
					if (cardRef.current) {
						cardRef.current.style.zIndex = "9999999";
					}

					document.documentElement.classList.add("no-scroll");
					// const rightNavbar = document.getElementById("right-navbar")
					// if (rightNavbar) {
					document.documentElement.style.marginRight = scrollBarWidth;
					document.documentElement.style.width = `calc(100% - ${scrollBarWidth})`;
					// }
				}
			}}
			onAnimationComplete={() => {
				if (showProfile) {
					if (overlayMotionCardCopyRef?.current) {
						overlayMotionCardCopyRef.current.style.display = "block";
					}
				}
				if (!showProfile) {
					if (cardRef?.current) {
						cardRef.current.style.zIndex = "10";
					}
				}
			}}
		>
			<div style={{
				position: "absolute",
				width: `${expandedCardMinWidth}px`,
				minWidth: `${expandedCardMinWidth}px`,
				background: "rgb(25,25,25)",
				borderRadius: "1rem",
				top: 0,
				left: 0,
			}}>
				<div>
					<NavLink to={`/search-results/${data.username}`}>
						<img style={{minWidth: 250, minHeight: 376, maxWidth: 250, maxHeight: 376}} src={imgUrl} alt=""/>
					</NavLink>
				</div>
			</div>
		</motion.div>

		const overlayMotionCardCopyRef = useRef<HTMLDivElement>(null);
		const overlayMotionCardCopy = <div
			id="overlay-motion-card-copy"
			ref={overlayMotionCardCopyRef}
			style={{
				display: "none",

				position: "fixed",
				overflowY: "scroll",
				background: "rgba(0,0,0,0.7)",
				zIndex: "999999999",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
			}}>
			<div>
				<section id="profile"
						 ref={profileRef}
						 style={{
							 position: "absolute",
							 top: `${searchResultsOffsetTop}px`,
							 left: `${expandedCardLeft}px`,
							 // left: `${expandedCardLeft.current}px`,
							 minWidth: `${expandedCardMinWidth}px`,
							 maxWidth: `${expandedCardMinWidth}px`,
						 }}
				>
					<div className="header" >

						<div className="profile-picture" style={{position: "relative"}}>
							<img style={{minWidth: 250, minHeight: 376,width: "auto", height: "auto", maxWidth: 250, maxHeight: 376}} src={imgUrl} alt=""/>
						</div>

						<div className="general-info">
							<div>
								animateLeft:
							</div>
							<div>
								animateTop:
							</div>
							<div>
								searchResultsOffsetTop:
							</div>
							<div>
								cardTop:
							</div>
							<div>
								expandedCardLeft:
							</div>
							<div>
								cardLeft:
							</div>
							<div>
								showProfile:
							</div>
						</div>

						<div className="profile-information">
							<div className="basic-info">
								<div>1</div>
								<div>2</div>
								<div>3</div>
							</div>

							<div className="additional-info">
								<div>
									<strong>A</strong><span>3</span>
								</div>
								<div>
									<strong>B</strong><span>4</span>
								</div>
								<div>
									<strong>C</strong><span>2</span>
								</div>
								<div>
									<strong>D</strong><span>3</span>
								</div>
								<div>
									<strong>E</strong><span>1</span>
								</div>
							</div>
						</div>

					</div>

					<div>
						<p>1</p>
						<p>2</p>
						<p>3</p>
						<p>4</p>
						<p>5</p>
						<p>6</p>
						<p>7</p>
						<p>8</p>
						<p>9</p>
						<p>10</p>
						<p>11</p>
						<p>12</p>
						<p>13</p>
						<p>14</p>
						<p>15</p>
						<p>16</p>
						<p>17</p>
						<p>18</p>
						<p>19</p>
						<p>20</p>
						<p>21</p>
						<p>22</p>
						<p>23</p>
						<p>24</p>
						<p>25</p>
						<p>26</p>
						<p>27</p>
						<p>28</p>
						<p>29</p>
						<p>30</p>
						<p>31</p>
						<p>32</p>
						<p>33</p>
					</div>

				</section>
			</div>
		</div>;

		return <>
			<div
				style={{
					position: "relative",
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,

					minWidth: "250px",
					maxWidth: "250px",
					minHeight: "400px",
					maxHeight: "400px",
				}}
			>
				{/*{staticCard}*/}
				{motionCard}
				{/*<AnimatePresence initial={false}>*/}
				{/*	{startMotion && motionCard}*/}
				{/*</AnimatePresence>*/}
			</div>
			{overlayMotionCardCopy}
		</>;
	},
	(prevProps, nextProps) => {
		return prevProps.data.username === nextProps.data.username;
	}
)
