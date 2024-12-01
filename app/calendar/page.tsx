"use client";

import { useRouter } from "next/navigation";
import Calendar from "@/components/calendar";

export default function CalendarPage() {
  const router = useRouter();
  return <Calendar />;
}