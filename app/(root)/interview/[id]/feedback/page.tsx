import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";

const Page = async ({ params }: RouteParams) => {
  const { id } = await params;

  const [interview, user] = await Promise.all([
    await getInterviewById(id),
    await getCurrentUser(),
  ]);

  if (!interview || !user) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  console.log(feedback);

  return <div>Page</div>;
};
export default Page;
