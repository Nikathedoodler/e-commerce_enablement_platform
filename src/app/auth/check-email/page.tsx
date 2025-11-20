"use client";

import { useRouter } from "next/navigation";

export default function CheckEmail() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full items-center justify-center md:p-10 bg-black text-white text-xl">
      <div className="w-1/3 flex flex-col items-center border-1 border-gray-500 rounded-md py-6 gap-4">
        <p className="*:">
          Almost done! Check your inbox and click the link we sent. Once
          confirmed, return to the app.
        </p>
        <button
          onClick={() => router.push("/auth/login")}
          className="border p-2 w-48 rounded-md border-gray-500 cursor-pointer"
        >
          Back To Login
        </button>
      </div>
    </div>
  );
}
