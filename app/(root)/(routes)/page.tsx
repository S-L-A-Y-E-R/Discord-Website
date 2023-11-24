import { UserButton } from "@clerk/nextjs";

import { ModeToggle } from "@/components/toggle-theme";

export default function Home() {
  return (
    <div className="flex gap-5">
      <UserButton afterSignOutUrl="/sign-in" />
      <ModeToggle />
    </div>
  );
}
