const inquirer = require('inquirer')
const question = require('./question')

function create(){
	return new Promise(resolve=>{
		inquirer.prompt(question.create).then(res=>{
			resolve(res)
		})
	})
}

module.exports = {
	create
}