import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router";
import {debounce} from "underscore";
import {NavLink} from "react-router-dom";
import {motion} from "framer-motion";
import {RandomPicture} from "random-picture/dist";

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
				const pic = await RandomPicture();
				// const pic = {url: undefined}
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

		const motionCard = <motion.div
			id="motion-card"
			ref={cardRef}
			style={{
				cursor: "default",
				position: "absolute",
				display: "none",
				overflow: "hidden",
			}}
			transition={{duration: .2}}
			variants={variants}
			custom={customProps}
			animate={"animate"}
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
					document.documentElement.style.marginRight = scrollBarWidth;
					document.documentElement.style.width = `calc(100% - ${scrollBarWidth})`;
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
							 minWidth: `${expandedCardMinWidth}px`,
							 maxWidth: `${expandedCardMinWidth}px`,
						 }}
				>

					<div className="header" >
						<div className="profile-picture" style={{position: "relative"}}>
							<img style={{minWidth: 250, minHeight: 376,width: "auto", height: "auto", maxWidth: 250, maxHeight: 376}} src={imgUrl} alt=""/>
						</div>
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
				{motionCard}
			</div>
			{overlayMotionCardCopy}
		</>;
	},
	(prevProps, nextProps) => {
		return prevProps.data.username === nextProps.data.username;
	}
)
