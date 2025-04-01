import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Feedback = async ({ params }: RouteParams) => {
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

  return (
    <section className={"section-feedback"}>
      <div className={"flex flex-row justify-center"}>
        <h1 className={"text-4xl font-semibold"}>
          Feedback on the Interview -{" "}
          <span className={"capitalize"}>{interview.role}</span> Interview
        </h1>
      </div>

      <div className={"flex flex-row justify-center"}>
        <div className={"flex flex-row gap-5"}>
          {/* overall impressions */}
          <div className={"flex flex-row gap-2 items-center"}>
            <Image src={"/star.svg"} alt={"star"} width={22} height={22} />
            <p className={"text-primary-200 font-bold"}>
              Overall Impressions: <span>{feedback?.totalScore}</span>/100
            </p>
          </div>

          {/* date */}
          <div className={"flex flex-row gap-2"}>
            <Image
              src={"/calendar.svg"}
              alt={"calendar"}
              width={22}
              height={22}
            />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      {/* interview breakdown */}
      <div className={"flex flex-col gap-4"}>
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((item, index) => (
          <div key={index}>
            <p className={"font-bold"}>
              {index + 1}. {item.name} ({item.score}/100)
            </p>
            <p>{item.comment}</p>
          </div>
        ))}
      </div>

      <div className={"flex flex-col gap-3"}>
        <h3>Strengths</h3>
        <ul>
          {feedback?.strengths?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={"flex flex-col gap-3"}>
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={"buttons"}>
        <Button className={"btn-secondary flex-1"}>
          <Link href={"/"} className={"flex w-full justify-center"}>
            <p className={"text-sm font-semibold text-primary-200 text-center"}>
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className={"btn-primary flex-1"}>
          <Link
            href={`/interview/${id}`}
            className={"flex w-full justify-center"}
          >
            <p className={"text-sm font-semibold text-black text-center"}>
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
