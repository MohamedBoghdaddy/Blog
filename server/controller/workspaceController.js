import Workspace from "../models/WorkspaceModel.js";
import mongoose from "mongoose";

// Create a new workspace
export const createWorkspace = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id; // Using req.user for authenticated user

  try {
    const existingWorkspace = await Workspace.findOne({ name });

    if (existingWorkspace) {
      return res
        .status(400)
        .json({ message: "A workspace with this name already exists." });
    }

    const newWorkspace = new Workspace({
      name,
      description,
      user: userId,
    });

    await newWorkspace.save();
    res.status(201).json(newWorkspace);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Workspace name must be unique." });
    }
    console.error("Failed to create workspace:", error);
    res.status(500).json({ message: "Failed to create workspace", error });
  }
};

// Fetch all workspaces owned or collaborated by the user
export const getWorkspacesByUser = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { user: req.user._id }, // Workspaces owned by the authenticated user
        { "collaborators.user": req.user._id }, // Workspaces where the user is a collaborator
      ],
      deleted: false, // Exclude deleted workspaces
    })
      .populate("user", "username email")
      .populate("collaborators.user", "username email");

    if (workspaces.length === 0) {
      return res.status(200).json({ message: "No workspaces found" });
    }

    res.status(200).json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workspaces", error: error.message });
  }
};

// Fetch a single workspace by ID
export const getWorkspaceById = async (req, res) => {
  const { id } = req.params;

  try {
    const workspace = await Workspace.findById(id).populate(
      "user",
      "username email"
    );

    if (!workspace || workspace.deleted) {
      return res
        .status(404)
        .json({ message: "Workspace not found or has been deleted." });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error("Error fetching workspace by ID:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workspace", error: error.message });
  }
};

// Update an existing workspace
export const updateWorkspace = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }

    if (workspace.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          message: "You do not have permission to update this workspace.",
        });
    }

    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    await workspace.save();

    res.status(200).json(workspace);
  } catch (error) {
    console.error("Error updating workspace:", error);
    return res
      .status(500)
      .json({ message: "Failed to update workspace", error });
  }
};

// Soft delete a workspace
export const deleteWorkspace = async (req, res) => {
  const { id } = req.params;

  try {
    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          message: "You do not have permission to delete this workspace",
        });
    }

    workspace.deleted = true;
    await workspace.save();

    return res
      .status(200)
      .json({ message: "Workspace soft deleted successfully" });
  } catch (error) {
    console.error("Error soft deleting workspace:", error);
    return res
      .status(500)
      .json({ message: "Workspace deletion failed", error });
  }
};

// Fetch collaborators for a specific workspace
export const fetchCollaborators = async (req, res) => {
  const { workspaceId } = req.params;

  try {
    const workspace = await Workspace.findById(workspaceId).populate(
      "collaborators.user",
      "username email"
    );

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace.collaborators);
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch collaborators", error });
  }
};

// Fetch all public workspaces
export const getAllPublicWorkspaces = async (req, res) => {
  try {
    const publicWorkspaces = await Workspace.find({
      deleted: false,
      isPublic: true,
    }).populate("user", "username email");

    res.status(200).json(publicWorkspaces);
  } catch (error) {
    console.error("Error fetching public workspaces:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch public workspaces", error });
  }
};


// Add a collaborator to a workspace
export const addCollaborator = async (req, res) => {
  const { workspaceId } = req.params;
  const { collaboratorId } = req.body; // The ID of the user to be added as a collaborator

  try {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if the user is already a collaborator
    if (workspace.collaborators.some(collab => collab.user.toString() === collaboratorId)) {
      return res.status(400).json({ message: "User is already a collaborator" });
    }

    // Add collaborator
    workspace.collaborators.push({ user: collaboratorId });
    await workspace.save();

    res.status(200).json({ message: "Collaborator added successfully", workspace });
  } catch (error) {
    console.error("Error adding collaborator:", error);
    return res.status(500).json({ message: "Failed to add collaborator", error });
  }
};