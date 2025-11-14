import { JournalEntry, CATEGORIES, getCategoryColor } from "@/types/journal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock } from "lucide-react";

interface SummaryProps {
  entries: JournalEntry[];
}

export function Summary({ entries }: SummaryProps) {
  const summary = CATEGORIES.map((category) => {
    const categoryEntries = entries.filter((e) => e.category === category);
    return {
      category,
      count: categoryEntries.length,
      hours: categoryEntries.reduce((sum, e) => sum + e.hoursSpent, 0),
      color: getCategoryColor(category),
    };
  });

  const totalHours = summary.reduce((sum, s) => sum + s.hours, 0);
  const totalActivities = summary.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivities}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Time invested</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Activities and hours by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary.map(({ category, count, hours, color }) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{category}</span>
                  <span className="text-muted-foreground">
                    {count} {count === 1 ? "activity" : "activities"} · {hours.toFixed(1)}h
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: totalHours > 0 ? `${(hours / totalHours) * 100}%` : "0%",
                      backgroundColor: `hsl(var(--${color}))`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
