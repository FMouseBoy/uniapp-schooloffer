'use strict';
const db = uniCloud.database()
const _ = db.command
exports.main = async (event, context) => {
  //event为客户端上传的参数
	const collection = db.collection('data') // 获取表'data'的集合对象
	// 区分组合查询和单独查询
	if (event.otherValue) {
		const res = await collection
			.where(_.or(
				{
					post: new RegExp('.*'+event.post+'.*','i'),
					location: new RegExp('.*'+event.otherValue+'.*','i')
				},
				{
					post: new RegExp('.*'+event.post+'.*','i'),
					company: new RegExp('.*'+event.otherValue+'.*','i')
				},
				{
					post: new RegExp('.*'+event.post+'.*','i'),
					education: new RegExp('.*'+event.otherValue+'.*','i')
				}
			))
			.get() // 获取表中的数据，结果为json格式
		return res
	} else {
		const res = await collection
			.where(_.or(
				{
					location: new RegExp('.*'+event.post+'.*','i')
				},
				{
					company: new RegExp('.*'+event.post+'.*','i')
				},
				{
					post: new RegExp('.*'+event.post+'.*','i')
				},
				{
					education: new RegExp('.*'+event.post+'.*','i')
				}
			))
			.get() // 获取表中的数据，结果为json格式
		return res
	}
};
