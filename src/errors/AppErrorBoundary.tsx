import React from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { captureError } from "./sentryInit";

type AppErrorBoundaryProps = {
  children: React.ReactNode;
  resetKey?: string;
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
    // A render crash here would otherwise be invisible outside the local
    // browser console: this was fully lost in production before Sentry.
    captureError(error, { tags: { boundary: "AppErrorBoundary" } });
  }

  componentDidUpdate(prevProps: AppErrorBoundaryProps) {
    if (this.props.resetKey !== prevProps.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="flex min-h-svh flex-col">
          <Container className="flex min-h-svh flex-col">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="max-w-md">
                <h1 className="leading-headers text-foreground text-3xl font-semibold md:text-4xl">
                  Something went wrong
                </h1>

                <p className="text-foreground/80 mt-4">
                  An unexpected error occurred while rendering the page. Please
                  refresh and try again.
                </p>

                <div className="mt-8 flex justify-center gap-3">
                  <Button
                    type="button"
                    background="accent"
                    foreground="foreground"
                    onClick={this.handleReload}
                  >
                    Reload page
                  </Button>

                  <Button
                    type="button"
                    background="primary"
                    foreground="foreground"
                    onClick={() => {
                      window.location.href = "/";
                    }}
                  >
                    Go home
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      );
    }

    return this.props.children;
  }
}
