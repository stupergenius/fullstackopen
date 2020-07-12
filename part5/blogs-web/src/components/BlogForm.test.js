import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'ben',
  url: 'http://blog.example.com',
  likes: 5,
}

test('it calls `createBlog` with the form blog data', () => {
  const createMock = jest.fn()

  const component = render(
    <BlogForm
      createBlog={createMock}
    />,
  )

  const form = component.container.querySelector('form')

  fireEvent.change(form.querySelector('input[name="blog_title"'), {
    target: { value: blog.title },
  })
  fireEvent.change(form.querySelector('input[name="blog_author"'), {
    target: { value: blog.author },
  })
  fireEvent.change(form.querySelector('input[name="blog_url"'), {
    target: { value: blog.url },
  })
  fireEvent.submit(form)

  expect(createMock).toBeCalledTimes(1)
  expect(createMock).toBeCalledWith({
    title: blog.title,
    author: blog.author,
    url: blog.url,
  })
})
