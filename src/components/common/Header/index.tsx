import { UserIcon } from "@/assets/images";
import s from "./styles.module.css";

export const Header = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.logoUser}>
        <UserIcon />
      </div>
    </div>
  );
};
