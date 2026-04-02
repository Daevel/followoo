import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { useEffect, useRef } from "react";
import { useSupportForm } from "../hooks/useSupportForm";
import { toastService } from "../services/toastService";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { Input } from "../ui/Input";
import { NavBar } from "../ui/NavBar";
import { SkeletonLoaderCircle } from "../ui/SkeletonLoaderCircle";

export function SupportSection() {
  const { form, onSubmit, submitState, isSubmitting } = useSupportForm();
  const {
    register,
    formState: { errors, isValid },
  } = form;

  // Watch the message field to get its value for the character count
  const messageValue = form.watch("message") ?? "";

  const rootRef = useRef<HTMLDivElement | null>(null);

  useStandardPageAnimation(rootRef);

  useEffect(() => {
    if (submitState.success)
      return toastService.success({
        title: "Success",
        description: "Email sent successfully.",
      });
    if (submitState.error)
      return toastService.warning({
        title: "Warning",
        description: "An error has occurred: " + submitState.message.toString(),
      });
  }, [submitState]);

  return (
    <section className="flex min-h-svh flex-col">
      <NavBar />
      <Container className="flex min-h-svh flex-col">
        <div
          ref={rootRef}
          className="text-foreground flex flex-1 flex-col items-start pt-15 pb-6 text-center"
        >
          <div className="mb-10 flex flex-col items-start text-start">
            <h1
              data-page-animate="heading"
              className="leading-headers text-4xl font-semibold md:text-5xl"
            >
              Support section
            </h1>
            <p data-page-animate="subheading" className="p1-r mt-10">
              Found a bug or have feedback about the app? Use the form below to
              let me know.
            </p>
          </div>

          <div className="flex w-full flex-col items-center">
            <div
              data-page-animate="content"
              className="flex w-full flex-col items-center gap-10 pt-5"
            >
              <div
                data-page-animate="item"
                className="flex w-full flex-col items-center text-start"
              >
                <form
                  onSubmit={onSubmit}
                  className="flex w-full flex-col gap-6"
                  noValidate
                >
                  <label className="l1-b" htmlFor="fullName">
                    Full name
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    hasError={!!errors.fullName}
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-accent text-sm">
                      {errors.fullName.message}
                    </p>
                  )}

                  <label className="l1-b" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    hasError={!!errors.email}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-accent text-sm">
                      {errors.email.message}
                    </p>
                  )}

                  <label className="l1-b" htmlFor="message">
                    Message
                  </label>
                  <div className="text-end">
                    <Input
                      id="message"
                      variant="textarea"
                      hasError={!!errors.message}
                      {...register("message")}
                    />
                    <span className="text-foreground/70 self-end text-xs">
                      {messageValue.length}/500
                    </span>
                    <div className="text-start">
                      {errors.message && (
                        <p className="text-accent text-sm">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    background="primary"
                    foreground="foreground"
                    icon={isSubmitting ? undefined : "sendMail"}
                    iconPosition="right"
                    type="submit"
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex flex-row items-center text-center align-middle">
                        <SkeletonLoaderCircle size="md" color="foreground" />
                      </div>
                    ) : (
                      "Send message"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
