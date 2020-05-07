const { ApolloServer, UserInputError, gql } = require("apollo-server");
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

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }
  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if (!args.phone) return persons;
      const byPhone = (person) =>
        args.phone === "YES" ? person.phone : !person.phone;
      return persons.filter(byPhone);
    },
    findPerson: (root, args) => persons.find((p) => p.name === args.name),
  },
  Person: {
    address: (root) => {
      return { street: root.street, city: root.city };
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError("Name must be unique", {
          invalidArgs: args.name,
        });
      }
      const person = { ...args, id: uuid() };
      persons = persons.concat(person);
      return person;
    },

    editNumber: (root, args) => {
      const persons = persons.find((p) => p.name === args.name);
      if (!person) return null;

      const updatedPerson = { ...person, phone: args.phone };
      person = persons.map((p) => (p.name === args.name ? updatedPerson : p));
      return updatedPerson;
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
