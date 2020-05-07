const { ApolloServer, gql } = require("apollo-server");
const { v1: uuid } = require("uuid");
let persons = [
  {
    name: "Bob",
    phone: "213-243-123213",
    street: "Street 1",
    city: "City 1",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431",
  },
  {
    name: "Tom",
    phone: "420-151-1615",
    street: "Street 2",
    city: "City 2",
    id: "3d599470-3436-11e9-bc57-8b80ba54c431",
  },
  {
    name: "Jim",
    street: "Street 3",
    city: "City 3",
    id: "3d599471-3436-11e9-bc57-8b80ba54c431",
  },
];

const typeDefs = gql`
  type Address {
    street: String!
    city: String!
  }
  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find((p) => p.name === args.name),
  },
  Person: {
    address: (root) => {
      return { street: root.street, city: root.city };
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      const person = { ...args, id: uuid() };
      persons = persons.concat(person);
      return person;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
