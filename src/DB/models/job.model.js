import mongoose from "mongoose";



const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  jobLocation: { type: String, enum: ["onsite", "remotely", "hybrid"], required: true },
  workingTime: { type: String, enum: ["part-time", "full-time"], required: true },
  seniorityLevel: { 
    type: String, 
    enum: ["fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
    required: true 
  },
  jobDescription: { type: String, required: true },
  technicalSkills: [{ type: String, required: true }],
  softSkills: [{ type: String, required: true }],
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  closed: { type: Boolean, default: false },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
}, { timestamps: true });

export const JobModel = mongoose.model.Job || mongoose.model("Job", jobSchema);
