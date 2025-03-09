import Link from "next/link";
import { auth } from "@/auth";
import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";

const UserButton = async () => {
    const session = await auth();

    if (!session) {
        return (
            <Button asChild>
                <Link href="/sign-in">
                    <UserIcon /> Sign In
                </Link>
            </Button>
        );
    }

    const firstInitial = session.user?.name?.charAt(0).toUpperCase() || "U";

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            className="relative ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200"
                        >
                            {firstInitial}
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <div className="text-sm font-medium leading-none">
                                {session.user?.name}
                            </div>
                            <div className="text-sm leading-none text-muted-foreground">
                                {session.user?.email}
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="mb-1 p-0">
                        <form action={signOutUser} className="w-full">
                            <Button
                                className="h-4 w-full justify-start px-2 py-4"
                                variant="ghost"
                            >
                                Sign Out
                            </Button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
export default UserButton;
