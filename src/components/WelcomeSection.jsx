import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@mui/material";
import _isEmpty from "lodash/isEmpty";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { logInUser } from "../redux/slices/userSlice";

const WelcomeSection = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const logInHandler = async () => {
    try {
      await dispatch(logInUser());
      router.push("/user-habits");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="homepage__welcome-section">
      <div className="homepage__welcome-information">
        <h1 className="homepage__welcome-title text-align-center">
          Welcome to Habit Tracker!
        </h1>
        <h2 className="homepage__welcome-subtitle">
          Start tracking your habits today!
        </h2>
        <Button onClick={logInHandler} variant="contained">
          Login with Google
          <GoogleIcon sx={{ marginLeft: "10px" }} />
        </Button>
        <Image
          height={400}
          width={600}
          style={{ margin: "0 auto" }}
          src="/imgs/habit-desktop-front.png"
          alt="Habit Tracker desktop view"
        />
      </div>
    </div>
  );
};

export default WelcomeSection;
