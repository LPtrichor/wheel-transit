// 导入 HTTP 工具函数
import http from '../../utils/http';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    banners: [], // 轮播图数据
    serviceEntries: [] // 服务入口数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchHomeData();
  },

  /**
   * 获取首页数据
   */
  async fetchHomeData() {
    try {
      wx.showLoading({
        title: '加载中...'
      });

      // 获取首页数据
      const res = await http.get('home/getHomeData');
      
      if (res.code === 1) {
        this.setData({
          banners: res.data.banners,
          serviceEntries: res.data.serviceEntries
        });
      }

      wx.hideLoading();
    } catch (error) {
      console.error('获取首页数据失败', error);
      wx.hideLoading();
    }
  },

  /**
   * 跳转到服务页面
   */
  goToService(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({
      url
    });
  },

  onShareTimeline: function() {
    return {
      title: '宏敏物流',
      imageUrl: 'https://wheel-transit.oss-cn-beijing.aliyuncs.com/index/cover_image.jpg'  // 例如：封面图，可选
    };
  },
  onShareAppMessage: function (options) {
    // 设置分享内容
    return {
      title: '宏敏物流',
      imageUrl: 'https://wheel-transit.oss-cn-beijing.aliyuncs.com/index/cover_image.jpg', // 可选
      path: '/pages/index/index' // 被分享的页面路径
    };
  },
  // onShow: function() {
  //   wx.showModal({
  //     title: '提示',
  //     content: '无法获取您的个人信息，请授权使用！',
  //     showCancel: false,
  //     success: (modalRes) => { // 使用箭头函数
  //       if (modalRes.confirm) {
  //         this.getUserProfile();
  //       }
  //     }
  //   });
  // },
  // getUserProfile: function() {
  //   wx.getUserProfile({
  //     desc: '展示用户信息',
  //     success: (res) => {
  //       console.log(res.userInfo);
  //     },
  //     fail: () => {
  //       // 用户拒绝授权的处理逻辑
  //     }
  //   });
  // }
});