// "use client";

// import type React from "react";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Download,
//   FileText,
//   FileSpreadsheet,
//   FileImage,
//   Database,
// } from "lucide-react";
// import { toast } from "sonner";
// import * as XLSX from "xlsx";

// interface ExportDropdownProps {
//   data: any[];
//   filename: string;
//   className?: string;
// }

// export function ExportDropdown({
//   data,
//   filename,
//   className,
// }: ExportDropdownProps) {
//   const [isExporting, setIsExporting] = useState(false);

//   const exportToCSV = async () => {
//     setIsExporting(true);
//     try {
//       if (!data || data.length === 0) {
//         toast.error("No data to export");
//         return;
//       }

//       const headers = Object.keys(data[0]);
//       const csvContent = [
//         headers.join(","),
//         ...data.map((row) =>
//           headers
//             .map((header) => {
//               const value = row[header];
//               // Escape commas and quotes in CSV
//               if (
//                 typeof value === "string" &&
//                 (value.includes(",") || value.includes('"'))
//               ) {
//                 return `"${value.replace(/"/g, '""')}"`;
//               }
//               return value;
//             })
//             .join(",")
//         ),
//       ].join("\n");

//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = `${filename}.csv`;
//       link.click();

//       toast.success("CSV exported successfully");
//     } catch (error) {
//       toast.error("Failed to export CSV");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const exportToExcel = async () => {
//     setIsExporting(true);
//     try {
//       if (!data || data.length === 0) {
//         toast.error("No data to export");
//         return;
//       }

//       const headers = Object.keys(data[0]);
//       const tsvContent = [
//         headers.join("\t"),
//         ...data.map((row) => headers.map((header) => row[header]).join("\t")),
//       ].join("\n");

//       const blob = new Blob([tsvContent], { type: "application/vnd.ms-excel" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = `${filename}.xls`;
//       link.click();

//       toast.success("Excel file exported successfully");
//     } catch (error) {
//       toast.error("Failed to export Excel file");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const exportToXLSX = async () => {
//     setIsExporting(true);
//     try {
//       if (!data || data.length === 0) {
//         toast.error("No data to export");
//         return;
//       }

//       // Create a new workbook
//       const workbook = XLSX.utils.book_new();

//       // Convert data to worksheet
//       const worksheet = XLSX.utils.json_to_sheet(data);

//       // Add the worksheet to the workbook
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

//       // Generate buffer
//       const excelBuffer = XLSX.write(workbook, {
//         bookType: "xlsx",
//         type: "array",
//       });

//       // Create blob and download
//       const blob = new Blob([excelBuffer], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = `${filename}.xlsx`;
//       link.click();

//       toast.success("XLSX file exported successfully");
//     } catch (error) {
//       toast.error("Failed to export XLSX file");
//       console.error("XLSX export error:", error);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const exportToPDF = async () => {
//     setIsExporting(true);
//     try {
//       if (!data || data.length === 0) {
//         toast.error("No data to export");
//         return;
//       }

//       const headers = Object.keys(data[0]);
//       let pdfContent = `${filename.toUpperCase()} REPORT\n`;
//       pdfContent += `Generated on: ${new Date().toLocaleString()}\n\n`;

//       // Add headers
//       pdfContent += headers.join(" | ") + "\n";
//       pdfContent += "-".repeat(headers.join(" | ").length) + "\n";

//       // Add data rows
//       data.forEach((row) => {
//         pdfContent += headers.map((header) => row[header]).join(" | ") + "\n";
//       });

//       const blob = new Blob([pdfContent], { type: "application/pdf" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = `${filename}.txt`;
//       link.click();

//       toast.success("PDF exported successfully");
//     } catch (error) {
//       toast.error("Failed to export PDF");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const exportToJSON = async () => {
//     setIsExporting(true);
//     try {
//       if (!data || data.length === 0) {
//         toast.error("No data to export");
//         return;
//       }

//       const jsonData = {
//         exportDate: new Date().toISOString(),
//         filename: filename,
//         totalRecords: data.length,
//         data: data,
//       };

//       const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
//         type: "application/json",
//       });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = `${filename}.json`;
//       link.click();

//       toast.success("JSON exported successfully");
//     } catch (error) {
//       toast.error("Failed to export JSON");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           size="sm"
//           className={className}
//           disabled={isExporting}
//         >
//           <Download className="h-4 w-4 mr-2" />
//           {isExporting ? "Exporting..." : "Export"}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-48 bg-popover">
//         <DropdownMenuItem onClick={exportToCSV} disabled={isExporting}>
//           <FileSpreadsheet className="h-4 w-4 mr-2" />
//           Export as CSV
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={exportToExcel} disabled={isExporting}>
//           <FileSpreadsheet className="h-4 w-4 mr-2" />
//           Export as Excel (XLS)
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={exportToXLSX} disabled={isExporting}>
//           <FileSpreadsheet className="h-4 w-4 mr-2" />
//           Export as XLSX
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={exportToPDF} disabled={isExporting}>
//           <FileText className="h-4 w-4 mr-2" />
//           Export as PDF
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={exportToJSON} disabled={isExporting}>
//           <Database className="h-4 w-4 mr-2" />
//           Export as JSON
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
"use client";

