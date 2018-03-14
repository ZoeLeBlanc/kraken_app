import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};
const links = [
    {'people': '/people'},
    {'about': '/about'},
    {'dashboard': '/dashboard'},
    {'projects': '/projects'}
];


class Navbar extends Component {
    renderLinks() {
        return links.map( (link, i) => {
            return (
                <Button key={i} color="inherit" href={Object.values(link)[0]}>{Object.keys(link)[0]}</Button>
            );
        });
    }
    render() {
        const {classes} = this.props;
        return (
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Typography className={classes.flex} type="title" color="inherit">
                        <Button href="/">Kraken</Button>
                    </Typography>
                    {this.renderLinks()}
                </Toolbar>
            </AppBar>
        );
    }
}

Navbar.propTypes = {
    classes: PropTypes.object
};

export default withStyles(styles)(Navbar);
