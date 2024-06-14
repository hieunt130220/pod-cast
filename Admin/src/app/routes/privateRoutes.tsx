import { RouteObject } from "react-router-dom";
import AdminPage from "../pages/AdminPage";
import AuthPage from "../pages/AuthPage";
import UserPage from "../pages/UserPage";
import DetailUserPage from "../pages/DetailUserPage";
import PodcastPage from "../pages/PodcastPage";
import DetailPodcast from "../pages/DetailPodcast";
import NotFoundPage from "../pages/NotFoundPage";
import RedirectPage from "../pages/RedirectPage";

export const privateRoutes: RouteObject[] = [
  {
    element: <RedirectPage />,
    path: "/",
  },
  {
    element: (
      <AdminPage>
        <UserPage />
      </AdminPage>
    ),
    path: "/users",
  },
  {
    element: <AuthPage />,
    path: "/login",
  },
  {
    element: (
      <AdminPage>
        <DetailUserPage />
      </AdminPage>
    ),
    path: "/users/:id",
  },
  {
    element: (
      <AdminPage>
        <PodcastPage />
      </AdminPage>
    ),
    path: "/podcast",
  },
  {
    element: (
      <AdminPage>
        <DetailPodcast />
      </AdminPage>
    ),
    path: "/podcast/:id",
  },
  {
    element: <NotFoundPage />,
    path: "*",
  },
];
