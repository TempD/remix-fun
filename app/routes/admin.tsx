import { json, Outlet, useLoaderData } from 'remix'

import { getPosts } from '~/post'
import type { Post } from '~/post'
import { Link } from '~/components'

export const loader = async () => {
  return json(await getPosts())
}

export default function Admin() {
  const posts = useLoaderData<Post[]>()
  return (
    <div className="flex flex-col">
      <nav className="flex flex-col">
        <h1 className="self-center font-extrabold">Admin</h1>
        <ul className="list-inside list-disc">
          {posts.map((post) => (
            <li key={post.slug} className="pl-20">
              <Link to={`/posts/${post.slug}`}>{post.title}</Link>{' '}
              <Link to={`edit/${post.slug}`}>EDIT</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 border border-solid border-gray-400 pl-20">
        <Outlet />
      </main>
    </div>
  )
}
