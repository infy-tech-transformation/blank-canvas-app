import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/types/journal";
import { Search, X } from "lucide-react";

interface FiltersProps {
  searchTerm: string;
  categoryFilter: string;
  ownerFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onOwnerChange: (value: string) => void;
  onClearFilters: () => void;
  owners: string[];
}

export function Filters({
  searchTerm,
  categoryFilter,
  ownerFilter,
  onSearchChange,
  onCategoryChange,
  onOwnerChange,
  onClearFilters,
  owners,
}: FiltersProps) {
  const hasActiveFilters = searchTerm || categoryFilter !== "all" || ownerFilter !== "all";

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search activity details..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={ownerFilter} onValueChange={onOwnerChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="All Owners" />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          <SelectItem value="all">All Owners</SelectItem>
          {owners.map((owner) => (
            <SelectItem key={owner} value={owner}>
              {owner}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClearFilters} className="w-full md:w-auto">
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
}
