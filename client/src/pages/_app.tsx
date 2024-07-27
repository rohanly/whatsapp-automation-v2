import { Navigate, createBrowserRouter } from "react-router-dom";
import LoginPage from "./login";
import DashboardPage from "./dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import EventsPage from "./events";
import PeoplePage from "./people";
import TemplatesPage from "./templates";
import MessagePage from "./playground";
import PersonEditorPage from "./person-editor";
import TemplateEditorPage from "./template-editor";
import { getUser } from "@/api/auth-service";
import Root from ".";

const pages = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "events",
            element: <EventsPage />,
          },
          {
            path: "people",
            element: <PeoplePage />,
          },
          {
            path: "people/:id",
            element: <PersonEditorPage />,
          },
          {
            path: "templates",
            element: <TemplatesPage />,
          },
          {
            path: "templates/:id",
            element: <TemplateEditorPage />,
          },
          {
            path: "messages",
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);

export default pages;
