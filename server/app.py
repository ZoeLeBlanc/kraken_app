'''server/app.py - main api app declaration'''
from flask import Flask, g, request, jsonify, send_from_directory
from flask.json import JSONEncoder
from flask_cors import CORS
from neo4j.v1 import GraphDatabase, basic_auth

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

from .api.network_routes import network_routes
from .api.graph_routes import graph_routes

app.register_blueprint(network_routes)
app.register_blueprint(graph_routes)

##
# View route
##

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
