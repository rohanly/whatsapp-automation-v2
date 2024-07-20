import { Navigate, createBrowserRouter } from "react-router-dom";
import LoginPage from "./login";
import DashboardPage from "./dashboard";
import { ProtectedRoute } from "@/components/protected-route";
import EventsPage from "./events";
import PeoplePage from "./people";
import TemplatesPage from "./templates";
import MessagePage from "./playground";
import PersonEditorPage from "./person-editor";
import TemplateEditorPage from "./template-editor";

const pages = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/",
    // TODO: to be removed
    // element: <ProtectedRoute />,
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
]);

export default pages;
