import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-4 text-center">
      <h1 className="text-4xl font-bold text-foreground">
        Oops! Something went wrong.
      </h1>
      <p className="text-muted-foreground">
        We couldn't find the tenant information you were looking for.
      </p>
      <Button asChild>
        <Link href="/auth/login">Return to Login</Link>
      </Button>
    </div>
  );
}
