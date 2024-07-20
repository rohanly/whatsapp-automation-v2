import StoreProvider from "@/providers/store";
import QueryProvider from "@/providers/query";
import RouterProvider from "@/providers/router";
import { Toaster } from "./components/ui/toaster";

const App = () => {
  return (
    <>
      <StoreProvider>
        <QueryProvider>
          <RouterProvider />
        </QueryProvider>
      </StoreProvider>
      <Toaster />
    </>
  );
};

export default App;
