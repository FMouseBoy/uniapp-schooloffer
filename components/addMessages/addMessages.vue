<template>
	<view v-show="isShow" class="container" @click="addMessage">
		<view class="head">
			
		</view>
		<view class="content">
			<view class="add-modal">
				<image class="add-icon" src="../../static/index/add.png" mode=""></image>
			</view>
		</view>
		<view class="footer">
			
		</view>
	</view>
</template>

<script>
	import util from '../../pages/util/util.js'
	export default {
		data() {
			return {
				isShow : false
			};
		},
		created() {
			this.getData()
		},
		methods:{
			getData: async function(){
				const { data } = await util.request({},'isShowADD')
				this.isShow = data[0].isShow
			},
			addMessage() {
				uni.navigateTo({
					url: '/pages/addMessage/addMessage'
				})
			}
		}
	}
</script>

<style>
	.add-icon {
		width: 80rpx;
		height: 80rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
</style>
