<template>
	<view class="container">
		<view class="head">
			<uni-nav-bar @clickLeft="goHome" left-icon="home"  color="grey" status-bar="true"  title="我来爆料"></uni-nav-bar>
		</view>
		<view class="content">
			
			<view class='line'>
			  <view class='lineLeft'>公司</view>
			  <view class="lineRight">  
					<input class="input" @input="change" :value="pageData.company" data-type="company"  placeholder-class="plaClass" placeholder='请输入公司名称'></input>
				</view>
			</view>
			
			<view class='line'>
			  <view class='lineLeft'>职位</view>
			  <view class="lineRight">  
					<input class="input" @input="change" :value="pageData.post" data-type="post"  placeholder-class="plaClass" placeholder='请输入职位名称'></input>
				</view>
			</view>
			
			<view class='line'>
			  <view class='lineLeft'>学历</view>
				<view class="lineRight">  
				<picker class="picker-list" @change="change" mode="selector" data-type="education" :value="pageData.education" :range="educationList">
				    <view class="picker">
				      {{pageData.education}}
				    </view>
				  </picker>
				  <view class="tips tri"></view>
				</view>
			</view>
			
			<view class='line'>
			  <view class='lineLeft'>学校</view>
				<view class="lineRight">  
				<picker class="picker-list" @change="change" mode="selector" data-type="level" :value="pageData.level" :range="levelList">
				    <view class="picker">
				      {{pageData.level}}
				    </view>
				  </picker>
				  <view class="tips tri"></view>
				</view>
			</view>
			
			<view class='line'>
			  <view class='lineLeft'>地点</view>
			  <view class="lineRight">  
					<input class="input" @input="change" :value="pageData.location" data-type="location"  placeholder-class="plaClass" placeholder='请输入工作地点'></input>
				</view>
			</view>
			
			<view class='line'>
			  <view class='lineLeft'>工资</view>
			  <view class="lineRight">  
					<input class="input" @input="change" :value="pageData.salary" data-type="salary"  placeholder-class="plaClass" placeholder='请输入薪资,如20K/16*16'></input>
				</view>
			</view>
			
			<view class='line'>
			  <view class='lineLeft'>备注</view>
			  <view class="lineRight">  
					<input class="input" @input="change" :value="pageData.description" data-type="description"  placeholder-class="plaClass" placeholder='请输入备注信息'></input>
					<view class="tips">选填</view>
				</view>
			</view>
			
		</view>
		<view class="footer">
			<view class="buttonBox" @click="submit">
				提交
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../util/util.js'
	export default {
		data() {
			return {
				pageData : {
					company: '',
					post: '',
					education: '请输入学历',
					level: '985/211/普通',
					location: '',
					salary: '',
					description: ''
				},
				educationList: ['博士海归','硕士海归','本科海归','博士','硕士','本科','专科',],
				levelList: ['海外高校','985','211','普通']
			}
		},
		methods: {
			init() {
				
			},
			goHome() {
				uni.navigateTo({
					url : '/pages/index/index',
					success() {
						// let page = getCurrentPages()
						// console.log(page[0].onLoad())
					}
				})
			},
			change(e){
				let type = e.target.dataset.type
				let value = e.detail.value
				switch(type) {
					case 'company':
						this.pageData.company = value
						break
					case 'post':
						this.pageData.post = value
						break
					case 'education':
						this.pageData.education = this.educationList[value]
						break
					case 'level':
						this.pageData.level = this.levelList[value]
						break
					case 'location':
						this.pageData.location = value
						break
					case 'salary':
						this.pageData.salary = value
						break
					case 'description':
						this.pageData.description = value
						break
				}
				console.log('FMouse',this.pageData)
			},
			legalData() {
				for(let key in this.pageData){
					if (!this.pageData[key] && key !== 'description') {
						return false
					}
				}
				return true
			},
			submit() {
				let that = this
				let date = util.myformatter(new Date())
				if (that.legalData()) {
					const {data} = util.request({...that.pageData,comment:[],reliability:[1,0],date:date},'addMessage')
					setTimeout(function(){
						uni.showToast({
							title:'提交成功~感谢您的支持',
							icon: 'success'
						})
						that.pageData = {
							company: '',
							post: '',
							education: '请输入学历',
							level: '985/211/普通',
							location: '',
							salary: '',
							description: ''
						}
					},500)
				} else {
					uni.showToast({
						title: '请输入完整数据哦~',
						icon: 'none'
					})
				}
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
	.plaClass{
		color: #dbdbdb;
		font-size: 36rpx;
	}
	.line {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		margin: 0 20rpx;
		margin-top: 30rpx;
		border-bottom: 1px solid #f5f5f5;
	}
	.lineLeft{
	  display: flex;
	  align-items: center;
	  height: 100%;
		width: 200rpx;
		font-size: 36rpx;
	  color: rgba(0,0,0,0.7);
	}
	.lineRight{
		flex: 1;
	  height: 100%;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  position: relative;
	}
	.input{
		padding-right: 20rpx;
		height: 100%;
		flex: 1;
		text-align: left;
		font-size: 36rpx;
		color: #545151;
	}
	.picker{
		height: 100%;
		justify-content: flex-start;
	  display: flex;
	  align-content: center;
	  width: 500rpx;
		font-size: 36rpx;
	}
	.picker-list {
		font-size: 36rpx;
		color: #545151;
	}
	.tri{
		width:0;
		height:0;
		border-left:8rpx solid transparent;
		border-right:8rpx solid transparent;
		right: 30rpx !important;
		border-top:16rpx solid #545151;
	}
	.tips{
	  color: #9a9a9c;
	  font-weight: bold;
	}
	.buttonBox{
		width: 91%;
		margin: 0 auto;
		height: 84rpx;
		border-radius: 84rpx;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 100rpx;
		left: 0;
		right: 0;
		background-color: #4a8be9;
	}
</style>
