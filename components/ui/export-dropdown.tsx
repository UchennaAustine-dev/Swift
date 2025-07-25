"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
  Database,
} from "lucide-react";
import { toast } from "sonner";

interface ExportDropdownProps {
  data: any[];
  filename: string;
  className?: string;
}

export function ExportDropdown({
  data,
  filename,
  className,
}: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header];
              // Escape commas and quotes in CSV
              if (
                typeof value === "string" &&
                (value.includes(",") || value.includes('"'))
              ) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();

      toast.success("CSV exported successfully");
    } catch (error) {
      toast.error("Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      const headers = Object.keys(data[0]);
      const tsvContent = [
        headers.join("\t"),
        ...data.map((row) => headers.map((header) => row[header]).join("\t")),
      ].join("\n");

      const blob = new Blob([tsvContent], { type: "application/vnd.ms-excel" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.xls`;
      link.click();

      toast.success("Excel file exported successfully");
    } catch (error) {
      toast.error("Failed to export Excel file");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      const headers = Object.keys(data[0]);
      let pdfContent = `${filename.toUpperCase()} REPORT\n`;
      pdfContent += `Generated on: ${new Date().toLocaleString()}\n\n`;

      // Add headers
      pdfContent += headers.join(" | ") + "\n";
      pdfContent += "-".repeat(headers.join(" | ").length) + "\n";

      // Add data rows
      data.forEach((row) => {
        pdfContent += headers.map((header) => row[header]).join(" | ") + "\n";
      });

      const blob = new Blob([pdfContent], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.txt`;
      link.click();

      toast.success("PDF exported successfully");
    } catch (error) {
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = async () => {
    setIsExporting(true);
    try {
      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      const jsonData = {
        exportDate: new Date().toISOString(),
        filename: filename,
        totalRecords: data.length,
        data: data,
      };

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.json`;
      link.click();

      toast.success("JSON exported successfully");
    } catch (error) {
      toast.error("Failed to export JSON");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={className}
          disabled={isExporting}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover">
        <DropdownMenuItem onClick={exportToCSV} disabled={isExporting}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} disabled={isExporting}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} disabled={isExporting}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} disabled={isExporting}>
          <Database className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
