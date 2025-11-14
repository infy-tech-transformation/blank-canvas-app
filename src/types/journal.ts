export type Category = 
  | "Firm Building" 
  | "Practice Building" 
  | "Personal Eminence" 
  | "Personal Development";

export interface JournalEntry {
  id: string;
  no: number;
  category: Category;
  activityDetails: string;
  activityStart: string;
  activityEnd: string;
  hoursSpent: number;
  activityOwner: string;
  createdAt: string;
}

export const CATEGORIES: Category[] = [
  "Firm Building",
  "Practice Building",
  "Personal Eminence",
  "Personal Development",
];

export const getCategoryColor = (category: Category): string => {
  const colorMap: Record<Category, string> = {
    "Firm Building": "category-firm",
    "Practice Building": "category-practice",
    "Personal Eminence": "category-eminence",
    "Personal Development": "category-development",
  };
  return colorMap[category];
};
