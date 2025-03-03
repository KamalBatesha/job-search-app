import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { adminQuery,adminMutation } from "./adminDashboard/fields.js";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
        ...adminQuery,
    },
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {
        ...adminMutation,
    },
  }),
});