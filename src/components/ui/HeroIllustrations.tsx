export function HeroIllustrations() {
  return (
    <>
      <div className="flex justify-center lg:hidden">
        <img
          src="/images/illustration-body-female-concerned-home.svg"
          alt=""
          className="w-[180px]"
        />
      </div>
      <div className="hidden lg:grid lg:grid-cols-5 lg:items-end lg:gap-8">
        <img
          src="/images/illustration-body-female-long-hair.svg"
          alt=""
          className="w-full max-w-[140px] justify-self-center"
        />
        <img
          src="/images/illustration-body-male-afro-2-phone.svg"
          alt=""
          className="w-full max-w-[140px] justify-self-center"
        />
        <img
          src="/images/illustration-body-female-concerned-home.svg"
          alt=""
          className="w-full max-w-[140px] justify-self-center"
        />
        <img
          src="/images/illustration-body-male-afro-phone.svg"
          alt=""
          className="w-full max-w-[140px] justify-self-center"
        />
        <img
          src="/images/illustration-body-male-notebook.svg"
          alt=""
          className="w-full max-w-[140px] justify-self-center"
        />
      </div>
    </>
  );
}
