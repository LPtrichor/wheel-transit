// pages/test/test.js
import http from '../../utils/http'

Page({
    /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl:'',
      nickName: '',
    },
    hasUserInfo: false,
  },
  async handler(){
    const code = '123';
    // 构建请求参数对象
    const data = {
        code: code
    };
    // 使用POST方法发送请求
    const res = await http.post(`/user/login`, data);
    
    // const res = await http.get(`/shop/status`)
    console.log(res)
  },

  getUserProfile(){
    // wx.login({
    //   success: (res) => {
    //     console.log('登录成功：' + res)
    //   },
    // })
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})