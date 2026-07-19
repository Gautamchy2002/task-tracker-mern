const EmptyState = ({ message }: { message: string }) => (
  <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed">
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export default EmptyState;