import React, { useState } from "react";
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
  Database,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

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
  const [exportType, setExportType] = useState<string | null>(null);

  const handleExportStart = (type: string) => {
    setIsExporting(true);
    setExportType(type);
  };

  const handleExportEnd = (success: boolean, message: string) => {
    setIsExporting(false);
    setExportType(null);
    toast[success ? "success" : "error"](message);
  };

  const exportToCSV = async () => {
    handleExportStart("CSV");
    try {
      if (!data || data.length === 0) {
        handleExportEnd(false, "No data to export");
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header];
              if (
                typeof value === "string" &&
                (value.includes(",") || value.includes('"'))
              ) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value ?? ""; // handle undefined/null gracefully
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();

      handleExportEnd(true, "CSV exported successfully");
    } catch (error) {
      handleExportEnd(false, "Failed to export CSV");
    }
  };

  const exportToExcel = async () => {
    handleExportStart("Excel");
    try {
      if (!data || data.length === 0) {
        handleExportEnd(false, "No data to export");
        return;
      }
      const headers = Object.keys(data[0]);
      const tsvContent = [
        headers.join("\t"),
        ...data.map((row) =>
          headers.map((header) => row[header] ?? "").join("\t")
        ),
      ].join("\n");

      const blob = new Blob([tsvContent], {
        type: "application/vnd.ms-excel",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.xls`;
      link.click();

      handleExportEnd(true, "Excel (XLS) exported successfully");
    } catch (error) {
      handleExportEnd(false, "Failed to export Excel (XLS)");
    }
  };

  const exportToXLSX = async () => {
    handleExportStart("XLSX");
    try {
      if (!data || data.length === 0) {
        handleExportEnd(false, "No data to export");
        return;
      }

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      link.click();

      handleExportEnd(true, "XLSX file exported successfully");
    } catch (error) {
      console.error("XLSX export error:", error);
      handleExportEnd(false, "Failed to export XLSX file");
    }
  };

  const exportToPDF = async () => {
    handleExportStart("PDF");
    try {
      if (!data || data.length === 0) {
        handleExportEnd(false, "No data to export");
        return;
      }

      const doc = new jsPDF();

      // Title and date
      doc.setFontSize(18);
      doc.text(`${filename.toUpperCase()} REPORT`, 10, 10);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 17);

      const headers = Object.keys(data[0]);
      const rows = data.map((row) =>
        headers.map((header) => row[header] ?? "")
      );

      // Print table headers
      let startY = 25;
      doc.setFontSize(12);
      doc.text(headers.join(" | "), 10, startY);
      startY += 7;

      // Print table rows with simple pagination logic
      const lineHeight = 7;
      rows.forEach((row, index) => {
        if (startY > 280) {
          doc.addPage();
          startY = 10;
        }
        doc.setFontSize(10);
        doc.text(row.join(" | "), 10, startY);
        startY += lineHeight;
      });

      doc.save(`${filename}.pdf`);

      handleExportEnd(true, "PDF exported successfully");
    } catch (error) {
      console.error("PDF export error:", error);
      handleExportEnd(false, "Failed to export PDF");
    }
  };

  const exportToJSON = async () => {
    handleExportStart("JSON");
    try {
      if (!data || data.length === 0) {
        handleExportEnd(false, "No data to export");
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

      handleExportEnd(true, "JSON exported successfully");
    } catch (error) {
      handleExportEnd(false, "Failed to export JSON");
    }
  };

  const menuItemClasses =
    "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors duration-150";

  const buttonClasses = `${
    className ?? ""
  } cursor-pointer hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors duration-150`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={buttonClasses}
          disabled={isExporting}
          aria-label="Export data"
        >
          {isExporting && exportType ? (
            <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {isExporting ? `Exporting ${exportType}...` : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-popover" forceMount>
        <DropdownMenuItem
          onClick={exportToCSV}
          disabled={isExporting}
          className={menuItemClasses}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={exportToExcel}
          disabled={isExporting}
          className={menuItemClasses}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2 text-blue-600" />
          Export as Excel (XLS)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={exportToXLSX}
          disabled={isExporting}
          className={menuItemClasses}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2 text-purple-600" />
          Export as XLSX
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={exportToPDF}
          disabled={isExporting}
          className={menuItemClasses}
        >
          <FileText className="h-4 w-4 mr-2 text-red-600" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={exportToJSON}
          disabled={isExporting}
          className={menuItemClasses}
        >
          <Database className="h-4 w-4 mr-2 text-yellow-600" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
