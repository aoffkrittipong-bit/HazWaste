import { createBrowserRouter } from "react-router";
import RoleSelection from "./components/RoleSelection";
import UserDashboard from "./components/UserDashboard";
import TruckDashboard from "./components/TruckDashboard";
import MapView from "./components/MapView";
import Statistics from "./components/Statistics";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RoleSelection,
  },
  {
    path: "/user",
    Component: UserDashboard,
  },
  {
    path: "/truck",
    Component: TruckDashboard,
  },
  {
    path: "/map",
    Component: MapView,
  },
  {
    path: "/stats",
    Component: Statistics,
  },
]);
