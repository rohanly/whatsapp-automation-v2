import pages from "@/pages/_app";
import { RouterProvider as ReactRouterProvider } from "react-router-dom";

const RouterProvider = () => {
  return <ReactRouterProvider router={pages} />;
};

export default RouterProvider;
