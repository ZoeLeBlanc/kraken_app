import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { fetchGraphIfNeeded } from '../../actions/graphActions';
import { loadFiles } from './DashboardActions';
import compose from 'recompose/compose';
import Graph from './Graph';
import FileUpload from '../../components/FileUpload';
// import Select from 'material-ui/Select';
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
    input: {
        display: 'none',
    },
});
export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.handleFileDrop = this.handleFileDrop.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            open: false,
            droppedFiles: [],
        };
    }
    componentDidMount() {

    }
    handleClickOpen() {
        this.setState({ open: true });
    }

    handleClose() {
        this.setState({ open: false });
    }
    handleFileDrop(item, monitor) {
  		  if (monitor) {
  			    const files = monitor.getItem().files;
            const droppedFiles = files.filter(file => file.type === 'text/csv');
  			    this.setState({ droppedFiles });
  		}
  	}
    onChange(e) {
        const droppedFiles = Object.entries(e.target.files).map( f => f[1]);
        this.setState({ droppedFiles });
    }
    onSave() {
        this.state.droppedFiles.map( f => this.props.saveCSVs(f));
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Graph/>
                <FileUpload handleClose={this.handleClose} open={this.state.open} droppedFiles={this.state.droppedFiles} handleClickOpen={this.handleClickOpen}
                    classes={classes}
                    onChange={(e)=>this.onChange(e)}
                    onSave={() =>this.onSave()}/>
            </div>
        );
    }
}
Dashboard.propTypes = {
    saveCSVs: PropTypes.func,
    classes: PropTypes.object,
};

const mapStateToProps = (state) => {
    const { dashboardReducer } = state;
    const {
        headers
    } = dashboardReducer;

    return {
        headers,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGraph: () => {
            dispatch(fetchGraphIfNeeded());
        },
        saveCSVs: (file) =>{
            dispatch(loadFiles(file));
        }
    };
};
export default compose(
    withStyles(styles, { name: 'Dashboard' }),
    connect(mapStateToProps, mapDispatchToProps)
)(Dashboard);
