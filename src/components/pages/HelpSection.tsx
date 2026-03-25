import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useHelpForm } from "../hooks/useHelpForm";
import { toastService } from "../services/toastService";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { Input } from "../ui/Input";
import { NavBar } from "../ui/NavBar";

export function HelpSection() {
  const { form, onSubmit, submitState, isSubmitting } = useHelpForm();
  const {
    register,
    formState: { errors },
  } = form;

  // Watch the message field to get its value for the character count
  const messageValue = form.watch("message") ?? "";

  const rootRef = useRef<HTMLDivElement | null>(null);

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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate='hero-item']",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
        },
      );

      gsap.fromTo(
        "[data-animate='hero-illustration']",
        {
          opacity: 0,
          y: 32,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

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
              data-animate="hero-item"
              className="leading-headers text-4xl font-semibold md:text-5xl"
            >
              Help section
            </h1>
            <p data-animate="hero-item" className="p1-r mt-10">
              Found any bugs or suggestions for better implementation? Fill the
              form below with your informations and I'll be grateful to read it.
            </p>
          </div>

          <div className="flex w-full flex-col items-center">
            <div className="flex w-full flex-col items-center gap-10 pt-5">
              <div
                data-animate="hero-item"
                className="flex w-full flex-col items-center text-start"
              >
                <form
                  onSubmit={onSubmit}
                  className="flex w-full flex-col gap-6"
                  noValidate
                >
                  <label
                    data-animate="hero-item"
                    className="l1-b"
                    htmlFor="fullName"
                  >
                    Full name
                  </label>
                  <Input
                    data-animate="hero-item"
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

                  <label
                    data-animate="hero-item"
                    className="l1-b"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Input
                    data-animate="hero-item"
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

                  <label
                    data-animate="hero-item"
                    className="l1-b"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <div className="text-end" data-animate="hero-item">
                    <Input
                      id="message"
                      variant="textarea"
                      hasError={!!errors.message}
                      {...register("message")}
                    />
                    <span className="text-foreground/70 self-end text-xs">
                      {messageValue.length}/500
                    </span>
                    <div data-animate="hero-item" className="text-start">
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
                    icon="sendMail"
                    iconPosition="right"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send"}
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
