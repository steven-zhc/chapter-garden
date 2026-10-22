import { getCollection, type CollectionEntry } from 'astro:content'
import { z } from 'astro/zod'

export const locales = ['zh', 'en'] as const
export type Locale = (typeof locales)[number]
export type Chapter = CollectionEntry<'chapters'>

export type Book = {
  slug: string
  locale: Locale
  title: string
  description: string
  author: string
  genre: string
  chapters: Chapter[]
  availableLocales: Locale[]
}

const bookDetailsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().min(1),
})
type BookDetails = z.infer<typeof bookDetailsSchema>

const bookFiles = import.meta.glob<{ default: BookDetails }>(
  '../content/books/*/book_*.json',
  { eager: true },
)

function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value)
}

function chapterParts(chapter: Chapter): { slug: string; locale: Locale; chapterSlug: string } {
  const slash = chapter.id.indexOf('/')
  const slug = chapter.id.slice(0, slash)
  const match = chapter.id.slice(slash + 1).match(/^(.+)_(zh|en)$/)
  if (slash < 1 || !match || !isLocale(match[2])) {
    throw new Error(`${chapter.id}: use <book-id>/<chapter-id>_zh.md or _en.md`)
  }
  return { slug, locale: match[2], chapterSlug: match[1] }
}

export async function getBooks(locale?: Locale): Promise<Book[]> {
  const chapters = await getCollection('chapters')
  const chapterInfo = chapters.map((chapter) => ({ chapter, ...chapterParts(chapter) }))
  const books = Object.entries(bookFiles).map(([path, file]) => {
    const parts = path.split('/')
    const slug = parts.at(-2)!
    const language = parts.at(-1)!.match(/^book_(zh|en)\.json$/)?.[1]
    if (!language || !isLocale(language)) {
      throw new Error(`${path}: use book_zh.json or book_en.json`)
    }

    const ownChapters = chapterInfo
      .filter((item) => item.slug === slug && item.locale === language)
      .map((item) => item.chapter)
      .sort((a, b) => a.data.order - b.data.order)

    if (ownChapters.length === 0) {
      throw new Error(`${slug}/book_${language}.json: add at least one chapter`)
    }
    const orders = ownChapters.map((chapter) => chapter.data.order)
    if (new Set(orders).size !== orders.length) {
      throw new Error(`${slug}/book_${language}.json: chapter order values must be unique`)
    }

    return { slug, locale: language, ...bookDetailsSchema.parse(file.default), chapters: ownChapters }
  })

  const known = new Set(books.map((book) => `${book.slug}/${book.locale}`))
  for (const item of chapterInfo) {
    if (!known.has(`${item.slug}/${item.locale}`)) {
      throw new Error(`${item.chapter.id}: add book_${item.locale}.json beside the chapter`)
    }
  }

  const languagesByBook = new Map<string, Locale[]>()
  for (const book of books) {
    const languages = languagesByBook.get(book.slug) ?? []
    languages.push(book.locale)
    languagesByBook.set(book.slug, languages)
  }

  for (const book of books) {
    const other = books.find((item) => item.slug === book.slug && item.locale !== book.locale)
    if (!other) continue
    for (const chapter of book.chapters) {
      const matching = other.chapters.find((item) => chapterSlug(item) === chapterSlug(chapter))
      if (matching && chapter.data.order !== matching.data.order) {
        throw new Error(`${chapter.id}: translated chapter must keep order ${matching.data.order}`)
      }
    }
  }

  return books
    .filter((book) => !locale || book.locale === locale)
    .map((book) => ({ ...book, availableLocales: languagesByBook.get(book.slug)! }))
    .sort((a, b) => a.title.localeCompare(b.title, locale === 'en' ? 'en' : 'zh-CN'))
}

export function chapterSlug(chapter: Chapter): string {
  return chapterParts(chapter).chapterSlug
}

export function homeUrl(locale: Locale): string {
  return locale === 'zh' ? '/' : '/en/'
}

export function bookUrl(book: Book): string {
  return `${homeUrl(book.locale)}books/${book.slug}/`
}

export function chapterUrl(book: Book, chapter: Chapter): string {
  return `${bookUrl(book)}${chapterSlug(chapter)}/`
}
