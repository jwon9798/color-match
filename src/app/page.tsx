import HomeMenu from "@/components/HomeMenu";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "무료 색감 매칭 게임",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeMenu />;
}
