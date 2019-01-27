import * as React from 'react'
import { Link, graphql } from 'gatsby'
const { kebabCase } = require('lodash')

import Page from '../components/Page'
import Container from '../components/Container'
import IndexLayout from '../layouts'

export interface BrowsePageProps {
	data: {
		tags: {
			group: Array<Object>
		}
		artists: {
			group: Array<Object>
		}
	}
}

const BrowsePage = (props: BrowsePageProps) => {
	const tags = props.data.tags.group
	const artists = props.data.artists.group

	return (
		<IndexLayout>
			<Page>
				<Container>
					<h1>browse</h1>

					<div style={{ borderTop: '2px solid #663399', marginTop: 24 }}>
						<h3 style={{ color: '#663399' }}>tags</h3>
						{tags.map((tag: Object) => {
							const { fieldValue, totalCount } = tag
							return (
								<div key={fieldValue}>
									<Link to={'/tags/' + fieldValue}>
										<strong>{fieldValue}</strong> ({totalCount})
									</Link>
								</div>
							)
						})}
					</div>
					<div style={{ borderTop: '2px solid #663399', marginTop: 24 }}>
						<h3 style={{ color: '#663399' }}>artists</h3>
						{artists.map((artist: Object) => {
							const { fieldValue, totalCount } = artist
							return (
								<div key={fieldValue}>
									<Link to={`/artists/${kebabCase(fieldValue)}/`}>
										<strong>{fieldValue}</strong> ({totalCount})
									</Link>
								</div>
							)
						})}
					</div>
				</Container>
			</Page>
		</IndexLayout>
	)
}

export default BrowsePage

export const pageQuery = graphql`
	query {
		tags: allMarkdownRemark(filter: { frontmatter: { draft: { ne: true } } }) {
			group(field: frontmatter___tags) {
				fieldValue
				totalCount
			}
		}
		artists: allMarkdownRemark(filter: { frontmatter: { draft: { ne: true } }, fileAbsolutePath: { regex: "/albums/|/tracks/" } }) {
			group(field: frontmatter___artist) {
				fieldValue
				totalCount
			}
		}
	}
`
