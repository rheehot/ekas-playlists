const { inputRequired } = require('./utils')

module.exports = plop => {
	plop.setGenerator('mixtape entry', {
		prompts: [
			{
				type: 'input',
				name: 'title',
				message: 'Mix title?',
				validate: inputRequired('title')
			},
			{
				type: 'input',
				name: 'description',
				message: 'Mix description?',
				validate: inputRequired('artist')
			},
			{
				type: 'input',
				name: 'icon',
				message: 'Decorative icon?'
			},
			{
				type: 'input',
				name: 'url',
				message: 'Mixtape URL?'
			},
			{
				type: 'input',
				name: 'tags',
				message: 'Tags? (separate with coma)'
			},
			{
				type: 'input',
				name: 'body',
				message: 'Body text?'
			},
			{
				type: 'confirm',
				name: 'draft',
				message: 'Save as draft?',
				default: false
			}
		],
		actions: data => {
			// Get current date
			data.date = new Date().toISOString().split('T')[0]

			// Parse tags as yaml array
			if (data.tags) {
				data.tags = `tags:\n  - ${data.tags.split(',').join('\n  - ')}`
			}

			// Open external URL link by default, but make sure there's a URL
			if (data.url) {
				data.openExternal = true
			}

			// Add the file
			return [
				{
					type: 'add',
					path: '../src/content/mixes/{{dashCase title}}.md',
					templateFile: 'templates/mixes-md.template'
				}
			]
		}
	})
}
