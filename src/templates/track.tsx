import * as React from 'react'
import { graphql } from 'gatsby'

import Page from '../components/Page'
import Container from '../components/Container'
import IndexLayout from '../layouts'

interface TrackTemplateProps {
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

const TrackTemplate: React.SFC<TrackTemplateProps> = ({ data }) => (
	<IndexLayout>
		<Page>
			<Container>
				<h1>
					{data.markdownRemark.frontmatter.title}
					<br />
					<small>{data.markdownRemark.frontmatter.artist}</small>
				</h1>
				<div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
			</Container>
		</Page>
	</IndexLayout>
)

export default TrackTemplate

export const query = graphql`
	query TrackTemplateQuery($slug: String!) {
		markdownRemark(fields: { slug: { eq: $slug } }) {
			...MarkdownFrontmatter
			fields {
				slug
			}
			html
		}
	}
`
