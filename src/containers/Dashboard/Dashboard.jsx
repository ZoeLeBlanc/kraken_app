import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import { fetchGraphIfNeeded } from '../../actions/graphActions';
import { loadFiles, selectedNodes, getCols } from './DashboardActions';
import compose from 'recompose/compose';
import Graph from './Graph';
import FileUpload from '../../components/FileUpload';
// import Select from 'material-ui/Select';
import { withStyles } from 'material-ui/styles';
import SelectItem from '../../components/SelectItem';

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
        console.log('nodes', this.props.nodes);
    }
    onSave() {
        console.log(this.state.droppedFiles);
        this.state.droppedFiles.map((f)=>{
            const reader = new FileReader();
            reader.readAsDataURL(f);
            reader.onload = () => {
                const finalFile = {'file_url': reader.result, 'filename': f.name, 'filetype': f.type};
                return this.props.saveCSVs(finalFile);
            };
        });
    }
    selectChange(e) {
        console.log(e);
        const file = this.props.uploadedFiles.filter( f => f.filename === e.target.value);
        file[0].selectedNodes = true;
        console.log(file);
        this.props.selectNodes(file[0].filename);
        const test = this.props.getCols(file);
        console.log(test);
    }
    render() {
        const { classes, uploadedFiles, nodes, columns, col1 } = this.props;
        console.log(columns.length);
        return (
            <div>
                {uploadedFiles.length > 0 ? <SelectItem
                    items={uploadedFiles.map(i => i.filename)}
                    onChange={(e)=>this.selectChange(e)}
                    value={nodes}
                    classes={classes}
                    title={'Select Nodes'}
                    helperText={'Select a file to be the nodes values in the network.'}
                /> : null}
                {columns.length > 0 ? <SelectItem
                    items={columns}
                    onChange={(e)=>this.selectChange(e)}
                    value={col1}
                    classes={classes}
                    title={'Select Column'}
                    helperText={'Select a column to use in the network.'}
                /> : null}
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
    getCols: PropTypes.func,
    selectNodes: PropTypes.func,
    classes: PropTypes.object,
    uploadedFiles: PropTypes.array,
    nodes: PropTypes.string,
    columns: PropTypes.array,
    col1: PropTypes.string,
};

const mapStateToProps = (state) => {
    const { dashboardReducer } = state;
    const {
        uploadedFiles,
        nodes,
        columns,
        col1,
    } = dashboardReducer;

    return {
        uploadedFiles,
        nodes,
        columns,
        col1
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        selectNodes: (nodes) => {
            dispatch(selectedNodes(nodes));
        },
        saveCSVs: (file) =>{
            dispatch(loadFiles(file));
        },
        getCols: (file) =>{
            dispatch(getCols(file));
        }
    };
};
export default compose(
    withStyles(styles, { name: 'Dashboard' }),
    connect(mapStateToProps, mapDispatchToProps)
)(Dashboard);
