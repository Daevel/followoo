import { Container } from "./Container";

export function Loading() {
  return (
    <section className="min-h-svh">
      <Container className="min-h-svh flex flex-col">
        <div className="flex flex-1 flex-col items-center justify-center pt-16 pb-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl text-base font-semibold leading-headers md:text-5xl">
              Loading...
            </h2>

            <p className="p1-r mt-4 max-w-[18rem] text-sm text-base/90 md:max-w-[24rem] md:text-base">
              This may take a while...
            </p>

            {/* Mobile / Tablet */}
            <div className="w-full pt-12 lg:hidden">
              <img
                src="./images/illustration-body-male-afro-2-phone.svg"
                alt="Loading illustration"
                className="mx-auto w-full max-w-[220px]"
              />
            </div>

            {/* Desktop */}
            <div className="hidden w-full pt-12 lg:block">
              <img
                src="./images/illustration-composition-loading-phase.svg"
                alt="Loading composition"
                className="mx-auto w-full max-w-[720px]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}