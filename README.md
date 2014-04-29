Development stuff
-----------------

- Prerequisites

	- Install nodejs and git

	- Install Grunt's command line interface

			npm install -g grunt-cli

  - Install mongodb
  
  - Restore data
  
      cd invitation
      mongorestore -h 127.0.0.1 -d invitation -directoryperdb ./invitation
	- Prepare Project

			git clone git@github.com:Potato2009/invitation.git
			cd invitation
			npm install

- [Grunt](http://gruntjs.com/) tasks

	- Config distribute path

			echo '{"path": {"dest": "www", "src": "."}}' >> config.json

	- Compile templates in `assets/template/*` to generate `public/js/templates.js`

			grunt templates

	- Concat JavaScript files in `assets/js/app/*` to generate `public/js/app-core.js`

			grunt concat

	- Compile Sass files in `assets/sass/*` to generate `public/css/mobile.css`

			grunt sass

	- Concat html files in `views/mobile/*` to generate `views/page.ejs`

			grunt includes

	- Alternative to previous 6 commandes, eg. run templates + concat + uglify + sass + includes + copy at the same time

			grunt dist

	- Monitor files, run tasks when they're changed

			grunt watch

	- Run a local dev server.

			grunt connect

		Arguments:

		- `--appcache` - enable Application Cache
		- `--port=XX` - specify a custom port number

	- Run both `watch` and `connect` tasks at the same time

			grunt server


License
-------

Licensed under the MIT License.
