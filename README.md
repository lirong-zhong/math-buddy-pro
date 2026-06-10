# 数学搭档 Pro

面向小初学生的 AI 数学练习应用，基于北师大版（2024 新版）教材目录出题，支持闯关记录、成长点追踪与再战陷阱。

## 功能

- 按年级、章节选知识点，AI 自动生成题目
- 先说思路再动笔，语音输入解题过程
- 练习记录与闯关记录（localStorage 本地保存）
- 成长点识别、陷阱分布、逐题回看与再战
- 题库管理（Word / PDF / 文字导入）
- 多孩子独立档案

## 技术栈

- 前端：单页 HTML（`public/index.html`）
- 后端：Cloudflare Pages Function（`functions/api/chat.js`）
- AI：DeepSeek API（密钥通过环境变量配置，不暴露给浏览器）

## 项目结构

```
math-pro/
├── public/
│   ├── index.html      # 主应用
│   └── _redirects      # SPA 路由
├── functions/
│   └── api/
│       └── chat.js     # API 代理
├── wrangler.toml       # Wrangler CLI 配置（可选）
├── 部署文档.md          # 完整部署指南
└── README.md
```

## 部署

详见 [部署文档.md](./部署文档.md)。

简要步骤：

1. 将仓库连接到 [Cloudflare Pages](https://dash.cloudflare.com)
2. 构建输出目录设为 `public`
3. 在环境变量中配置 `DEEPSEEK_API_KEY`（Secret 类型）
4. 重新部署后即可访问

## 教材覆盖

北师大版（2024 新版）：三年级 ~ 九年级（小学 + 初中）
