const { inputRequired } = require('./utils')

module.exports = plop => {
	plop.setGenerator('track entry', {
		prompts: [
			{
				type: 'input',
				name: 'title',
				message: 'Track title?',
				validate: inputRequired('title')
			},
			{
				type: 'input',
				name: 'artist',
				message: 'Track artist?',
				validate: inputRequired('artist')
			},
			{
				type: 'input',
				name: 'url',
				message: 'Track URL?'
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

			// Add the file
			return [
				{
					type: 'add',
					path: '../src/content/tracks/{{date}}--{{dashCase title}}.md',
					templateFile: 'templates/track-md.template'
				}
			]
		}
	})
}
