import { Menu } from "lucide-react";

import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import NavSidebar from "./navigation/nav-sidebar";
import ServerSidbar from "./server/server-sidebar";

export default function MobileToggle({ serverId }: { serverId: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavSidebar />
        </div>
        <ServerSidbar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
}
