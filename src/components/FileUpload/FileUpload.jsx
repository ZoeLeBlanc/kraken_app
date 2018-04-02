import React from 'react';
import PropTypes from 'prop-types';
// import Typography from 'material-ui/Typography';
// import Grid from 'material-ui/Grid';
import Dialog, {
    DialogActions,
    DialogContent,
    // DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { DragDropContext, DragDropContextProvider } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';
import TargetBox from './TargetBox';
import FileList from './FileList';
import Icon from 'material-ui/Icon';
const style = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
};
export class FileUpload extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }

    render() {
        const { FILE } = NativeTypes;
        const { classes, handleClickOpen, handleClose, handleFileDrop, onChange, droppedFiles, open, onSave } = this.props;
        return (
            <div>
                <Button style={style} variant="fab" color="secondary" aria-label="file_upload" onClick={() => handleClickOpen()}>
                    <Icon>file_upload</Icon>
                </Button>
                <Dialog
                    open={open}
                    onClose={() => handleClose()}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="simple-dialog-title">Upload CSV </DialogTitle>
                    <DialogContent>
                        <DragDropContextProvider backend={HTML5Backend}>
      			                <div>
      					                <TargetBox accepts={[FILE]} onDrop={() =>handleFileDrop()} />
      					                <FileList files={droppedFiles} />
      				              </div>
      			            </DragDropContextProvider>
                        <input
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsx, .xls, .csv, text/csv"
                            className={classes.input}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={(e) => onChange(e)}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="raised"  component="span" className={classes.button}>
                             Upload
                            </Button>
                        </label>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() =>handleClose()} color="primary">
                        Cancel
                        </Button>
                        <Button onClick={() =>{handleClose(); onSave();}} color="primary">
                        Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
FileUpload.propTypes = {
    classes: PropTypes.object,
    files: PropTypes.arrayOf(PropTypes.object),
    handleClose: PropTypes.func,
    handleClickOpen: PropTypes.func,
    onChange: PropTypes.func,
    handleFileDrop: PropTypes.func,
    droppedFiles: PropTypes.arrayOf(PropTypes.object),
    open: PropTypes.bool,
    onSave: PropTypes.func,
};

export default DragDropContext(HTML5Backend)(FileUpload);
