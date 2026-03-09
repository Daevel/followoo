import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { helpSchema, type HelpFormValues } from "../schemas/help.schema";
import { sendHelpMessage } from "../services/help.service";

type SubmitState = {
  success: boolean;
  error: boolean;
  message: string;
};

const initialSubmitState: SubmitState = {
  success: false,
  error: false,
  message: "",
};

export function useHelpForm() {
  const [submitState, setSubmitState] =
    useState<SubmitState>(initialSubmitState);

  const form = useForm<HelpFormValues>({
    resolver: zodResolver(helpSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitState(initialSubmitState);

    try {
      await sendHelpMessage(values);

      setSubmitState({
        success: true,
        error: false,
        message: "Message sent successfully!",
      });

      form.reset();
    } catch (error) {
      console.error(error);

      setSubmitState({
        success: false,
        error: true,
        message: "Failed to send message. Please try again.",
      });
    }
  });

  return {
    form,
    onSubmit,
    submitState,
    isSubmitting: form.formState.isSubmitting,
  };
}
