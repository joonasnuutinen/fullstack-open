import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'test blog',
  author: 'test author',
  url: 'https://localhost:3000',
  likes: 100,
}

describe('<Blog /> component', () => {
  let component

  beforeEach(() => {
    component = render(
      <Blog blog={blog} />
    )
  })

  test('renders only title and author by default', () => {
    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.author)
    expect(component.container).not.toHaveTextContent(blog.url)
    expect(component.container).not.toHaveTextContent(blog.likes)
  })

  test('renders also url and likes after the button has been clicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.author)
    expect(component.container).toHaveTextContent(blog.url)
    expect(component.container).toHaveTextContent(blog.likes)
  })
})

describe('clicking the like button', () => {
  test('twice fires the event handler twice', () => {
    const handleLike = jest.fn()

    const component = render(
      <Blog blog={blog} handleLike={handleLike} />
    )

    const showButton = component.getByText('view')
    fireEvent.click(showButton)

    const likeButton = component.getByText('like')
    const times = 2
    for (let i = 0; i < times; i++) {
      fireEvent.click(likeButton)
    }
    expect(handleLike.mock.calls).toHaveLength(times)
  })
})
