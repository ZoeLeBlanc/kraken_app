import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { fetchGraphIfNeeded } from '../../actions/graphActions';
import compose from 'recompose/compose';
// import Typography from 'material-ui/Typography';
// import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
        flexGrow: 1,
    }),
    paper: {
        height: 600,
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});
export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        const { graph } = this.props;
        console.log(graph.length);
        return (
            <div>
                { Object.keys(graph).length === 0 ?
                    <h2>Loading</h2> :
                    this.renderGraph()
                }
            </div>
        );
    }
}
Dashboard.propTypes = {
    graph: PropTypes.object,
    getGraph: PropTypes.func,
    isFetching: PropTypes.bool,
    classes: PropTypes.object,
};

const mapStateToProps = (state) => {
    const { graphReducer } = state;
    const {
        isFetching,
        graph
    } = graphReducer;

    return {
        graph,
        isFetching,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGraph: () => {
            dispatch(fetchGraphIfNeeded());
        }
    };
};
export default compose(
    withStyles(styles, { name: 'Dashboard' }),
    connect(mapStateToProps, mapDispatchToProps)
)(Dashboard);
