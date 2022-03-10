import { json, redirect, Form, useActionData, useTransition } from 'remix'
import type { ActionFunction } from 'remix'

import { createPost } from '~/post'
import invariant from 'tiny-invariant'

type PostError = {
  title?: boolean
  slug?: boolean
  markdown?: boolean
}

export const action: ActionFunction = async ({ request }) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Request/formData
  await new Promise((res) => setTimeout(res, 1000))
  const formData = await request.formData()

  const title = formData.get('title') // FormDateEntryValue | null
  const slug = formData.get('slug') // FormDateEntryValue | null
  const markdown = formData.get('markdown') // FormDateEntryValue | null

  const errors: PostError = {
    ...(!title && { title: true }),
    ...(!slug && { slug: true }),
    ...(!markdown && { markdown: true }),
  }

  if (Object.keys(errors).length) {
    return json(errors)
  }

  invariant(typeof title === 'string')
  invariant(typeof slug === 'string')
  invariant(typeof markdown === 'string')
  await createPost({ title, slug, markdown })

  return redirect('/admin')
}

function Error({ children }: { children: string }): JSX.Element {
  return <em className="text-red-500">{children}</em>
}

export default function NewPost() {
  const errors = useActionData()
  // https://remix.run/docs/en/v1/api/remix#usetransition
  const transition = useTransition()

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: <input type="text" name="title" />
          {errors?.title ? <Error>Title is required</Error> : null}
        </label>
      </p>
      <p>
        <label>
          Post Slug: <input type="tet" name="slug" />
          {errors?.slug ? <Error>Slug is required</Error> : null}
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{' '}
        {errors?.markdown ? <Error>Markdown is required</Error> : null}
        <br />
        <textarea id="markdown" rows={20} name="markdown" />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? 'Creating...' : 'Create Post'}
        </button>
      </p>
    </Form>
  )
}
