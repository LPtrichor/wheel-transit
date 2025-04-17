// pages/info/info.js

import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '../../stores/userstore'
import http from '../../utils/http'
import { setStorage } from '../../utils/storage'

ComponentWithStore({
  // 页面的初始数据
  data: {
    // 初始化第二个面板数据
    initpanel: [
      {
        url: '/modules/orderPayModule/pages/order/list/list',
        title: '商品订单',
        iconfont: 'icon-dingdan'
      },
      {
        url: '/modules/orderPayModule/pages/order/list/list',
        title: '礼品卡订单',
        iconfont: 'icon-lipinka'
      },
      {
        url: '/modules/orderPayModule/pages/order/list/list',
        title: '退款/售后',
        iconfont: 'icon-tuikuan'
      }
    ],
    token: '', // 令牌
    userInfo: {}, // 用户信息
  },

  storeBindings: {
    store: userStore,
    fields: ['token', 'userInfo']
  },

  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
      // 获取 store 中的数据
      this.setData({
        token: userStore.token,
        userInfo: userStore.userInfo
      });
      
      // 如果没有登录，尝试获取用户信息
      if (!this.data.token) {
        this.checkLoginStatus();
      }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      // 获取 store 中的数据
      this.setData({
        token: userStore.token,
        userInfo: userStore.userInfo
      });
    },

    /**
     * 检查登录状态
     */
    async checkLoginStatus() {
      try {
        // 如果已有 token，尝试获取用户信息
        if (userStore.token) {
          const res = await http.get('user/getUserInfo');
          if (res.code === 1) {
            // 更新用户信息
            userStore.setUserInfo(res.data);
            this.setData({
              userInfo: res.data
            });
          }
        }
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    },

    // 跳转到登录页面
    toLoginPage() {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    },

    /**
     * 使用模拟数据直接登录（仅用于开发测试）
     */
    async mockLogin() {
      try {
        const res = await http.post('user/login', {
          code: 'mock_code'
        });
        
        if (res.code === 1) {
          // 保存 token 到本地和 store
          setStorage('token', res.data.token);
          userStore.setToken(res.data.token);
          
          // 保存用户信息到本地和 store
          setStorage('userInfo', res.data.userInfo);
          userStore.setUserInfo(res.data.userInfo);
          
          // 更新页面数据
          this.setData({
            token: res.data.token,
            userInfo: res.data.userInfo
          });
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        }
      } catch (error) {
        console.error('模拟登录失败', error);
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    }
  }
})
