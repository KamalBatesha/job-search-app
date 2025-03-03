import { OAuth2Client } from "google-auth-library";
import { ApplicationModel, CompanyModel, JobModel, UserModel } from "../../DB/models/index.js";
import { deletedImage, uploadImage } from "../../utils/cloudinary/index.js";
import { providerTypes, rolesTypes } from "../../utils/generalRules/index.js";
import {
  AppError,
  asyncHandler,
} from "../../utils/globalErrorHandling/index.js";
import { Compare } from "../../utils/hash/compare.js";
import { eventEmitter } from "../../utils/sendEmailEvent/index.js";
import { generateToken } from "../../utils/token/generateToken.js";
import { decodedToken, tokenTypes } from "../../middleware/auth.js";

//----------------------------addJob----------------------------------------------------
export const addJob = asyncHandler(async (req, res, next) => {
        // Ensure the user is HR or Company Owner
        const company = await CompanyModel.findById(req.body.companyId);
        if (!company) return res.status(404).json({ message: "Company not found" });

        const HRs=company.HRs.map(hr=>hr.toString());
        if (HRs.includes(req.user._id.toString()) && company.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to add jobs for this company" });
        }

        const job = await JobModel.create({...req.body,addedBy:req.user._id});
        return res.status(201).json({ message: "Job created successfully", job });
});

//----------------------------updateJob----------------------------------------------------
export const updateJob = asyncHandler(async (req, res, next) => {
  const job = await JobModel.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  // Ensure only the owner can update
  if (job.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this job" });
  }
  const updatedJob = await JobModel.findByIdAndUpdate(req.params.id, {...req.body,addedBy:req.user._id}, { new: true });

  return res.status(200).json({ message: "Job updated successfully", job:updatedJob });
});

//----------------------------deleteJob----------------------------------------------------
export const deleteJob = asyncHandler(async (req, res, next) => {
  const job = await JobModel.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  // Ensure only the owner can delete
  if (job.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
  }
  const deletedJob = await JobModel.findByIdAndUpdate(req.params.id, { closed: true }, { new: true });
  return res.status(200).json({ message: "Job updated successfully", job:deletedJob });
});

//----------------------------getJobs----------------------------------------------------
export const getJobs = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params; // Optional companyId from merged params
        const { jobId } = req.params; // Optional jobId for a specific job
        const { page = 1, limit = 10, sort = "-createdAt", search } = req.query;

        let filter = {};

        if (jobId) {
            // Fetch a specific job
            const job = await JobModel.findOne({ _id: jobId, closed: false }).populate([{path:"companyId"}]);
            if (!job) return res.status(404).json({ message: "Job not found or closed" });
            return res.status(200).json({ job });
        }
        if (companyId) {
            // Ensure the company exists before fetching jobs
            const company = await CompanyModel.findById(companyId);
            if (!company) return next(new AppError("Company not found", 404));

            filter.companyId = companyId;
        }


        if (search) {
            filter.jobTitle = { $regex: search, $options: "i" } // Case-insensitive search
        }

        const jobs = await JobModel.find(filter)
            .populate([{path:"companyId"}])
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalCount = await JobModel.countDocuments(filter);

        return res.status(200).json({ jobs, totalCount });
});


//----------------------------getFilteredJobs----------------------------------------------------
export const getFilteredJobs = asyncHandler(async (req, res, next) => {
  const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills, page = 1, limit = 10, sort = "-createdAt" } = req.query;
        const filter = {};

        if (workingTime) filter.workingTime = workingTime;
        if (jobLocation) filter.jobLocation = jobLocation;
        if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
        if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: "i" };
        if (technicalSkills) filter.technicalSkills = { $in: technicalSkills.split(",") };

        const jobs = await JobModel.find(filter)
            .populate([{path:"companyId"}])
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalCount = await JobModel.countDocuments(filter);

        return res.status(200).json({ jobs, totalCount });
});

//----------------------------applyForJob----------------------------------------------------
export const applyForJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { userCV } = req.body;

  // Check if the user is authorized (only normal users can apply)
  if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can apply for jobs" });
  }

  // Ensure job exists
  const job = await JobModel.findById(jobId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  // Check if the user has already applied
  const existingApplication = await ApplicationModel.findOne({ jobId, userId: req.user._id });
  if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
  }

  // Create new application
  const application = await ApplicationModel.create({
      jobId,
      userId: req.user._id,
      userCV
  });

  return res.status(201).json({ message: "Application submitted successfully", application });
});


