import { useState, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppBar, Toolbar, Typography, Button, IconButton, InputBase, Box, Menu, MenuItem } from "@mui/material";
import { Search as SearchIcon, AccountCircle } from "@mui/icons-material";
import DarkModeToggle from "../../components/DarkModeToggle";
import NotificationIcon from "../../components/NotificationIcon";
import logo from "../../assets/images/logo.jpeg";
import { useLogout } from "../../hooks/useLogout";
import { DashboardContext } from "../../context/DashboardContext";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useLogout();
  const { searchBlogs } = useContext(DashboardContext);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      searchBlogs(searchTerm);
      navigate(`/Blogs?term=${searchTerm}`);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ background: "#121212", boxShadow: "none" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="logo" component={RouterLink} to="/">
          <img src={logo} alt="Blog Logo" style={{ width: 40, borderRadius: "50%" }} />
        </IconButton>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}>
          EliteBlog
        </Typography>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", alignItems: "center" }}>
          <InputBase
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              padding: "0 8px",
              marginRight: 1,
              width: 200,
            }}
          />
          <IconButton type="submit" color="inherit">
            <SearchIcon />
          </IconButton>
        </form>
        <Box sx={{ display: "flex", alignItems: "center", marginLeft: 2 }}>
          <DarkModeToggle />
          <NotificationIcon />
          {currentUser ? (
            <>
              <IconButton
                color="inherit"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{ "aria-labelledby": "profile-button" }}
              >
                <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button variant="outlined" color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
