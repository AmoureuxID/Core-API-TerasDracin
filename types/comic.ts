export type ComicListItem = {
  title?: string
  slug?: string
  type?: string
  cover?: string
  thumbnail?: string
  image?: string
}

export type ComicHomepage = {
  popular?: ComicListItem[]
  latest?: ComicListItem[]
  ranking?: ComicListItem[]
}

export type ComicGenre = {
  name?: string
  slug?: string
}

export type ComicDetail = {
  title?: string
  slug?: string
  cover?: string
  type?: string
  status?: string
  rating?: string
  synopsis?: string
  genres?: ComicGenre[]
  chapters?: ChapterListItem[]
}

export type ChapterListItem = {
  title?: string
  slug?: string
  chapter?: string
  date?: string
}
