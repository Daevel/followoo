import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Field } from "@/components/ui/Field";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { NavBar } from "@/components/ui/NavBar";
import { PageHeader } from "@/components/ui/PageHeader";
import Seo from "@/components/ui/Seo";
import { useSupportForm } from "@/features/support/hooks/useSupportForm";
import { toastService } from "@/services/toastService";

const helpLinks: {
  to: string;
  icon: IconName;
  title: string;
  description: string;
}[] = [
  {
    to: "/instructions-to-start",
    icon: "download",
    title: "How to get your export",
    description: "Step-by-step videos for computer and phone",
  },
  {
    to: "/updates",
    icon: "code",
    title: "What's new",
    description: "A bug you saw may already be fixed",
  },
  {
    to: "/privacy-and-policy",
    icon: "shield",
    title: "Privacy policy",
    description: "How your data is handled",
  },
];

export function SupportSection() {
  return (
    <>
      <Seo
        title="Support - Followoo"
        description="Contact Followoo support for help, bug reports or feedback about private Instagram export analysis."
        image="https://followoo.app/icons/OG.png"
        canonical="https://followoo.app/support"
      />
      <SupportContent />
    </>
  );
}

function SupportContent() {
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
      return toastService.danger({
        title: "Message not sent",
        description: `An error has occurred: ${submitState.message.toString()}`,
      });
  }, [submitState]);

  return (
    <section className="flex min-h-svh flex-col">
      <NavBar />
      <Container size="app" className="flex flex-1 flex-col">
        <div
          ref={rootRef}
          className="grid flex-1 items-start gap-10 pb-20 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-16 lg:pt-6"
        >
          <div className="min-w-0">
            <PageHeader
              kicker="Support"
              title="How can I help?"
              description="Found a bug or have feedback about Followoo? Write to me with the form. You might find a quicker answer here first:"
              flush
            />

            <nav
              data-page-animate="content"
              aria-label="Help topics"
              className="mt-8 flex flex-col gap-2"
            >
              {helpLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group border-line-subtle bg-surface-1 hover:border-line-strong focus-visible:shadow-ring flex items-center gap-3.5 rounded-card border px-4 py-3.5 text-start transition-colors outline-none"
                >
                  <span className="bg-surface-2 text-brand-fg flex size-9 shrink-0 items-center justify-center rounded-control">
                    <Icon
                      name={link.icon}
                      color="current"
                      width={16}
                      height={16}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-fg block text-sm font-medium">
                      {link.title}
                    </span>
                    <span className="text-fg-muted block text-[13px]">
                      {link.description}
                    </span>
                  </span>
                  <Icon
                    name="singleArrowRight"
                    color="current"
                    width={16}
                    height={16}
                    className="text-fg-faint group-hover:text-fg-muted shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </nav>
          </div>

          <div
            data-page-animate="content"
            className="border-line-subtle bg-surface-1 shadow-elev-1 rounded-card border p-5 text-start sm:p-7 lg:mt-16"
          >
            <h2 className="text-fg text-base font-semibold tracking-[-0.01em]">
              Send a message
            </h2>
            <p className="text-fg-muted mt-1 text-sm">
              Bug reports and feedback go straight to me.
            </p>

            <form
              onSubmit={onSubmit}
              className="mt-6 flex w-full flex-col gap-5"
              noValidate
            >
              <Field
                label="Full name"
                htmlFor="fullName"
                error={errors.fullName?.message}
              >
                <Input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  hasError={!!errors.fullName}
                  {...register("fullName")}
                />
              </Field>

              <Field
                label="Email"
                htmlFor="email"
                hint="I'll reply to this address."
                error={errors.email?.message}
              >
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  hasError={!!errors.email}
                  {...register("email")}
                />
              </Field>

              <Field
                label="Message"
                htmlFor="message"
                hint="Please don't paste usernames or attach your export."
                error={errors.message?.message}
                meta={`${messageValue.length}/500`}
              >
                <Input
                  id="message"
                  variant="textarea"
                  hasError={!!errors.message}
                  {...register("message")}
                />
              </Field>

              <Button
                size="lg"
                icon="sendMail"
                type="submit"
                disabled={!isValid}
                loading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
