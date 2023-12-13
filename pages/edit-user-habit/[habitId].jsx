import HabitForm from "@/src/components/HabitForm";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { EDIT_HABIT } from "@/src/util/habitVariables";
import Container from "@mui/material/Container";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import Head from "next/head";

const EditUserHabit = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        marginTop: 3,
      }}
    >
      <ProtectedRoute>
        <Head>
          <title>Edit Habit</title>
        </Head>
        <div>
          <Breadcrumbs className="breadcrumbs" aria-label="breadcrumb">
            <Link href="/user-habits">My Habits</Link>
            <Typography color="text.primary">Edit Habit</Typography>
          </Breadcrumbs>
          <h1>Edit Habit</h1>
          <p className="margin-bottom-2">
            Edit the habit by updating the input fields and clicking Submit.
          </p>
          <HabitForm formType={EDIT_HABIT} />
        </div>
      </ProtectedRoute>
    </Container>
  );
};

export default EditUserHabit;
