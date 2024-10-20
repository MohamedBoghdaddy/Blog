// Import necessary models at the top of the file
import Workspace from "../models/WorkspaceModel.js"; // Adjust the path as necessary
import Blog from "../models/BlogModel.js"; // Adjust the path as necessary

export const getAnalytics = async (req, res) => {
  const { workspaceId } = req.params;

  try {
    // Check if the workspaceId is valid
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    // Check if the workspace exists
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Count the total number of workspaces
    const workspaceCount = await Workspace.countDocuments({ deleted: false });

    // Count the total number of blogs in the workspace
    const blogCount = await Blog.countDocuments({
      workspace: workspaceId,
    });

    // Fetch the workspace with collaborators
    const populatedWorkspace = await Workspace.findById(workspaceId).populate({
      path: "collaborators.user",
      select: "username email", // Only select the username and email from the User model
    });

    // Extract collaborators and ensure user data is valid
    const collaborators = populatedWorkspace.collaborators
      .filter((c) => c.user?.username && c.user?.email) // Ensure user and its fields exist
      .map((c) => ({
        username: c.user.username,
        email: c.user.email,
        role: c.role || "Viewer", // Default role as 'Viewer' if not provided
      }));

    // Remove duplicate collaborators by email
    const uniqueCollaborators = Array.from(
      new Map(collaborators.map((c) => [c.email, c])).values()
    );

    // Send analytics data in response
    res.status(200).json({
      workspaces: workspaceCount,
      blogs: blogCount,
      collaborators: uniqueCollaborators.length,
      collaboratorDetails: uniqueCollaborators,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics data" });
  }
};
