import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";

// //======================================registerArgs====================================
// export const registerArgs = {
//   name: { type: new GraphQLNonNull(GraphQLString) },
//   email: { type: new GraphQLNonNull(GraphQLString) },
//   password: { type: new GraphQLNonNull(GraphQLString) },
//   phone: { type: new GraphQLNonNull(GraphQLString) },
// };

// //======================================loginArgs====================================
// export const loginArgs = {
//   email: { type: new GraphQLNonNull(GraphQLString) },
//   password: { type: new GraphQLNonNull(GraphQLString) },
// };

//======================================checkToken====================================
export const checkToken = {
  authorization: { type: new GraphQLNonNull(GraphQLString) },
};
//======================================banUser====================================
export const ban = {
  authorization: { type: new GraphQLNonNull(GraphQLString) },
  id: { type: new GraphQLNonNull(GraphQLID) },
};
