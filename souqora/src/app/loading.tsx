export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-accent)" }}
        />
      </div>
      <p
        className="mt-4 text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        جاري التحميل...
      </p>
    </div>
  );
}
