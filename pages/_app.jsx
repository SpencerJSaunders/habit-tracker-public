import "@/styles/main.scss";
import "@/styles/homepage.scss";
import "@/styles/user-portal.scss";
import "@/styles/utility-classes.scss";
import "@/styles/modal.scss";
import "@/styles/header.scss";
import "@/styles/edit-habit.scss";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/theme";
import store from "../src/redux/store";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "../src/components/Header";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </Provider>
  );
}
