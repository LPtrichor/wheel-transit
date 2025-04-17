import {
  reqSumbitOrder
} from '@/api/order'
// 导入 async-validator 对参数进行验证
import Schema from 'async-validator'
// 导入 HTTP 工具函数，使用 mock 数据
import http from '../../utils/http'

Page({
  // 页面的初始数据
  data: {
    plateOrFrame: '', // 车牌号或车架号
    carModel: '', // 品牌车型
    phone: '', // 联系电话
    name: '', // 用户姓名
    startAddress: '', // 起始地址
    endAddress: '', // 终点地址
    amount: '', // 订单金额
    insuranceId: 1, // 保险选项，默认基础保障
    isLuxury: false, // 是否为豪车，影响价格
    priceDetail: null, // 价格详情
    showPricePopup: false, // 是否显示价格弹窗
    insuranceOptions: [], // 保险选项列表
    loading: false, // 提交按钮加载状态
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    // 获取价格规则
    this.fetchPriceRules();
    
    // 如果是从分享或其它入口传入了参数，进行处理
    if (options.type) {
      if (options.type === 'luxury') {
        this.setData({ isLuxury: true });
      }
    }
  },

  // 获取价格规则
  async fetchPriceRules() {
    try {
      const res = await http.get('price/getPriceRules');
      if (res.code === 1) {
        this.setData({
          insuranceOptions: res.data.insuranceOptions
        });
      }
    } catch (error) {
      console.error('获取价格规则失败', error);
    }
  },

  onShareTimeline: function() {
    return {
      title: '宏敏物流',
      imageUrl: 'https://wheel-transit.oss-cn-beijing.aliyuncs.com/index/cover_image.jpgg'  // 例如：封面图，可选
    };
  },
  onShareAppMessage: function (options) {
    // 设置分享内容
    return {
      title: '宏敏物流',
      imageUrl: 'https://wheel-transit.oss-cn-beijing.aliyuncs.com/index/cover_image.jpg', // 可选
      path: '/pages/order/order' // 被分享的页面路径
    };
  },
  // 方法：当用户输入车牌/车架号时触发，更新页面数据
  inputPlateOrFrame(e) {
    this.setData({
      plateOrFrame: e.detail
    });
  },

  // 方法：当用户输入品牌车型时触发，更新页面数据
  inputCarModel(e) {
    this.setData({
      carModel: e.detail
    });
  },

  // 方法：当用户输入联系电话时触发，更新页面数据
  inputPhone(e) {
    this.setData({
      phone: e.detail
    });
  },

  // 方法：当用户输入姓名时触发，更新页面数据
  inputName(e) {
    this.setData({
      name: e.detail
    });
  },

  // 方法：当用户输入起始地址时触发，更新页面数据
  inputStartAddress(e) {
    this.setData({
      startAddress: e.detail
    });
  },

  // 方法：当用户输入终点地址时触发，更新页面数据
  inputEndAddress(e) {
    this.setData({
      endAddress: e.detail
    });
  },

  // 切换豪车状态
  toggleLuxury() {
    this.setData({
      isLuxury: !this.data.isLuxury
    });
  },

  // 选择保险选项
  selectInsurance(e) {
    this.setData({
      insuranceId: e.currentTarget.dataset.id
    });
  },

  // 地理定位
  async onStartLocation() {
    try {
      const res = await wx.chooseLocation();
      console.log(res); // 打印整个返回结果，确保有结果
      console.log(res.address); // 打印地址信息，确保这部分有返回
      this.setData({
        startAddress: res.address
      }, () => {
        console.log("startAddress:", this.data.startAddress); // 确保这里使用this.data.startAddress
      });
    } catch (error) {
      console.error("获取位置失败:", error);
    }
  },

  async onEndLocation() {
    try {
      const res = await wx.chooseLocation();
      console.log(res); // 打印整个返回结果，确保有结果
      console.log(res.address); // 打印地址信息，确保这部分有返回
      this.setData({
        endAddress: res.address
      }, () => {
        console.log("startAddress:", this.data.endAddress); // 确保这里使用this.data.startAddress
      });
    } catch (error) {
      console.error("获取位置失败:", error);
    }
  },

  // 计算价格
  async calculatePrice() {
    try {
      // 先验证输入
      const params = {
        ...this.data
      };
      
      const { valid } = await this.validatorPerson(params);
      if (!valid) return;
      
      // 显示加载中
      wx.showLoading({
        title: '计算价格中...',
      });
      
      // 调用价格计算API
      const res = await http.post('price/calculatePrice', {
        startAddress: this.data.startAddress,
        endAddress: this.data.endAddress,
        isLuxury: this.data.isLuxury,
        insuranceId: this.data.insuranceId
      });
      
      wx.hideLoading();
      
      if (res.code === 1) {
        this.setData({
          priceDetail: res.data,
          amount: res.data.totalPrice,
          showPricePopup: true
        });
      } else {
        wx.showToast({
          title: '价格计算失败',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('计算价格失败', error);
      wx.showToast({
        title: '价格计算失败',
        icon: 'none'
      });
    }
  },
  
  // 关闭价格弹窗
  closePricePopup() {
    this.setData({
      showPricePopup: false
    });
  },
  
  // 确认价格
  confirmPrice() {
    this.setData({
      showPricePopup: false
    });
    this.submitOrder();
  },

  // 方法：当用户提交订单时触发
  async submitOrder() {
    console.log('订单信息:', this.data); // 在控制台打印订单信息，用于调试
    
    try {
      // 如果没有计算价格，则先计算价格
      if (!this.data.amount) {
        this.calculatePrice();
        return;
      }
      
      const params = {
        plateOrFrame: this.data.plateOrFrame,
        carModel: this.data.carModel,
        phone: this.data.phone,
        name: this.data.name,
        startAddress: this.data.startAddress,
        endAddress: this.data.endAddress,
        amount: this.data.amount,
        isLuxury: this.data.isLuxury,
        insuranceId: this.data.insuranceId
      };

      // 对请求参数进行验证
      const { valid } = await this.validatorPerson(params);

      // 如果请求参数验证失败，直接 return ，不执行后续的逻辑
      if (!valid) return;

      // 显示确认提交订单的模态对话框
      const res = await new Promise((resolve, reject) => {
        wx.showModal({
          title: '订单提交确认',
          content: '确定提交订单？金额：￥' + this.data.amount,
          success: resolve,
          fail: reject
        });
      });

      // 用户取消了订单提交
      if (res.cancel) {
        wx.showToast({
          title: '已取消订单',
          icon: 'success',
          duration: 2000
        });
        return; // 直接返回，不再执行后续代码
      }

      // 用户确认了订单提交
      if (res.confirm) {
        this.setData({ loading: true });
        
        try {
          // 使用 mock API 提交订单
          const orderResult = await http.post('order/createOrder', params);

          if (orderResult.code === 1) {
            wx.showToast({
              title: '订单已提交',
              icon: 'success',
              duration: 2000
            });
            
            // 等待提示显示完毕后再跳转
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/history/history',
                success: function () {
                  wx.showModal({
                    title: '提示',
                    content: '请耐心等待，即将为您回电',
                    showCancel: false
                  });
                }
              });
            }, 2000);
          } else {
            wx.showToast({
              title: '订单提交失败',
              icon: 'none',
              duration: 2000
            });
          }
        } catch (error) {
          console.error('提交订单出错', error);
          wx.showToast({
            title: '提交失败，请重试',
            icon: 'none'
          });
        } finally {
          this.setData({ loading: false });
        }
      }
    } catch (error) {
      console.error('提交订单过程中发生错误:', error);
      wx.showToast({
        title: '提交异常，请稍后重试',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },


  async validatorPerson(data) {
    // 定义正则表达式
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$';
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';
    const addressReg = '.+'; // 简单验证地址不为空，根据需要调整

    // 创建验证规则
    const rules = {
      name: [{
          required: true,
          message: '请输入用户姓名'
        },
        {
          pattern: new RegExp(nameRegExp),
          message: '用户姓名不合法'
        }
      ],
      phone: [{
          required: true,
          message: '请输入联系电话'
        },
        {
          pattern: new RegExp(phoneReg),
          message: '联系电话不合法'
        }
      ],
      startAddress: [{
          required: true,
          message: '请输入起始地址'
        },
        {
          pattern: new RegExp(addressReg),
          message: '起始地址不合法'
        }
      ],
      endAddress: [{
          required: true,
          message: '请输入终点地址'
        },
        {
          pattern: new RegExp(addressReg),
          message: '终点地址不合法'
        }
      ]
    };

    // 创建 Schema 实例
    const validator = new Schema(rules);

    // 定义验证结果
    let valid = false;

    await new Promise((resolve) => {
      // 进行验证
      validator.validate(data, {
        firstFields: true
      }, (errors, fields) => {
        // 当存在验证错误时，在页面上进行提示
        if (errors) {
          wx.showToast({
            title: errors[0].message,
            icon: 'none',
            mask: true
          });
        } else {
          valid = true;
        }
        resolve();
      });
    });

    return {
      valid
    };
  }
});