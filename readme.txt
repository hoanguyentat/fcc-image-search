 		new project
Add to Github Desktop
Publish to Github
Extract Template
Add project to Netbeans from existing source
Heroku Create : heroku create
	if needs mongodb
		Add mLab : heroku addons:create mongolab
		Add MONGOLAB_URI to .env : echo|set /p="MONGOLAB_URI=" >>.env & heroku config:get MONGOLAB_URI >>.env
Git Commit
Sync Github Desktop
Heroku Upload : git push heroku master
Heroku Scale : heroku ps:scale web=1
Heroku Open

		save project
Git Commit
Sync Github Desktop
Heroku Upload : git push heroku master
