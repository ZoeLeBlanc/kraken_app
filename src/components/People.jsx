import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { fetchPeopleIfNeeded } from '../actions/peopleActions';

export class People extends React.Component {
  constructor(props) {
    super(props);

  }
  componentDidMount(){
    const { getAllPeople } = this.props
    getAllPeople();
  }

  render() {
    const { people, isFetching } = this.props
    return (
      <ul>
        Person
        {isFetching ?
          <h2>Loading</h2> :
          null
        }
      </ul>
    );
  }
}
People.propTypes = {
  people: PropTypes.array.isRequired,
  getAllPeople: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { peopleFetched, isFetching } = state
  const {
    people
  } = peopleFetched || []
  return {
    people,
    isFetching
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getAllPeople: () => {
      dispatch(fetchPeopleIfNeeded())
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(People);
