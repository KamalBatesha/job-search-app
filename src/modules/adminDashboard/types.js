import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { DateScalar, providerTypes, rolesTypes } from "../../utils/generalRules/index.js";

const otpType = new GraphQLObjectType({
  name: "OTP",
  fields: {
    code: { type: GraphQLString },
    type: { type: GraphQLString },
    expiresIn: { type: DateScalar },
  }
})
const picType = new GraphQLObjectType({
  name: "Pic",
  fields: {
    secure_url: { type: GraphQLString },
    public_id: { type: GraphQLString },
  }
})

export const userType = new GraphQLObjectType({
  name: "User",
  fields: {
    _id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    mobileNumber: { type: GraphQLString },
    role: {
      type: new GraphQLEnumType({
        name: "Role",
        values: {
          user: { value: rolesTypes.user },
          admin: { value: rolesTypes.admin },
        },
      }),
    },
    isConfirmed: { type: GraphQLBoolean },
    DOB:{ type:  DateScalar },
    deletedAt:{ type:  DateScalar },
    bannedAt:{ type:  DateScalar },
    updatedBy:{ type:  GraphQLID },
    provider: { type: new GraphQLEnumType({
      name: "Provider",
      values: {
        google: { value: providerTypes.google },
        system: { value: providerTypes.system },
      },
    }) },
    createdAt: { type: DateScalar },
    updatedAt: { type: DateScalar },
    OTP: { type: new GraphQLList(otpType) },
    profilePic: { type: picType },
    coverPic: { type: picType },

  },
});


export const companyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    _id: { type: GraphQLID },
    companyName: { type: GraphQLString },
    description: { type: GraphQLString },
    industry: { type: GraphQLString },
    address: { type: GraphQLString },
    numberOfEmployees: { type: GraphQLString },
    companyEmail: { type: GraphQLString },
    createdBy: { type: GraphQLID },
    logo: { type: picType },
    coverPic: { type: picType },
    HRs: { type: new GraphQLList(GraphQLID) },
    bannedAt: { type: DateScalar },
    deletedAt: { type: DateScalar },
    legalAttachment: { type: picType },
    approvedByAdmin: { type: GraphQLBoolean },
    createdAt: { type: DateScalar },
    updatedAt: { type: DateScalar },
  },
});