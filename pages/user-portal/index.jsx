import ProtectedRoute from "@/src/components/ProtectedRoute";
import UserPortal from "../../src/components/UserPortal";
import Container from "@mui/material/Container";

const UserPortalPage = () => {
  return (
    <ProtectedRoute>
      <Container
        maxWidth="xl"
        sx={{
          marginTop: 3,
        }}
      >
        <UserPortal />
      </Container>
    </ProtectedRoute>
  );
};

export default UserPortalPage;
