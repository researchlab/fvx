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

function findYarn(){
	
	let yarns = process.platform === 'win32' ? ['yarn.cmd'] : ['yarn']
	for (let i = 0; i < yarns.length; i++){
		try{
			which.sync(yarns[i])
			console.log('use yarn:', yarns[i])
			return yarns[i]
		}catch(e){
		}
	}
	throw new Error('please install yarn')
}

module.exports = function(installArg = ['install']){
	const yarn = findYarn()
	return function(done){
		runCMD(which.sync(yarn), installArg, function(){
			done && done()
		})
	}
}
