# 宏敏物流小程序

## 项目介绍
宏敏物流微信小程序，提供汽车托运、物流配送等服务。

## 特性
- 车辆托运下单
- 物流订单管理
- 地址管理
- 支付功能

## 技术栈
- 微信小程序原生开发
- SCSS 样式预处理
- MobX 状态管理
- Vant Weapp UI 组件库

## 模拟数据使用说明

### 功能概述
项目集成了 Mock 数据功能，可在后端服务不可用时使用模拟数据进行开发和测试。

### 使用方法

1. 模拟数据配置位于 `miniprogram/utils/mockData.js`，包含：
   - 用户数据
   - 订单数据
   - 首页数据
   - 地址数据
   - 价格数据

2. 开启/关闭模拟数据：
   在 `miniprogram/utils/http.js` 文件中，修改 `ENABLE_MOCK` 常量：
   ```js
   // 是否使用 mock 数据（开发时设为 true，生产环境设为 false）
   const ENABLE_MOCK = true; // 改为 false 使用真实后端
   ```

3. 所有 API 请求会自动路由：
   - 启用 Mock 时，请求会被路由到 mockApi 处理函数
   - 禁用 Mock 时，请求会正常发送到真实后端

### Mock API 配置

Mock API 处理逻辑位于 `miniprogram/utils/mockApi.js`，按功能模块组织：

- `user`: 用户相关 API（登录、获取用户信息等）
- `order`: 订单相关 API（创建订单、支付订单等）
- `home`: 首页相关 API（获取轮播图、服务入口等）
- `address`: 地址相关 API（获取地址列表、添加地址等）
- `price`: 价格计算相关 API

### 扩展模拟数据

如需扩展或修改模拟数据：

1. 在 `mockData.js` 中添加或修改对应的数据结构
2. 在 `mockApi.js` 中实现对应的处理函数
3. 确保 API 路径和处理函数命名一致

示例：
```js
// 在 mockData.js 中添加数据
const newFeatureData = {
  // 添加新数据...
};

// 在 mockApi.js 中添加处理函数
const mockApi = {
  // ...其他API组
  newFeature: {
    getNewFeatureData: async () => {
      await delay();
      return createResponse(mockData.newFeatureData);
    }
  }
};
```

### 测试账号

使用快速登录功能可直接登录测试账号：
- 用户名：张三
- 手机号：13812345678

## 开发说明

1. 克隆项目
2. 使用微信开发者工具打开项目
3. 确认 `project.config.json` 中的 AppID
4. 构建运行 