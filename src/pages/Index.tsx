import { useState, useMemo } from "react";
import { JournalEntry, Category } from "@/types/journal";
import { getEntries, addEntry, updateEntry, deleteEntry } from "@/utils/storage";
import { exportToCSV } from "@/utils/export";
import { EntryForm } from "@/components/journal/EntryForm";
import { EntriesTable } from "@/components/journal/EntriesTable";
import { Summary } from "@/components/journal/Summary";
import { Filters } from "@/components/journal/Filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(getEntries());
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const owners = useMemo(() => {
    const uniqueOwners = [...new Set(entries.map((e) => e.activityOwner))];
    return uniqueOwners.sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch = entry.activityDetails
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || entry.category === categoryFilter;
      const matchesOwner =
        ownerFilter === "all" || entry.activityOwner === ownerFilter;

      return matchesSearch && matchesCategory && matchesOwner;
    });
  }, [entries, searchTerm, categoryFilter, ownerFilter]);

  const handleAddEntry = (data: {
    category: Category;
    activityDetails: string;
    activityStart: string;
    activityEnd: string;
    hoursSpent: number;
    activityOwner: string;
  }) => {
    const newEntry = addEntry(data);
    setEntries(getEntries());
    setShowAddDialog(false);
    toast({
      title: "Entry added",
      description: "Your activity has been recorded successfully.",
    });
  };

  const handleEditEntry = (data: {
    category: Category;
    activityDetails: string;
    activityStart: string;
    activityEnd: string;
    hoursSpent: number;
    activityOwner: string;
  }) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, data);
      setEntries(getEntries());
      setEditingEntry(null);
      toast({
        title: "Entry updated",
        description: "Your changes have been saved.",
      });
    }
  };

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
    setEntries(getEntries());
    toast({
      title: "Entry deleted",
      description: "The activity has been removed.",
    });
  };

  const handleExport = () => {
    exportToCSV(filteredEntries);
    toast({
      title: "Export successful",
      description: `Exported ${filteredEntries.length} entries to CSV.`,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setOwnerFilter("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Performance Journal
          </h1>
          <p className="text-muted-foreground">
            Track and analyze organizational activities and time investments
          </p>
        </div>

        <Tabs defaultValue="entries" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="entries">Entries</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Add New Entry</CardTitle>
                    <CardDescription>
                      Record a new performance activity
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>
                      View and manage all recorded activities
                    </CardDescription>
                  </div>
                  <Button onClick={handleExport} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Filters
                  searchTerm={searchTerm}
                  categoryFilter={categoryFilter}
                  ownerFilter={ownerFilter}
                  onSearchChange={setSearchTerm}
                  onCategoryChange={setCategoryFilter}
                  onOwnerChange={setOwnerFilter}
                  onClearFilters={handleClearFilters}
                  owners={owners}
                />
                <EntriesTable
                  entries={filteredEntries}
                  onEdit={setEditingEntry}
                  onDelete={handleDeleteEntry}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Summary entries={entries} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Entry</DialogTitle>
          </DialogHeader>
          <EntryForm onSubmit={handleAddEntry} submitLabel="Add Entry" />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <EntryForm
              onSubmit={handleEditEntry}
              defaultValues={{
                category: editingEntry.category,
                activityDetails: editingEntry.activityDetails,
                activityStart: new Date(editingEntry.activityStart),
                activityEnd: new Date(editingEntry.activityEnd),
                hoursSpent: editingEntry.hoursSpent,
                activityOwner: editingEntry.activityOwner,
              }}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
