"use client";

import { useEffect } from "react";
import LogRocket from "logrocket";

export default function LogRocketInit() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      LogRocket.init("ppo9zo/hyper-grid");
    }
  }, []);

  return null;
}
