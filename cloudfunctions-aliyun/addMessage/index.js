'use strict';
const db = uniCloud.database()
const _ = db.command
exports.main = async (event, context) => {
  //event为客户端上传的参数
	const collection = db.collection('data') // 获取表'data'的集合对象
	const res = await collection
		.add({
			comment: event.comment,
			company: event.company,
			description: event.description,
			education: event.education,
			level: event.level,
			location: event.location,
			post: event.post,
			reliability:event.reliability,
			salary: event.salary,
			date: event.date
		})
};
