import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is required");
  }
  if (!userId) {
    throw new Error("userId is required");
  }

  const project = await projectModel.create({
    name,
    users: [userId],
  });
  return project;
};

export const getAllProjectbyUserId = async ({ userId }) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  const allUserroject = await projectModel.find({
    users: userId,
  });
  return allUserroject;
};

export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("project id is required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }
  if (!users) {
    throw new Error("users are required");
  }
  if (
    !Array.isArray(users) ||
    users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error("Invalid userId(s) in users array");
  }

  if (!userId) {
    throw new Error("user id are required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  if (!project) {
    throw new Error("User not belong to this project");
  }

  const updatedProject = await projectModel.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $addToSet: {
        //addToSet for unique, pushstores duplicates
        users: {
          $each: users,
        },
      },
    },
    {
      new: true,
    }
  );

  return updatedProject;
};

export const getProjectById = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  const project = await projectModel
    .findOne({
      _id: projectId,
    })
    .populate("users");

  return project;
};
