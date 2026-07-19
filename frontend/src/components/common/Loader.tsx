const Loader = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex min-h-[240px] flex-col items-center justify-center gap-3">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default Loader;
