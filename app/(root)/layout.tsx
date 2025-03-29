import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  // we check for logged-in user and redirect to sign-in if not found
  const isUserAuthenticate = await isAuthenticated();
  if (!isUserAuthenticate) redirect("/sign-in");

  return (
    <div className={"root-layout"}>
      <nav>
        <Link href={"/"} className={"flex item-center gap-2"}>
          <Image src={"/logo.svg"} alt={"Logo"} width={38} height={32} />
          <h2 className={"text-primary-100"}>Preppi</h2>
        </Link>
      </nav>

      {children}
    </div>
  );
};
export default RootLayout;
