import signInWithGoogle from "../../auth-actions";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  return (
    <button
      type="submit"
      className="cursor-pointer"
      onClick={() => router.push("/login")}
    >
      Sign in
    </button>
  );
}
