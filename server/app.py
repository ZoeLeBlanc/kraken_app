'''server/app.py - main api app declaration'''
from flask import Flask, g, request, jsonify, send_from_directory
from flask.json import JSONEncoder
from flask_cors import CORS
from .models import Person, Graph
from neo4j.v1 import GraphDatabase, basic_auth
import pandas as pd
import networkx as nx
# from flask_restful import Resource, Api
class CustomJSONEncoder(JSONEncoder):

    def default(self, obj):
        try:
            if isinstance(obj, set):
                return list(obj)
        except TypeError:
            pass
        return JSONEncoder.default(self, obj)
'''Main wrapper for app creation'''
app = Flask(__name__, static_folder='../build')
app.json_encoder = CustomJSONEncoder
CORS(app)

driver = GraphDatabase.driver("bolt://127.0.0.1:7687", auth=("neo4j", "asdf1234"))


def get_db():
    if not hasattr(g, 'neo4j_db'):
        g.neo4j_db = driver.session()
    return g.neo4j_db

@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'neo4j_db'):
        g.neo4j_db.close()

@app.route('/api/get_graph')
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

@app.route('/api/get_people')
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
##
# View route
##
def create_graph(pd_df):
    df2 = pd.concat([pd_df, pd_df.T]).fillna(0)
    df2 = df2.reindex(df2.columns)
    graph = nx.from_numpy_matrix(df2.values)

@app.route('/api/load_csv', methods=['POST'])
def load_csv():
    print('request', request.files, request.__dict__, request.form)
    file = request.files['file']
    print(file.filename)
    pd_df = pd.read_csv(file)
    print(pd_df.columns.values.tolist())
    response = {'headers': pd_df.columns.values.tolist()}
    return jsonify(response)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
  '''Return index.html for all non-api routes'''
  #pylint: disable=unused-argument
  return send_from_directory(app.static_folder, 'index.html')

def run():
    app.run(debug=True)
