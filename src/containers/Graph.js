import React from 'react';
import {Sigma, NeoCypher, EdgeShapes, RelativeSize} from 'react-sigma';

class ViewGraph extends React.Component {
    constructor() {
        super();
    }
    onNodeHover(e) {
        return console.log(e, e.data.node.neo4j_labels[0], e.data.node.neo4j_data);
    }
    render() {
        return (
            <Sigma style={{
                maxWidth: 'inherit',
                height: '50vh'
            }} settings={{
                drawEdgeLabels: true,
                minArrowSize: 30,
                drawNodeLabels: true,
            }}
            onOutNode={e => this.onNodeHover(e)}>
                <EdgeShapes default="arrow" />
                <RelativeSize initialSize={8}/>
                <NeoCypher
                    url="http://127.0.0.1:7474"
                    user="neo4j"
                    password="asdf1234"
                    query="match (n)-[r]->(m) return n,r,m" />
            </Sigma>
        );
    }
}

export default ViewGraph;
