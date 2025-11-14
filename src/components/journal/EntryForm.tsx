import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CATEGORIES, type Category } from "@/types/journal";

const formSchema = z.object({
  category: z.enum(["Firm Building", "Practice Building", "Personal Eminence", "Personal Development"] as const),
  activityDetails: z.string().min(1, "Activity details are required").max(500),
  activityStart: z.date(),
  activityEnd: z.date(),
  hoursSpent: z.number().min(0.1, "Hours must be positive"),
  activityOwner: z.string().min(1, "Activity owner is required"),
}).refine((data) => data.activityEnd >= data.activityStart, {
  message: "End date must be after or equal to start date",
  path: ["activityEnd"],
});

type FormData = z.infer<typeof formSchema>;

interface EntryFormProps {
  onSubmit: (data: {
    category: Category;
    activityDetails: string;
    activityStart: string;
    activityEnd: string;
    hoursSpent: number;
    activityOwner: string;
  }) => void;
  defaultValues?: Partial<FormData>;
  submitLabel?: string;
}

export function EntryForm({ onSubmit, defaultValues, submitLabel = "Add Entry" }: EntryFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      category: "Firm Building",
      activityDetails: "",
      hoursSpent: 1,
      activityOwner: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit({
      category: data.category,
      activityDetails: data.activityDetails,
      activityStart: format(data.activityStart, "yyyy-MM-dd"),
      activityEnd: format(data.activityEnd, "yyyy-MM-dd"),
      hoursSpent: data.hoursSpent,
      activityOwner: data.activityOwner,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover z-50">
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activityOwner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Owner</FormLabel>
                <FormControl>
                  <Input placeholder="Enter owner name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="activityDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Details</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the activity..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="activityStart"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activityEnd"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hoursSpent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours Spent</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    min="0.1"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
