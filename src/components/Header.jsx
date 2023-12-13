import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import _isEmpty from "lodash/isEmpty";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useSelector, useDispatch } from "react-redux";
import { logInUser, logOutUser } from "../redux/slices/userSlice";
import { useRouter } from "next/router";

const pages = [
  { name: "My Habits", link: "/user-habits" },
  { name: "Add Habit", link: "/add-user-habit" },
  { name: "User Portal", link: "/user-portal" },
];

function ResponsiveAppBar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user.userDetails);

  const logInHandler = async () => {
    try {
      await dispatch(logInUser());
    } catch (error) {
      console.log(error);
    }
  };

  const signOutHandler = async () => {
    try {
      await dispatch(logOutUser());
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <EventRepeatIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Link className="header__title" href="/">
              Habit Tracker
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            {!_isEmpty(user) && (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                      <Link
                        className="header__mobile-menu-link"
                        href={page.link}
                      >
                        {page.name}
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
          <EventRepeatIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
            }}
          >
            <Link className="header__title" href="/">
              Habit Tracker
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {!_isEmpty(user) &&
              pages.map((page) => (
                <span key={page.name}>
                  <Link className="header__link" href={page.link}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page.name}
                    </Button>
                  </Link>
                </span>
              ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {!_isEmpty(user) ? (
              <>
                {" "}
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src={user.photoURL} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={() => {
                      signOutHandler();
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography textAlign="center">Log Out</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button onClick={logInHandler} variant="secondary">
                Log In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
