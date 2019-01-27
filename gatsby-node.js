'use strict'

const path = require('path')
const { kebabCase, uniq, get, compact, times } = require('lodash')

exports.onCreateNode = ({ node, actions, getNode }) => {
	const { createNodeField } = actions

	// Sometimes, optional fields tend to get not picked up by the GraphQL
	// interpreter if not a single content uses it. Therefore, we're putting them
	// through `createNodeField` so that the fields still exist and GraphQL won't
	// trip up. An empty string is still required in replacement to `null`.

	switch (node.internal.type) {
		case 'MarkdownRemark': {
			const { permalink, layout } = node.frontmatter
			const { relativePath } = getNode(node.parent)

			let slug = permalink

			if (!slug) {
				slug = `/${relativePath.replace('.md', '')}/`
			}

			// Used to generate URL to view this content.
			createNodeField({
				node,
				name: 'slug',
				value: slug || ''
			})

			// Used to determine a page layout.
			createNodeField({
				node,
				name: 'layout',
				value: layout || ''
			})
		}
	}
}

exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions

	const allMarkdown = await graphql(`
		{
			allMarkdownRemark(limit: 1000) {
				edges {
					node {
						fields {
							layout
							slug
						}
						frontmatter {
							artist
							tags
						}
					}
				}
			}
		}
	`)

	if (allMarkdown.errors) {
		console.error(allMarkdown.errors)
		throw new Error(allMarkdown.errors)
	}

	allMarkdown.data.allMarkdownRemark.edges.forEach(({ node }) => {
		const { slug, layout } = node.fields

		// ==================================
		// eka's custom edit:
		// ==================================
		// assign template based on path without setting `layout` on frontmatter

		let customLayout = null

		if (slug.startsWith('/tracks/')) {
			customLayout = 'track'
		} else if (slug.startsWith('/albums/')) {
			customLayout = 'album'
		} else {
			customLayout = layout
		}

		// end custom edit

		createPage({
			path: slug,
			// This will automatically resolve the template to a corresponding
			// `layout` frontmatter in the Markdown.
			//
			// Feel free to set any `layout` as you'd like in the frontmatter, as
			// long as the corresponding template file exists in src/templates.
			// If no template is set, it will fall back to the default `page`
			// template.
			//
			// Note that the template has to exist first, or else the build will fail.
			component: path.resolve(`./src/templates/${customLayout || 'page'}.tsx`),
			context: {
				// Data passed to context is available in page queries as GraphQL variables.
				slug
			}
		})
	})

	// ==================================
	// eka's custom edit:
	// ==================================

	// create tag pages

	const posts = allMarkdown.data.allMarkdownRemark.edges.map(p => p.node)

	const cleanArray = arr => compact(uniq(arr))

	posts.reduce((mem, post) => cleanArray(mem.concat(get(post, 'frontmatter.tags'))), []).forEach(tag => {
		createPage({
			path: `/tags/${kebabCase(tag)}/`,
			component: path.resolve(`./src/templates/tag.tsx`),
			context: {
				slug: tag
			}
		})
	})

	// create artist pages

	posts.reduce((mem, post) => cleanArray(mem.concat(get(post, 'frontmatter.artist'))), []).forEach(artist => {
		if (artist) {
			createPage({
				path: `/artists/${kebabCase(artist)}/`,
				component: path.resolve(`./src/templates/artist.tsx`),
				context: {
					slug: artist
				}
			})
		}
	})

	// end custom edit
}
