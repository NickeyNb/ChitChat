import EmptyState from "@/components/EmptyState";
import { signOut } from "next-auth/react";
const Users = () => {
  return (
    <div className="hidden h-full lg:block lg:pl-80">
      <EmptyState />
    </div>
  );
};

export default Users;
