// orders.js
import {
  reqGetOrders
} from '@/api/order'
import {
  reqOrderAddress,
  reqOrderInfo,
  reqBuyNowGoods,
  reqSubmitOrder,
  reqPrePayInfo,
  reqPayStatus
} from '../../api/orderpay'
import http from '../../utils/http';
import mockData from '../../utils/mockData';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentOrder: {}, // 当前订单
    historyOrders: [], // 历史订单
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
          historyOrders: historyOrdersRes.data
        });
      }

      wx.hideLoading();
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

      // 调用支付接口
      const res = await http.post('order/payOrder', { orderId: currentOrder.id });
      
      if (res.code === 1) {
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
    
    // 简单实现，实际应该根据状态筛选订单
    // 这里仅做UI状态变化演示
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.fetchOrders();
    wx.stopPullDownRefresh();
  },

  // 获取预付单信息、支付参数
  async advancePay() {
    try {
      const payParams = await reqPrePayInfo(this.orderNo)

      if (payParams.code === 200) {
        // payParams.data 就是获取的支付参数

        // 调用  wx.requestPayment 发起微信支付
        const payInfo = await wx.requestPayment(payParams.data)

        // 获取支付的结果
        if (payInfo.errMsg === 'requestPayment:ok') {
          // 查询支付的状态
          const payStatus = await reqPayStatus(this.orderNo)

          if (payStatus.code === 200) {
            wx.redirectTo({
              url: '/modules/orderPayModule/pages/order/list/list',
              success: () => {
                wx.toast({
                  title: '支付成功',
                  icon: 'success'
                })
              }
            })
          }
        }
      }
    } catch (error) {
      wx.toast({
        title: '支付失败1',
        icon: 'error'
      })
    }
  },
  // 获取当前日期
  // 获取当前日期
  getFormattedDate: function () {
    console.log('获取当前日期');
    const date = new Date();
    console.log('当前完整日期和时间:', date);

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    const formattedDate = year + month + day + hour + minute + second;
    console.log('格式化后的日期和时间:', formattedDate);
    return formattedDate;
  },
  async pay() {
    try {
      // 调用 reqPrePayInfo 函数获取支付参数
      console.log('pay方法内部11');
      const orderId = this.data.currentOrder.id;
      console.log('orderId', orderId);
      // 生成订单号
      const orderNo = this.getFormattedDate() + orderId;
      // const orderNo = dateStr + "-" + orderId.toString(); // 添加分隔符并显式转换 orderId 为字符串
      // console.log(orderNo); // 输出 "20240426-12345"

      console.log('orderNo', orderNo);
      const payParams = await reqPrePayInfo(orderNo, this.data.currentOrder.amount);
      console.log("payParams", payParams)
      // 检查返回的code是否表示成功
      if (payParams.code === 1) {
        // payParams.data 就是获取的支付参数
        try {
          console.log(payParams.data);
          console.log("发起微信支付");

          // 从payParams.data中解构出所有属性，将packageStr重命名为packageValue
          const {
            packageStr: packageValue,
            ...restOfData
          } = payParams.data;

          // 使用计算属性名来动态设置package属性
          const payInfo = await new Promise((resolve, reject) => {
            wx.requestPayment({
              ...restOfData, // 展开支付参数中除了packageStr之外的部分
              ['package']: packageValue, // 使用计算属性名来设置package
              success: resolve,
              fail: reject
            });
          });

          console.log("微信支付结果");
          // 根据payInfo的errMsg属性判断支付是否成功
          if (payInfo.errMsg === 'requestPayment:ok') {
            this.data.currentOrder.status = 2;
            // // 如果支付成功，查询支付状态
            // const payStatus = await reqPayStatus(this.data.orderNo);

            // // 检查支付状态的code是否为200，表示支付成功
            // if (payStatus.code === 200) {
            //   wx.toast({
            //     title: "支付成功"
            //   });
            //   // 支付成功后的处理，比如页面跳转
            //   // wx.redirectTo({
            //   //   url: '/modules/orderPayModule/pages/order/list/list',
            //   //   success: () => {
            //   //     wx.showToast({
            //   //       title: '支付成功',
            //   //       icon: 'success'
            //   //     });
            //   //   }
            //   // });
            // }
          }
        } catch (payError) {
          // 处理支付过程中发生的错误
          wx.showToast({
            title: '支付失败',
            icon: 'error'
          });
        }
      }
    } catch (error) {
      // 处理获取支付参数失败的情况
      wx.showToast({
        title: '支付失败',
        icon: 'error'
      });
    }
  },
  async fetchOrders() {
    try {
      const page = 1; // 第一页
      const pageSize = 10; // 每页10条记录
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