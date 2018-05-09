import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import D3ForceGraph from '../../components/graphs/D3ForceGraph';
import compose from 'recompose/compose';
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
        height: 600,
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});
export class Graph extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.state = { zoom: false };
    }
    switchChange(name, event) {
        this.setState({ [name]: event.target.checked });
    }
    renderGraph() {
        const { network, classes } = this.props;
        console.log(network);
        const g = network === undefined ? {} : network;
        console.log(g.nodes, g.edges);
        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <D3ForceGraph nodes={g.nodes} links={g.edges} height={350} width={900}
                            radius={18}
                            zoom={this.state.zoom}
                            switchChange={(name, event) => this.switchChange(name, event)}
                            classes={classes}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
    render() {
        const { network } = this.props;
        console.log(network.length);
        return (
            <div>
                {Object.keys(network).length === 0 ?
                    <h2>Loading</h2> :
                    this.renderGraph()
                }
            </div>
        );
    }
}
Graph.propTypes = {
    network: PropTypes.object,
    isFetching: PropTypes.bool,
    classes: PropTypes.object,
};

const mapStateToProps = (state) => {
    const { dashboardReducer } = state;
    const {
        isFetching,
        network
    } = dashboardReducer;

    return {
        network,
        isFetching,
    };
};


export default compose(
    withStyles(styles, { name: 'Graph' }),
    connect(mapStateToProps, {})
)(Graph);
