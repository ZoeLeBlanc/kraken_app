import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

const style = {
  	border: '1px solid gray',
  	height: '15rem',
  	width: '15rem',
  	padding: '2rem',
  	textAlign: 'center',
};

const boxTarget = {
  	drop(props, monitor) {
  		if (props.onDrop) {
  			  props.onDrop(props, monitor);
  		}
  	},
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    };
}
class TargetBox extends Component {
  	render() {
  		  const { canDrop, isOver, connectDropTarget } = this.props;
  		  const isActive = canDrop && isOver;

  		  return connectDropTarget(
  			    <div style={style}>
  				      {isActive ? 'Release to drop' : 'Drag file here'}
  			    </div>,
  		  );
  	}
}
TargetBox.propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
    onDrop: PropTypes.func,
};
export default DropTarget(props => props.accepts, boxTarget, collect)(TargetBox);
