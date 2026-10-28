import type { Metadata } from "next";
import React from "react";
import "./styles/global.css";

export const metadata: Metadata = {
  title: "Paleomap Maker",
  description: "the new paleomap maker",
};

export default function PaleomapMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="paleomap-maker">{children}</div>;
}
