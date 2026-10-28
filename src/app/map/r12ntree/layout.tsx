import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Reconstruction Tree",
  description: "visualise the reconstruction trees",
};

export default function R12nTreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
