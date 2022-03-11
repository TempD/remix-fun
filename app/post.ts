import path from 'path'
import fs from 'fs/promises'
import parseFrontMatter from 'front-matter'
import invariant from 'tiny-invariant'
import { marked } from 'marked'
import { json } from 'remix'

export type Post = {
  slug: string
  title: string
  html: string
  markdown: string
}

export type PostMarkdownAttributes = {
  title: string
}

type NewPost = {
  title: string
  slug: string
  markdown: string
}

// relative to server output, not source
const postsPath = path.join(__dirname, '..', 'posts')

const isValidPostAttributes = (
  attributes: any
): attributes is PostMarkdownAttributes => attributes?.title

export const updatePost = async (post: NewPost) => {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`
  await fs.writeFile(path.join(postsPath, post.slug + '.md'), md)
  return json(await getPost(post.slug))
}

export const createPost = async (post: NewPost) => {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`
  await fs.writeFile(path.join(postsPath, post.slug + '.md'), md)
  return json(await getPost(post.slug))
}

export const getPost = async (slug: string): Promise<Post> => {
  const filepath = path.join(postsPath, slug + '.md')
  const file = await fs.readFile(filepath)
  const { attributes, body } = parseFrontMatter(file.toString())
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  )
  const html = marked(body)
  return { slug, html, markdown: body, title: attributes.title }
}

export const getPosts = async () => {
  const dir = await fs.readdir(postsPath)
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename))
      const { attributes } = parseFrontMatter(file.toString())

      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      )

      return {
        slug: filename.replace(/\.md$/, ''),
        title: attributes.title,
      }
    })
  )
}
