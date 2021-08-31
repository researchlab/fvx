#!/usr/bin/env node
'use strict';

const program = require('commander')
const create = require('../src/create')
const start = require('../src/start')
const inquirer = require('../src/inquirer')
const utils = require('../utils/index')

const { green, yellow, blue } = utils 

program.version('1.0.0')

program
	.command('create')
	.description('create a project')
	.action(function(){
		green('欢迎使用aox, 灵活构建react项目~🎉🎉🎉')
		inquirer.create().then(res=>{
				if(res.conf){
						create(res)
				}
		})
	})

program.parse(process.argv)
