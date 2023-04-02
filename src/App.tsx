import { BrowserRouter as Router, RouterProvider } from "react-router-dom";
import "@/assets/global/styles.css";
import { routes } from "./routes";

const App = () => {
  return (
    <RouterProvider router={routes} fallbackElement={<div>Загрузка</div>} />
  );
};

export default App;
