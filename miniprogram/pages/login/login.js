// pages/login/login.js
// Page({})

// pages/login/login.js

// 导入封装通用模块方法
import { toast } from '../../utils/extendApi'
// 导入本地存储 api
import { setStorage } from '../../utils/storage'
// 导入接口 API 函数
import { reqLogin, reqUserInfo } from '../../api/user'

// 导入 ComponentWithStore 方法
import { ComponentWithStore } from 'mobx-miniprogram-bindings'
// 导入 store 对象
import { userStore } from '../../stores/userstore'

// 导入防抖函数
import { debounce } from 'miniprogram-licia'

// 导入 HTTP 工具函数
import http from '../../utils/http'

// 使用 ComponentWithStore 方法替换 Component 方法构造页面
ComponentWithStore({
  // 让页面和 Store 对象建立关联
  storeBindings: {
    store: userStore,
    fields: ['token', 'userInfo'],
    actions: ['setToken', 'setUserInfo']
  },

  /**
   * 页面的初始数据
   */
  data: {
    loading: false
  },

  methods: {
    // 授权登录
    async handleLogin() {
      try {
        this.setData({
          loading: true
        });

        // 调用模拟登录接口
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
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
          
          // 返回上一页
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('登录失败', error);
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      } finally {
        this.setData({
          loading: false
        });
      }
    },

    // 获取用户信息
    async getUserInfo() {
      // wx.getUserProfile({
      //   desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      //   success: (res) => {
      //     console.log(res)
      //   }
      // })

      // 调用接口，获取用户信息
      const { data } = await reqUserInfo()

      // 将用户信息存储到本地
      setStorage('userInfo', data)

      // 将用户信息存储到 Store 对象
      this.setUserInfo(data)
    }
  }
})

