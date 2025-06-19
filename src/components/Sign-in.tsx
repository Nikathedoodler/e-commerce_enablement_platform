import signInWithGoogle from "../../auth-actions";

export default function SignIn() {
  return (
    <form action={signInWithGoogle}>
      <button type="submit" className="cursor-pointer">
        Sign with Google
      </button>
    </form>
  );
}
