class Person(object):

    def __init__(self,first_name):
        self.first_name = first_name,
        self.last_name = last_name
        self.session = get_db()

    @classmethod
    def create_update(self):
        query = '''
        MERGE (person:Person {first_name: {first_name} , last_name: {last_name} })
        ON CREATE SET person.created = timestamp()
        ON MATCH SET
        person.first_name = { first_name },
        person.last_name = {last_name },
        person.updated = timestamp()
        return person
        '''
        with self.session as session:
            return session.run(query, self.first_name, self.last_name)

    @classmethod
    def person_has_title(self, title, start_date, end_date, department, affiliation):
        query = '''
        MERGE (person:Person { first_name: { first_name }, last_name: { last_name } })-[r:HAS_TITLE]->(title:Title { title: { title }})
        SET r.start_date = { start_date },
        r.end_date = { end_date },
        r.department = { department },
        r.affiliation = { affiliation }
        RETURN person, r, title
        '''
        with self.session as session:
            return session.run(query, self.first_name, self.last_name, title, start_date, end_date, department, affiliation)

    @classmethod
    def person_works_on(self, project, start_date, end_date):
        query = '''
        MERGE (person:Person { first_name: { first_name }, last_name: { last_name } })-[r:WORKS_ON]->(project:Project { title: { project.title }, topic: { project.topic }})
        SET r.start_date = { start_date },
        r.end_date = { end_date }
        RETURN person, r, project
        '''
        with self.session as session:
            return session.run(query, self.first_name, self.last_name, project, start_date, end_date)


    @classmethod
    def get_person():
        pass

    @classmethod
    def get_people(self, tx):
        query = '''
        MATCH (person:Person) return person
        '''
        result = tx.run(query)
        print(result)
        return result

    def delete(self):
        pass
