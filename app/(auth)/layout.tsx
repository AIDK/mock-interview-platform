import { ReactNode } from "react";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  // redirect the user to the home page is they are already authenticated
  const isUserAuthenticate = await isAuthenticated();
  if (isUserAuthenticate) redirect("/");

  return <div className={"auth-layout"}>{children}</div>;
};
export default AuthLayout;
