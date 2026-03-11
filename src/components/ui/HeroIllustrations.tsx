export function HeroIllustrations() {
  return (
    <>
      <div className="flex justify-center lg:hidden">
        <img
          src="/images/illustration-body-female-concerned-home.svg"
          alt=""
          className="w-[200px]"
        />
      </div>
      <div className="hidden lg:grid lg:grid-cols-2 lg:items-end lg:gap-8">
        <img
          src="/images/illustration-body-female-concerned-home.svg"
          alt=""
          className="w-full max-w-[200px] justify-self-center"
        />
        <img
          src="/images/illustration-body-male-afro-phone.svg"
          alt=""
          className="w-full max-w-[200px] scale-x-[-1] justify-self-center"
        />
      </div>
    </>
  );
}
