export function UnknownErrorPage() {
  return (
    <div className="text-accent flex flex-col items-center justify-center gap-y-5">
      <h3>Unable to load content</h3>
      <p>Unable to retrieve content. Retry later</p>
    </div>
  );
}
