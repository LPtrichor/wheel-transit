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
