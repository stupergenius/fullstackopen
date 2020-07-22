export const filterAction = filter => ({
  type: 'FILTER',
  filter
})

const reducer = (state = '', action) => {
  switch (action.type) {
    case 'FILTER':
      return action.filter
    default:
      return state
  }
}

export default reducer
