import { TeamSettingsClient } from "@/components/settings/TeamSettingsClient";
import { env } from "@/lib/env";

export default function TeamSettingsPage() {
  return <TeamSettingsClient appUrl={env.APP_URL} />;
}
