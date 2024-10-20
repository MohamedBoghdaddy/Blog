import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "./AuthContext";

export const DashboardContext = createContext();

const DashboardProvider = ({ children }) => {
  const { state } = useAuthContext();
  const { user, isAuthenticated } = state;

  // State variables
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [blogs, setBlogs] = useState([]); // Changed to manage blogs
  const [recycleBin, setRecycleBin] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const handleError = (error, defaultMessage) => {
    console.error(error);
    toast.error(defaultMessage || "Something went wrong.");
  };

  const createWorkspace = useCallback(async (workspaceData) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/workspaces/createWorkspace",
        workspaceData,
        { withCredentials: true }
      );

      setWorkspaces((prevWorkspaces) => {
        const workspacesArray = Array.isArray(prevWorkspaces)
          ? prevWorkspaces
          : [];
        return [...workspacesArray, response.data];
      });

      toast.success("Workspace created successfully.");
    } catch (error) {
      handleError(error, "Failed to create workspace.");
    }
  }, []);

  const fetchWorkspacesByUser = useCallback(async () => {
    if (!isAuthenticated || !user) {
      toast.error("You need to log in to fetch workspaces.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:4000/api/workspaces/${user?._id}`, // Optional chaining
        { withCredentials: true }
      );
      setWorkspaces(response.data || []);
    } catch (error) {
      handleError(error, "Failed to fetch workspaces.");
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const deleteWorkspace = useCallback(async (workspaceId) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/workspaces/deleteWorkspace/${workspaceId}`,
        { withCredentials: true }
      );
      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.filter((workspace) => workspace._id !== workspaceId)
      );
      toast.success("Workspace deleted successfully.");
    } catch (error) {
      handleError(error, "Failed to delete workspace.");
    }
  }, []);

  const fetchBlogs = useCallback(async (workspaceId, onlyDeleted = false) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/blogs/${workspaceId}/blogs`,
        { withCredentials: true }
      );
      const allBlogs = response.data || [];
      const filtered = onlyDeleted
        ? allBlogs.filter((blog) => blog.deleted)
        : allBlogs.filter((blog) => !blog.deleted);

      setBlogs(filtered);
      setRecycleBin(allBlogs.filter((blog) => blog.deleted));
    } catch (error) {
      handleError(error, "Failed to fetch blogs.");
    }
  }, []);

  const uploadBlog = useCallback(async (workspaceId, blogData) => {
    try {
      const formData = new FormData();
      formData.append("blog", blogData.file);
      formData.append("workspaceId", workspaceId);

      const response = await axios.post(
        "http://localhost:4000/api/blogs/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setBlogs((prev) => [...prev, response.data.blog]);
      toast.success("Blog uploaded successfully.");
    } catch (error) {
      handleError(error, "Failed to upload blog.");
    }
  }, []);

  const deleteBlog = useCallback(async (blogId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/blogs/${blogId}/soft-delete`,
        { deleted: true },
        { withCredentials: true }
      );
      const updatedBlog = response.data;
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
      setRecycleBin((prevRecycleBin) => [...prevRecycleBin, updatedBlog]);
      toast.success("Blog moved to recycle bin.");
    } catch (error) {
      handleError(error, "Failed to move blog to recycle bin.");
    }
  }, []);

  const downloadBlog = useCallback(async (blogId, filename) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/blogs/download/${blogId}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      toast.success("Blog downloaded successfully.");
    } catch (error) {
      handleError(error, "Failed to download blog.");
    }
  }, []);

  const restoreBlog = useCallback(async (blogId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/blogs/${blogId}/restore`,
        { deleted: false },
        { withCredentials: true }
      );
      const restoredBlog = response.data;
      setRecycleBin((prev) => prev.filter((blog) => blog._id !== blogId));
      setBlogs((prev) => [...prev, restoredBlog]);
      toast.success("Blog restored successfully.");
    } catch (error) {
      handleError(error, "Failed to restore blog.");
    }
  }, []);

  const searchBlogs = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const searchBlogsWithParams = useCallback(async (searchParams) => {
    try {
      const { name, metadata, tags } = searchParams;
      const query = new URLSearchParams();

      if (name) query.append("name", name);
      if (metadata) query.append("metadata", metadata);
      if (tags) query.append("tags", tags);

      const response = await axios.get(
        `http://localhost:4000/api/blogs/search?${query.toString()}`,
        { withCredentials: true }
      );

      setFilteredBlogs(response.data || []);
    } catch (error) {
      handleError(error, "Failed to search blogs.");
    }
  }, []);

  const filteredBlogsList = useMemo(() => {
    return blogs.filter((blog) =>
      blog.name
        ? blog.name.toLowerCase().includes(searchTerm.toLowerCase())
        : false
    );
  }, [blogs, searchTerm]);

  const searchPublicWorkspaces = useCallback(async (term) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/workspaces/search?q=${term}`,
        { withCredentials: true }
      );
      setFilteredWorkspaces(response.data || []);
    } catch (error) {
      handleError(error, "Failed to search workspaces.");
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWorkspacesByUser();
    }
  }, [isAuthenticated, user, fetchWorkspacesByUser]);

  const contextValue = useMemo(
    () => ({
      loading,
      workspaces,
      blogs,
      deleteBlog,
      downloadBlog,
      recycleBin,
      filteredBlogs,
      filteredWorkspaces,
      createWorkspace,
      deleteWorkspace,
      fetchWorkspacesByUser,
      fetchBlogs,
      searchPublicWorkspaces,
      uploadBlog,
      restoreBlog,
      previewFile,
      setPreviewFile,
      selectedWorkspace,
      setSelectedWorkspace,
      collaborators,
      setCollaborators,
      searchBlogs,
      searchBlogsWithParams,
      filteredBlogsList,
    }),
    [
      loading,
      workspaces,
      blogs,
      deleteBlog,
      downloadBlog,
      recycleBin,
      filteredBlogs,
      filteredWorkspaces,
      createWorkspace,
      deleteWorkspace,
      fetchWorkspacesByUser,
      fetchBlogs,
      searchPublicWorkspaces,
      uploadBlog,
      restoreBlog,
      previewFile,
      selectedWorkspace,
      collaborators,
      searchBlogs,
      searchBlogsWithParams,
      filteredBlogsList,
    ]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardProvider;
