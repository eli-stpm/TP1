"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";

export default function HomeLoader() {
  const router = useRouter();
  const hasNavigated = useRef(false);

  function handleComplete() {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    router.replace("/page-principale");
  }

  return <Loader onComplete={handleComplete} />;
}
