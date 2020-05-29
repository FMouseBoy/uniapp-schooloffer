<template>
	<view class="container">
		<view class="head">
			<uni-nav-bar  color="grey" status-bar="true"  title="校招offer"></uni-nav-bar>
		</view>
		<view class="content">
			<uni-search-bar :radius="100" cancelText="" cancelButton="none" bgColor="#fff" placeholder="请输入职位/公司/地点/学历" @confirm="search"></uni-search-bar>
			<view class="search-result">
				<uni-card v-for="(item, index) in pageData.initData" :title="item.company"  :extra="`${item.post} / ${item.location}`" note="可信度"  :isShadow="true" @click="getDetail(item._id)">
					<view class="offer-salary">
						<view class="offer-money">
							{{item.salary}}
						</view>
						<view class="offer-education">
							{{item.education}} / {{item.level}}
						</view>
					</view>
					<view slot="footer" class="slot-footer">
						<view class="slot-message">
							可信度
						</view>
						<view class="slot-icon">
							<uni-rate disabled="true" size=12 :value="rate(item.reliability)"></uni-rate>
						</view>
						
					</view>
				</uni-card>
				<view v-if="showToast" class="tips">
					没有查到你想要的数据哦~组合查询：职位+公司/地点/学历,例如：算法+京东/Java+北京/安卓+硕士
				</view>
			</view>
		</view>
		<view class="footer">
			<view v-if="showToast" class="add-modal">
				<add-messages></add-messages>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../util/util.js'
	import addMessages from '@/components/addMessages/addMessages.vue';
	export default {
		data() {
			return {
				pageData: {
					initData: []
				},
				userName: '',
				showToast: false
			}
		},
		components:{
			addMessages
		},
		onLoad() {
			this.init()
		},
		onShow() {
			
		},
		onShareAppMessage(){
			return {
				title: '校招offer知多少,就上校招offer',
				path: '/pages/index/index'
			}
		},
		created() {
			
		},
		computed:{
			rate: function() {
				return function(arr){
					let sum = 0
					sum = arr.reduce((total,current,index,arr) => {
						return total + current
					})
					return (sum/arr.length)*5
				}
			}
		},
		methods: {
			init(){
				this.getData()
				try{
					const data = uni.getStorageSync('userName');
					if(data && data.userName){
						this.userName = data.userName
					} else {
						const name = this.randomName()
						uni.setStorage({
						    key: 'userName',
						    data: {"userName":name},
						    success: function () {
						        console.log('userName success');
						    }
						});
						this.userName = name
					}
				}catch(e){
					console.log(e)
				}
			},
			randomName(){
			 return	util.randomName([true,false][Math.floor(Math.random()*2)])
			},
			getData: async function() {
				const { data } = await util.request({},'getData')
				this.pageData = {
					...this.pageData,
					initData : data
				}
				this.showToast = false
			},
			search: async function(e) {
				let arr = []
			 	arr = e.value.split('+')
				if(e.value){
					if(arr.length === 1){
						const { data } = await util.request({post : arr[0].trim()},'searchData')
						if (data.length === 0) {
							this.showToast = true
							uni.showToast({
								title: '不好意思~暂未收录，赶紧去爆料吧',
								icon: 'none',
								duration: 2000
							})
						} else {
							this.showToast = false
						}
						this.pageData = {
							...this.pageData,
							initData : data
						}
					} else if (arr.length === 2) {
						const { data } = await util.request({post : arr[0].trim(),otherValue : arr[1].trim()},'searchData')
						if (data.length === 0) {
							this.showToast = true
							uni.showToast({
								title: '不好意思~暂未收录，赶紧去爆料吧',
								icon: 'none',
								duration: 2000
							})
						} else {
							this.showToast = false
						}
						this.pageData = {
							...this.pageData,
							initData : data
						}
					} else {
						uni.showToast({
							title: '请输入正确组合查询格式',
							icon: 'none'
						})
					}
				} else {
					this.getData()
					uni.showToast({
						title: '没有查询内容，已为您展示默认数据',
						icon: 'none'
					})
				}	
			},
			getDetail(_id) {
				uni.navigateTo({
					url: '/pages/detail/detail?_id='+_id+'&&userName='+this.userName
				})
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content:center;
	}
	.content {
		margin-top: 20upx;
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
	.tips {
		color: rgba(0,0,0,0.2);
		font-size: 28rpx;
		padding: 0 40rpx;
	}
	.footer {
		position: fixed;
		bottom: 20rpx;
		left: 50%;
		transform: translateX(-50%) ;
	}
	add.add-modal {
		
	}
</style>
