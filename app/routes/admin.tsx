import { json, Outlet, Link, useLoaderData } from 'remix'

import { getPosts } from '~/post'
import type { Post } from '~/post'

export const loader = async () => {
  return json(await getPosts())
}

export default function Admin() {
  const posts = useLoaderData<Post[]>()
  return (
    <div className="flex">
      <nav className="pr-8">
        <h1>Admin</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 border border-solid border-gray-400">
        <Outlet />
      </main>
    </div>
  )
}
