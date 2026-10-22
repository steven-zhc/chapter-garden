# Chapter Garden · 续章

故事像花园：一个人播下开头，后来的人写出新的枝叶。Chapter Garden 是一个共同写小说的开放书架。每本书可以由不同作者接力创作，读者可以从第一章一直读到最新一章，也可以接过故事继续写。

网站采用静态页面。首页展示所有书；打开一本书后，左侧是章节目录，右侧是正文。每本书放在 `src/content/books/<book-slug>/` 下，`book.json` 记录书名和简介，每一章都是独立的 Markdown 文件。这样，故事内容可以像代码一样通过版本记录和 Pull Request 协作。

## 阅读与创作

- 阅读无需账号。网站公开展示已经合入 `main` 的书和章节。
- 想续写时，fork 仓库，在自己的 fork 上建立分支。完成一章后，向本仓库的 `main` 提交 Pull Request。
- `main` 受保护，只接收通过检查的 Pull Request。构建检查确保网站能正常生成；故事衔接、文字质量和内容是否适合发布仍需要审阅。
- 每位作者保留自己提交内容的署名。作品的长期授权方式会在开放外部投稿前明确。

## 添加一本书

新建 `src/content/books/<book-slug>/book.json`：

```json
{
  "title": "书名",
  "description": "一句简介",
  "author": "共同创作"
}
```

在同一目录里添加章节，例如 `01-opening.md`：

```md
---
title: 第一章 · 开场
order: 1
author: 你的名字
---

正文从这里开始。
```

同一本书的 `order` 不能重复。已有的《雨停以后》展示了完整的目录结构。

## 本地运行

需要 Node.js 22.23.4 或更新版本。

```bash
npm ci
npm run dev
npm run check
npm run build
```

网站使用 Astro 生成静态文件。计划部署到 Cloudflare Pages，构建命令为 `npm run build`，输出目录为 `dist`，主地址为 `chapter.hczhang.com`；`cg.hczhang.com` 和 `chapter-garden.hczhang.com` 计划跳转到主地址。
