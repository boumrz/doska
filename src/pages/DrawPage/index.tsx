import { Header, Canvas, Navigation, Toolbar } from "@/components";
import s from "./styles.module.css";

export const DrawPage = () => {
  return (
    <div className={s.wrapper}>
      <Header />
      <Navigation />
      <div className={s.canvas}>
        <Canvas />
        <Toolbar />
      </div>
    </div>
  );
};
