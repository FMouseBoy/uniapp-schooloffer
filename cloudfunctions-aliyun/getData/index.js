'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  //event为客户端上传的参数
	const collection = db.collection('data') // 获取表'data'的集合对象
	const res = await collection
		.get() // 获取表中的数据，结果为json格式
  //返回数据给客户端
  return res
};
