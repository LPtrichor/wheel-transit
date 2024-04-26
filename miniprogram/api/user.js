import http from '../utils/http'

/**
 * @description 进行登录操作
 * @param {*} code 临时登录凭证
 * @returns Promise
 */
export const reqLogin = (code) => {
  // 构建请求参数对象
  const data = {
      code: code
  };
  // return http.get(`/weixin/wxLogin/${code}`)
  return http.post(`/user/login`, data)
}

/**
 * @description 获取用户信息
 * @returns Promise
 */
export const reqUserInfo = () => {
  return http.get('/user/getuserInfo')
}

/**
 * @description 实现本地资源上传
 * @param {*} filePath 要上传的文件资源路径
 * @param {*} name 文件对应的 key
 * @returns Promise
 */
export const reqUploadFile = (filePath, name) => {
  // console.log(filePath);
  // console.log(name);
  // const data ={
  //   imageUrl:filePath
  // }
  return http.upload('/common/upload', filePath, name)
  // return http.post('/common/upload', data)
}

/**
 * @description 更新用户信息
 * @param {*} userInfo 最新的头像和昵称
 * @returns Promise
 */
export const reqUpdateUserInfo = (userInfo) => {
  return http.post('/user/updateUserInfo', userInfo)
}

/**
 * @description 获取用户电话号码
 * @param ACCESS_TOKEN
 * @param code
 * @description POST https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=ACCESS_TOKEN
 */
//  export const reqUserPhone = (ACCESS_TOKEN, code) => {
//   //构建{code: code}的对象
//   return http.post(`https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${ACCESS_TOKEN}`, { code })
// }
// 请求用户手机号的函数
export function reqUserPhone(ACCESS_TOKEN, code) {
  // 微信小程序的request方法不支持直接返回Promise，因此我们需要自己包装一下
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${ACCESS_TOKEN}`,
      method: 'POST',
      data: {
        code: code, // 用户同意后获取到的code
      },
      success(res) {
        // 请求成功
        if (res.data && res.data.errcode === 0) {
          // 操作成功
          resolve({
            success: true,
            data: res.data.phone_info, // 这里的返回值取决于微信API的实际响应
          });
        } else {
          // 微信API返回错误
          reject({
            success: false,
            errorMessage: res.data.errmsg,
          });
        }
      },
      fail(error) {
        // 请求失败
        reject({
          success: false,
          errorMessage: error.errMsg,
        });
      }
    });
  });
}

