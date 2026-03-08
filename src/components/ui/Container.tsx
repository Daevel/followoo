export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 flex flex-col items-center pt-20 gap-12 text-center">
      {children}
    </div>
  );
}
