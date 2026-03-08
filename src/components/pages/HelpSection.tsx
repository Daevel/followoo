import { useState } from "react";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { FooterSignature } from "../ui/FooterSignature";
import { Input } from "../ui/Input";
import { NavBar } from "../ui/NavBar";

import emailjs from "@emailjs/browser";

export function HelpSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: "",
  });

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setFormStatus({
      submitting: true,
      success: false,
      error: false,
      message: "",
    });

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.fullName,
          email: formData.email,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      setFormStatus({
        submitting: false,
        success: true,
        error: false,
        message: "Message sent successfully!",
      });

      setFormData({
        fullName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log("err", error);
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message: "Failed to send message. Please try again.",
      });
    }
  };

  return (
    <section className="min-h-svh flex flex-col">
      <Container className="min-h-svh flex flex-col">
        <NavBar showHelp={false} />
        <div className="flex flex-col items-start pt-15 pb-6 text-center text-base flex-1">
          <div className="flex flex-col items-start text-start mb-10">
            <h2 className="text-4xl font-semibold leading-headers md:text-5xl">
              Help section
            </h2>
            <p className="p1-r">
              Found any bugs or suggestions for better implementation? Fill the
              form below with your informations and I'll be grateful to read it.
            </p>
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="w-full pt-5 flex flex-col items-center gap-10">
              <div className="w-full flex flex-col items-center text-start">
                <form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-6"
                >
                  <label className="l1-b" htmlFor="fullName">
                    Full name
                  </label>
                  <Input
                    type="text"
                    name="fullName"
                    variant="input"
                    placeholder="Enter your full name here..."
                    onChange={handleInputChange}
                    value={formData.fullName}
                  />

                  <label className="l1-b" htmlFor="email">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    variant="input"
                    placeholder="Enter your email here..."
                    onChange={handleInputChange}
                    value={formData.email}
                  />

                  <label className="l1-b" htmlFor="message">
                    Message
                  </label>
                  <Input
                    name="message"
                    variant="textarea"
                    placeholder="Enter your message here..."
                    onChange={handleInputChange}
                    value={formData.message}
                  />

                  <Button
                    color="primary"
                    type="submit"
                    disabled={formStatus.submitting}
                  >
                    {formStatus.submitting ? "Sending..." : "Send"}
                  </Button>
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
