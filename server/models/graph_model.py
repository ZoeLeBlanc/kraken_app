class Graph(object):

    def __init__(self):
        pass

    @classmethod
    def get_graph(self, tx):
        query = '''
        MATCH (n) OPTIONAL MATCH (n)-[r]-() RETURN n, r;
        '''
        result = tx.run(query)
        return result
