'''server/app.py - main api app declaration'''
from flask import Flask, g, request, jsonify, send_from_directory
from flask_cors import CORS
from .models import Person
from neo4j.v1 import GraphDatabase, basic_auth
# from flask_restful import Resource, Api

'''Main wrapper for app creation'''
app = Flask(__name__, static_folder='../build')
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

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
  '''Return index.html for all non-api routes'''
  #pylint: disable=unused-argument
  return send_from_directory(app.static_folder, 'index.html')

def run():
    app.run(debug=True)
