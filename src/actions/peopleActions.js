import config from '../config/client';
export const LOAD_PEOPLE = 'LOAD_PEOPLE'
export const REQUEST_PEOPLE = 'REQUEST_PEOPLE'

export const loadPeople = (json) => ({
  type: 'LOAD_PEOPLE',
  people: json.data.children.map(child => child.data)
})

export const requestPeople = () => ({
  type: 'REQUEST_PEOPLE'
})

const shouldFetchPeople = (state) => {
  const people = state.people
  const isFetching = state.isFetching
  if (!people) {
    return true
  }
  if (isFetching) {
    return false
  }
}

export const fetchPeopleIfNeeded = (dispatch, getState) => {
  if (shouldFetchPeople(getState())) {
    return dispatch(getPeople())
  }
}
const getPeople = () => {
  return function(dispatch) {
    dispatch(requestPeople());
    return fetch('http://localhost:7082/api/get_people')
      .then(response => response.json()
        .catch(err => {
          console.err(`'${err}' happened!`);
          return {};
        })
        .then(json => {
          console.log(json);
          dispatch(loadPeople(json));
        })
    )
  }
}
