import { json, Link, useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'

import { getPost } from '~/post'
import invariant from 'tiny-invariant'

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug')
  return json(await getPost(params.slug))
}

export default function PostSlug() {
  const post = useLoaderData()
  return (
    <>
      <main>
        <Link to={`/admin`}>Back to Admin</Link>
        <br />
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </main>
    </>
  )
}
