import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { tabs } from "@/constants";

import s from "./styles.module.css";

export const Navigation = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<"draw" | "students" | "tasks">("draw");

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: "draw" | "students" | "tasks"
  ) => {
    setValue(newValue);
    navigate(tabs[newValue]);
  };

  return (
    <div className={s.wrapper}>
      <Tabs value={value} onChange={handleChange} aria-label="tabs">
        <Tab label="Доска" {...a11yProps(0)} value={"draw"} />
        <Tab
          label="Список заданий"
          {...a11yProps(1)}
          value={"tasks"}
          disabled
        />
      </Tabs>
    </div>
  );
};
