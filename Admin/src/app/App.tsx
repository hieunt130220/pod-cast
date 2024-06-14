import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { privateRoutes } from "./routes/privateRoutes";
import { publicRoutes } from "./routes/publicRoutes";
import { ThemeProvider } from "@mui/styles";
import { CssBaseline, createTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { authReducerType } from "./redux/reducer/authReducer";

function App() {
  const theme = createTheme({});
  const token = useSelector<RootState, authReducerType>(
    (state) => state.authReducer
  ).token;

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {token
              ? privateRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path as string}
                    element={route.element}
                  />
                ))
              : publicRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path as string}
                    element={route.element}
                  />
                ))}
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
