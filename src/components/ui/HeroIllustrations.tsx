import { vercelBlobStructure } from "@/data/vercelBlobStructure";

export function HeroIllustrations() {
  return (
    <>
      <div className="flex justify-center lg:hidden">
        <img
          src={vercelBlobStructure.images.female01}
          alt=""
          className="w-[200px]"
        />
      </div>
      <div className="hidden lg:grid lg:grid-cols-2 lg:items-end lg:gap-8">
        <img
          src={vercelBlobStructure.images.female01}
          alt=""
          className="w-full max-w-[200px] justify-self-center"
        />
        <img
          src={vercelBlobStructure.images.male02}
          alt=""
          className="w-full max-w-[200px] scale-x-[-1] justify-self-center"
        />
      </div>
    </>
  );
}
