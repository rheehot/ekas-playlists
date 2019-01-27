import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Moment from 'react-moment'

import Page from '../components/Page'
import Container from '../components/Container'
import IndexLayout from '../layouts'

export interface IndexPageProps {
	data: {
		tracks: {
			edges: Array<Object>
		}
	}
}

// export interface TrackNodeProps {
// 	excerpt: string
// 	fields: {
// 		slug: string
// 	}
// 	frontmatter: {
// 		title: string
// 		artist: string
// 	}
// }

const IndexPage = (props: IndexPageProps) => {
	// const tracks = props.data.tracks.edges // comment out if using group below
	let dateGroups = props.data.tracks.group

	// reverse (make latest date first), but only the first time
	if (dateGroups[0].fieldValue < dateGroups[1].fieldValue) {
		dateGroups = dateGroups.reverse()
	}

	return (
		<IndexLayout>
			<Page>
				<Container>
					<h1>now playing</h1>

					{dateGroups.map((dateGroup: any) => {
						const date = dateGroup.fieldValue
						const tracks = dateGroup.edges

						return (
							<div key={date} style={{ borderTop: '2px solid #663399', marginTop: 24 }}>
								<h3 style={{ color: '#663399' }}>
									<Moment parse="YYYY-MM-DD" format="DD MMMM YYYY">
										{date}
									</Moment>
								</h3>
								<ul
									style={{
										listStyle: 'none',
										padding: 0,
										display: 'grid',
										gridTemplateColumns: 'repeat(3, 1fr)',
										columnGap: 'calc(1rem + 2vw)'
									}}
								>
									{tracks.map(({ node }: { node: any }) => {
										const { frontmatter, fields } = node
										return (
											<li key={fields.slug} style={{ marginBottom: 20 }}>
												<Link to={fields.slug}>
													<h4>{frontmatter.title}</h4>
													<strong>{frontmatter.artist}</strong>
												</Link>
											</li>
										)
									})}
								</ul>
							</div>
						)
					})}
				</Container>
			</Page>
		</IndexLayout>
	)
}

export default IndexPage

export const pageQuery = graphql`
	query {
		tracks: allMarkdownRemark(
			sort: { order: DESC, fields: [frontmatter___date] }
			filter: { frontmatter: { draft: { ne: true } }, fileAbsolutePath: { regex: "/tracks/" } }
		) {
			group(field: frontmatter___date) {
				fieldValue
				totalCount
				edges {
					node {
						...MarkdownFrontmatter
						fields {
							slug
						}
					}
				}
			}
		}
	}
`
