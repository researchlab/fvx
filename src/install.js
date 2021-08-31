const which = require('which')

function runCMD(cmd, args, fn){
	args = args || []
	let runner = require('child_process').spawn(cmd, args, {
		stdio: 'inherit'
	})

	runner.on('close', function(code){
		if(fn){
			fn(code)
		}
	})
}

function findNPM(){
	let npms = process.platform === 'win32' ? ['npm.cmd'] : ['npm']
	for (let i = 0; i < npms.length; i++){
		try{
			which.sync(npms[i])
			console.log('use npm: '+ npms[i])
			return npms[i]
		}catch(e){
		}
	}
	throw new Error('please install npm')
}

module.exports = function(installArg = ['install']){
	const npm = findNPM()
	return function(done){
		runCMD(which.sync(npm), installArg, function(){
			done && done()
		})
	}
}
