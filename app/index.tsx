import { Redirect } from "expo-router";

export default function Index() {
  // Use declarative Redirect so navigation happens after the navigator mounts.
  return <Redirect href="/(app)/main" />;
}
