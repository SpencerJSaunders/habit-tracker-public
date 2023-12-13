import Head from "next/head";
import _isEmpty from "lodash/isEmpty";
import WelcomeSection from "../src/components/WelcomeSection";
import UserPortal from "../src/components/UserPortal";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state) => state.user.userDetails);

  return (
    <>
      <Head>
        <title>Habit Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {_isEmpty(user) ? <WelcomeSection /> : <UserPortal />}
    </>
  );
}
