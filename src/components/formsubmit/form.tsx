import BasicDetailCard from "./basicDetailCard";
import QuestionCard from "./questioncard";
import theoryQuestion from "./questionTemplate/theory.json";
import practicalQuestion from "./questionTemplate/practical.json";
import { useFeedbackFormData } from "@/context/Form";
import { useEffect, useState } from "react";
import SubmitForm from "./SubmitForm";
import { Card } from "../ui/card";
import { useSubmission } from "@/context/Submission";
import type { FormSubmission } from "@/context/Submission";

type QuestionSet = Record<string, string>;

const FeedbackForm = () => {
  const { formType, showForm, faculties } = useFeedbackFormData();
  const [formQuestion, setFormQuestion] = useState<QuestionSet>({});
  const { name, rollNo, div, setSubmissions } = useSubmission();

  useEffect(() => {
    if (formType === "Theory") {
      setFormQuestion(theoryQuestion as QuestionSet);
    } else if (formType === "Practical") {
      setFormQuestion(practicalQuestion as QuestionSet);
    } else {
      setFormQuestion({});
    }
  }, [formType]);

  useEffect(() => {
    const defaultSubmissions: FormSubmission = {};
    for (let i = 1; i <= 2; i++) {
      defaultSubmissions["Q" + i] = new Array(faculties.length).fill(0);
    }

    setSubmissions(defaultSubmissions);
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-4 justify-center items-center">
      <div className="max-w-sm sm:max-w-4xl flex flex-col gap-6 w-full justify-center items-center">
        {!showForm ? (
          <BasicDetailCard />
        ) : (
          <Card className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-4 sm:p-6 mb-8 shadow-md rounded-2xl">
            <h2 className="text-2xl font-semibold text-foreground">
              Student Details Submitted
            </h2>
            <p className="text-sm text-muted-foreground">
              Name : <span>{name}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Roll No : <span>{rollNo}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Division : <span>{div}</span>
            </p>
          </Card>
        )}

        {showForm ? (
          <>
            {Object.entries(formQuestion).map(([key, question], index) => (
              <QuestionCard index={index + 1} key={key} question={question} />
            ))}
            <SubmitForm />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default FeedbackForm;
