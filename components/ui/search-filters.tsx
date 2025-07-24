// "use client";

// import { useState } from "react";
// import { Search, Filter, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";

// interface FilterOption {
//   key: string;
//   label: string;
//   options: { value: string; label: string }[];
// }

// export interface SearchFiltersProps {
//   searchPlaceholder?: string;
//   searchQuery?: string;
//   onSearchChange?: (query: string) => void;
//   onSearch?: (query: string) => void;
//   filterOptions?: FilterOption[];
//   filters?: FilterOption[];
//   activeFilters?: Record<string, string>;
//   onFilterChange?: (key: string, value: string) => void;
//   onClearFilters?: () => void;
//   className?: string;
//   showDateFilter?: boolean;
//   dateRange?: { from: string; to: string };
//   onDateRangeChange?: (range: { from: string; to: string }) => void;
// }

// export function SearchFilters({
//   searchPlaceholder = "Search...",
//   searchQuery = "",
//   onSearchChange,
//   onSearch,
//   filterOptions = [],
//   filters = [],
//   activeFilters = {},
//   onFilterChange,
//   onClearFilters,
//   className,
//   showDateFilter = false,
//   dateRange,
//   onDateRangeChange,
// }: SearchFiltersProps) {
//   const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
//   const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);

//   let availableFilters = filterOptions.length > 0 ? filterOptions : filters;

//   if (showDateFilter) {
//     const dateFilterKey = "date";
//     const dateFilterExists = availableFilters.some(
//       (f) => f.key === dateFilterKey
//     );
//     if (!dateFilterExists) {
//       availableFilters = [
//         ...availableFilters,
//         {
//           key: dateFilterKey,
//           label: "Date",
//           options: [],
//         },
//       ];
//     }
//   }

//   const handleSearchChange = (value: string) => {
//     setLocalSearchQuery(value);
//     onSearchChange?.(value);
//     onSearch?.(value);
//   };

//   const handleFilterSelect = (filterKey: string, value: string) => {
//     if (filterKey !== "date") onFilterChange?.(filterKey, value);
//   };

//   const handleClearFilter = (filterKey: string) => {
//     if (filterKey === "date") {
//       onDateRangeChange?.({ from: "", to: "" });
//     } else {
//       onFilterChange?.(filterKey, "");
//     }
//   };

//   const activeFilterCount =
//     Object.values(activeFilters).filter(Boolean).length +
//     (dateRange?.from || dateRange?.to ? 1 : 0);

//   // Format date label for button
//   const formatDateLabel = () => {
//     if (!dateRange?.from && !dateRange?.to) return "Date";
//     if (dateRange?.from && dateRange?.to)
//       return `${dateRange.from} → ${dateRange.to}`;
//     if (dateRange?.from) return `From: ${dateRange.from}`;
//     if (dateRange?.to) return `To: ${dateRange.to}`;
//     return "Date";
//   };

//   return (
//     <div
//       className={cn(
//         "flex flex-col gap-4 sm:flex-row sm:items-center",
//         className
//       )}
//     >
//       {/* Search Input */}
//       <div className="relative flex-1">
//         <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//         <Input
//           placeholder={searchPlaceholder}
//           value={localSearchQuery}
//           onChange={(e) => handleSearchChange(e.target.value)}
//           className="pl-9 bg-background/50 border-border/50"
//         />
//       </div>

