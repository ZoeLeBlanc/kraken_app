import React from 'react';
import UpdatedD3Example from '../containers/LongD3';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
const dataset = {
    'nodes': [
        {
            'name': 'Peter',
            'label': 'Person',
            'id': 1
        },
        {
            'name': 'Michael',
            'label': 'Person',
            'id': 2
        },
        {
            'name': 'Neo4j',
            'label': 'Database',
            'id': 3
        },
        {
            'name': 'Graph Database',
            'label': 'Database',
            'id': 4
        }
    ],
    'links': [
        {
            'source': 1,
            'target': 2,
            'type': 'KNOWS',
            'since': 2010,
            'key': '1,2'
        },
        {
            'source': 1,
            'target': 3,
            'type': 'FOUNDED',
            'key': '1,3'
        },
        {
            'source': 2,
            'target': 3,
            'type': 'WORKS_ON',
            'key': '2,3'
        },
        {
            'source': 3,
            'target': 4,
            'type': 'IS_A',
            'key': '3,4'
        }
    ]
};

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.state = {nodes: [], links: [], version: 0, zoom: false};
    }

    componentWillMount() {
        this.updateData();
    }

    updateData() {
        this.setState({nodes: dataset.nodes, links: dataset.links, version: this.state.version + 1});
    }
    handleChange(name, event) {
        console.log(event.target.checked);
        this.setState({ [name]: event.target.checked });
    }
    render() {
        return (
            <div>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.zoom}
                                onChange={(e) => this.handleChange('zoom', e)}
                                value="zoom"
                                color="primary"
                            />
                        }
                        label="Zoom Graph"
                    />
                </FormGroup>
                <UpdatedD3Example {...this.state} />
            </div>
        );
    }
}
export default Projects;
