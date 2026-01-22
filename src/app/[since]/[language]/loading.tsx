import { Card } from "@/components/ui/Card";

export default function LoadingLatest() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-48 rounded-lg bg-surface-2" />
      <Card className="p-5">
        <div className="h-10 w-full rounded-xl bg-surface-2" />
      </Card>
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-5">
            <div className="h-4 w-2/3 rounded bg-surface-2" />
            <div className="mt-3 h-4 w-full rounded bg-surface-2" />
            <div className="mt-2 h-4 w-5/6 rounded bg-surface-2" />
          </Card>
        ))}
      </div>
    </div>
  );
}

