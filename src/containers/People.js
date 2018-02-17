import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { fetchPeopleIfNeeded } from '../actions/peopleActions';

export class People extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.getAllPeople();
    }
    renderPeople() {
        const {people} = this.props;
        const persons = people === undefined ? [] : people;
        return persons.map( (person, i) => {
            return (
                <li key={i}>{person.first_name}</li>
            );
        });
    }
    render() {
        const { isFetching } = this.props;
        return (
            <ul>
            Person
                {isFetching ?
                    <h2>Loading</h2> :
                    this.renderPeople()
                }
            </ul>
        );
    }
}
People.propTypes = {
    people: PropTypes.array,
    getAllPeople: PropTypes.func,
    isFetching: PropTypes.bool
};

const mapStateToProps = (state) => {
    const { peopleReducer } = state;
    const {
        isFetching,
        people
    } = peopleReducer || {
        isFetching: false,
        people: []
    };

    return {
        people,
        isFetching,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAllPeople: () => {
            dispatch(fetchPeopleIfNeeded());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(People);
