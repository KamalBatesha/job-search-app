import mongoose from "mongoose";



  const companySchema = new mongoose.Schema({
    companyName: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    address: { type: String, required: true },
    numberOfEmployees: { 
      type: String, 
      required: true, 
      enum: ["1-10", "11-20", "21-50", "51-100", "100+"], 
      message: "Number of employees must be in a valid range."
    },
    companyEmail: { type: String, unique: true, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    logo: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },
    HRs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bannedAt: { type: Date },
    deletedAt: { type: Date },
    legalAttachment: { secure_url: String, public_id: String },
    approvedByAdmin: { type: Boolean, default: false },
  }, { timestamps: true ,toJSON:{virtuals:true},toObject:{virtuals:true}});

  companySchema.virtual("jobs",{
    ref:"Job",
    localField:"_id",
    foreignField:"companyId"
  })

export const CompanyModel = mongoose.model.Company || mongoose.model("Company", companySchema);
