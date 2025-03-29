"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  // assign our custom validation schema
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      if (type === "sign-up") {
        // get the user details from the passed in values object
        const { name, email, password } = values;
        // create new user account session
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        // sign the user up
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email: email!,
          password: password!,
        });

        // evaluate result of signup
        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        // get form values
        const { email, password } = values;

        //sign in
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        // create short-lived token
        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error("Sign in failed");
          return;
        }

        // sign in the user
        await signIn({ email, idToken });

        toast.success("Sign in successfully.");
        router.push("/");
      }
    } catch (e) {
      console.log(e);
      toast.error(`There was an error: ${e}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className={"flex flex-col gap-6 card py-4 px-10"}>
        <div className={"flex flex-row gap-2 justify-center"}>
          <Image src={"/logo.svg"} alt={"logo"} height={32} width={38} />
          <h2 className={"text-primary-100"}>Preppi</h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {/* Name */}
            {!isSignIn && (
              <FormField
                control={form.control}
                name={"name"}
                label={"Name"}
                placeholder={"Your Name"}
              />
            )}

            {/* Email */}
            <FormField
              control={form.control}
              name={"email"}
              label={"Email"}
              placeholder={"Your email address"}
              type={"email"}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name={"password"}
              label={"Password"}
              placeholder={"Enter your password"}
              type={"password"}
            />

            <Button className={"btn"} type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className={"text-center"}>
          {isSignIn ? "No account yet?" : "Have and account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className={"font-bold text-user-primary ml-1"}
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};
export default AuthForm;
