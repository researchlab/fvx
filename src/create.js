const fs = require('fs')
const utils = require('../utils/index')
const npm = require('./install')

const { green, blue, yellow, red } = utils

const BUILD_START		  = '----------开始构建-----------'
const BUILD_END				= '----------构建结束-----------'
const IINSTALLL_START = '----------npm包安装----------'
const INSTANLL_END		= '----------npm包安装完成------'

let fileCount = 0
let dirCount = 0
let flat = 0
let isInstall = false

module.exports = function(res){
	green(BUILD_START)		
	const sourcePath = __dirname.slice(0,-3) +'template'
	blue('当前路径:'+process.cwd())
	modifyPackageJson(res, sourcePath).then(()=>{
		copy(sourcePath, process.cwd(), npm())
	})
}

function copy(sourcePath, currentPath, cb){
	flat++
	// fs.readdir是异步操作
	fs.readdir(sourcePath, (err, paths)=>{
		flat--
		if(err) throw err
		paths.forEach(path=>{
			if(path !== '.git' && path !== 'package.json') fileCount++
			const newSourcePath = sourcePath + '/' + path 
			const newCurrentPath = currentPath + '/' + path
			fs.stat(newSourcePath, (err, stat)=>{
				if (err) throw err
				if(stat.isFile() && path !== 'package.json'){
					const reader = fs.createReadStream(newSourcePath)
					const writer = fs.createWriteStream(newCurrentPath)
					reader.pipe(writer)
					green('创建文件:'+newCurrentPath)
					fileCount--
					completeCtrl(cb)
				} else if (stat.isDirectory()){
					if(path !== '.git' && path !== 'package.json'){
							dirCount++
							dirExist(newSourcePath, newCurrentPath, copy ,cb)
					}	
				} 
			})
		})
	})
}

function dirExist(sourcePath, currentPath, copyCallback, cb){
	fs.exists(currentPath, (ext=>{
		if(ext){
			copyCallback(sourcePath, currentPath, cb)
		} else {
			fs.mkdir(currentPath, ()=>{
				fileCount--
				dirCount--
				copyCallback(sourcePath, currentPath, cb)
				yellow('创建文件夹:'+ currentPath)
				completeCtrl(cb)
			})
		}
	}))
}

function completeCtrl(cb){
	if (fileCount === 0 && dirCount === 0 && flat === 0){
		green(BUILD_END)
		if(cb && !isInstall){
			isInstall = true
			blue(IINSTALLL_START)
			cb(()=>{
				blue(INSTANLL_END)
				runProject()
			})
		}
	}	
}

function runProject(){
	try{
		const run = npm(['start'])
		run()
	}catch(e){
		red('自动启动失败, 请手动npm start 启动项目')
	}
}

function modifyPackageJson(res, sourcePath){
	return new Promise((resolve)=>{
			fs.readFile(sourcePath + '/package.json', (err, data)=>{
				if (err) throw err
				const { author, name } = res
				let json = data.toString()
				json = json.replace(/demoName/g, name.trim())
				json = json.replace(/demoAuthor/g, author.trim())
				const path = process.cwd() + '/package.json'
				fs.writeFile(path, new Buffer.from(json), ()=>{
					green('创建文件:' + path)
					resolve()
				})
			})
	})
}
