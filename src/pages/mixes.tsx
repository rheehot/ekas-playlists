import * as React from 'react'
import { Link, graphql } from 'gatsby'

import Page from '../components/Page'
import Container from '../components/Container'
import IndexLayout from '../layouts'

const MixesPage = props => {
	const mixes = props.data.mixes.edges
	return (
		<IndexLayout>
			<Page>
				<Container>
					<h1>mixes</h1>

					<ul
						style={{
							listStyle: 'none',
							padding: 0
						}}
					>
						{mixes.map(({ node }: { node: any }, i) => {
							const { frontmatter, fields } = node
							return (
								<li key={i} style={{ marginBottom: 20 }}>
									{frontmatter.openExternal ? (
										<a href={frontmatter.url} rel="external" target="_blank">
											<h4>
												{frontmatter.icon && <span>{frontmatter.icon}</span>}
												{frontmatter.title}
											</h4>
											<span>{frontmatter.description}</span>
										</a>
									) : (
										<React.Fragment>
											<h4>{frontmatter.title}</h4>
											<span>{frontmatter.description}</span>
										</React.Fragment>
									)}
								</li>
							)
						})}
					</ul>
				</Container>
			</Page>
		</IndexLayout>
	)
}

export default MixesPage

export const pageQuery = graphql`
	query {
		mixes: allMarkdownRemark(
			sort: { order: DESC, fields: [frontmatter___date] }
			filter: { frontmatter: { draft: { ne: true } }, fileAbsolutePath: { regex: "/mixes/" } }
		) {
			totalCount
			edges {
				node {
					...MarkdownFrontmatter
					frontmatter {
						icon
						url
						description
						openExternal
					}
				}
			}
		}
	}
`
