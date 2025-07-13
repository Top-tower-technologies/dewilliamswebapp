import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function GuestDetailsCard({ children }: { children: React.ReactNode }) {

  return (
    <Card>
      <CardHeader className="pb-3">
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}