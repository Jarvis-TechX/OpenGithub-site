import { redirect } from "next/navigation";
import { pathInsights } from "@/lib/url";

export default function InsightsIndexPage() {
  redirect(pathInsights("7d", "all"));
}
