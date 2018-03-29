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

export class FileUpload extends React.Component {
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
    render() {
        const { FILE } = NativeTypes;
        const { droppedFiles } = this.state;
        const { classes } = this.props;
        return (
            <div>
                <Button onClick={this.handleClickOpen}>Open form dialog</Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="simple-dialog-title">Upload CSV </DialogTitle>
                    <DialogContent>
                        <DragDropContextProvider backend={HTML5Backend}>
      			                <div>
      					                <TargetBox accepts={[FILE]} onDrop={this.handleFileDrop} />
      					                <FileList files={droppedFiles} />
      				              </div>
      			            </DragDropContextProvider>
                        <input
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsx, .xls, .csv, text/csv"
                            className={classes.input}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={this.onChange}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="raised"  component="span" className={classes.button}>
                             Upload
                            </Button>
                        </label>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                        Cancel
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                        Subscribe
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
};

export default DragDropContext(HTML5Backend)(FileUpload);
