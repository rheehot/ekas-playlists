import * as React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import { Link } from 'gatsby'

import { heights, dimensions, colors } from '../styles/variables'
import Container from './Container'

const StyledHeader = styled.header`
	height: ${heights.header}px;
	padding: 0 ${dimensions.containerPadding}rem;
	background-color: ${colors.brand};
	color: ${transparentize(0.5, colors.white)};
`

const HeaderInner = styled(Container)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 100%;
	ul,
	li {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	li {
		display: inline-block;
		margin-left: 1rem;
		a {
			color: #fff;
			&.is-active {
				// text-decoration: underline;
				&:after {
					content: '';
					background: #fff100;
					width: 100%;
					height: 4px;
					display: block;
					margin-bottom: -4px;
				}
			}
		}
	}
`

const HomepageLink = styled(Link)`
	color: ${colors.white};
	font-size: 1.5rem;
	font-weight: 600;

	&:hover,
	&:focus {
		text-decoration: none;
	}
`

interface HeaderProps {
	title: string
}

// Match partial path to menu item active class
// https://reach.tech/router/api/Link

// if on single album/mix page, assign active class to respective menu item
const isPartiallyActive = ({ isPartiallyCurrent }) => {
	return isPartiallyCurrent ? { className: 'is-active' } : null
}
// if on root OR on single track page, assign active class to "now playing"
// ("now playing" is actually home link)
const isTrackPage = ({ location }) => {
	const firstSegment = location.pathname.substring(0, 8)
	return firstSegment === '/tracks/' || location.pathname === '/' ? { className: 'is-active' } : null
}
// if on single tag/artist page, assign active class to "browse"
const isBrowsePage = ({ location }) => {
	const path = location.pathname
	const isTrack = path.indexOf('/tags/') !== -1
	const isArtist = path.indexOf('/artists/') !== -1
	const isBrowse = path.indexOf('/browse') !== -1

	return isTrack || isArtist || isBrowse ? { className: 'is-active' } : null
}

const Header: React.SFC<HeaderProps> = ({ title }) => (
	<StyledHeader>
		<HeaderInner>
			<HomepageLink to="/">{title}</HomepageLink>
			<ul>
				<li>
					<Link getProps={isTrackPage} activeClassName="is-active" to="/">
						now playing
					</Link>
				</li>
				<li>
					<Link getProps={isPartiallyActive} activeClassName="is-active" to="/albums">
						albums
					</Link>
				</li>
				<li>
					<Link getProps={isPartiallyActive} activeClassName="is-active" to="/mixes">
						mixes
					</Link>
				</li>
				<li>
					<Link getProps={isBrowsePage} activeClassName="is-active" to="/browse">
						browse
					</Link>
				</li>
			</ul>
		</HeaderInner>
	</StyledHeader>
)

export default Header
