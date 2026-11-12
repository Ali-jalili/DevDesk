/** @format */

import { Toaster } from "react-hot-toast";

import Router from "./router/Router";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App() {
  return (
    <>
      {" "}
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
      <Toaster position="top-center" />
    </>
  );
}
