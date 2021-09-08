const fs = require('fs')
const utils = require('../utils/index')
const yarn = require('./install')
const path = require('path')

const { green, blue, yellow, red } = utils

const BUILD_START     = '----------开始构建-----------'
const BUILD_END       = '----------构建结束-----------'
const IINSTALLL_START = '----------yarn包安装---------'
const INSTANLL_END    = '----------yarn包安装完成-----'

let fileCount = 0
let dirCount = 0
let flat = 0
let isInstall = false

let choices = new Set()
let pkgs = [
	{
		name:'sass-loader',
		deps:['sass-loader', 'node-sass']
	},
	{
		name:'less-loader',
		deps:['less-loader', 'less']
	},
	{
		name:'typescript',
		deps:['ts-loader', 'typescript']
	},
	{
		name:'image(url-loader,file-loader)',
		deps:['url-loader', 'file-loader']
	},
	{
		name:'redux',
		deps:['react-redux','redux']
	}
]
module.exports = function(res){

	res.state.forEach(choice=>{
		choices.add(choice)
	})
	res.module.forEach(choice=>{
		choices.add(choice)
	})

	green(BUILD_START)		
	const sourcePath =  path.join(__dirname.slice(0,-3), 'template', 'react')
	const configPath = path.join(__dirname.slice(0,-3), 'template', 'config')
	blue('当前路径:'+process.cwd())
	
  if (choices.has('typescript')){
			setConfig(configPath)
	}
	modifyPackageJson(res, sourcePath).then(()=>{
		copy(sourcePath, process.cwd(), yarn())
	})

}

function copy(sourcePath, currentPath, cb){
	flat++
	// fs.readdir是异步操作
	fs.readdir(sourcePath, (err, paths)=>{
		flat--
		if(err) throw err
		paths.forEach(path=>{

			if (path === 'app.jsx' && choices.has('typescript')) return 
			if (path === 'app.tsx' && !choices.has('typescript')) return 

			if ((path === 'app.scss' || path === 'default.scss') && choices.has('less-loader')) return
			if ((path === 'app.less' || path === 'default.less') && choices.has('sass-loader')) return

			if(path !== '.git' && path !== 'package.json') fileCount++
			const newSourcePath = sourcePath + '/' + path 
			const newCurrentPath = currentPath + '/' + path
			fs.stat(newSourcePath, (err, stat)=>{
				if (err) throw err
				if(stat.isFile() && path !== 'package.json'){
					if ((RegExp(/app.(t|j)sx/).exec(path) || path === 'index.jsx') && choices.has('less-loader')){
						 modifyFile(newSourcePath, newCurrentPath)
					}else{
					   const reader = fs.createReadStream(newSourcePath)
					   const writer = fs.createWriteStream(newCurrentPath)
					   reader.pipe(writer)
					}
					green('创建文件:'+newCurrentPath)
					fileCount--
					completeCtrl(cb)
				} else if (stat.isDirectory()){
					if(path !== '.git' && path !== 'package.json'){
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
			dirCount++
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
		const run = yarn(['start'])
		run()
	}catch(e){
		red('自动启动失败, 请手动yarn start 启动项目')
	}
}

function modifyPackageJson(res, sourcePath){
	return new Promise((resolve)=>{
			fs.readFile(path.join(sourcePath, 'package.json'), (err, data)=>{
				if (err) throw err
				const { author, name } = res
				// let json = data.toString()
				// json = json.replace(/demoName/g, name.trim())
				// json = json.replace(/demoAuthor/g, author.trim())
				let json = JSON.parse(data)
				json = {
					...json,
					name: name.trim(),
					author: author.trim()
				}
				pkgs.forEach(pkg=>{
					if (!choices.has(pkg.name)){
						pkg.deps.forEach(dep=>{
							delete json.dependencies[dep]
						})
					}
				})
				const pkgPath = path.join(process.cwd(), 'package.json')
				fs.writeFile(pkgPath, new Buffer.from(JSON.stringify(json,null, '\t')), ()=>{
					green('创建文件:' + pkgPath)
					resolve()
				})
			})
	})
}

function setConfig(configPath){
	return new Promise(resolve=>{
			fs.readFile(path.join(configPath, 'tsconfig.json'), (err, data)=>{
					if (err) throw err
					let json = data.toString()
					const tsPath = path.join(process.cwd(), 'tsconfig.json')
					fs.writeFile(tsPath, new Buffer.from(json), ()=>{
						green('创建文件:'+tsPath)
						resolve()
					})
			})
	})
}

function modifyFile(newSourcePath, newCurrentPath){
     fs.readFile(newSourcePath, (err,data)=>{
        if (err) throw err
        let json = data.toString()
        json = json.replace(/app.scss/g, 'app.less')
        json = json.replace(/default.scss/g, 'default.less')
        fs.writeFile(newCurrentPath, new Buffer.from(json), ()=>{
            green('创建文件:'+newCurrentPath)
        })
     })
}
