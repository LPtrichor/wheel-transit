import {
  reqSumbitOrder
} from '@/api/order'
// 导入 async-validator 对参数进行验证
import Schema from 'async-validator'

Page({
  // 页面的初始数据
  data: {
    plateOrFrame: '', // 车牌号或车架号
    carModel: '', // 品牌车型
    phone: '', // 联系电话
    name: '', // 用户姓名
    startAddress: '', // 起始地址
    endAddress: '', // 终点地址
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


  // 方法：当用户提交订单时触发
  async submitOrder() {
    console.log('订单信息:', this.data); // 在控制台打印订单信息，用于调试
    const params = {
      ...this.data
    };

    // 对请求参数进行验证
    const {
      valid
    } = await this.validatorPerson(params)

    // 如果请求参数验证失败，直接 return ，不执行后续的逻辑
    if (!valid) return

    // 显示确认提交订单的模态对话框
    const res = await new Promise((resolve, reject) => {
      wx.showModal({
        title: '订单提交确认',
        content: '确定提交订单？',
        success: resolve,
        fail: reject
      });
    });
    console.log("res", res);

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
      let message = '';
      let icon = 'success'; // 默认为成功的图标
      let delayBeforeRedirect = 1000; // 跳转前的延迟时间

      try {
        const orderResult = await reqSumbitOrder(params);

        if (orderResult.code == 1) {
          message = '订单已提交';
          delayBeforeRedirect += 2000; // 提交成功，等待提示显示完毕后再跳转
        } else {
          // 根据实际情况，如果有错误码的详细分析，可以在这里设置不同的消息
          message = '订单提交失败，请稍后再试';
          icon = 'none';
        }
      } catch (error) {
        console.error('提交订单过程中发生错误:', error);
        message = '提交异常，请检查网络后重试';
        icon = 'none';
      }

      // 延迟1秒后显示提示信息
      setTimeout(() => {
        wx.showToast({
          title: message,
          icon: icon,
          duration: 2000 // 提示持续时间
        });

        // 如果订单提交成功，等待提示结束后跳转到订单页面
        if (message === '订单已提交') {
          setTimeout(() => {
            try {
              console.log("准备跳转到tabbar页面");
              wx.switchTab({
                url: '/pages/history/history',
                success: function () {
                  console.log("成功跳转到tabbar页面");
                },
                fail: function (err) {
                  console.log("跳转到tabbar页面失败", err);
                }
              });
            } catch (error) {
              console.error("尝试跳转到tabbar页面时捕获到异常", error);
            }

            // wx.navigateTo({
            //   url: '/pages/history/history'
            // });
          }, 2000); // 等待提示信息展示完毕后跳转
        }
      }, 1000);
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

    const validator = new Schema(rules);

    try {
      // 进行验证
      await validator.validate(data);
      // 验证成功
      return {
        valid: true
      };
    } catch (error) {
      // 验证失败，显示第一个错误提示
      wx.toast({
        title: error.errors[0].message
      });
      return {
        valid: false
      };
    }
  }

});