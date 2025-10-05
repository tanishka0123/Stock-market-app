"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import NavItems from "@/components/NavItems";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserDropdown = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    router.push("/sign-in");
  };

  const user = { name: "John", email: "blah@gmail.com" };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 text-gray-4 hover:text-yellow-500"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://imgs.search.brave.com/6tNgZPLbgUNl-efDN7QS13jvZj-DomWBc7stTuq-BI4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/YnVzaW5lc3NtYW4t/Y2hhcmFjdGVyLWF2/YXRhci1pc29sYXRl/ZF8yNDg3Ny02MDEx/MS5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQwJnE9ODA" />
            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-base font-medium text-gray-400">
              {user.name}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-400">
        <DropdownMenuLabel>
          <div className="flex relative items-center gap-3 py-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://imgs.search.brave.com/6tNgZPLbgUNl-efDN7QS13jvZj-DomWBc7stTuq-BI4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/YnVzaW5lc3NtYW4t/Y2hhcmFjdGVyLWF2/YXRhci1pc29sYXRl/ZF8yNDg3Ny02MDEx/MS5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQwJnE9ODA" />
              <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-400">
                {user.name}
              </span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
          Logout
        </DropdownMenuItem>
        <DropdownMenuSeparator className="hidden sm:block bg-gray-600" />
        <nav className="sm:hidden">
          <NavItems />
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserDropdown;
