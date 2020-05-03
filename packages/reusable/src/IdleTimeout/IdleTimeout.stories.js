import React from "react";
import IdleTimeout from "./IdleTimeout";

export default { title: "IdleTimeout" };
export const defaultExample = () => (
  <>
    <IdleTimeout
      onLogoutClick={() => alert("Log out clicked")}
      secondsBeforeAutomaticLogout={10}
      secondsBeforeWarning={5}
    />
    <p>Warning modal will show in 5 seconds if idle</p>
  </>
);
