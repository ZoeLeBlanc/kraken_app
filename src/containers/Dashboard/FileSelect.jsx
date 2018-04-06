import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { getCols, selectedEdges, selectedNodes, setColumn } from './DashboardActions';
import compose from 'recompose/compose';
import SelectItem from '../../components/SelectItem';
// import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormLabel, FormControlLabel } from 'material-ui/Form';

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
    }
    componentDidMount() {
    }
    selectNodes(e) {
        console.log(e);
        const file = this.props.uploadedFiles.filter( f => f.filename === e.target.value);
        file[0].selectedNodes = true;
        console.log(file);
        this.props.selectNodes(file[0].filename);
        const test = this.props.getCols(file);
        console.log(test);
    }
    selectColumn(e) {
        this.props.setColumn(e.target.value);
    }
    selectEdges(e) {
        console.log(e.target.value);
    }
    render() {
        const { uploadedFiles, nodes, classes, columns, selectedCols } = this.props;
        console.log(selectedCols.length, selectedCols, selectedCols[0]);
        return (
            <div>
                {uploadedFiles.length > 0 ?
                    <div>
                        <SelectItem
                            items={uploadedFiles.map(i => i.filename)}
                            onChange={(e)=>this.selectNodes(e)}
                            value={nodes}
                            classes={classes}
                            title={'Select Nodes'}
                            helperText={'Select a file to be the nodes values in the network.'} />
                        <FormControl component="fieldset" required className={classes.formControl}>
                            <FormLabel component="legend">Add Edges or Use Node Columns</FormLabel>
                            <RadioGroup
                                aria-label="edges"
                                name="edges"
                                className={classes.group}
                                value={''}
                                onChange={(e)=>this.selectEdges(e)}
                            >
                                <FormControlLabel value="edges" control={<Radio />} label="Edges" />
                                <FormControlLabel value="columns" control={<Radio />} label="Columns" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    :
                    null}
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

            </div>
        );
    }
}
FileSelect.propTypes = {
    uploadedFiles: PropTypes.array,
    nodes: PropTypes.array,
    edges: PropTypes.array,
    columns: PropTypes.array,
    classes: PropTypes.object,
    selectedCols: PropTypes.array,
    selectNodes: PropTypes.func,
    getCols: PropTypes.func,
    setColumn: PropTypes.func,
};

const mapStateToProps = (state) => {
    const { dashboardReducer } = state;
    const {
        uploadedFiles,
        nodes,
        edges,
        columns,
        selectedCols
    } = dashboardReducer;

    return {
        uploadedFiles,
        nodes,
        edges,
        columns,
        selectedCols
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
        selectEdgeFile: (file) => {
            dispatch(selectedEdges(file));
        },
        setColumn: (col) => {
            dispatch(setColumn(col));
        },
    };
};
export default compose(
    withStyles(styles, { name: 'FileSelect' }),
    connect(mapStateToProps, mapDispatchToProps)
)(FileSelect);
