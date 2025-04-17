// orders.js
import http from '../../utils/http';
import mockData from '../../utils/mockData';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentOrder: {}, // 当前订单
    historyOrders: [], // 历史订单
    filteredOrders: [], // 筛选后的历史订单
    orderStatus: mockData.statusMapping.orderStatus, // 订单状态映射
    payStatus: mockData.statusMapping.payStatus, // 支付状态映射
    currentStatus: 'all' // 当前筛选状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchOrders();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.fetchOrders();
  },

  /**
   * 获取订单数据
   */
  async fetchOrders() {
    try {
      wx.showLoading({
        title: '加载中...'
      });

      // 获取当前订单
      const currentOrderRes = await http.get('order/getCurrentOrder');
      if (currentOrderRes.code === 1) {
        this.setData({
          currentOrder: currentOrderRes.data
        });
      }

      // 获取历史订单
      const historyOrdersRes = await http.get('order/getHistoryOrders');
      if (historyOrdersRes.code === 1) {
        this.setData({
          historyOrders: historyOrdersRes.data,
          filteredOrders: historyOrdersRes.data // 初始化筛选后的订单列表
        });
      }

      wx.hideLoading();
      
      // 应用当前筛选状态
      this.applyStatusFilter(this.data.currentStatus);
    } catch (error) {
      console.error('获取订单失败', error);
      wx.hideLoading();
      wx.showToast({
        title: '获取订单失败',
        icon: 'none'
      });
    }
  },

  /**
   * 支付订单
   */
  async pay() {
    try {
      const { currentOrder } = this.data;
      
      wx.showLoading({
        title: '支付中...'
      });

      // 提示用户确认支付
      const res = await new Promise((resolve, reject) => {
        wx.showModal({
          title: '确认支付',
          content: `确定支付¥${currentOrder.amount}吗？`,
          success: resolve,
          fail: reject
        });
      });
      
      if (res.cancel) {
        wx.hideLoading();
        return;
      }

      // 调用支付接口
      const payRes = await http.post('order/payOrder', { orderId: currentOrder.id });
      
      if (payRes.code === 1) {
        // 支付成功，更新订单状态
        this.setData({
          'currentOrder.payStatus': 1,
          'currentOrder.status': 2
        });
        
        wx.showToast({
          title: '支付成功',
          icon: 'success'
        });
        
        // 刷新订单列表
        setTimeout(() => {
          this.fetchOrders();
        }, 1500);
      } else {
        wx.showToast({
          title: '支付失败',
          icon: 'none'
        });
      }
      
      wx.hideLoading();
    } catch (error) {
      console.error('支付失败', error);
      wx.hideLoading();
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      });
    }
  },

  /**
   * 切换订单状态筛选
   */
  changeStatus(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({
      currentStatus: status
    });
    
    this.applyStatusFilter(status);
  },
  
  /**
   * 应用状态筛选
   */
  applyStatusFilter(status) {
    const { historyOrders } = this.data;
    
    if (status === 'all') {
      // 显示所有订单
      this.setData({
        filteredOrders: historyOrders
      });
    } else {
      // 根据状态筛选
      const filtered = historyOrders.filter(order => order.status.toString() === status);
      this.setData({
        filteredOrders: filtered
      });
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.fetchOrders();
    wx.stopPullDownRefresh();
  }
});