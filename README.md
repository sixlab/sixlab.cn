# 六楼小站

🌐 [sixlab.cn](https://sixlab.cn) - 六楼的雨个人主页与技术博客

基于 HTML + Tailwind CSS + 原生 JS 构建的静态个人网站。

## 项目简介

六楼小站是我的个人主页，展示开源项目、技术栈、博客文章和联系方式。

## 技术栈

- **HTML5** + **Tailwind CSS CDN v3**
- **原生 JavaScript**（无需构建步骤）
- **Canvas 2D** 粒子背景系统
- 暗色/亮色主题切换
- 响应式布局

## 项目结构

```
.
├── index.html          # 主页面
├── css/
│   └── style.css       # 自定义样式
├── js/
│   └── main.js         # 交互脚本
├── images/             # 图片资源
│   ├── favicon.png     # 网站图标
│   ├── logo.png        # 导航栏 Logo
│   └── wechat-qr.jpg   # 微信公众号二维码
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions 自动部署
```

## 特效功能

- 粒子背景 + 连线效果 + 鼠标排斥
- 浮动大气泡背景
- 鼠标轨迹特效
- 滚动显示动画（IntersectionObserver）
- 导航栏滚动高亮
- 3D 视差滚动
- 霓虹发光边框
- 光线扫过卡片
- 数字滚动动画
- 打字机效果

## 自动部署

推送至 `main` 分支后，GitHub Actions 自动通过 SSH 部署到远程服务器。

配置方式见 [`.github/workflows/README.md`](.github/workflows/README.md)。

## License

MIT
