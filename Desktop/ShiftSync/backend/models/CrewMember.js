/* =====================================================
   SHIFTSYNC — models/CrewMember.js
   Mongoose schema for a CrewMember document
   ===================================================== */

const mongoose = require("mongoose");

const CrewMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    roles: {
      type: [String],
      // e.g. ["Sound", "Lighting"]
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one role is required",
      },
    },

    availability: {
      type: String,
      enum: {
        values: ["free", "on_shift"],
        message: "availability must be free | on_shift",
      },
      default: "free",
    },

    assignedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CrewMember", CrewMemberSchema);
