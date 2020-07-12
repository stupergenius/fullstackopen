import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'ben',
  url: 'http://blog.example.com',
  likes: 5,
}

test('it renders content when closed', () => {
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

test('it shows more details when clicking the view button', () => {
  const component = render(
    <Blog
      blog={blog}
      onLike={jest.fn()}
      onRemove={jest.fn()}
      showRemove={false}
    />,
  )

  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)

  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container).toHaveTextContent(blog.url)
  expect(component.container).toHaveTextContent(`likes ${blog.likes}`)
})
