import * as AR from "./resolve.js"
import * as AT from "./types.js"
import * as AA from "./args.js"
import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"
export const adminQuery={
getAllUsersAndCompanies:{
    type:new GraphQLObjectType({
        name: "getAllUsersAndCompanies",
        fields: {
            users: { type: new GraphQLList(AT.userType) },
            companies: { type: new GraphQLList(AT.companyType) },
        }
    }),
    args:AA.checkToken,
    resolve:AR.getAllUsersAndCompanies
}
}
export const adminMutation={
    banUser:{
        type:AT.userType,
        args:AA.ban,
        resolve:AR.banUser
    },
    banCompany:{
        type:AT.companyType,
        args:AA.ban,
        resolve:AR.banCompany
    },
    approveCompany:{
        type:AT.companyType,
        args:AA.ban,
        resolve:AR.approveCompany
    },
    
}