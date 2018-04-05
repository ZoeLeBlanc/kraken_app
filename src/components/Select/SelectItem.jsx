import React from 'react';
import PropTypes from 'prop-types';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

export default class SelectItem extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }

    render() {
        const { classes, value, onChange, items } = this.props;
        return (
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-helper">Age</InputLabel>
                <Select
                    value={value}
                    onChange={onChange}
                    input={<Input name="age" id="age-helper" />}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {   items.map( i =>
                        <MenuItem value={i.filename}>i.filename</MenuItem>
                    )
                    }
                </Select>
                <FormHelperText>Some important helper text</FormHelperText>
            </FormControl>
        );
    }
}
SelectItem.propTypes = {
    classes: PropTypes.object,
    items: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.object,
    onChange: PropTypes.func,
};
