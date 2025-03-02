import mongoose from "mongoose";
import { Hash } from "../../utils/hash/index.js";
import { Decrypt, Encrypt } from "../../utils/encrypt/index.js";
import { genderTypes, providerTypes, rolesTypes } from "../../utils/generalRules/index.js";


const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String,
     required: function(){
    return this.provider == providerTypes.system
  },
  minLength: 8,
  trim: true,
 },
  provider: { type: String, enum:Object.values(providerTypes), required: true,default:providerTypes.system },
  gender: { type: String, enum: Object.values(genderTypes), required: true },
  DOB: { 
    type: Date, 
    required: true, 
    validate: {
      validator: function(value) {
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        return value < today && value <= minDate;
      },
      message: "Date of Birth must be a valid date in the past and at least 18 years ago."
    }
  },
  mobileNumber: { type: String, required: true },
  role: { type: String, enum:Object.values(rolesTypes), required: true, default:rolesTypes.user },
  isConfirmed: { type: Boolean, default: false },
  deletedAt: { type: Date },
  bannedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changeCredentialTime: { type: Date },
  profilePic: { secure_url: String, public_id: String },
  coverPic: { secure_url: String, public_id: String },
  OTP: [
    {
      code: String,
      type: { type: String, enum: ["confirmEmail", "forgetPassword"] },
      expiresIn: Date,
    },
  ],
},{
  virtuals:{
    userName: {
      get: function () {
        return `${this.firstName} ${this.lastName}`;
      },
    },
  }
},{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true
},

);

// userSchema.virtual('userName').get(function() {
//   return `${this.firstName} ${this.lastName}`;
// });

userSchema.pre("save", async function (next) {
  if(this.isNew ||this.isModified("password")){
    this.password = await Hash({
      key: this.password,
      SALT_ROUNDS: process.env.SALT_ROUNDS,
    });
  }

  if(this.isNew ||this.isModified("mobileNumber")){
    this.mobileNumber =await Encrypt({
      key: this.mobileNumber,
      SECRET_KEY: process.env.SECRET_KEY,
    });
  }

  next();
});
// Middleware for updateOne
userSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
      update.password = await Hash({
          key: update.password,
          SALT_ROUNDS: process.env.SALT_ROUNDS,
      });
  }

  if (update.mobileNumber) {
      update.mobileNumber = await Encrypt({
          key: update.mobileNumber,
          SECRET_KEY: process.env.SECRET_KEY,
      });
  }

  next();
});
userSchema.post(['find', 'findOne',"findById"], async function (docs) {
  // Check if docs is an array (for find) or a single document (for findOne)
  if (Array.isArray(docs)) {
      docs.forEach(async(doc) => {
          if (doc && doc.mobileNumber) {
              doc.mobileNumber =await Decrypt({key:doc.mobileNumber,SECRET_KEY: process.env.SECRET_KEY});
          }
      });
  } else if (docs && docs.mobileNumber) { // Handle single document case (for findOne)
    
      docs.mobileNumber =await Decrypt({key:docs.mobileNumber, SECRET_KEY:process.env.SECRET_KEY});
  }
});

export const UserModel = mongoose.model.User || mongoose.model("User", userSchema);
