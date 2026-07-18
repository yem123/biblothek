"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const last = localStorage.getItem("last-pdf");

    if (last) {
      router.replace(`/lesson/${last}`);
    }
  }, [router]);

  return null;
}
