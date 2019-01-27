import * as React from 'react'
import { graphql } from 'gatsby'

import Page from '../components/Page'
import Container from '../components/Container'
import IndexLayout from '../layouts'

interface AlbumTemplateProps {
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

const AlbumTemplate: React.SFC<AlbumTemplateProps> = ({ data }) => (
	<IndexLayout>
		<Page>
			<Container>
				<h1>
					{data.markdownRemark.frontmatter.title}
					<br />
					<small>{data.markdownRemark.frontmatter.artist}</small>
					<br />
					<small>{data.markdownRemark.frontmatter.year}</small>
				</h1>
				<img
					width="244"
					height="244"
					src={data.markdownRemark.frontmatter.image.children[0].fluid.src}
					srcSet={data.markdownRemark.frontmatter.image.children[0].fluid.srcSet}
					sizes="(max-width: 544px) 100vw, 20vw"
				/>
				<div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
			</Container>
		</Page>
	</IndexLayout>
)

export default AlbumTemplate

export const query = graphql`
	query AlbumTemplateQuery($slug: String!) {
		markdownRemark(fields: { slug: { eq: $slug } }) {
			...MarkdownFrontmatter
			frontmatter {
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
			html
		}
	}
`
