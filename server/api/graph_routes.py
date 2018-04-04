from flask import Blueprint, jsonify, request, g
import json
import pandas as pd
import networkx as nx
from networkx.readwrite import json_graph

graph_routes = Blueprint('graph_routes', __name__)

@graph_routes.route('/api/graph/get_graph')
def get_graph():
    print('api called')
    db = get_db()
    with db as session:
        nodesMap = []
        edgesMap = []
        graph = session.write_transaction(Graph.get_graph)
        for item in graph:

            node_item = item[0]
            for l in node_item.labels:
                node_label = l
                full_label = l
                for prop in node_item.properties:
                    if prop == 'created' or prop == 'updated':
                        pass
                    else:
                        full_label += ' ' + str(node_item.properties[prop])
            node = {
                'id': node_item.id,
                'node_label':node_label,
                'properties': node_item.properties,
                'label': full_label
            }
            if [node for node in nodesMap if node['id'] == node_item.id]:
                pass
            else:
                nodesMap.append(node)

            rel_item = item[1]

            if rel_item == None:
                rel = {}
            else:
                rel_label = ''
                for prop in rel_item.properties:
                    if prop == 'start_date' or prop == 'end_date':
                        pass
                    else:
                        rel_label += str(rel_item.properties[prop]) +' '
                rel = {
                    'id': rel_item.id,
                    'type': rel_item.type,
                    'source':rel_item.start,
                    'target':rel_item.end,
                    'properties':rel_item.properties,
                    'label':rel_label
                }
                if [rel for rel in edgesMap if rel['id'] == rel_item.id]:
                    pass
                else:
                    edgesMap.append(rel)
        print(nodesMap, edgesMap)

        return jsonify({'nodes':nodesMap, 'edges':edgesMap})

@graph_rotes.route('/api/get_people')
def get_people():
    print('api called')
    db = get_db()
    with db as session:
        people = session.write_transaction(Person.get_people)
        all_people = []
        [all_people.append(serialize_person(person[0])) for person in people]
        print('api finished')
        return jsonify(all_people)

def serialize_person(person):
    return {
        'id': person.id,
        'first_name': person.properties['first_name'],
        'last_name': person.properties['last_name'],
    }
