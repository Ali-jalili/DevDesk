/** @format */

import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Loading from "@/ui/Loading";

const Home = lazy(() => import("@/page/Home"));
const Signup = lazy(() => import("@/page/Signup"));
const Login = lazy(() => import("@/page/Login"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const AppLayout = lazy(() => import("../layouts/AppLayout"));
const PublicLayout = lazy(() => import("../layouts/PublicLayout"));
const Workspaces = lazy(() => import("@/features/workspaces/Workspaces"));
const WorkspaceLayout = lazy(
  () => import("@/features/workspaces/WorkspaceLayout"),
);
const WorkspaceOverview = lazy(
  () => import("@/features/workspaces/WorkspaceOverview"),
);
const CreateWorkspace = lazy(
  () => import("@/features/workspaces/CreateWorkspace"),
);
const Collections = lazy(() => import("@/features/collection/Collections"));
const CollectionDetail = lazy(
  () => import("@/features/collection/CollectionDetail"),
);
const CreateRequest = lazy(() => import("@/features/requests/CreateRequest"));
const RequestDetail = lazy(() => import("@/features/requests/RequestDetail"));
const Environments = lazy(() => import("@/features/environments/Environments"));
const EnvironmentDetail = lazy(
  () => import("@/features/environments/EnvironmentDetail"),
);
const Dashboard = lazy(() => import("@/features/dashboard/Dashboard"));

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },

  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },

          {
            path: "workspaces",
            element: <Workspaces />,
          },

          {
            path: "workspaces/new",
            element: <CreateWorkspace />,
          },

          {
            path: "workspaces/:workspaceId",
            element: <WorkspaceLayout />,
            children: [
              {
                index: true,
                element: <WorkspaceOverview />,
              },
              {
                path: "collections",
                element: <Collections />,
              },

              {
                path: "collections/:collectionId",
                element: <CollectionDetail />,
              },
              {
                path: "collections/:collectionId/requests/new",
                element: <CreateRequest />,
              },

              {
                path: "collections/:collectionId/requests/:requestId",
                element: <RequestDetail />,
              },

              {
                path: "environments",
                element: <Environments />,
              },
              {
                path: "environments/:environmentId",
                element: <EnvironmentDetail />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default function Router() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
