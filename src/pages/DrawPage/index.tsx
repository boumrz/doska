import { Header, Canvas, Navigation } from "@/components";
import s from "./styles.module.css";

export const DrawPage = () => {
  return (
    <div className={s.wrapper}>
      <Header />
      <Navigation />
      <Canvas />
    </div>
  );
};
