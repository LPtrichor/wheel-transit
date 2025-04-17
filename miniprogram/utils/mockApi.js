import mockData from './mockData';

// 延迟函数，模拟网络请求延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟 API 响应格式
const createResponse = (data, code = 1, message = 'success') => {
  return {
    code,
    data,
    message
  };
};

// 模拟 API 服务
const mockApi = {
  // 用户相关 API
  user: {
    // 登录
    login: async (params) => {
      await delay();
      return createResponse(mockData.userData);
    },
    
    // 获取用户信息
    getUserInfo: async () => {
      await delay();
      return createResponse(mockData.userData.userInfo);
    },
    
    // 更新用户信息
    updateUserInfo: async (params) => {
      await delay();
      // 合并更新的用户信息
      const updatedUserInfo = { ...mockData.userData.userInfo, ...params };
      return createResponse(updatedUserInfo);
    },
    
    // 退出登录
    logout: async () => {
      await delay();
      return createResponse(null);
    }
  },
  
  // 订单相关 API
  order: {
    // 获取当前订单
    getCurrentOrder: async () => {
      await delay();
      return createResponse(mockData.orderData.currentOrder);
    },
    
    // 获取历史订单列表
    getHistoryOrders: async () => {
      await delay();
      return createResponse(mockData.orderData.historyOrders);
    },
    
    // 获取订单详情
    getOrderDetail: async (orderId) => {
      await delay();
      // 查找订单
      if (mockData.orderData.currentOrder.id === orderId) {
        return createResponse(mockData.orderData.currentOrder);
      }
      
      const order = mockData.orderData.historyOrders.find(item => item.id === orderId);
      if (order) {
        return createResponse(order);
      }
      
      return createResponse(null, 0, '订单不存在');
    },
    
    // 创建订单
    createOrder: async (params) => {
      await delay(800);
      // 生成订单ID
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
      const orderId = `WL${year}${month}${day}${random}`;
      
      // 创建新订单对象
      const newOrder = {
        id: orderId,
        plateOrFrame: params.plateOrFrame || '',
        carModel: params.carModel || '',
        phone: params.phone || '',
        name: params.name || '',
        startAddress: params.startAddress || '',
        endAddress: params.endAddress || '',
        createTime: `${year}-${month}-${day} ${new Date().toTimeString().slice(0, 8)}`,
        amount: params.amount || '2800.00',
        payStatus: 0, // 未支付
        status: 1 // 待支付
      };
      
      return createResponse(newOrder);
    },
    
    // 支付订单
    payOrder: async (orderId) => {
      await delay(1000);
      return createResponse({
        orderId,
        payStatus: 1,
        payTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    },
    
    // 取消订单
    cancelOrder: async (orderId) => {
      await delay();
      return createResponse({
        orderId,
        status: 5 // 已取消
      });
    }
  },
  
  // 首页相关 API
  home: {
    // 获取首页数据
    getHomeData: async () => {
      await delay();
      return createResponse(mockData.homeData);
    },
    
    // 获取轮播图
    getBanners: async () => {
      await delay();
      return createResponse(mockData.homeData.banners);
    },
    
    // 获取服务入口
    getServiceEntries: async () => {
      await delay();
      return createResponse(mockData.homeData.serviceEntries);
    }
  },
  
  // 地址相关 API
  address: {
    // 获取地址列表
    getAddressList: async () => {
      await delay();
      return createResponse(mockData.addressData.addressList);
    },
    
    // 获取地址详情
    getAddressDetail: async (addressId) => {
      await delay();
      const address = mockData.addressData.addressList.find(item => item.id === addressId);
      if (address) {
        return createResponse(address);
      }
      return createResponse(null, 0, '地址不存在');
    },
    
    // 添加地址
    addAddress: async (params) => {
      await delay();
      const newAddress = {
        id: Date.now(),
        ...params,
        isDefault: params.isDefault || false
      };
      return createResponse(newAddress);
    },
    
    // 更新地址
    updateAddress: async (params) => {
      await delay();
      return createResponse(params);
    },
    
    // 删除地址
    deleteAddress: async (addressId) => {
      await delay();
      return createResponse({ success: true });
    },
    
    // 设置默认地址
    setDefaultAddress: async (addressId) => {
      await delay();
      return createResponse({ success: true });
    }
  },
  
  // 价格计算 API
  price: {
    // 获取价格规则
    getPriceRules: async () => {
      await delay();
      return createResponse(mockData.priceData.priceRules);
    },
    
    // 计算价格
    calculatePrice: async (params) => {
      await delay();
      const { priceRules } = mockData.priceData;
      
      // 距离计算（模拟）
      const distance = Math.floor(Math.random() * 1000) + 500; // 500-1500公里
      
      // 基础价格
      let price = priceRules.baseFee + distance * priceRules.kmFee;
      
      // 豪车加价
      if (params.isLuxury) {
        price = price * priceRules.luxuryRate;
      }
      
      // 保险费用
      if (params.insuranceId) {
        const insurance = priceRules.insuranceOptions.find(item => item.id === params.insuranceId);
        if (insurance) {
          price += price * insurance.rate;
        }
      }
      
      // 服务费
      price += priceRules.serviceFee;
      
      return createResponse({
        totalPrice: price.toFixed(2),
        distance: distance,
        baseFee: priceRules.baseFee,
        distanceFee: (distance * priceRules.kmFee).toFixed(2),
        insuranceFee: params.insuranceId ? (price * priceRules.insuranceOptions.find(item => item.id === params.insuranceId).rate).toFixed(2) : '0.00',
        serviceFee: priceRules.serviceFee.toFixed(2)
      });
    }
  }
};

export default mockApi; 