import { JournalEntry } from "@/types/journal";

export const exportToCSV = (entries: JournalEntry[]): void => {
  const headers = [
    "No",
    "Category",
    "Activity Details",
    "Activity Start",
    "Activity End",
    "Hours Spent",
    "Activity Owner",
  ];

  const rows = entries.map(entry => [
    entry.no,
    entry.category,
    entry.activityDetails,
    entry.activityStart,
    entry.activityEnd,
    entry.hoursSpent,
    entry.activityOwner,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row =>
      row.map(cell => {
        const cellStr = String(cell);
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        return cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")
          ? `"${cellStr.replace(/"/g, '""')}"`
          : cellStr;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `performance-journal-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
