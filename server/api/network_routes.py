from flask import Blueprint, jsonify, request, g
import json
import pandas as pd
import networkx as nx
from networkx.readwrite import json_graph

network_routes = Blueprint('network_routes', __name__)

@network_routes.route('/api/network/get_csv_headers')
def get_csv_headers(request):
    file = request.files['file']
    df = pd.read_csv(file)
    cols = df.columns.values.tolist()
    return jsonify({ 'cols': cols }), 200


@network_routes.route('/api/network/create_network_nodes_edges')
def create_network_nodes_edges(request):
    files = request.files['file']
    nodes_file = [file for file in files if 'nodes' in file.file_name ]
    edges_file = [file for file in files if 'edges' in file.file_name ]
    index = request.data['index']
    nodes = pd.read_csv(nodes_file)
    edges = pd.read_csv(edges_file)
    G = nx.from_pandas_edgelist(edges, 'source', 'target')
    nodes["id"] = nodes.index + 1
    data = nodes.set_index(index).to_dict('index').items()
    G.add_nodes_from(data)
    degree = nx.degree(G)
    partition = community.best_partition(G)
    betweeness = nx.betweenness_centrality(G)
    for u,v,d in G.edges(data=True):
        d['degree'] = degree[u]
        d['community'] = partition[u]
        d['betweenness_centrality'] = betweeness[u]

    for d, v in G.nodes(data=True):
        print(d, v)
        v['degree'] = degree[d]
        v['community'] = partition[d]
        v['betweenness_centrality'] = betweeness[d]
    data = json_graph.node_link_data(G)
    return jsonify({ 'network': data }), 200

@network_routes.route('/api/network/create_network_nodes')
    file = request.files['file']
    cols = request.data['cols']
    index = request.data['index']
    df = pd.read_csv(file)
    df.fillna(0, inplace=True)
    G=nx.from_pandas_edgelist(df, cols[0], cols[1])
    data = df.set_index(index).to_dict('index').items()
    G.add_nodes_from(data)
    degree = nx.degree(G)
    partition = community.best_partition(G)
    betweeness = nx.betweenness_centrality(G)
    for u,v,d in G.edges(data=True):
        d['degree'] = degree[u]
        d['community'] = partition[u]
        d['betweenness_centrality'] = betweeness[u]

    for d, v in G.nodes(data=True):
        print(d, v)
        v['degree'] = degree[d]
        v['community'] = partition[d]
        v['betweenness_centrality'] = betweeness[d]
    data = json_graph.node_link_data(G)
    return jsonify({ 'network': data }), 200
