export type ReaderChapter = {
  title?: string
  images?: string[]
}

export type ReaderNavigation = {
  prev?: { slug?: string; title?: string }
  next?: { slug?: string; title?: string }
}
