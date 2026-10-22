# Chapter Garden · 章节花园

故事像花园：一个人播下开头，后来的人写出新的枝叶。章节花园（Chapter Garden）是一个中英文共同写小说的开放书架。每本书可以由不同作者接力创作，读者可以从第一章一直读到最新一章，也可以接过故事继续写。

网站采用静态页面。中文首页是 `/`，英文首页是 `/en/`，两边只展示对应语言已有的故事。打开一本书后，左侧是章节目录，右侧是正文。每本书放在 `src/content/books/<book-id>/` 下，同一章节的中英文文件并排存放，用 `_zh` 和 `_en` 后缀区分。这样，故事内容可以像代码一样通过版本记录和 Pull Request 协作。

## 书架

目前有八个原创故事开篇，九章正文都提供中文原文和英文译文。英文译文为 AI 辅助初稿，欢迎润色或从任意一本续写：

| 类型 | 中文书名 | 英文书名 | 开篇悬念 |
|---|---|---|---|
| 玄幻 | 天命欠我一页 | Fate Owes Me a Page | 谁一直替少年延后死期？ |
| 魔法 | 第十三座塔不教魔法 | The Thirteenth Tower Teaches No Magic | 谁替没有魔力的学徒付出了记忆？ |
| 恐怖 | 零号房今晚有人退房 | Room Zero Checks Out Tonight | 不存在的房间为何预先开出她的退房单？ |
| 穿越 | 我在千年前值天气班 | Weather Duty a Thousand Years Ago | 谁在三十年前留下现代气象台的署名？ |
| 科幻 | 太阳的第九分钟 | The Sun's Ninth Minute | 来自未来的求救为何要阻止镜阵？ |
| 侦探 | 失踪者亲自报案 | The Missing Person Filed Her Own Report | 谁用失踪者的样貌走进了监控盲区？ |
| 爽文 | 我不再替他们兜底 | I Won't Cover for Them Anymore | 被辞退的工程师如何接手真正的城市系统？ |
| 悬疑 | 雨停以后 | After the Rain | 第二个自己为何也握着一封信？ |

## 阅读与创作

- 阅读无需账号。网站公开展示当前部署版本的书和章节；页面右上角可以切换网站语言。
- 想续写时，fork 仓库，在自己的 fork 上建立分支。完成一章后，向本仓库的 `main` 提交 Pull Request。
- `main` 受保护，只接收通过检查的 Pull Request。构建检查确保网站能正常生成；故事衔接、文字质量和内容是否适合发布仍需要审阅。
- 每位作者保留自己提交内容的署名。作品的长期授权方式会在开放外部投稿前明确。

## 内容目录与翻译

```text
src/content/books/<book-id>/
├── book_zh.json
├── book_en.json
├── 01-opening_zh.md
└── 01-opening_en.md
```

`<book-id>` 是不随语言变化的作品 ID。一本书可以先只有中文或英文文件；有内容的语言版本才出现在对应书架。每种已发布语言都需要 `book_<语言>.json` 和至少一个章节。译文沿用原文章节的**章节 ID（后缀前的文件名）和 `order`**，但在自己的 Markdown 文件中填写翻译后的 `title` 和正文。译文可以逐章加入；只有两种语言都有的章节才显示直达对应译文的链接。自动翻译需要核对剧情与语言并标明辅助方式；尚未翻译的章节不放占位正文。

### 添加一本书

新建 `src/content/books/<book-id>/book_zh.json` 或 `src/content/books/<book-id>/book_en.json`：

```json
{
  "title": "书名",
  "description": "一句简介",
  "author": "共同创作",
  "genre": "玄幻"
}
```

在同一本书目录里添加章节，例如 `01-opening_zh.md`：

```md
---
title: 第一章 · 开场
order: 1
author: 你的名字
---

正文从这里开始。
```

译文写在 `01-opening_en.md`，可在 frontmatter 中另加 `translator: 译者名字`；`author` 标注原作者。每个语言版本中的 `order` 不能重复。已有的《雨停以后》展示了配对文件。

## 本地运行

需要 Node.js 22.23.4 或更新版本；CI 和 Cloudflare Pages 按 `.node-version` 使用 Node.js 24.18.0。

```bash
npm ci
npm run dev
npm run check
npm run build
```

网站使用 Astro 生成静态文件。部署到 Cloudflare Pages，构建命令为 `npm run build`，输出目录为 `dist`，主地址为 `cg.hczhang.com`；`chapter.hczhang.com` 和 `chapter-garden.hczhang.com` 可在之后跳转到主地址。

---

## English

Chapter Garden is an open bookshelf for collaborative fiction in Chinese and English. One writer plants the opening; others help the story grow. Readers can follow a book chapter by chapter or contribute the next one.

The site is static. The Chinese home page is `/`; the English home page is `/en/`. Each shelf lists only books with content in that language. A reader page has a chapter list on the left and the story on the right.

### Books and contributions

The shelf has eight original Chinese openings and English translations of all nine current chapters. The English translations are AI-assisted drafts and welcome editorial improvements.

| Genre | English title | Chinese original |
|---|---|---|
| Fantasy | Fate Owes Me a Page | 天命欠我一页 |
| Magic | The Thirteenth Tower Teaches No Magic | 第十三座塔不教魔法 |
| Horror | Room Zero Checks Out Tonight | 零号房今晚有人退房 |
| Time Travel | Weather Duty a Thousand Years Ago | 我在千年前值天气班 |
| Science Fiction | The Sun's Ninth Minute | 太阳的第九分钟 |
| Detective | The Missing Person Filed Her Own Report | 失踪者亲自报案 |
| Power Fantasy | I Won't Cover for Them Anymore | 我不再替他们兜底 |
| Mystery | After the Rain | 雨停以后 |

- Reading needs no account. The site displays books and chapters from its current deployment.
- To contribute, fork the repository, create a branch in your fork, and open a pull request to `main` with a new chapter or book.
- `main` is protected. A successful build is required; story continuity, writing quality, and suitability for publication also need review.
- Writers retain attribution. Long-term licensing will be defined before outside submissions open.

### Content format and translations

Keep both languages in `src/content/books/<book-id>/`. Use `_zh` for Chinese and `_en` for English. A book may start in either language. Each published language needs localized `book_<language>.json` metadata and at least one Markdown chapter.

```text
src/content/books/<book-id>/
├── book_zh.json
├── book_en.json
├── 01-opening_zh.md
└── 01-opening_en.md
```

Each `book_<language>.json` contains `title`, `description`, `author`, and `genre` in that language. A chapter's frontmatter contains its localized `title`, positive integer `order`, optional original `author`, and optional `translator`. Use the **same chapter ID before the language suffix and the same order** as the source chapter when translating, for example `01-opening_zh.md` and `01-opening_en.md`. A translation may be added one chapter at a time. The reader links matching chapters only when both files exist; untranslated chapters need no placeholder.

```json
{
  "title": "Book title",
  "description": "A short description",
  "author": "Original author",
  "genre": "Fantasy"
}
```

```md
---
title: Chapter 1 · The Opening
order: 1
author: Original author
translator: Translator name
---

The story begins here.
```

### Run locally

Use Node.js 22.23.4 or newer. CI and Cloudflare Pages use Node.js 24.18.0 from `.node-version`.

```bash
npm ci
npm run dev
npm run check
npm run build
```

Astro writes the static site to `dist`. The Cloudflare Pages address is `cg.hczhang.com`; `chapter.hczhang.com` and `chapter-garden.hczhang.com` can redirect to it later.
