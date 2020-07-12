import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('it renders content when closed', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'ben',
    url: 'http://blog.example.com',
    likes: 5,
  }

  const component = render(
    <Blog
      blog={blog}
      onLike={jest.fn()}
      onRemove={jest.fn()}
      showRemove={false}
    />,
  )

  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container).not.toHaveTextContent(blog.url)
  expect(component.container).not.toHaveTextContent(/likes \d/)
})
