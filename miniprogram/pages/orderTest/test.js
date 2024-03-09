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
    this.setData({ plateOrFrame: e.detail });
  },

  // 方法：当用户输入品牌车型时触发，更新页面数据
  inputCarModel(e) {
    this.setData({ carModel: e.detail });
  },

  // 方法：当用户输入联系电话时触发，更新页面数据
  inputPhone(e) {
    this.setData({ phone: e.detail });
  },

  // 方法：当用户输入姓名时触发，更新页面数据
  inputName(e) {
    this.setData({ name: e.detail });
  },

  // 方法：当用户输入起始地址时触发，更新页面数据
  inputStartAddress(e) {
    this.setData({ startAddress: e.detail });
  },

  // 方法：当用户输入终点地址时触发，更新页面数据
  inputEndAddress(e) {
    this.setData({ endAddress: e.detail });
  },

  // 方法：当用户提交订单时触发
  submitOrder() {
    // 这里添加提交订单的逻辑，例如调用API发送数据到后端
    console.log('订单信息:', this.data); // 在控制台打印订单信息，用于调试

    // 显示提交成功的提示
    wx.showToast({
      title: '订单已提交', // 提示内容
      icon: 'success', // 图标
      duration: 2000 // 提示持续时间
    });
  }
});
