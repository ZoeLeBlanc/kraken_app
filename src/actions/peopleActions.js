import config from '../config/client';
export const LOAD_PEOPLE = 'LOAD_PEOPLE'

export const loadPeople = (people) => ({
  type: 'LOAD_PEOPLE',
  people:
})

export function getPeople() {
  return function(dispatch) {
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
