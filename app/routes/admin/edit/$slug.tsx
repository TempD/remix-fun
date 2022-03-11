import { ActionFunction, LoaderFunction, useLoaderData } from 'remix'
import { json, redirect, Form, useActionData, useTransition } from 'remix'
import { updatePost, getPost } from '~/post'
import invariant from 'tiny-invariant'

type PostError = {
  title?: boolean
  slug?: boolean
  markdown?: boolean
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug')
  return json(await getPost(params.slug))
}

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.slug, 'expected params.slug')

  const formData = await request.formData()
  const title = formData.get('title') // FormDateEntryValue | null
  const slug = params.slug
  const markdown = formData.get('markdown') // FormDateEntryValue | null

  const errors: PostError = {
    ...(!title && { title: true }),
    ...(!markdown && { markdown: true }),
  }

  if (Object.keys(errors).length) {
    return json(errors)
  }

  invariant(typeof title === 'string')
  invariant(typeof slug === 'string')
  invariant(typeof markdown === 'string')
  await updatePost({ title, slug, markdown })

  return redirect('/admin')
}

function Error({ children }: { children: string }): JSX.Element {
  return <em className="text-red-500">{children}</em>
}

export default function EditPost() {
  const errors = useActionData()
  const post = useLoaderData()
  const transition = useTransition()

  console.log({ post })

  return (
    <Form method="put">
      <p>
        <label>
          Post Title:{' '}
          <input
            key={post?.title}
            defaultValue={post?.title}
            type="text"
            name="title"
          />
          {errors?.title ? <Error>Title is required</Error> : null}
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Post Body (Markdown Format):</label>{' '}
        {errors?.markdown ? <Error>Body is required</Error> : null}
        <br />
        <textarea
          key={post?.markdown}
          defaultValue={post?.markdown}
          id="markdown"
          rows={20}
          name="markdown"
        />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? 'Editing...' : 'Edit Post'}
        </button>
      </p>
    </Form>
  )
}
