export * from "./user.model.js";
export * from "./application.model.js";
export * from "./chat.model.js";
export * from "./company.model.js";
export * from "./job.model.js";

// const userSchema = new mongoose.Schema({
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     provider: { type: String, enum: ["google", "system"], required: true },
//     gender: { type: String, enum: ["Male", "Female"], required: true },
//     DOB: {
//       type: Date,
//       required: true,
//       validate: {
//         validator: function(value) {
//           const today = new Date();
//           const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
//           return value < today && value <= minDate;
//         },
//         message: "Date of Birth must be a valid date in the past and at least 18 years ago."
//       }
//     },
//     mobileNumber: { type: String, required: true },
//     role: { type: String, enum: ["User", "Admin"], required: true },
//     isConfirmed: { type: Boolean, default: false },
//     deletedAt: { type: Date },
//     bannedAt: { type: Date },
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     changeCredentialTime: { type: Date },
//     profilePic: { secure_url: String, public_id: String },
//     coverPic: { secure_url: String, public_id: String },
//     OTP: [
//       {
//         code: String,
//         type: { type: String, enum: ["confirmEmail", "forgetPassword"] },
//         expiresIn: Date,
//       },
//     ],
//   }, { timestamps: true });

//   userSchema.virtual('username').get(function() {
//     return `${this.firstName} ${this.lastName}`;
//   });

//   userSchema.pre("remove", async function (next) {
//     const userId = this._id;
//     await mongoose.model("Company").updateMany(
//       { createdBy: userId },
//       { deletedAt: new Date() }
//     );
//     await mongoose.model("Job").updateMany(
//       { addedBy: userId },
//       { closed: true }
//     );
//     await mongoose.model("Application").deleteMany({ userId });
//     next();
//   });

//   const companySchema = new mongoose.Schema({
//     companyName: { type: String, unique: true, required: true },
//     description: { type: String, required: true },
//     industry: { type: String, required: true },
//     address: { type: String, required: true },
//     numberOfEmployees: { type: String, required: true },
//     companyEmail: { type: String, unique: true, required: true },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     logo: { secure_url: String, public_id: String },
//     coverPic: { secure_url: String, public_id: String },
//     HRs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     bannedAt: { type: Date },
//     deletedAt: { type: Date },
//     legalAttachment: { secure_url: String, public_id: String },
//     approvedByAdmin: { type: Boolean, default: false },
//   }, { timestamps: true });

//   const jobSchema = new mongoose.Schema({
//     jobTitle: { type: String, required: true },
//     jobLocation: { type: String, enum: ["onsite", "remotely", "hybrid"], required: true },
//     workingTime: { type: String, enum: ["part-time", "full-time"], required: true },
//     seniorityLevel: {
//       type: String,
//       enum: ["fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
//       required: true
//     },
//     jobDescription: { type: String, required: true },
//     technicalSkills: [{ type: String, required: true }],
//     softSkills: [{ type: String, required: true }],
//     addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     closed: { type: Boolean, default: false },
//     companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
//   }, { timestamps: true });

//   const chatSchema = new mongoose.Schema({
//     senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     messages: [
//       {
//         message: { type: String, required: true },
//         senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//         timestamp: { type: Date, default: Date.now }
//       }
//     ]
//   }, { timestamps: true });

//   const applicationSchema = new mongoose.Schema({
//     jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     userCV: { secure_url: String, public_id: String, required: true },
//     status: {
//       type: String,
//       enum: ["pending", "accepted", "viewed", "in consideration", "rejected"],
//       default: "pending"
//     }
//   }, { timestamps: true });

//   const User = mongoose.model("User", userSchema);
//   const Company = mongoose.model("Company", companySchema);
//   const Job = mongoose.model("Job", jobSchema);
//   const Chat = mongoose.model("Chat", chatSchema);
//   const Application = mongoose.model("Application", applicationSchema);

//   module.exports = { User, Company, Job, Chat, Application };
