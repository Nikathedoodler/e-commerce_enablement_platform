import NavigationClient from "./NavigationClient";
import { auth } from "../../auth";

export default async function Navigation() {
  const session = await auth(); // Fetch the session

  return (
    <nav>
      <NavigationClient session={session} />
    </nav>
  );
}
