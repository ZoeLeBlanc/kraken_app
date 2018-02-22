import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { fetchGraphIfNeeded } from '../../actions/graphActions';
import D3ForceGraph from '../../components/graphs/D3ForceGraph';
import Paper from 'material-ui/Paper';
import compose from 'recompose/compose';
// import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
        flexGrow: 1,
    }),
    paper: {
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
        this.props.getGraph();
    }
    renderGraph() {
        const {graph, classes} = this.props;
        console.log(graph);
        const g = graph === undefined ? {} : graph;
        console.log(g.nodes, g.edges);
        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <D3ForceGraph nodes={g.nodes} links= {g.edges} height={400} width={900} />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
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
