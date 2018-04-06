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
    render() {
        const { classes, value, onChange, items, title, helperText} = this.props;
        return (
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="{title}">{title}</InputLabel>
                <Select
                    value={value}
                    onChange={onChange}
                    input={<Input name="{title}" id="{title}" />}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {   items.map( (i, k) =>
                        <MenuItem key={k}  value={i}>{i}</MenuItem>
                    )
                    }
                </Select>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        );
    }
}
SelectItem.propTypes = {
    classes: PropTypes.object,
    items: PropTypes.array,
    value: PropTypes.string,
    onChange: PropTypes.func,
    title: PropTypes.string,
    helperText: PropTypes.string,
};
