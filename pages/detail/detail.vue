<template>
	<view id="moments">
		
		<view class="home-pic">
			<view class="home-pic-base">
				
			</view>
		</view>
		
		
		
		<view class="moments__post">
		
			<view class="post_right">
				<view class="paragraph">{{messages.description}}</view>
				<!-- 详情 -->
				
				<view class="search-result">
					<uni-card  :title="messages.company"  :extra="`${messages.post} / ${messages.location}`" note="可信度"  :isShadow="true">
						<view class="offer-salary">
							<view class="offer-money">
								{{messages.salary}}
							</view>
							<view class="offer-education">
								{{messages.education}} / {{messages.level}}
							</view>
						</view>
						<view slot="footer" class="slot-footer">
							<view class="slot-message">
								可信度
							</view>
							<view class="slot-icon">
								<uni-rate disabled="true" size=12 :value="rate"></uni-rate>
							</view>
							
						</view>
					</uni-card>
				</view>
				
				
				<!-- 时间 -->
				<view class="toolbar">
					<view class="timestamp">{{messages.date}}</view>
					<view class="comment" @tap="comment()">
						<image src="../../static/index/comment.png"></image>
					</view>
				</view>
				<!-- 评论区 -->
				<view class="post-footer">
					<view v-for="(item,index) in comments" class="footer_content">
						<text class="comment-nickname">
							{{item.name}}:
							<text class="comment-content">{{item.value}}</text>
						</text>
					</view>
					<!-- 添加的评论 -->
					<view v-if="newComments&&newComments.length>0" v-for="(item,index) in newComments" class="footer_content">
						<text class="comment-nickname">
							{{newName}}:
							<text class="comment-content">{{item}}</text>
						</text>
					</view>
					<!-- 添加的评论 -->	
				</view>
			</view>
			<!-- 结束 -->
		</view>
		
		
		
		<view class="believe-modal">
			
			<view class="believe" data-type="stateA" @click="choose">
				<view>
					<image style="width: 60rpx;height: 60rpx;" class="believe-icon" :src="`../../static/index/${stateA===0?'islike':'like'}.png`"></image>
				</view>
				<view class="believe-value">
					可信
				</view>
			</view>
			
			<view class="unbelieve" data-type="stateB" @click="choose">
				<view class="switch-roate">
					<image style="width: 60rpx;height: 60rpx;" class="believe-icon" :src="`../../static/index/${stateB===0?'islike':'like'}.png`"></image>
				</view>
				<view class="believe-value">
					不可信
				</view>
			</view>
			
		</view>
		
		<view class="foot" v-if="showInput">
			<!-- <chat-input @send-message="send_comment" @blur="blur" :focus="focus" :placeholder="input_placeholder"></chat-input> -->
			<ygc-comment :placeholder="placeholder" :focus="focus" @send-message="addInput" @blur="blur"></ygc-comment>
		</view>
		
		
		<view class="add-modal">
			<add-messages></add-messages>
		</view>
	</view>
</template>

<script>
	import util from '../util/util.js'
	import ygcComment from '@/components/ygc-comment/ygc-comment.vue';
	import addMessages from '@/components/addMessages/addMessages.vue';
	
	export default {
		data() {
			return {
				_id: '',
				uername: '赵子龙',
				showInput: false,
				messages: {},
				comments: [],
				rateData: [0,0],
				newName: '',
				newComments: [],
				focus: false,
				placeholder: '评论',
				stateB: 0,
				stateA: 0
			}
		},
		components: {
			ygcComment,
			addMessages
		},
		onLoad(options) {
			this._id = options._id
			this.newName = options.userName
			// try{
			// 	const data = uni.getStorageSync(this._id);
			// 	if(data && data.userName){
			// 		this.newName = data.userName
			// 	} else {
			// 		uni.setStorage({
			// 		    key: this._id,
			// 		    data: {...data,"userName":options.userName},
			// 		    success: function () {
			// 		        console.log('userName success');
			// 		    }
			// 		});
			// 		this.newName = options.userName
			// 	}
			// }catch(e){
			// 	console.log(e)
			// }
			this.init()
		},
		created() {
			// this.init()
		},
		mounted() {
			
		},
		computed:{
			rate() {
				let sum = 0
				for(let i=0;i<this.rateData.length;i++) {
					sum = sum + this.rateData[i]
				}
				return (sum/this.rateData.length)*5
			}
		},
		watch:{
			// rate(val){
			// 	console.log('FMouse')
			// 	this.rateVal = val
			// 	console.log('111',this.rateVal)
			// }
		},
		methods:{
			init() {
				this.getData()
				try {
				    const data = uni.getStorageSync(this._id);
				    if (data && data.stateA) {
							this.stateA = data.stateA
				    }
						if(data && data.stateB) {
							this.stateB = data.stateB
						}
				} catch (e) {
				    console.log('没有找到对应的key')
				}
			},
			getData: async function() {
				const { data } = await util.request({_id: this._id},'getDetail')
				this.messages = data[0]
				this.rateData = data[0].reliability
				this.comments = data[0].comment
			},
			comment() {
				this.showInput = true //调起input框
				this.focus = true	
			},
			addInput: async function(e) {
				// let inputVal = '新添加的'
				this.newComments.push(e.content)
				this.showInput = false
				// 向数据库中添加评论
				const data  = util.request({_id: this._id,name: this.newName,value: e.content},'addComment')
				console.log('FMouse',e.content)
			},
			blur(){
				this.showInput = false
			},
			choose(e) {
				let type = e.currentTarget.dataset.type
				if (this.stateA === 1 || this.stateB === 1) {
					uni.showToast({
						title : '您已评价哦~'
					})
					return
				}
				if (type === "stateA") {
					this.stateA = 1
					const data  = util.request({_id: this._id,value: 1},'addAssess')
					// 存储状态
					uni.setStorage({
					    key: this._id,
					    data: {"stateA":this.stateA},
					    success: function () {
					        console.log('success');
					    }
					});
					return
				}
				if (type === "stateB") {
					this.stateB = 1
					const data  = util.request({_id: this._id,value: 0},'addAssess')
					// 存储状态
					uni.setStorage({
					    key: this._id,
					    data: {"stateB":this.stateB},
					    success: function () {
					        console.log('success');
					    }
					});
					return	
				}
			}
		}
	}
