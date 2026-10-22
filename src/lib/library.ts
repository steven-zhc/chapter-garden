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
  '../content/books/*/*/book.json',
  { eager: true },
)

function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value)
}

export async function getBooks(locale?: Locale): Promise<Book[]> {
  const chapters = await getCollection('chapters')
  const books = Object.entries(bookFiles).map(([path, file]) => {
    const parts = path.split('/')
    const slug = parts.at(-3)!
    const language = parts.at(-2)!
    if (!isLocale(language)) {
      throw new Error(`${path}: language must be zh or en`)
    }

    const ownChapters = chapters
      .filter((chapter) => chapter.id.startsWith(`${slug}/${language}/`))
      .sort((a, b) => a.data.order - b.data.order)

    if (ownChapters.length === 0) {
      throw new Error(`${slug}/${language}: add at least one chapter`)
    }
    const orders = ownChapters.map((chapter) => chapter.data.order)
    if (new Set(orders).size !== orders.length) {
      throw new Error(`${slug}/${language}: chapter order values must be unique`)
    }

    return { slug, locale: language, ...bookDetailsSchema.parse(file.default), chapters: ownChapters }
  })

  const known = new Set(books.map((book) => `${book.slug}/${book.locale}`))
  for (const chapter of chapters) {
    const [slug, language] = chapter.id.split('/')
    if (!known.has(`${slug}/${language}`)) {
      throw new Error(`${chapter.id}: add a book.json in its language directory`)
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
  return chapter.id.split('/').slice(2).join('/')
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
