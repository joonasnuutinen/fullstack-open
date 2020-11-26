import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('only title and author are rendered by default', () => {
  const blog = {
    title: 'test blog',
    author: 'test author',
    url: 'https://localhost:3000',
    likes: 100,
  }

  const component = render(
    <Blog blog={blog} />
  )

  //component.debug()
  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container).not.toHaveTextContent(blog.url)
  expect(component.container).not.toHaveTextContent(blog.likes)
})