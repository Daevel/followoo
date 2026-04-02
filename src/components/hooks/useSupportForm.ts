import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  supportSchema,
  type SupportFormValues,
} from "../schemas/support.schema";
import { sendSupportMessage } from "../services/supportService";

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

export function useSupportForm() {
  const [submitState, setSubmitState] =
    useState<SubmitState>(initialSubmitState);

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
    mode: "onChange",
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
      await sendSupportMessage(values);

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
