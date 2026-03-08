import { Container } from "./Container";

export function Loading() {
  return (
    <section className="min-h-svh">
      <Container>
        <div className="flex flex-col items-center pt-16 pb-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-semibold leading-headers text-base md:text-5xl">
              Loading...
            </h2>

            <p className="p1-r mt-4 max-w-[18rem] text-sm text-base/90 md:max-w-[24rem] md:text-base">
              This may take a while...
            </p>

            <div className="mt-auto w-full pt-12">
              <img src="./images/illustration-composition-loading-phase.svg" alt="Loading illustration" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
