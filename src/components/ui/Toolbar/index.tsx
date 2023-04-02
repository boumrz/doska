import {
  PencilIcon,
  PalletteIcon,
  CircleIcon,
  SquareIcon,
} from "@/assets/images";
import s from "./styles.module.css";

export const Toolbar = () => {
  return (
    //TODO: в следующей задаче сделать функциональность
    <div className={s.wrapper}>
      <button className={s.icon}>
        <PencilIcon />
      </button>
      <button className={s.icon}>
        <SquareIcon />
      </button>
      <button className={s.icon}>
        <CircleIcon />
      </button>
      <button className={s.icon}>
        <PalletteIcon />
      </button>
    </div>
  );
};
