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
    origin: '*',
    credentials: true,
  },
  introspection: true,
  playground: true,
});

const port = process.env.PORT || 4000;

server.listen({ port }).then(({ url }) => {
  console.log(`GraphQL Gateway running at ${url}`);
});
