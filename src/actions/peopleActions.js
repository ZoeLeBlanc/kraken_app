export const LOAD_PEOPLE = 'LOAD_PEOPLE';
export const REQUEST_PEOPLE = 'REQUEST_PEOPLE';

export const loadPeople = (json) => ({
    type: 'LOAD_PEOPLE',
    people: json
});

export const requestPeople = () => ({
    type: 'REQUEST_PEOPLE'
});

const shouldFetchPeople = (state) => {
    const { peopleReducer } = state;
    const people = peopleReducer.people;
    const isFetching = peopleReducer.isFetching;
    if (people.length === 0) {
        return true;
    }
    if (isFetching) {
        return false;
    }
    return (null);
};

export const fetchPeopleIfNeeded = () => {
    return (dispatch, getState) => {
        if (shouldFetchPeople(getState())) {
            return getPeople(dispatch);
        }
        return (null);
    };
};

const getPeople = (dispatch) => {
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
        );
};