</script>
<style>
.liked{
	/* display: inline-block; */
	position: relative;
	margin-right: 10upx;
	width: 34upx;
	height: 34upx;
}
.post-username{
	font-size:32upx;
	font-weight: 600;
	color: #36648B;
}
.gallery_img {
	width: 100%;
	height: 100%
}

.header {
	width: 100%;
	height: 100%;
	z-index: 10;
	border-radius: 40upx;
}

.publish {
	position: absolute;
	top: 20upx;
	right: 20upx;

	/* z-index: 9999; */
}
.post_header {
	width: 90upx !important;
	height: 90upx !important;
	border-radius: 10upx;
	margin-top: 8upx;
}
#moments {
	background: #fff;
}

#moments .home-pic {
	display: flex;
	justify-content: center;
}

#moments .home-pic-base {
	width: 250px;
	/* margin-top: -150upx; */
	position: relative;
	height: 250px;
	z-index: 5;
	background: url(data:image/png;base64,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);
	background-size: 100% 100%;
	background-repeat: no-repeat;
	margin-top:100upx;
}

#moments .home-pic-base .top-pic {
	width: 360upx;
	height: 360upx;
	
	border-radius: 40upx;
	-webkit-transform: scale(0.5);
	-ms-transform: scale(0.5);
	transform: scale(0.5);
	-webkit-transform-origin: 100% 0%;
	-ms-transform-origin: 100% 0%;
	transform-origin: 100% 0%;
	background-color: #ffffff;
	float: right
}

#moments .home-pic-base .top-name {
	position: absolute;
	/* left: 20px; */
	right: 240upx;
	top: 30upx;
	font-size: 32upx;
	font-weight: 600;
	text-align: right;
	color: #ffffff;
	overflow: hidden
}

#moments .moments__post {
	background: #fff;
	display: block;
	/* border-bottom: 1px solid #f2eeee; */
	padding: 30upx 20upx;
	position: relative;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
}

#moments .moments__post::before {
	content: none
}

#moments .moments__post .post_right {
	font-size: 32rpx;
	display: table-cell;
	width: 100%;
}
#moments .moments__post .title {
	color: #094dcc
}

#moments .moments__post .thumbnails {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	/* display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox; */
	/* -webkit-flex-wrap: wrap;
	-ms-flex-wrap: wrap; */
}

#moments .moments__post .thumbnails .thumbnail {
	width: 30%;
	height: 180upx;
	margin: 4upx;
	background: #757575;
	overflow: hidden;
}

.my-gallery{
	width: 250upx;
	height: 400upx;
	margin: 4upx;
	background: #757575;
	overflow: hidden
}

#moments .moments__post .toolbar {
	position: relative;
	top: 10upx;
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-webkit-align-items: center;
	-ms-flex-align: center;
	align-items: center
}

#moments .moments__post .toolbar .timestamp {
	color: #757575;
	font-size: 22upx;
}


#moments .moments__post .like {
	width: auto;
	height: auto;
	position: absolute;
	right: 60upx;
	display: flex;
	align-items: center;
}
#moments .moments__post .comment {
	width: auto;
	height: auto;
	position: absolute;
	right: 0upx;
	display: flex;
	align-items: center;
}

#moments .moments__post .toolbar image{
	padding-left: 20upx;
	width: 40upx;
	height: 40upx;
}

.post-footer{
	margin-top: 30upx;
	background-color: #f3f3f5;
	width: 100%;
}

#moments .moments__post .footer_content {
	padding-left: 10upx;
	position: relative;
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-webkit-align-items: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-flex-wrap: wrap;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	padding-top: 20rpx;
	padding-bottom: 20rpx;
}

#moments .moments__post .footer_content .nickname {
	color: #36648B;
	font-size: 24upx
}

#moments .moments__post .footer_content .comment-nickname {
	color: #36648B;
	font-size: 24upx
}

#moments .moments__post .footer_content .comment-content {
	color: #000000;
	font-size: 24upx
}

.foot {
	position: fixed;
	width: 100%;
	/* height: 90upx; */
	min-height: 90upx;
	left: 0upx;
	bottom: 0upx;
	overflow: hidden;
}

.search-result {
		margin-top: 20upx;
	}
	.offer-salary {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
	}
	.slot-footer {
		position: relative;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: rgba(0,0,0,0.7);
	}
	.slot-message {
		position: relative;
	}
	.slot-icon {
		position: absolute;
		top: 50%;
		/* left: 100rpx; */
		right: 0;
	}
	.paragraph {
		color: rgba(0,0,0,0.7);
	}
	.believe-modal {
		display: flex;
		justify-content: space-around;
		margin-top: 100rpx;
		font-size: 28rpx;
		padding: 0 30rpx;
		color: rgba(0,0,0,0.7);
		margin-bottom: 200rpx;
	}
	.believe {
		width: 100rpx;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.believe-icon {
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
	.unbelieve {
		width: 100rpx;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}
	.switch-roate {
		transform:rotate(180deg);
	}
	.add-modal {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;
	}
</style>
