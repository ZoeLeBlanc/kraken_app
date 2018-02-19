import React from 'react';
import D3Graph from '../containers/D3Graph';

const nodeCount = 100;
const nodes = [];
for (let i = 0; i < nodeCount; i++) {
    nodes.push({
  	    r: (Math.random() * 5 ) + 2,
        x: 0,
        y: 0
    });
}

const links = [];
for (let i = 0; i < nodeCount; i++) {
    let target = 0;
    do {
        target = Math.floor(Math.random() * nodeCount);
    } while(target === i);
    links.push({
        source: i,
        target
    });
}

console.log(links);

const About = () => (
    <div >
      About
        <D3Graph nodes={nodes} links={links} />,
    </div>
);

export default About;
