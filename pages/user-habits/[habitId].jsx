import ProtectedRoute from "../../src/components/ProtectedRoute";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { DayPicker } from "react-day-picker";
import Grid from "@mui/material/Unstable_Grid2";
import dayjs from "dayjs";
import "react-day-picker/dist/style.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import Head from "next/head";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";

const IndividualHabit = () => {
  const params = useParams();
  const individualHabit = useSelector((state) => {
    return state.userHabits.userHabits.find((habit) => {
      return habit.id === params.habitId;
    });
  });


  const calculateHabitSuccessRate = () => {
    const habitStartDate = dayjs(individualHabit.habitStartDate);

    /*
     endDateForHabitDateRange is a dayjs object that will be used to determine the success rate for a specific habit. 
     The value for this variable will be based on whether or not there's a habit limit.
    */
    let endDateForHabitDateRange = dayjs();

    const { habitEndDate, daysCompleted, habitLimit } = individualHabit;

    if (habitLimit) {
      if (habitEndDate && dayjs() > dayjs(habitEndDate)) {
        endDateForHabitDateRange = dayjs(habitEndDate);
      }
    }

    // Have to add 1 to result of diff() due to diff only being the number of days after the start date. The addition of 1 is to account for the start date which can be marked as completed
    const numberOfDaysBetweenDates =
      endDateForHabitDateRange.diff(habitStartDate, "day") + 1;
    return Number(
      (daysCompleted.length / numberOfDaysBetweenDates) * 100
    ).toFixed(2);
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
          <title>Habit Details</title>
        </Head>

        {individualHabit ? (
          <div>
            <Breadcrumbs className="breadcrumbs" aria-label="breadcrumb">
              <Link href="/user-habits">My Habits</Link>
              <Typography color="text.primary">Habit Details</Typography>
            </Breadcrumbs>
            <h1>{individualHabit.habitName}</h1>
            <Grid
              container
              rowSpacing={5}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid xs={12} md={6} lg={4}>
                <Card>
                  <CardContent>
                    <div className="habit-statistic">
                      <h2>Number of Times Completed</h2>
                      <p>
                        {individualHabit.daysCompleted.length}{" "}
                        {individualHabit.daysCompleted.length === 1
                          ? "time"
                          : "times"}
                      </p>{" "}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} md={6} lg={4}>
                <Card>
                  <CardContent>
                    <div className="habit-statistic">
                      <h2>Habit Start Date</h2>
                      <p>{individualHabit.habitStartDate}</p>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
              {individualHabit.habitEndDate && (
                <Grid xs={12} md={6} lg={4}>
                  <Card>
                    <CardContent>
                      <div className="habit-statistic">
                        <h2>Habit End Date</h2>
                        <p>{individualHabit.habitEndDate}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              {/*  
                   The 'Habit Completion Rate' card won't be rendered if the user has habitNumberOfTimesToComplete set to a non-falsy value.
                   This is because there's no end date for this habit and the user may take an 
                   indefinite amount of times to reach the habitNumberOfTimesToComplete value.
              */}
              {!individualHabit.habitNumberOfTimesToComplete && (
                <Grid xs={12} md={6} lg={4}>
                  <Card>
                    <CardContent>
                      <div className="habit-statistic">
                        <h2>Habit Completion Rate</h2>
                        <p>{calculateHabitSuccessRate()} %</p>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              {individualHabit.habitNumberOfTimesToComplete && (
                <Grid xs={12} md={6} lg={4}>
                  <Card>
                    <CardContent>
                      <div className="habit-statistic">
                        <h2>Number of Times to Complete Goal</h2>
                        <p>{individualHabit.habitNumberOfTimesToComplete}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
            <p className="margin-bottom-2 margin-top-2">
              All highlighted days in the calendar below are the days that have
              been marked completed.
            </p>
            <DayPicker
              defaultMonth={
                new Date(individualHabit.habitStartDate.replace(/-/g, "/"))
              }
              mode="multiple"
              minDate={
                new Date(individualHabit.habitStartDate.replace(/-/g, "/"))
              }
              max={0}
              selected={individualHabit.daysCompleted.map((day) => {
                return new Date(day.replace(/-/g, "/"));
              })}
            />
          </div>
        ) : (
          <h3 className="margin-top-2">Habit not found!</h3>
        )}
      </ProtectedRoute>
    </Container>
  );
};

export default IndividualHabit;
