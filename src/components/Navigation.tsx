import NavigationClient from "./NavigationClient";
import Image from "next/image";
import { auth } from "../../auth";

export default async function Navigation() {
  const session = await auth(); // Fetch the session

  return (
    <nav>
      {/* Left: Logo */}
      <a href="#top" className="flex items-center space-x-2">
        <Image
          src="/images/logo.png"
          alt="Cuckoo Logo"
          width={32}
          height={32}
        />
        <span className="font-bold text-lg"></span>
      </a>
      <NavigationClient session={session} />
    </nav>
  );
}
