const DataTableSkelton = ({
  rows = 5,
  columns = 6,
}: {
  rows?: number;
  columns?: number;
}) => (
  <div className="overflow-hidden rounded-xl border bg-white">
    <div className="grid gap-3 border-b bg-slate-50 p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index} className="h-4 animate-pulse rounded bg-slate-200" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        className="grid gap-3 border-b p-4 last:border-b-0"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, columnIndex) => (
          <div
            key={columnIndex}
            className="h-4 animate-pulse rounded bg-slate-100"
          />
        ))}
      </div>
    ))}
  </div>
);

export default DataTableSkelton;
