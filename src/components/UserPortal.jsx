import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Link from "next/link";
import Grid from "@mui/material/Unstable_Grid2";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { redIconHoverStyling, editIconHoverStyling } from "../../styles/ComponentStyling";
import DeleteHabitConfirmationModal from "./DeleteHabitConfirmationModal";
import { setDisplayDeleteHabitModal } from "../redux/slices/modalSlice";
import EditIcon from "@mui/icons-material/Edit";

const UserPortal = () => {
  const user = useSelector((state) => state.user.userDetails);
  const habits = useSelector((state) => state.userHabits.userHabits);
  const dispatch = useDispatch();

  const [habitToDelete, setHabitToDelete] = useState("");

  return (
    <Container
      maxWidth="xl"
      sx={{
        marginTop: 3,
        marginBottom: 3,
      }}
    >
      <h1>User Portal</h1>
      <div className="user-portal">
        <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <div className="user-portal__profile-information">
                  <h2>User Information</h2>
                  <img src={user.photoURL} alt="User profile picture" />
                  <p>Name: {user.displayName}</p>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} md={6} lg={8}>
            <Card>
              <CardContent>
                <div className="user-portal__manage-habits">
                  <h2 className="margin-bottom-3">My Habits</h2>
                  {habits.length === 0 && (
                    <p className="text-align-center">No habits found.</p>
                  )}
                  {habits.map((habit) => {
                    return (
                      <div
                        key={habit.id}
                        className="user-portal__habit-list-item"
                      >
                        <Link href={`/user-habits/${habit.id}`}>
                          {habit.habitName}
                        </Link>
                        <div>
                          <Tooltip title="Edit User Habit">
                            <Link href={`/edit-user-habit/${habit.id}`}>
                              <EditIcon fontSize="large" sx={editIconHoverStyling} />
                            </Link>
                          </Tooltip>
                          <span
                            onClick={() => {
                              dispatch(setDisplayDeleteHabitModal(true));
                              setHabitToDelete(habit.id);
                            }}
                          >
                            <Tooltip title="Delete habit">
                              <DeleteIcon
                                sx={redIconHoverStyling}
                                color="error"
                                fontSize="large"
                              />
                            </Tooltip>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <DeleteHabitConfirmationModal habitId={habitToDelete} />
    </Container>
  );
};

export default UserPortal;
