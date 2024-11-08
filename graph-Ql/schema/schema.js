const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    profile: Profile
  }

  type Profile {
    firstName: String
    lastName: String
    address: String
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    quantity: Int!
    category: String
  }

  type OrderItem {
    productId: ID!
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    userId: ID!
    items: [OrderItem!]!
    totalAmount: Float!
    status: String!
    shippingAddress: ShippingAddress
  }

  type ShippingAddress {
    street: String
    city: String
    state: String
    postalCode: String
    country: String
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    quantity: Int!
    category: String
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
    price: Float!
  }

  input OrderInput {
    items: [OrderItemInput!]!
    shippingAddress: ShippingAddressInput
  }

  input ShippingAddressInput {
    street: String
    city: String
    state: String
    postalCode: String
    country: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    products: [Product!]!
    product(id: ID!): Product
    orders: [Order!]!
    order(id: ID!): Order
  }
 input ProductUpdateInput {
    name: String
    description: String
    price: Float
    quantity: Int
    category: String
  }
  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
    createProduct(input: ProductInput!): Product!
    placeOrder(input: OrderInput!): Order!
    updateOrderStatus(id: ID!, status: String!): Order!
    updateProduct(id: ID!, input: ProductUpdateInput!): Product! 
  }
`;

module.exports = typeDefs;
