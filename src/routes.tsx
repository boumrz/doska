import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { DrawPage } from "./pages";

// TODO: сделать авторизацию
const PrivateRoutes = () => {
  const { pathname } = useLocation();

  if (pathname === "/") {
    return <Navigate to="/draw" />;
  }

  return <Outlet />;
};

export const routes = createBrowserRouter([
  {
    path: "*",
    element: <div>Страница ошибки</div>,
  },
  {
    path: "/",
    element: <PrivateRoutes />,
    children: [
      {
        path: "draw",
        element: <DrawPage />,
      },
    ],
  },
]);
