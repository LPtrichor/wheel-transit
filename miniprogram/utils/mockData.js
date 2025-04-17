// 模拟用户数据
const userData = {
  token: 'mock_token_12345678',
  userInfo: {
    id: 1001,
    nickname: '张三',
    headimgurl: 'https://wheel-transit.oss-cn-beijing.aliyuncs.com/avatar/default_avatar.png',
    phone: '13812345678',
    gender: 1,
    registerTime: '2023-05-15 12:30:45'
  }
};

// 模拟订单数据
const orderData = {
  // 当前订单
  currentOrder: {
    id: 'WL202405150001',
    plateOrFrame: '京A12345',
    carModel: '宝马 3系 2023款',
    phone: '13812345678',
    name: '张三',
    startAddress: '北京市朝阳区三里屯',
    endAddress: '上海市浦东新区陆家嘴',
    createTime: '2024-05-15 08:30:00',
    amount: '2800.00',
    payStatus: 0, // 0-未支付 1-已支付
    status: 1 // 1-待支付 2-待接单 3-运输中 4-已完成 5-已取消
  },
  
  // 历史订单列表
  historyOrders: [
    {
      id: 'WL202404150002',
      plateOrFrame: '京B54321',
      carModel: '奔驰 E级 2022款',
      phone: '13812345678',
      name: '张三',
      startAddress: '北京市海淀区中关村',
      endAddress: '广州市天河区珠江新城',
      createTime: '2024-04-15 10:20:00',
      amount: '3200.00',
      payStatus: 1, // 已支付
      status: 4 // 已完成
    },
    {
      id: 'WL202403200003',
      plateOrFrame: '京C98765',
      carModel: '奥迪 A6 2023款',
      phone: '13812345678',
      name: '张三',
      startAddress: '北京市西城区西单',
      endAddress: '深圳市南山区科技园',
      createTime: '2024-03-20 14:15:00',
      amount: '3500.00',
      payStatus: 1, // 已支付
      status: 4 // 已完成
    },
    {
      id: 'WL202402100004',
      plateOrFrame: '京D45678',
      carModel: '丰田 凯美瑞 2022款',
      phone: '13812345678',
      name: '张三',
      startAddress: '北京市东城区王府井',
      endAddress: '成都市锦江区春熙路',
      createTime: '2024-02-10 09:45:00',
      amount: '2600.00',
      payStatus: 1, // 已支付
      status: 4 // 已完成
    }
  ]
};

// 模拟首页数据
const homeData = {
  banners: [
    {
      id: 1,
      imageUrl: 'https://wheel-transit.oss-cn-beijing.aliyuncs.com/banner/banner1.jpg',
      linkUrl: '/pages/order/order'
    },
    {
      id: 2,
      imageUrl: 'https://wheel-transit.oss-cn-beijing.aliyuncs.com/banner/banner2.jpg',
      linkUrl: '/pages/order/order'
    },
    {
      id: 3,
      imageUrl: 'https://wheel-transit.oss-cn-beijing.aliyuncs.com/banner/banner3.jpg',
      linkUrl: '/pages/category/category'
    }
  ],
  serviceEntries: [
    {
      id: 1,
      name: '单车运输',
      icon: 'car',
      url: '/pages/order/order?type=single'
    },
    {
      id: 2,
      name: '多车运输',
      icon: 'car',
      url: '/pages/order/order?type=multiple'
    },
    {
      id: 3,
      name: '豪车托运',
      icon: 'car',
      url: '/pages/order/order?type=luxury'
    },
    {
      id: 4,
      name: '订单查询',
      icon: 'search',
      url: '/pages/history/history'
    }
  ]
};

// 模拟地址数据
const addressData = {
  addressList: [
    {
      id: 1,
      name: '张三',
      phone: '13812345678',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detailAddress: '三里屯SOHO 5号楼2单元801',
      isDefault: true
    },
    {
      id: 2,
      name: '张三',
      phone: '13812345678',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      detailAddress: '陆家嘴金融中心12号楼',
      isDefault: false
    },
    {
      id: 3,
      name: '李四(收)',
      phone: '13987654321',
      province: '广东省',
      city: '广州市',
      district: '天河区',
      detailAddress: '珠江新城冼村路28号',
      isDefault: false
    }
  ]
};

// 模拟价格计算数据
const priceData = {
  priceRules: {
    baseFee: 1800, // 基础费用
    kmFee: 2.5,    // 每公里费用
    luxuryRate: 1.5, // 豪车倍率
    insuranceOptions: [
      { id: 1, name: '基础保障', rate: 0, desc: '免费基础保障' },
      { id: 2, name: '标准保障', rate: 0.05, desc: '车辆全程保障' },
      { id: 3, name: '全面保障', rate: 0.1, desc: '全面意外保障' }
    ],
    serviceFee: 200 // 服务费
  }
};

// 订单状态和支付状态映射
const statusMapping = {
  orderStatus: {
    1: '待支付',
    2: '待接单',
    3: '运输中',
    4: '已完成',
    5: '已取消'
  },
  payStatus: {
    0: '未支付',
    1: '已支付'
  }
};

// 导出所有模拟数据
export default {
  userData,
  orderData,
  homeData,
  addressData,
  priceData,
  statusMapping
}; 