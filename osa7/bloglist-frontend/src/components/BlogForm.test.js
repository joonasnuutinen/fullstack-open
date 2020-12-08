import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('adding a blog calls the event handler with the correct data', () => {
  const testCb = jest.fn()
  const component = render(
    <BlogForm testCb={testCb} />
  )

  const newNoteButton = component.getByText('new note')
  fireEvent.click(newNoteButton)

  const titleInput = component.container.querySelector('input[name="title"]')
  const authorInput = component.container.querySelector('input[name="author"]')
  const urlInput = component.container.querySelector('input[name="url"]')

  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'http://localhost:3000'
  }


  fireEvent.change(titleInput, {
    target: { value: blog.title }
  })

  fireEvent.change(authorInput, {
    target: { value: blog.author }
  })

  fireEvent.change(urlInput, {
    target: { value: blog.url }
  })

  const form = component.container.querySelector('form')
  fireEvent.submit(form)

  expect(testCb.mock.calls).toHaveLength(1)
  expect(testCb.mock.calls[0][0]).toEqual(blog)
})
