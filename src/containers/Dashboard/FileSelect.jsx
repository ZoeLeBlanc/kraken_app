import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { getCols, selectedEdges, selectedNodes, setColumn, hasEdges } from './DashboardActions';
import compose from 'recompose/compose';
import SelectItem from '../../components/SelectItem';
// import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormLabel, FormControlLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    },
});

export class FileSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            value: ''
        };
    }
    componentDidMount() {
    }
    selectNodes(e) {
        console.log(e);
        const file = this.props.uploadedFiles.filter( f => f.filename === e.target.value);
        file[0].selectedNodes = true;
        this.props.selectNodes(file[0].filename);
    }
    selectEdges(e) {
        console.log(e.target.value);
        const edgeFile = this.props.uploadedFiles.filter(f => f.filename === e.target.value);
        edgeFile[0].selectedEdges = true;
        this.props.selectEdges(edgeFile[0].filename);
    }
    selectColumn(e) {
        this.props.setColumn(e.target.value);
    }
    selectNetworkType(e) {
        this.setState({'value': e.target.value});
        if (e.target.value === 'columns') {
            const file = this.props.uploadedFiles.filter(f => f.filename === this.props.nodes);
            this.props.getCols(file);
            this.props.hasEdges();
        } else {
            this.props.hasEdges();
        }
    }
    createNetwork() {
        const { uploadedFiles } = this.props;
        const nodeFile = uploadedFiles.filter(f => f.selectedNodes === true);
        nodeFile.map( f => console.log(f));
        const edgeFile = uploadedFiles.filter(f => f.selectedEdges === true);
        edgeFile.map(f => console.log(f));
        // this.props.createNetwork(nodeFile, edgeFile);
    }
    render() {
        const { uploadedFiles, nodes, classes, columns, selectedCols, networkHasEdges, edges } = this.props;
        const edgeFiles = uploadedFiles.filter(f => f.selectedNodes === undefined);
        return (
            <div>
                {uploadedFiles.length > 0 ?
                    <SelectItem
                        items={uploadedFiles.map(i => i.filename)}
                        onChange={(e)=>this.selectNodes(e)}
                        value={nodes}
                        classes={classes}
                        title={'Select Nodes'}
                        helperText={'Select a file to be the nodes values in the network.'} />
                    :
                    null}
                {nodes.length > 0 ? <FormControl component="fieldset" required className={classes.formControl}>
                    <FormLabel component="legend">Add Edges or Use Node Columns</FormLabel>
                    <RadioGroup
                        aria-label="edges"
                        name="edges"
                        className={classes.group}
                        value={this.state.value}
                        onChange={(e) => this.selectNetworkType(e)}
                    >
                        <FormControlLabel value="edges" control={<Radio />} label="Edges" />
                        <FormControlLabel value="columns" control={<Radio />} label="Columns" />
                    </RadioGroup>
                </FormControl> : null

                }
                {networkHasEdges ? <SelectItem
                    items={edgeFiles.length > 0 ? edgeFiles.map(i => i.filename) : []}
                    onChange={(e) => this.selectEdges(e)}
                    value={edges}
                    classes={classes}
                    title={'Select Edges'}
                    helperText={'Select a file to be the edge values in the network.'} /> : null }
                {columns.length > 0 ? <SelectItem
                    items={columns}
                    onChange={(e)=>this.selectColumn(e)}
                    value={selectedCols.length > 0 ? selectedCols[0] :  ''}
                    classes={classes}
                    title={'Select Column'}
                    helperText={'Select a column to use in the network.'}
                /> : null}
                {selectedCols.length > 0 ? <SelectItem
                    items={columns}
                    onChange={(e)=>this.selectColumn(e)}
                    value={selectedCols.length > 1 ? selectedCols[1] : ''}
                    classes={classes}
                    title={'Select Column'}
                    helperText={'Select a column to use in the network.'}
                /> : null}
                {edges.length > 0 || selectedCols.legnth == 2 ? 
                    <Button variant="raised" color="primary" className={classes.button} onClick={this.createNetwork}>
                    Create Network
                    </Button> : null}

            </div>
        );
    }
}
FileSelect.propTypes = {
    uploadedFiles: PropTypes.array,
    nodes: PropTypes.string,
    edges: PropTypes.string,
    columns: PropTypes.array,
    classes: PropTypes.object,
    selectedCols: PropTypes.array,
    selectNodes: PropTypes.func,
    getCols: PropTypes.func,
    setColumn: PropTypes.func,
    networkHasEdges: PropTypes.bool,
    hasEdges: PropTypes.func,
    selectEdges: PropTypes.func,
};

const mapStateToProps = (state) => {
    const { dashboardReducer } = state;
    const {
        uploadedFiles,
        nodes,
        edges,
        columns,
        selectedCols,
        networkHasEdges,
        selectEdges
    } = dashboardReducer;

    return {
        uploadedFiles,
        nodes,
        edges,
        columns,
        selectedCols,
        networkHasEdges,
        selectEdges
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCols: (file) => {
            dispatch(getCols(file));
        },
        selectNodes: (file) => {
            dispatch(selectedNodes(file));
        },
        selectEdges: (file) => {
            dispatch(selectedEdges(file));
        },
        setColumn: (col) => {
            dispatch(setColumn(col));
        },
        hasEdges: () => {
            dispatch(hasEdges());
        }
    };
};
export default compose(
    withStyles(styles, { name: 'FileSelect' }),
    connect(mapStateToProps, mapDispatchToProps)
)(FileSelect);
