import {
  reqSumbitOrder
} from '@/api/order'

Page({
  // 页面的初始数据
  data: {
    plateOrFrame: '', // 车牌号或车架号
    carModel: '', // 品牌车型
    phone: '', // 联系电话
    name: '', // 用户姓名
    startAddress: '', // 起始地址
    endAddress: '', // 终点地址
    // 初始化picker的range数组
    multiArray: [
      [],
      [],
      []
    ], // 分别对应品牌，车系，车型
    multiIndex: [0, 0, 0], // 默认选中的项

    brands: ['品牌A', '品牌B'], // 品牌
    series: [ // 车系，假设每个品牌下有两个车系
      ['车系A1', '车系A2'],
      ['车系B1', '车系B2']
    ],
    models: [ // 车型，假设每个车系下有两个车型
      [
        ['车型A1-1', '车型A1-2'],
        ['车型A2-1', '车型A2-2']
      ],
      [
        ['车型B1-1', '车型B1-2'],
        ['车型B2-1', '车型B2-2']
      ]
    ],
  },
  onLoad: function () {
    // 初始化multiArray的值
    var multiArray = this.data.multiArray;
    var brands = this.data.brands;
    var series = this.data.series[0]; // 默认取第一个品牌的车系
    var models = this.data.models[0][0]; // 默认取第一个品牌的第一个车系的车型

    multiArray[0] = brands;
    multiArray[1] = series;
    multiArray[2] = models;

    this.setData({
      multiArray
    });
  },

  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    });
  },

  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    switch (e.detail.column) {
      case 0: // 品牌改变
        var series = this.data.series[e.detail.value];
        var models = this.data.models[e.detail.value][0];
        data.multiArray[1] = series;
        data.multiArray[2] = models;
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1: // 车系改变
        var brandIndex = data.multiIndex[0];
        var models = this.data.models[brandIndex][e.detail.value];
        data.multiArray[2] = models;
        data.multiIndex[2] = 0;
        break;
    }

    this.setData(data);
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
  async onLocation() {
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
  // 方法：当用户提交订单时触发
  async submitOrder() {
    // 这里添加提交订单的逻辑，例如调用API发送数据到后端
    console.log('订单信息:', this.data); // 在控制台打印订单信息，用于调试
    const params = {
      ...this.data
    }
    const res = await reqSumbitOrder(params);
    // 显示提交成功的提示
    wx.showToast({
      title: '订单已提交', // 提示内容
      icon: 'success', // 图标
      duration: 2000 // 提示持续时间
    });
  },

  // 处理车型选择改变的事件
  onCarModelChange: function (e) {
    const {
      value
    } = e.detail;
    const selectedBrand = this.data.carData[value[0]];
    const selectedSeries = selectedBrand.series[value[1]];
    const selectedModel = selectedSeries.models[value[2]];
    this.setData({
      selectedBrandIndex: value[0],
      selectedSeriesIndex: value[1],
      selectedModelIndex: value[2],
      carBrand: selectedBrand.name,
      carSeries: selectedSeries.name,
      carModel: selectedModel,
    });
  },
});