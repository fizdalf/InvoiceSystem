import * as express from 'express';
import * as bodyParser from 'body-parser';
import {graphiqlExpress, graphqlExpress} from 'apollo-server-express';
import schema from './data/schema';
import {printSchema} from 'graphql';


const setupGraphQLServer = () => {
  const graphQLServer = express();

  graphQLServer.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({schema, context: {}})
  );

  // /api/graphiql
  graphQLServer.use(
    '/graphiql',
    graphiqlExpress({endpointURL: '/api/graphql'})
  );

  // /api/schema
  graphQLServer.use('/schema', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(printSchema(schema));
  });

  return graphQLServer;
};

export default setupGraphQLServer;
