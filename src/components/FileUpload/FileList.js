import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FileList extends Component {
    list(files) {
        return files.map(file => (
  			    <li key={file.name}>{`'${file.name}' of size '${file.size}' and type '${
  				file.type}'`}</li>
        ));
  	}

    render() {
		    const { files } = this.props;

    		if (files.length === 0) {
    			   return <div>Nothing to display</div>;
    		}

    		return <div>{this.list(files)}</div>;
    	}
}

FileList.propTypes = {
    files: PropTypes.arrayOf(PropTypes.object),
};
export default FileList;
