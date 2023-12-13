import ProtectedRoute from "@/src/components/ProtectedRoute";
import {
  onSnapshot,
  query,
  where,
  collection,
  doc,
  arrayUnion,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import Container from "@mui/material/Container";
import { db } from "../../src/firebase/firebase";
import _isEmpty from "lodash/isEmpty";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import { updateUserHabitsList } from "@/src/redux/slices/userHabitsSlice";
import dayjs from "dayjs";
import Head from "next/head";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import UndoIcon from "@mui/icons-material/Undo";
import DeleteIcon from "@mui/icons-material/Delete";
import HabitImage from "@/src/components/HabitImage";
import Grid from "@mui/material/Unstable_Grid2";
import DeleteHabitConfirmationModal from "../../src/components/DeleteHabitConfirmationModal";
import { useEffect, useState } from "react";
import {
  redIconHoverStyling,
  greenIconHoverStyling,
} from "../../styles/ComponentStyling";
import { setDisplayDeleteHabitModal } from "@/src/redux/slices/modalSlice";

const UserHabits = () => {
  const user = useSelector((state) => state.user.userDetails);

  const habitsList = useSelector((state) => state.userHabits.userHabits);

  const dispatch = useDispatch();

  const [habitsDateToView, setHabitsDateToView] = useState(dayjs());


  const [loadingHabits, setLoadingHabits] = useState(false);


  // Set state to the document ID of the habit the user wants to delete
  const [habitToDelete, setHabitToDelete] = useState("");

  useEffect(() => {
    if (!_isEmpty(user)) {
      setLoadingHabits(true);

      const q = query(
        collection(db, "user-habits"),
        where("uid", "==", user.uid)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const habits = [];
        querySnapshot.forEach((doc) => {
          habits.push({ ...doc.data(), id: doc.id });
        });

        dispatch(updateUserHabitsList(habits));
        setLoadingHabits(false);
      });

      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const markHabitCompletedForDay = async (docId) => {
    const habitRef = doc(db, "user-habits", docId);

    try {
      await updateDoc(habitRef, {
        daysCompleted: arrayUnion(
          habitsDateToView.toISOString().substring(0, 10)
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const markHabitAsTodo = async (docId) => {
    const habitRef = doc(db, "user-habits", docId);

    try {
      await updateDoc(habitRef, {
        daysCompleted: arrayRemove(
          habitsDateToView.toISOString().substring(0, 10)
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Function to check if the user has completed all habits for the current day the user is viewing
  const allHabitsCompletedForCurrentlyViewedDate = () => {
    const currentDateBeingViewedFormatted =
      habitsDateToView.format("YYYY-MM-DD");

    // Increment this value for every habit that's completed for the day being currently viewed by the user
    let numberOfCompletedHabits = 0;

    const allHabitsForCurrentlyViewedDay = habitsList.filter((habit) => {
      return displayHabitForCurrentlyViewedDay(habit);
    });

    allHabitsForCurrentlyViewedDay.forEach((habit) => {
      if (habit.daysCompleted.includes(currentDateBeingViewedFormatted)) {
        numberOfCompletedHabits += 1;
      }
    });
    
    return (
      numberOfCompletedHabits === allHabitsForCurrentlyViewedDay.length &&
      allHabitsForCurrentlyViewedDay.length > 0
    );
  };
  const deleteHabitJSX = (docId) => {
    return (
      <span
        onClick={() => {
          dispatch(setDisplayDeleteHabitModal(true));
          setHabitToDelete(docId);
        }}
      >
        <Tooltip title="Delete habit">
          <DeleteIcon sx={redIconHoverStyling} color="error" fontSize="large" />
        </Tooltip>
      </span>
    );
  };

  // Boolean for determining whether the user has entered an input date that is past/present or future
  const isUserInputDateAFutureDate = dayjs(habitsDateToView).isAfter(
    dayjs(),
    "day"
  );

  const displayHabitForCurrentlyViewedDay = (habit) => {
    const habitDateToViewIsStartDateOrFuture =
      habitsDateToView.isAfter(dayjs(habit.habitStartDate), "day") ||
      habitsDateToView.isSame(dayjs(habit.habitStartDate), "day");

    const exceededHabitEndDate =
      habit.habitEndDate &&
      habitsDateToView.isAfter(dayjs(habit.habitEndDate), "day");

    return habitDateToViewIsStartDateOrFuture && !exceededHabitEndDate;
  };

  const renderHabits = () => {
    const habitsJSX = habitsList?.map((habit) => {
      // Check if the date selected in the input is found in the daysCompleted property
      const habitCompletedForInputDate = habit.daysCompleted.find((date) => {
        return habitsDateToView.isSame(dayjs(date), "day");
      });

      const reachedHabitCompletionGoal =
        Number(habit.habitNumberOfTimesToComplete) ===
        habit.daysCompleted.length;

      const habitCompletionProgressJSX = reachedHabitCompletionGoal ? (
        <p className="user-habit__completion-statistic user-habit__completion-statistic--achieved">
          Reached habit completion goal!
        </p>
      ) : (
        <p className="user-habit__completion-statistic">{`Completed ${habit.daysCompleted.length} times. Habit completion goal is ${habit.habitNumberOfTimesToComplete}`}</p>
      );

      // Only display habits on dates that fall on the day of the habit's start date or on dates after the habit's start date
      return displayHabitForCurrentlyViewedDay(habit) ? (
        <Grid key={habit.habitName} xs={12} lg={4}>
          <div className="user-habit">
            <HabitImage habitType={habit.habitType} />
            <div className="user-habit__content-section">
              <div className="user-habit__icons">
                {habitCompletedForInputDate && !isUserInputDateAFutureDate && (
                  <span
                    aria-label="Mark habit as todo"
                    onClick={() => markHabitAsTodo(habit.id)}
                  >
                    <Tooltip title="Mark habit as not completed">
                      <UndoIcon
                        sx={redIconHoverStyling}
                        fontSize="large"
                        color="error"
                      />
                    </Tooltip>
                  </span>
                )}
                {deleteHabitJSX(habit.id)}
              </div>
              <div className="user-habit__icons">
                {!habitCompletedForInputDate && !isUserInputDateAFutureDate && (
                  <span
                    aria-label="Mark habit completed"
                    onClick={() => markHabitCompletedForDay(habit.id)}
                  >
                    <Tooltip title="Mark habit as completed for the day">
                      <CheckBoxIcon
                        sx={greenIconHoverStyling}
                        color="success"
                        fontSize="large"
                      />
                    </Tooltip>
                  </span>
                )}
                {deleteHabitJSX(habit.id)}
              </div>
              <p className="user-habit__title">{habit.habitName}</p>
              {/* Only render the habit completion progress JSX if the habit has the 'habitNumberOfTimesToComplete' set to a non-falsy value*/}
              {habit.habitNumberOfTimesToComplete && habitCompletionProgressJSX}
              <div className="user-habit__buttons">
                <Link href={`/user-habits/${habit.id}`}>
                  <Button variant="contained">View Details</Button>
                </Link>
                <Link href={`/edit-user-habit/${habit.id}`}>
                  <Button variant="contained">Edit Habit</Button>
                </Link>
              </div>
            </div>
          </div>
        </Grid>
      ) : null;
    });

    // Return 'No Habits' if none of the user habits have a start date equal to or greater to the user selected input date

    return habitsJSX.every((habit) => habit === null) ? (
      <p>No habits found for {habitsDateToView.format("MM/DD/YYYY")}</p>
    ) : (
      habitsJSX
    );
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        marginTop: 3,
      }}
    >
      <ProtectedRoute>
        <Head>
          <title>My Habits</title>
        </Head>
        <div className="list-of-habits">
          <h1>My Habits</h1>
          <p className="margin-bottom-2">
            Use the date selector below to view your habits for a particular
            day. Click on a habit to view the details for that habit. Click on
            the green checkmark next to a habit to mark it complete. Click the
            red trashcan to delete a habit.
          </p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Enter date"
              value={habitsDateToView}
              onChange={(newValue) => setHabitsDateToView(newValue)}
            />
          </LocalizationProvider>
          {habitsList.length < 1 && loadingHabits && (
            <div className="loading-spinner">
              <CircularProgress />
            </div>
          )}
          {habitsList.length >= 1 && !loadingHabits && (
            <>
              {isUserInputDateAFutureDate && (
                <div className="alert margin-top-2">
                  <Alert severity="info">
                    <AlertTitle>
                      Cannot Mark Habits Complete/Incomplete
                    </AlertTitle>
                    The selected date is a future date. Habits can not be marked
                    as complete or incomplete for a future date.
                  </Alert>
                </div>
              )}
              {allHabitsCompletedForCurrentlyViewedDate() === true && (
                <Alert className="margin-top-2 alert" severity="success">
                  All habits completed for the day!
                </Alert>
              )}
              <div className="margin-top-2">
                <Grid
                  container
                  rowSpacing={5}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  {renderHabits()}
                </Grid>
              </div>
            </>
          )}

          {!loadingHabits && habitsList.length === 0 && (
            <p className="margin-top-2">No habits found.</p>
          )}

          <DeleteHabitConfirmationModal habitId={habitToDelete} />
        </div>
      </ProtectedRoute>
    </Container>
  );
};

export default UserHabits;
