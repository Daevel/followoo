import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { FooterSignature } from "../ui/FooterSignature";
import { Input } from "../ui/Input";
import { NavBar } from "../ui/NavBar";

import { useHelpForm } from "../hooks/useHelpForm";

export function HelpSection() {
  const { form, onSubmit, submitState, isSubmitting } = useHelpForm();
  const {
    register,
    formState: { errors },
  } = form;
  const messageValue = form.watch("message") ?? "";

  return (
    <section className="min-h-svh flex flex-col">
      <Container className="min-h-svh flex flex-col">
        <NavBar showHelp={false} />
        <div className="flex flex-col items-start pt-15 pb-6 text-center text-foreground flex-1">
          <div className="flex flex-col items-start text-start mb-10">
            <h1 className="text-4xl font-semibold leading-headers md:text-5xl">
              Help section
            </h1>
            <p className="p1-r mt-10">
              Found any bugs or suggestions for better implementation? Fill the
              form below with your informations and I'll be grateful to read it.
            </p>
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="w-full pt-5 flex flex-col items-center gap-10">
              <div className="w-full flex flex-col items-center text-start">
                <form
                  onSubmit={onSubmit}
                  className="w-full flex flex-col gap-6"
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
                    <p className="text-sm text-accent">
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
                    <p className="text-sm text-accent">
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
                    <span className="self-end text-xs text-foreground/70">
                      {messageValue.length}/500
                    </span>
                    <div className="text-start">
                      {errors.message && (
                        <p className="text-sm text-accent">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    background="primary"
                    foreground="foreground"
                    icon="sendMail"
                    iconPosition="right"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </Button>

                  {submitState.success && (
                    <p className="text-foreground">{submitState.message}</p>
                  )}
                  {submitState.error && (
                    <p className="text-accent">{submitState.message}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        <FooterSignature />
      </Container>
    </section>
  );
}
