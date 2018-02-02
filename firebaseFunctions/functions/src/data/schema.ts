import {makeExecutableSchema} from 'graphql-tools';

import resolvers from './resolvers';

const schema = `
type Author {
  id: Int! #the ! means that every author object _must_ have an id
  firstName: String
  lastName: String
  posts: [Post] # the list of Posts by this author
}
type Post {
  id: Int!
  title: String
  author: Author
  votes: Int
}
type Query{
  posts: [Post]
  author(id: Int!): Author
}
type Mutation {
  upvotePost(postId: Int!): Post
}
`;


export default makeExecutableSchema({
  typeDefs: schema,
  resolvers
})
