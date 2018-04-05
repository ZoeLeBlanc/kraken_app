import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { getCols, selectedEdges, selectedNodes } from './DashboardActions';
import compose from 'recompose/compose';
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
export class FileSelect extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    renderSelectNode() {

    }
    render() {

    }
}
FileSelect.propTypes = {
    uploadedFiles: PropTypes.array,
    nodes: PropTypes.array,
    edges: PropTypes.array,
    nodeColumns: PropTypes.array
};

const mapStateToProps = (state) => {
    const { dashboardReducer } = state;
    const {
        uploadedFiles,
        nodes,
        edges,
        nodeColumns
    } = dashboardReducer;

    return {
        uploadedFiles,
        nodes,
        edges,
        nodeColumns
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCols: () => {
            dispatch(getCols());
        },
        selectNodeFile: (file) => {
            dispatch(selectedNodes(file));
        },
        selectEdgeFile: (file) => {
            dispatch(selectedEdges(file));
        }
    };
};
export default compose(
    withStyles(styles, { name: 'FileSelect' }),
    connect(mapStateToProps, mapDispatchToProps)
)(FileSelect);
