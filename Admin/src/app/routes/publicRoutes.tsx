import { RouteObject } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import NotFoundPage from "../pages/NotFoundPage";
import RedirectPage from "../pages/RedirectPage";

export const publicRoutes: RouteObject[] = [
  {
    element: <AuthPage />,
    path: "/login",
  },
  {
    element: <RedirectPage />,
    path: "/",
  },
  {
    element: <NotFoundPage />,
    path: "*",
  },
];
