import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Moment from 'react-moment'

import Page from '../components/Page'
import Container from '../components/Container'
import IndexLayout from '../layouts'

const _ = require('lodash')
const { groupBy } = require('lodash')

export interface AlbumsPageProps {
	data: {
		albums: {
			edges: Array<Object>
		}
	}
}

const AlbumsPage = (props: AlbumsPageProps) => {
	const albums = props.data.albums.edges

	// group albums by month
	const monthGroups = _(albums)
		.groupBy(x => x.node.frontmatter.month)
		.map((value, key) => ({ month: key, albums: value }))
		.value()

	return (
		<IndexLayout>
			<Page>
				<Container>
					<h1>albums</h1>
					{monthGroups.map(monthGroup => {
						const { month, albums } = monthGroup

						return (
							<div key={month} style={{ borderTop: '2px solid #663399', marginTop: 24 }}>
								<h3 style={{ color: '#663399', marginBottom: 20 }}>
									<Moment parse="YYYY-MM" format="MMMM YYYY">
										{month}
									</Moment>
								</h3>
								<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap: 'calc(1rem + 2vw)' }}>
									{/* the following function is the same whether using monthGroup or just mapping all graphql items */}
									{albums.map(({ node }: { node: any }) => {
										const { frontmatter, fields } = node

										let albumImg
										if (frontmatter.image) {
											albumImg = frontmatter.image.children[0].fluid
										}

										return (
											<div key={fields.slug}>
												<Link to={fields.slug}>
													{albumImg ? (
														<img
															width="244"
															height="244"
															src={albumImg.src}
															srcSet={albumImg.srcSet}
															sizes="(max-width: 544px) 100vw, 20vw"
															style={{ width: '100%', height: 'auto' }}
														/>
													) : (
														<div style={{ width: '244px', height: '244px', background: '#eee' }} />
													)}
													<h4 style={{ margin: 0 }}>{frontmatter.title}</h4>
													<strong>{frontmatter.artist}</strong>
													<div>{frontmatter.year}</div>
												</Link>
											</div>
										)
									})}
								</div>
							</div>
						)
					})}
				</Container>
			</Page>
		</IndexLayout>
	)
}

export default AlbumsPage

export const pageQuery = graphql`
	query {
		albums: allMarkdownRemark(
			sort: { order: DESC, fields: [frontmatter___date] }
			filter: { frontmatter: { draft: { ne: true } }, fileAbsolutePath: { regex: "/albums/" } }
		) {
			totalCount
			edges {
				node {
					...MarkdownFrontmatter
					frontmatter {
						month: date(formatString: "YYYY-MM")
						image {
							children {
								... on ImageSharp {
									fluid(maxWidth: 400, maxHeight: 400) {
										src
										srcSet
										sizes
									}
								}
							}
						}
					}
					fields {
						slug
					}
				}
			}
		}
	}
`
