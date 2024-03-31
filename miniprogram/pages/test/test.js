// pages/test/test.js
import http from '../../utils/http'
import {
  reqSumbitOrder
} from '@/api/order'

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
    console.log('订单信息:', this.data); // 在控制台打印订单信息，用于调试
    const params = {
      ...this.data
    }
    // 将外层调用包装在一个异步自执行函数中
    const res = await new Promise((resolve, reject) => {
      wx.showModal({
        title: '订单提交确认',
        content: '确定提交订单？',
        success: resolve,
        fail: reject
      });
    });

    // 根据用户的选择处理结果
    if (res.cancel) {
      wx.showToast({
        title: '已取消订单', // 提示内容
        icon: 'success', // 图标
        duration: 1000 // 提示持续时间
      });
    } else if (res.confirm) {
      // const orderResult = await reqSumbitOrder(params);
      // console.log(orderResult);
      try {
        console.log("准备跳转到tabbar页面");
        wx.switchTab({
          url: '/pages/history/history',
          success: function() {
            console.log("成功跳转到tabbar页面");
          },
          fail: function(err) {
            console.log("跳转到tabbar页面失败", err);
          }
        });
      } catch (error) {
        console.error("尝试跳转到tabbar页面时捕获到异常", error);
      }
      
      // try {
      //   console.log("准备跳转页面");
      //   wx.navigateTo({
      //     url: '/pages/history/history',
      //     success: function() {
      //       console.log("页面跳转成功");
      //     },
      //     fail: function(err) {
      //       console.log("页面跳转失败", err);
      //       // 根据错误信息进一步调试和解决问题
      //       // 可能的错误原因包括页面路径错误、页面栈深度限制等
      //     }
      //   });
      // } catch (error) {
      //   console.error("跳转页面时捕获到异常", error);
      //   // 这里可以根据异常信息进一步分析问题
      //   // 异常可能由wx.navigateTo调用本身或其他问题引起
      // }
      
      wx.showToast({
        title: '订单已提交', // 提示内容
        icon: 'success', // 图标
        duration: 2000 // 提示持续时间
      });}
    // wx.showModal({
    //   title: '订单提交确认',
    //   content: '确定提交订单？',
    //   complete: (res) => {
    //     if (res.cancel) {
    //       wx.showToast({
    //         title: '已取消订单', // 提示内容
    //         icon: 'success', // 图标
    //         duration: 1000 // 提示持续时间
    //       });         
    //     }
    
    //     if (res.confirm) {
    //       wx.showToast({
    //         title: '订单已提交', // 提示内容
    //         icon: 'success', // 图标
    //         duration: 2000 // 提示持续时间
    //       });  
    //     }
    //   }
    // })
    // const code = '123';
    // // 构建请求参数对象
    // const data = {
    //     code: code
    // };
    // // 使用POST方法发送请求
    // const res = await http.post(`/user/login`, data);
    
    // // const res = await http.get(`/shop/status`)
    // console.log(res)
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