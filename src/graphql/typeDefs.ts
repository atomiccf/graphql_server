import { gql } from 'apollo-server'

export const typeDefs = gql`
  type User {   
    username: String!
    first_name: String!
    last_name: String!
    password: String!
    is_active: Boolean!
    is_deleted: Boolean!
    terms: Boolean!
    _updated_at: String!
    _created_at: String!
    role: String!
  }
  
  input UserInput {
    email: String!
    username: String!
    password: String!
    first_name: String!
    last_name: String!
    terms: Boolean!  
  }
  
  input LoginInput {
      username: String!
      password: String! 
  }
  
  type Query {
    getUser(id: ID!): User!
    getUsers(amount: Int): [User]
  }
  
  type Mutation {
    createUser(userInput: UserInput!): User!
    loginUser(loginInput: LoginInput!): AuthPayload!
    refreshToken: AuthPayload!
  }
  
  type AuthPayload {
    accessToken: String!
  }
`;
