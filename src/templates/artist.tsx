import * as React from 'react'
import { Link, graphql } from 'gatsby'

import Page from '../components/Page'
import Container from '../components/Container'
import IndexLayout from '../layouts'

interface ArtistTemplateProps {
	data: {
		markdownRemark: {
			html: string
			excerpt: string
			frontmatter: {
				title: string
				artist: string
			}
		}
	}
}

const ArtistTemplate: React.SFC<ArtistTemplateProps> = props => {
	let albums = []
	let albumCount
	if (props.data.albums) {
		albums = props.data.albums.edges
		albumCount = props.data.albums.totalCount
	}

	let tracks = []
	let trackCount
	if (props.data.tracks) {
		tracks = props.data.tracks.edges
		trackCount = props.data.tracks.totalCount
	}

	const currArtist = props.pathContext.slug

	return (
		<IndexLayout>
			<Page>
				<Container>
					<h1>artist: {currArtist}</h1>
					{albumCount && (
						<div style={{ borderTop: '2px solid #663399', marginTop: 24 }}>
							<h3 style={{ color: '#663399' }}>
								albums <small>({albumCount})</small>
							</h3>
							<div style={{ display: 'flex' }}>
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
														width="120"
														height="120"
														src={albumImg.src}
														srcSet={albumImg.srcSet}
														sizes="(max-width: 544px) 50vw, 8vw"
														// style={{ width: '100%', height: 'auto' }}
													/>
												) : (
													<div style={{ width: '120px', height: '120px', background: '#eee' }} />
												)}
												<h4 style={{ marginTop: 8, marginBottom: 8 }}>{frontmatter.title}</h4>
												<strong>{frontmatter.artist}</strong>
											</Link>
										</div>
									)
								})}
							</div>
						</div>
					)}
					{trackCount && (
						<div style={{ borderTop: '2px solid #663399', marginTop: 24 }}>
							<h3 style={{ color: '#663399' }}>
								tracks <small>({trackCount})</small>
							</h3>
							{tracks.map(({ node }: { node: any }) => {
								const { frontmatter, fields } = node
								return (
									<div key={fields.slug}>
										<Link to={fields.slug}>
											<h4>{frontmatter.title}</h4>
											<strong>{frontmatter.artist}</strong>
										</Link>
									</div>
								)
							})}
						</div>
					)}
				</Container>
			</Page>
		</IndexLayout>
	)
}

export default ArtistTemplate

export const query = graphql`
	query ArtistTemplateQuery($slug: String!) {
		# Get albums
		albums: allMarkdownRemark(
			sort: { order: DESC, fields: [frontmatter___date] }
			filter: { frontmatter: { artist: { in: [$slug] }, draft: { ne: true } }, fileAbsolutePath: { regex: "/albums/" } }
		) {
			totalCount
			edges {
				node {
					...MarkdownFrontmatter
					frontmatter {
						image {
							children {
								... on ImageSharp {
									fluid(maxWidth: 200, maxHeight: 200) {
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
		# Get tracks
		tracks: allMarkdownRemark(
			sort: { order: DESC, fields: [frontmatter___date] }
			filter: { frontmatter: { artist: { in: [$slug] }, draft: { ne: true } }, fileAbsolutePath: { regex: "/tracks/" } }
		) {
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
`
