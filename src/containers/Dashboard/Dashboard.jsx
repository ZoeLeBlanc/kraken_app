import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { fetchGraphIfNeeded } from '../../actions/graphActions';
import { saveCSV } from './DashboardActions';
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
        console.log(e.target.files);
        const droppedFiles = Object.entries(e.target.files).map( f => f[1]);
        this.setState({ droppedFiles });
        console.log(droppedFiles);
    }
    onSave() {
        console.log(this.state.droppedFiles);
        this.state.droppedFiles.map( f => this.props.saveCSVs(f));
    }
    renderSelects() {
        console.log(this.props.headers);
    }
    render() {
        const { classes, headers } = this.props;
        const allHeaders = headers.headers;
        return (
            <div>
                { allHeaders.length === 0 ? null : this.renderSelects()
                }
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
    headers: PropTypes.object,
    saveCSVs: PropTypes.func,
    isSaving: PropTypes.bool,
    classes: PropTypes.object,
};

const mapStateToProps = (state) => {
    const { dashboardReducer } = state;
    const {
        isSaving,
        headers
    } = dashboardReducer;

    return {
        headers,
        isSaving,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGraph: () => {
            dispatch(fetchGraphIfNeeded());
        },
        saveCSVs: (file) =>{
            dispatch(saveCSV(file));
        }
    };
};
export default compose(
    withStyles(styles, { name: 'Dashboard' }),
    connect(mapStateToProps, mapDispatchToProps)
)(Dashboard);
