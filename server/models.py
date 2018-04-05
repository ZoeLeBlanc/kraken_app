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


class Person(object):

    def __init__(self,first_name, last_name):
        self.first_name = first_name,
        self.last_name = last_name

    @classmethod
    def create_update(self, tx):
        query = '''
        MERGE (person:Person {first_name: {first_name} , last_name: {last_name} })
        ON CREATE SET person.created = timestamp()
        ON MATCH SET
        person.first_name = { first_name },
        person.last_name = {last_name },
        person.updated = timestamp()
        return person
        '''
        result = tx.run(query, self.first_name, self.last_name)
        return result

    @classmethod
    def person_has_title(self, tx, title, start_date, end_date, department, affiliation):
        query = '''
        MERGE (person:Person { first_name: { first_name }, last_name: { last_name } })-[r:HAS_TITLE]->(title:Title { title: { title }})
        SET r.start_date = { start_date },
        r.end_date = { end_date },
        r.department = { department },
        r.affiliation = { affiliation }
        RETURN person, r, title
        '''
        result = tx.run(query, self.first_name, self.last_name, title, start_date, end_date, department, affiliation)
        return result

    @classmethod
    def person_works_on(self, tx, project, start_date, end_date):
        query = '''
        MERGE (person:Person { first_name: { first_name }, last_name: { last_name } })-[r:WORKS_ON]->(project:Project { title: { project.title }, topic: { project.topic }})
        SET r.start_date = { start_date },
        r.end_date = { end_date }
        RETURN person, r, project
        '''
        result = tx.run(query, self.first_name, self.last_name, project, start_date, end_date)
        return result


    @classmethod
    def get_person():
        pass

    @classmethod
    def get_people(self, tx):
        query = '''
        MATCH (person:Person) return person
        '''
        result = tx.run(query)
        return result

    def delete(self):
        pass
