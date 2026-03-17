import React from "react";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { NavBar } from "../ui/NavBar";
import { FooterSignature } from "../ui/FooterSignature";

type AppErrorBoundaryProps = {
  children: React.ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[AppErrorBoundary]", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="min-h-svh flex flex-col">
          <Container className="min-h-svh flex flex-col">
            <NavBar />

            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="max-w-md">
                <h1 className="text-3xl font-semibold leading-headers text-foreground md:text-4xl">
                  Something went wrong
                </h1>

                <p className="mt-4 text-foreground/80">
                  An unexpected error occurred while rendering the page.
                  Please refresh and try again.
                </p>

                <div className="mt-8 flex justify-center">
                  <Button
                    type="button"
                    background="accent"
                    foreground="foreground"
                    onClick={this.handleReload}
                  >
                    Reload page
                  </Button>
                </div>
              </div>
            </div>

            <FooterSignature />
          </Container>
        </section>
      );
    }

    return this.props.children;
  }
}