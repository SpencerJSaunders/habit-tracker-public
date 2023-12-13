import ProtectedRoute from "../../src/components/ProtectedRoute";
import Head from "next/head";
import Container from "@mui/material/Container";
import HabitForm from "@/src/components/HabitForm";
import { CREATE_HABIT } from "@/src/util/habitVariables";

const AddHabit = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        marginTop: 3,
      }}
    >
      <ProtectedRoute>
        <Head>
          <title>Add Habit</title>
        </Head>
        <div>
          <h1>Add a new habit</h1>
          <p style={{ marginBottom: "2rem" }}>
            To add a new habit to your habit list, fill out the fields below and
            click Submit.
          </p>
          <HabitForm formType={CREATE_HABIT} />
        </div>
      </ProtectedRoute>
    </Container>
  );
};

export default AddHabit;
