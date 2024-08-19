import {
  Dispatch,
  useState,
  useEffect,
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
} from "react";

import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { AvatarComponent } from "./avatar";
import { Button } from "../ui/button";
import { signOut } from "@/services/supabase/auth";
import { AlertBox } from "../share/alert";
import { Navigate, Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";

import { pageLinks } from "@/utils/pageLinks";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Cars",
    href: pageLinks.inspectionPlanFolders,
    description: "A list of all your Car folders",
  },
  {
    title: "Motorcycles",
    href: pageLinks.inspectionPlanFolders,
    description: "A list of all your Motorcycle folders",
  },
  {
    title: "Trucks",
    href: pageLinks.inspectionPlanFolders,
    description: "A list of all your Truck folders",
  },
];
interface NavBarProps {
  loggedIn: boolean;
  setUser: Dispatch<React.SetStateAction<any>>;
}

export const NavigationBar: React.FC<NavBarProps> = ({ loggedIn, setUser }) => {
  const [error, setError] = useState<string | null>(null);
  const [successfullyLoggedOut, setSuccessfullyLoggedOut] =
    useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setSuccessfullyLoggedOut(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  useEffect(() => {
    if (successfullyLoggedOut) {
      setSuccessfullyLoggedOut(false);
    }
  }, [successfullyLoggedOut]);

  return (
    <>
      {successfullyLoggedOut && <Navigate to="/" />}
      {error && (
        <AlertBox message={{ title: "SignOut error!", description: error }} />
      )}
      <ul className="flex justify-between">
        <li className="mt-6 ml-5">
          <Link to="/">
            <IoHomeOutline className="w-10 h-10" />
          </Link>
        </li>
        <li className="mt-5 mr-5 ml-5 w-3/4 p-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-lg">
                  Folders
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[200px]  p-4 md:w-[100px] lg:w-[300px] ">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </li>
        <li className="mt-6 mr-5">
          {loggedIn ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <Button className="cursor-not-allowed" disabled>
              Logout
            </Button>
          )}
        </li>
      </ul>
    </>
  );
};

const ListItem = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
