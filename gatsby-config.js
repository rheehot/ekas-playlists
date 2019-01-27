'use strict'

module.exports = {
	siteMetadata: {
		title: 'eka’s playlists',
		description: 'songs on repeat and mixes I make',
		siteUrl: 'https://playlists.ekaaa.me',
		author: {
			name: 'eka',
			url: 'https://ekaaa.me',
			email: 'eka@ekaaa.me'
		}
	},
	plugins: [
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'content',
				path: `${__dirname}/src/content`
			}
		},
		{
			resolve: 'gatsby-transformer-remark',
			options: {
				plugins: [
					{
						resolve: 'gatsby-remark-responsive-iframe',
						options: {
							wrapperStyle: 'margin-bottom: 1rem'
						}
					},
					'gatsby-remark-prismjs',
					'gatsby-remark-copy-linked-files',
					'gatsby-remark-smartypants',
					{
						resolve: 'gatsby-remark-images',
						options: {
							maxWidth: 1140,
							quality: 90,
							linkImagesToOriginal: false
						}
					},
					'gatsby-remark-embed-spotify'
				]
			}
		},
		'gatsby-transformer-json',
		{
			resolve: 'gatsby-plugin-canonical-urls',
			options: {
				siteUrl: 'https://gatsby-starter-typescript-plus.netlify.com'
			}
		},
		'gatsby-plugin-emotion',
		'gatsby-plugin-typescript',
		'gatsby-plugin-sharp',
		'gatsby-transformer-sharp',
		'gatsby-plugin-react-helmet',
		{
			resolve: `gatsby-plugin-feed`,
			options: {
				query: `
					{
						site {
							siteMetadata {
								title
								description
								siteUrl
								site_url: siteUrl
							}
						}
					}
				`,
				feeds: [
					{
						serialize: ({ query: { site, allMarkdownRemark } }) => {
							return allMarkdownRemark.edges.map(edge => {
								const { frontmatter, fields } = edge.node
								return Object.assign({}, frontmatter, {
									description: frontmatter.artist,
									date: frontmatter.date,
									url: site.siteMetadata.siteUrl + fields.slug,
									guid: site.siteMetadata.siteUrl + fields.slug,
									custom_elements: [
										{
											'content:encoded':
												frontmatter.artist +
												' — ' +
												frontmatter.title +
												' ' +
												frontmatter.url +
												' | ' +
												site.siteMetadata.siteUrl +
												fields.slug
										}
									]
								})
							})
						},
						query: `
							{
								allMarkdownRemark(
									limit: 1000,
									sort: { order: DESC, fields: [frontmatter___date] },
									filter: { frontmatter: { draft: { ne: true } }, fileAbsolutePath: { regex: "/tracks/" } }
								) {
									edges {
										node {
											excerpt
											html
											fields { slug }
											frontmatter {
												title
												artist
												date
											}
										}
									}
								}
							}
						`,
						output: '/rss-tracks.xml',
						title: "Eka's Playlists - Tracks RSS"
					}
				]
			}
		}
	]
}
