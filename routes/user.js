const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const authenticateToken = require("../middleware/authenticate");






// User register

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authenticaiton failed" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Getting job applications of selected user
router.get('/job-applications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const jobApplications = user.jobApplications;

    res.status(200).json(jobApplications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//User adding a job application
router.post("/job-applications", authenticateToken, async (req, res) => {
  try {
    const { companyName, jobTitle, jobLink, status, response, notes } =
      req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.jobApplications.push({
      companyName,
      jobTitle,
      jobLink,
      status,
      response,
      notes,
    });
    await user.save();

    res.status(201).json({ message: "Job application added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//User editing a job application
router.put(
  "/job-applications/:applicationId",
  authenticateToken,
  async (req, res) => {
    try {
      const { companyName, jobTitle, jobLink, status, response, notes } =
        req.body;
      const userId = req.user.userId;
      const applicationId = req.params.applicationId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const jobApplication = user.jobApplications.id(applicationId);

      if (!jobApplication) {
        return res.status(404).json({ message: "Job application not found" });
      }

      jobApplication.companyName = companyName || jobApplication.companyName;
      jobApplication.jobTitle = jobTitle || jobApplication.jobTitle;
      jobApplication.jobLink = jobLink || jobApplication.jobLink;
      jobApplication.status = status || jobApplication.status;
      jobApplication.response = response || jobApplication.response;
      jobApplication.notes = notes || jobApplication.notes;

      await user.save();

      res.status(200).json({ message: "Job application updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//User deleting a job application
router.delete(
  "/job-applications/:applicationId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const applicationId = req.params.applicationId;

      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { jobApplications: { _id: applicationId } } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Job application deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
