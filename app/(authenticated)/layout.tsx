"use client";

import { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Navigation from "@/components/layout/navigation";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardLayout sidebar={<Navigation />}>
      {children}
    </DashboardLayout>
  );
}
