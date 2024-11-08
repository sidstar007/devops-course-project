// graphql-gateway/src/index.js

require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema/schema');
const resolvers = require('./resolvers/resolvers');
const { dataSources } = require('./datasolvers/datasolvers');
const { authMiddleware } = require('./middleware/authmiddlewares');



const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context: ({ req }) => {
    const { user } = authMiddleware(req);
    return { user };
  },
  cors: {
    origin: '*', // Allow all origins for testing purposes
    credentials: true,
  },
  introspection: true, // Enable introspection
  playground: true,    // Enable playground for testing
});

const port = process.env.PORT || 4000;

server.listen({ port }).then(({ url }) => {
  console.log(`GraphQL Gateway running at ${url}`);
});