//       {/* Filters - Horizontally scrollable on mobile */}
//       <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2 sm:pb-0 sm:overflow-x-visible">
//         <div className="flex items-center gap-2 min-w-max">
//           {availableFilters.map((filter) =>
//             filter.key === "date" ? (
//               <DropdownMenu
//                 key="date"
//                 onOpenChange={setIsDateMenuOpen}
//                 open={isDateMenuOpen}
//               >
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn(
//                       "bg-background/50 border-border/50 whitespace-nowrap",
//                       (dateRange?.from || dateRange?.to) &&
//                         "bg-primary/10 border-primary/30"
//                     )}
//                   >
//                     <Filter className="h-4 w-4 mr-2" />
//                     {formatDateLabel()}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-64 p-4 space-y-2">
//                   <label className="flex flex-col text-sm">
//                     From
//                     <input
//                       type="date"
//                       className="mt-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm outline-none"
//                       value={dateRange?.from || ""}
//                       onChange={(e) =>
//                         onDateRangeChange?.({
//                           from: e.target.value,
//                           to: dateRange?.to || "",
//                         })
//                       }
//                     />
//                   </label>
//                   <label className="flex flex-col text-sm">
//                     To
//                     <input
//                       type="date"
//                       className="mt-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm outline-none"
//                       value={dateRange?.to || ""}
//                       onChange={(e) =>
//                         onDateRangeChange?.({
//                           from: dateRange?.from || "",
//                           to: e.target.value,
//                         })
//                       }
//                     />
//                   </label>
//                   {(dateRange?.from || dateRange?.to) && (
//                     <>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem
//                         className="cursor-pointer text-muted-foreground"
//                         onSelect={() => {
//                           onDateRangeChange?.({ from: "", to: "" });
//                           setIsDateMenuOpen(false);
//                         }}
//                       >
//                         Clear date range filter
//                       </DropdownMenuItem>
//                     </>
//                   )}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <DropdownMenu key={filter.key}>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn(
//                       "bg-background/50 border-border/50 whitespace-nowrap",
//                       activeFilters[filter.key] &&
//                         "bg-primary/10 border-primary/30"
//                     )}
//                   >
//                     <Filter className="h-4 w-4 mr-2" />
//                     {activeFilters[filter.key]
//                       ? filter.options.find(
//                           (opt) => opt.value === activeFilters[filter.key]
//                         )?.label || filter.label
//                       : filter.label}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-48">
//                   {filter.options.map((option) => (
//                     <DropdownMenuItem
//                       key={option.value}
//                       onSelect={() =>
//                         handleFilterSelect(filter.key, option.value)
//                       }
//                       className={cn(
//                         "cursor-pointer",
//                         activeFilters[filter.key] === option.value &&
//                           "bg-primary/10"
//                       )}
//                     >
//                       {option.label}
//                     </DropdownMenuItem>
//                   ))}
//                   {activeFilters[filter.key] && (
//                     <>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem
//                         onSelect={() => handleClearFilter(filter.key)}
//                         className="cursor-pointer text-muted-foreground"
//                       >
//                         Clear filter
//                       </DropdownMenuItem>
//                     </>
//                   )}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )
//           )}
//           {/* Clear All Filters */}
//           {activeFilterCount > 0 && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => {
//                 onClearFilters?.();
//                 onDateRangeChange?.({ from: "", to: "" });
//               }}
//               className="text-muted-foreground hover:text-foreground whitespace-nowrap"
//             >
//               <X className="h-4 w-4 mr-1" />
//               Clear ({activeFilterCount})
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Active Filters Display (hidden on sm and above) */}
//       {activeFilterCount > 0 && (
//         <div className="flex flex-wrap gap-2 sm:hidden">
//           {Object.entries(activeFilters)
//             .filter(([, value]) => value)
//             .map(([key, value]) => {
//               const filter = availableFilters.find((f) => f.key === key);
//               const option = filter?.options.find((opt) => opt.value === value);
//               return (
//                 <Badge key={key} variant="secondary" className="text-xs">
//                   {option?.label || value}
//                   <button
//                     onClick={() => handleClearFilter(key)}
//                     className="ml-1 hover:text-destructive"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </Badge>
//               );
//             })}
//           {/* Date range badge */}
//           {(dateRange?.from || dateRange?.to) && (
//             <Badge variant="secondary" className="text-xs">
//               {formatDateLabel()}
//               <button
//                 onClick={() => onDateRangeChange?.({ from: "", to: "" })}
//                 className="ml-1 hover:text-destructive"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </Badge>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface SearchFiltersProps {
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearch?: (query: string) => void;
  filterOptions?: FilterOption[];
  filters?: FilterOption[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
  className?: string;
  showDateFilter?: boolean;
  dateRange?: { from: string; to: string };
  onDateRangeChange?: (range: { from: string; to: string }) => void;
}

