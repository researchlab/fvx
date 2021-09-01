const create = [
	{
		name:'conf',
		type:'confirm',
		message:'是否创建新的项目?'
	},
	{
		name:'name',
		message:'请输入项目名称?',
		when:res=>Boolean(res.conf)
	},
	{
		name:'author',
		message:'请输入作者?',
		when:res=>Boolean(res.conf)
	},
	{
		type:'checkbox',
		message:'请选择公共管理状态?',
		name:'state',
		choices:[
			{
				name: 'no need',
				checked: true
			},
			{
				name: 'mobx'
			},
			{
				name: 'redux'
			}
		],
		when: res=>Boolean(res.conf)
	},
	{
		type:'checkbox',
		message:'请选择相应的模块?',
		name:'module',
		choices:[
			{
				name: 'sass-loader',
				checked: true
			},
			{
				name: 'less-loader'
			},
			{
				name: 'typescript'
			},
			{
				name: 'image(url-loader,file-loader)'
			}
		],
		when: res=>Boolean(res.conf)
	}
]

module.exports ={
	create
}
