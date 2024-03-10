import http from '../utils/http'

/**
 * @description 提交用户订单
 * @param {*} data 
 * @returns Promise
 */
export const reqSumbitOrder = (data) => {
  return http.post('/order1/submit', data)
}

/**
 * @description 获取用户订单
 * @returns Promise
 */
export const reqGetOrders = (page, pageSize) => {
  return http.get(`/order1/historyOrders?page=${page}&pageSize=${pageSize}`);
};