export function SearchFilters({
  searchPlaceholder = "Search...",
  searchQuery = "",
  onSearchChange,
  onSearch,
  filterOptions = [],
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  className,
  showDateFilter = false,
  dateRange,
  onDateRangeChange,
}: SearchFiltersProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);

  let availableFilters = filterOptions.length > 0 ? filterOptions : filters;

  if (showDateFilter) {
    const dateFilterKey = "date";
    const dateFilterExists = availableFilters.some(
      (f) => f.key === dateFilterKey
    );
    if (!dateFilterExists) {
      availableFilters = [
        ...availableFilters,
        {
          key: dateFilterKey,
          label: "Date",
          options: [],
        },
      ];
    }
  }

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    onSearchChange?.(value);
    onSearch?.(value);
  };

  const handleFilterSelect = (filterKey: string, value: string) => {
    if (filterKey !== "date") onFilterChange?.(filterKey, value);
  };

  const handleClearFilter = (filterKey: string) => {
    if (filterKey === "date") {
      onDateRangeChange?.({ from: "", to: "" });
    } else {
      onFilterChange?.(filterKey, "");
    }
  };

  const activeFilterCount =
    Object.values(activeFilters).filter(Boolean).length +
    (dateRange?.from || dateRange?.to ? 1 : 0);

  // Format date label for button
  const formatDateLabel = () => {
    if (!dateRange?.from && !dateRange?.to) return "Date";
    if (dateRange?.from && dateRange?.to)
      return `${dateRange.from} → ${dateRange.to}`;
    if (dateRange?.from) return `From: ${dateRange.from}`;
    if (dateRange?.to) return `To: ${dateRange.to}`;
    return "Date";
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center",
        className
      )}
    >
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={localSearchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 bg-background border-border focus:bg-background focus:border-primary"
        />
      </div>

      {/* Filters - Horizontally scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2 sm:pb-0 sm:overflow-x-visible">
        <div className="flex items-center gap-2 min-w-max">
          {availableFilters.map((filter) =>
            filter.key === "date" ? (
              <DropdownMenu
                key="date"
                onOpenChange={setIsDateMenuOpen}
                open={isDateMenuOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "bg-background border-border whitespace-nowrap hover:bg-muted focus:bg-muted",
                      (dateRange?.from || dateRange?.to) &&
                        "bg-primary/10 border-primary text-primary"
                    )}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {formatDateLabel()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 p-4 space-y-2 bg-popover border border-border shadow-lg"
                >
                  <label className="flex flex-col text-sm">
                    From
                    <input
                      type="date"
                      className="mt-1 rounded border border-border bg-background px-2 py-1 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      value={dateRange?.from || ""}
                      onChange={(e) =>
                        onDateRangeChange?.({
                          from: e.target.value,
                          to: dateRange?.to || "",
                        })
                      }
                    />
                  </label>
                  <label className="flex flex-col text-sm">
                    To
                    <input
                      type="date"
                      className="mt-1 rounded border border-border bg-background px-2 py-1 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      value={dateRange?.to || ""}
                      onChange={(e) =>
                        onDateRangeChange?.({
                          from: dateRange?.from || "",
                          to: e.target.value,
                        })
                      }
                    />
                  </label>
                  {(dateRange?.from || dateRange?.to) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-muted-foreground hover:bg-muted focus:bg-muted"
                        onSelect={() => {
                          onDateRangeChange?.({ from: "", to: "" });
                          setIsDateMenuOpen(false);
                        }}
                      >
                        Clear date range filter
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu key={filter.key}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "bg-background border-border whitespace-nowrap hover:bg-muted focus:bg-muted",
                      activeFilters[filter.key] &&
                        "bg-primary/10 border-primary text-primary"
                    )}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {activeFilters[filter.key]
                      ? filter.options.find(
                          (opt) => opt.value === activeFilters[filter.key]
                        )?.label || filter.label
                      : filter.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-popover border border-border shadow-lg"
                >
                  {filter.options.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() =>
                        handleFilterSelect(filter.key, option.value)
                      }
                      className={cn(
                        "cursor-pointer hover:bg-muted focus:bg-muted",
                        activeFilters[filter.key] === option.value &&
                          "bg-primary/10 text-primary"
                      )}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                  {activeFilters[filter.key] && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => handleClearFilter(filter.key)}
                        className="cursor-pointer text-muted-foreground hover:bg-muted focus:bg-muted"
                      >
                        Clear filter
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          )}

          {/* Clear All Filters */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClearFilters?.();
                onDateRangeChange?.({ from: "", to: "" });
              }}
              className="text-muted-foreground hover:text-foreground whitespace-nowrap hover:bg-muted focus:bg-muted"
            >
              <X className="h-4 w-4 mr-1" />
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display (hidden on sm and above) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 sm:hidden">
          {Object.entries(activeFilters)
            .filter(([, value]) => value)
            .map(([key, value]) => {
              const filter = availableFilters.find((f) => f.key === key);
              const option = filter?.options.find((opt) => opt.value === value);
              return (
                <Badge key={key} variant="secondary" className="text-xs">
                  {option?.label || value}
                  <button
                    onClick={() => handleClearFilter(key)}
                    className="ml-1 hover:text-destructive"
                    aria-label={`Remove ${option?.label || value} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          {/* Date range badge */}
          {(dateRange?.from || dateRange?.to) && (
            <Badge variant="secondary" className="text-xs">
              {formatDateLabel()}
              <button
                onClick={() => onDateRangeChange?.({ from: "", to: "" })}
                className="ml-1 hover:text-destructive"
                aria-label="Remove date filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
