// orders.js
import {reqGetOrders} from '@/api/order'

Page({
  data: {
    currentOrder: {},  // 当前订单
    historyOrders: []  // 历史订单数组
  },
  onShow: function () {
    this.fetchOrders();
  },

  async fetchOrders() {
    try {
      const page = 1;       // 第一页
      const pageSize = 10;  // 每页10条记录
      const res = await reqGetOrders(page, pageSize);
      console.log(res)
      if (res.code === 1) {
        const orders = res.data.records;
        this.setData({
          currentOrder: orders[0], // 假设最新的订单是当前订单
          historyOrders: orders.slice(1) // 其余的是历史订单
        });
      } else {
        wx.showToast({
          title: '获取订单失败',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    }
  }
  
});
