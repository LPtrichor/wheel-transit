import http from '@/utils/http'
import { getStorage, clearStorage } from '../utils/storage'
/**
 * @description 获取订单详情
 * @returns Promise
 */
export const reqOrderInfo = () => {
  return http.get('/order/trade')
}

/**
 * @description 获取订单详情页面的收货地址
 * @returns Promise
 */
export const reqOrderAddress = () => {
  return http.get('/userAddress/getOrderAddress')
}

/**
 * @description 获取立即购买商品的详细信息
 * @param { Object } param { goodsId：商品Id, blessing：祝福语 }
 * @returns Promise
 */
export const reqBuyNowGoods = ({ goodsId, ...data }) => {
  return http.get(`/order/buy/${goodsId}`, data)
}

/**
 * @description 提交订单、进行下单
 * @returns Promise
 */
export const reqSubmitOrder = (data) => {
  return http.post('/order/submitOrder', data)
}

/**
 * @description 获取微信支付预支付信息
 * @param {*} orderNo 订单 ID
 * @returns Promise
 */
// export const reqPrePayInfo = (orderNo) => {
//   // return http.get(`/webChat/createJsapi/${orderNo}`)
//   return http.get(`/order/payment`)
// }
// 假设这个方法接受一个orderNo作为参数，并且固定payMethod为0
export const reqPrePayInfo = (orderNo, amount) => {
  const token = getStorage('token')
  // console.log('token', token)
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://hongminwuliu.top/user/order/payment', // 目标服务器地址
      // url: ' http://localhost:8080/user/order/payment', // 目标服务器地址
      method: 'PUT', // 请求方法
      data: {
        orderNumber: orderNo, // 使用函数参数
        amount: amount, //支付金额
        payMethod: 1 // 根据需求固定的值
      },
      header: {
        'content-type': 'application/json', // 设置请求的header
        'authentication': token // 添加Authorization头部
      },
      success(res) {
        // 请求成功，解析返回的数据并通过resolve返回
        console.log('请求成功:', res.data);
        resolve(res.data); // 将服务器返回的数据传递出去
      },
      fail(err) {
        // 请求失败，通过reject返回错误信息
        console.log('请求失败:', err);
        reject(err); // 将错误信息传递出去
      }
    })
  });
}


/**
 * @description 微信支付支付的结果，查询微信支付的状态
 * @param {*} orderNo 订单 ID
 * @returns Promise
 */
export const reqPayStatus = (orderNo) => {
  return http.get(`/webChat/queryPayStatus/${orderNo}`)
}

/**
 * @description 获取订单列表
 * @returns Promise
 */
export const reqOrderList = (page, limit) => {
  return http.get(`/order/order/${page}/${limit}`)
}
