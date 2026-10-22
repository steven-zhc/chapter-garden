import { getCollection, type CollectionEntry } from 'astro:content'

export type Chapter = CollectionEntry<'chapters'>

export type Book = {
  slug: string
  title: string
  description: string
  author: string
  chapters: Chapter[]
}

type BookDetails = Pick<Book, 'title' | 'description' | 'author'>

const bookFiles = import.meta.glob<{ default: BookDetails }>(
  '../content/books/*/book.json',
  { eager: true },
)

export async function getBooks(): Promise<Book[]> {
  const chapters = await getCollection('chapters')
  const books = Object.entries(bookFiles).map(([path, file]) => {
    const slug = path.split('/').at(-2)!
    const ownChapters = chapters
      .filter((chapter) => chapter.id.startsWith(`${slug}/`))
      .sort((a, b) => a.data.order - b.data.order)

    if (ownChapters.length === 0) {
      throw new Error(`${slug}: add at least one chapter`)
    }
    const orders = ownChapters.map((chapter) => chapter.data.order)
    if (new Set(orders).size !== orders.length) {
      throw new Error(`${slug}: chapter order values must be unique`)
    }

    return { slug, ...file.default, chapters: ownChapters }
  })

  const known = new Set(books.map((book) => book.slug))
  for (const chapter of chapters) {
    const slug = chapter.id.split('/')[0]
    if (!known.has(slug)) {
      throw new Error(`${chapter.id}: add a book.json in its book directory`)
    }
  }

  return books.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
}

export function chapterSlug(chapter: Chapter): string {
  return chapter.id.split('/').slice(1).join('/')
}

export function chapterUrl(book: Book, chapter: Chapter): string {
  return `/books/${book.slug}/${chapterSlug(chapter)}/`
}
