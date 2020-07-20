import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import {Link} from 'react-router-dom';

const links = [
	{
		section: '/',
		name: 'Home'
	},
    { 
		section: '/about',
		name: 'About',
        pages: [
            {
                name: 'Bio',
                path: '/about/bio'
            }
        ]
    },
    { 
		section: '/matches',
		name: 'Matches',
        pages: [
            {
                name: 'Attendances',
                path: '/matches/attendances'
            },
            {
                name: 'League positions',
                path: '/matches/league-positions'
            }
        ]
    },
    { 
		section: '/players',
		name: 'Players',
        pages: [
            {
                name: 'Goalscorers',
                path: '/players/scorers'
            }
        ]
    }
];

export default function Navigation() {

  	const [sectionString, setSectionString] = useState({});
    const [hasError, setErrors] = useState(false);
	const [data, setData] = useState({});
	const [primaryToggle, setPrimaryToggle] = useState(false);
	const [secondaryToggle, setSecondaryToggle] = useState(false);
	const [sectionPath, setSectionPath] = useState({});
	
  	useEffect(() => {

		async function fetchData() {
            const res = await fetch("/get-navigation-links");
            res
                .json()
                .then(res => setData(res))
                .catch(err => setErrors(err));
		}
		fetchData();

		// If users reaches page directly or by refresh, highlight correct primary section
		let url = window.location.href;
		let urlParts = url.split('/');
		setSectionPath(`/${urlParts[3]}`);

    },[]);


	let subPages, subLinks;

	let toggleSubLinks = (e) => {
		let buttons = document.getElementsByTagName('button');
		for (const button of buttons) {
			if (button === e.target && button.dataset.sectionOpen === 'false') {
				button.dataset.sectionOpen = 'true';
				button.innerText = '-';
			} else {
				button.dataset.sectionOpen = 'false';
				button.innerText = '+';
			}
		}

		let subLinks = document.querySelectorAll('.secondary-navigation');
		for (const subLink of subLinks) {
			if (subLink.dataset.section === e.target.dataset.section && subLink.dataset.toggleOpen === 'false') {
				subLink.dataset.toggleOpen = 'true';
			} else {
				subLink.dataset.toggleOpen = 'false';
			}
		}
	}

	let navLinks = links.map((data) => {
					let toggleBtn = '';

		if (data.pages) {
			let subPagesData = data.pages;
			if (subPagesData) {
				toggleBtn = <button 
								data-section={data.section}
								data-section-open='false'
								onClick={(e) =>{						
									setSectionPath(data.section);
									toggleSubLinks(e);
								}}>
								{secondaryToggle && data.section === sectionPath ? `-` : `+`}</button>
			}
			subPages = subPagesData.map((data) => {
				return (
					<li>
						<Link 
							to={data.path}
							data-toggle-open={sectionPath === data.section ? `true` : `false`}
							onClick={(e) => {
								data.pages ? setPrimaryToggle(true) : setPrimaryToggle(false);
								let subLinkHref = e.target.href;
								let urlParts = subLinkHref.split('/');
								setSectionPath(`/${urlParts[3]}`);
							}}
						>
							{data.name}
						</Link>
					</li>
				);
			});
			subLinks = <ul 
							className={`secondary-navigation`}
							data-section={data.section}
							data-toggle-open={(data.section === sectionPath) && secondaryToggle ? `true` : `false`}
						>
							{subPages}
						</ul>
		}

		return (
			<li>
				<Link
					to={data.section}
					className={`primary-navigation__link`}
					data-toggle-open={sectionPath === data.section ? `true` : `false`}
					onClick={(e) => {
						setSectionPath(data.section);
						setPrimaryToggle(false);
						toggleSubLinks(e);
					}}
					data-active={sectionString === data.path ? `true` : `false`}
				>
					{data.name}
				</Link>
				{toggleBtn}
				{subLinks}
			</li>
		)		
	})

  	return (
	  	<React.Fragment>
    		<ul 
				className={primaryToggle ? 'primary-navigation responsive' : 'primary-navigation'}
				data-toggle-open={primaryToggle ? 'true' : 'false'}
			>
				<li className='primary-navigation__toggle'>
					<Link  
						onClick={() => setPrimaryToggle(!primaryToggle)}
					>
						Menu
					</Link>
				</li>
      			{navLinks}
    		</ul>
		</React.Fragment>
  	);
}