// 导入模块、包提供的类
import WxRequest from 'mina-request'
// 导入封装的本地存储操作模块
import { getStorage, clearStorage } from './storage'
// 导入封装的增强 API
import { toast, modal } from './extendApi'
// 导入 mock API 服务
import mockApi from './mockApi'

// 是否使用 mock 数据（开发时设为 true，生产环境设为 false）
const ENABLE_MOCK = true;

// 对类进行实例化
const instance = new WxRequest({
  // baseURL: 'https://gmall-prod.atguigu.cn/mall-api',
  // baseURL: 'http://localhost:8080/user',
  // baseURL: 'http://39.105.47.12:8080/user',
  baseURL: 'https://hongminwuliu.top/user',
  timeout: 15000
})

// 添加请求拦截器 (在请求发送之前对请求参数进行新增或者修改)
instance.interceptors.request = (config) => {
  // 在实际开发中，有一些接口需要使用访问令牌 token
  // 访问令牌 token 通常是存储到本地
  // 需要先从本地获取到存储的 token
  const token = getStorage('token')

  // 如果本地存在 token，这时候就需要在请求头中添加 token 字段
  if (token) {
    config.header['authentication'] = token
  }

  // 在发送请求之前做些什么
  return config
}

// 添加响应拦截器 (在服务器响应数据以后，对返回的数据进行逻辑处理)
instance.interceptors.response = async (response) => {
  // 从 response 对象中解构数据
  const { isSuccess, data, statusCode } = response;

  // 鉴权失败，延迟提示用户登录
  if (statusCode === 401) {
    wx.switchTab({
      url: '/pages/my/my',
    });
    setTimeout(() => {
      toast({
        title: '请先登录',
        icon: 'none'
      });
      // 可选择重定向到登录页面
    }, 3000); // 延迟3秒提示
  }

  // 网络请求失败
  if (!isSuccess) {
    toast({
      title: '网络异常请重试',
      icon: 'error'
    });
    return Promise.reject(response);
  }

  // 根据后端返回的业务状态码进行判断
  switch (data.code) {
    case 1: // 业务状态码1代表调用成功
      return data;

    case 401: // 鉴权失败，提示用户重新登录，并清除本地存储的过期信息
      const res = await modal({
        content: '鉴权失败，请重新登录',
        showCancel: false
      });
      if (res.confirm) {
        clearStorage();
        wx.navigateTo({
          url: '/pages/login/login'
        });
      }
      return Promise.reject(response);

    default: // 其他异常
      toast({
        title: '程序出现异常，请联系客服或稍后重试！'
      });
      return Promise.reject(response);
  }

  // 正常返回响应数据
  // return response; // 如果需要在外部还要继续处理响应，可以取消注释这一行
};

// Mock API 处理函数
const handleMockRequest = async (url, method, data = {}) => {
  console.log(`[MOCK] ${method} ${url}`, data);
  
  // 根据 URL 路径和方法调用对应的 mock 函数
  try {
    // 解析路径
    const urlParts = url.split('/').filter(part => part);
    
    // 第一部分通常是 API 分组
    const apiGroup = urlParts[0];
    // 第二部分通常是具体操作
    const apiOperation = urlParts[1];
    
    // 检查是否存在对应的 mock API 处理函数
    if (mockApi[apiGroup] && mockApi[apiGroup][apiOperation]) {
      const response = await mockApi[apiGroup][apiOperation](data);
      console.log(`[MOCK] Response:`, response);
      return response;
    }
    
    // 如果没有找到对应的处理函数，返回错误
    console.warn(`[MOCK] No handler found for ${url}`);
    return {
      code: 0,
      message: '接口未实现',
      data: null
    };
  } catch (error) {
    console.error(`[MOCK] Error:`, error);
    return {
      code: 0,
      message: '模拟数据出错',
      data: null
    };
  }
};

// 增强 instance 对象，添加 mock 模式
const enhancedInstance = {
  // GET 请求
  get: async (url, params = {}) => {
    if (ENABLE_MOCK) {
      return handleMockRequest(url, 'GET', params);
    }
    return instance.get(url, { params });
  },
  
  // POST 请求
  post: async (url, data = {}) => {
    if (ENABLE_MOCK) {
      return handleMockRequest(url, 'POST', data);
    }
    return instance.post(url, data);
  },
  
  // PUT 请求
  put: async (url, data = {}) => {
    if (ENABLE_MOCK) {
      return handleMockRequest(url, 'PUT', data);
    }
    return instance.put(url, data);
  },
  
  // DELETE 请求
  delete: async (url, params = {}) => {
    if (ENABLE_MOCK) {
      return handleMockRequest(url, 'DELETE', params);
    }
    return instance.delete(url, { params });
  },
  
  // 原始实例，用于不需要 mock 的请求
  raw: instance
};

// 导出增强后的实例
export default enhancedInstance;
