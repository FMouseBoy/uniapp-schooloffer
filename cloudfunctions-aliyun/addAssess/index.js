'use strict';
const db = uniCloud.database()
const _ = db.command
exports.main = async (event, context) => {
  //event为客户端上传的参数
	const collection = db.collection('data') // 获取表'data'的集合对象
	const res = await collection
		.doc(event._id)    //  制定_id的集合
		.update({
			reliability: _.push(event.value)
		}) 
};
