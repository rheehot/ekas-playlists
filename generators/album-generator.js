const { inputRequired } = require('./utils')

module.exports = plop => {
	plop.setGenerator('album entry', {
		prompts: [
			{
				type: 'input',
				name: 'title',
				message: 'Album title?',
				validate: inputRequired('title')
			},
			{
				type: 'input',
				name: 'artist',
				message: 'Album artist?',
				validate: inputRequired('artist')
			},
			{
				type: 'input',
				name: 'year',
				message: 'Release year?'
			},
			{
				type: 'input',
				name: 'url',
				message: 'Album URL?'
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
					path: '../src/content/albums/{{dashCase title}}-by-{{dashCase artist}}.md',
					templateFile: 'templates/album-md.template'
				}
			]
		}
	})
}
