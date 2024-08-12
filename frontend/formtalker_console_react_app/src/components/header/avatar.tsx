import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AvatarComponent: React.FC = () => {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};
