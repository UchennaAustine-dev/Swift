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
import autoTable from "jspdf-autotable"; // The AutoTable plugin

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

  const triggerDownload = (blob: Blob, ext: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Revoke URL after click
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
              return value ?? "";
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      triggerDownload(blob, "csv");

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
      triggerDownload(blob, "xls");

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
      triggerDownload(blob, "xlsx");

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

      // Use jspdf-autotable for better table and pagination
      autoTable(doc, {
        startY: 25,
        head: [headers],
        body: rows,
        theme: "striped",
        headStyles: { fillColor: [33, 150, 243] }, // Tailwind blue 500
        margin: { left: 10, right: 10 },
        styles: { fontSize: 10 },
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
      triggerDownload(blob, "json");

      handleExportEnd(true, "JSON exported successfully");
    } catch (error) {
      handleExportEnd(false, "Failed to export JSON");
    }
  };

  const menuItemClasses =
    "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

  const buttonClasses = `${
    className ?? ""
  } cursor-pointer hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`;

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

// "use client";

// import React, { useState } from "react";
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
//   Database,
//   LoaderCircle,
// } from "lucide-react";
// import { toast } from "sonner";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";

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
//   const [exportType, setExportType] = useState<string | null>(null);

//   const handleExportStart = (type: string) => {
//     setIsExporting(true);
//     setExportType(type);
//   };

//   const handleExportEnd = (success: boolean, message: string) => {
//     setIsExporting(false);
//     setExportType(null);
//     toast[success ? "success" : "error"](message);
//   };

//   const exportToCSV = async () => {
//     handleExportStart("CSV");
//     try {
//       if (!data || data.length === 0) {
//         handleExportEnd(false, "No data to export");
//         return;
//       }

//       const headers = Object.keys(data[0]);
//       const csvContent = [
//         headers.join(","),
//         ...data.map((row) =>
//           headers
//             .map((header) => {
//               const value = row[header];
//               if (
//                 typeof value === "string" &&
//                 (value.includes(",") || value.includes('"'))
//               ) {
//                 return `"${value.replace(/"/g, '""')}"`;
//               }
//               return value ?? ""; // handle undefined/null gracefully
//             })
//             .join(",")
//         ),
//       ].join("\n");

//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = `${filename}.csv`;
//       link.click();

//       handleExportEnd(true, "CSV exported successfully");
//     } catch (error) {
//       handleExportEnd(false, "Failed to export CSV");
//     }
//   };

//   const exportToExcel = async () => {
//     handleExportStart("Excel");
//     try {
//       if (!data || data.length === 0) {
//         handleExportEnd(false, "No data to export");
//         return;
//       }
//       const headers = Object.keys(data[0]);
//       const tsvContent = [
//         headers.join("\t"),
//         ...data.map((row) =>
//           headers.map((header) => row[header] ?? "").join("\t")
//         ),
//       ].join("\n");

//       const blob = new Blob([tsvContent], {
//         type: "application/vnd.ms-excel",
//       });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = `${filename}.xls`;
//       link.click();

//       handleExportEnd(true, "Excel (XLS) exported successfully");
//     } catch (error) {
//       handleExportEnd(false, "Failed to export Excel (XLS)");
//     }
//   };

//   const exportToXLSX = async () => {
//     handleExportStart("XLSX");
//     try {
//       if (!data || data.length === 0) {
//         handleExportEnd(false, "No data to export");
//         return;
//       }

//       const workbook = XLSX.utils.book_new();
//       const worksheet = XLSX.utils.json_to_sheet(data);
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

//       const excelBuffer = XLSX.write(workbook, {
//         bookType: "xlsx",
//         type: "array",
//       });

//       const blob = new Blob([excelBuffer], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = `${filename}.xlsx`;
//       link.click();

//       handleExportEnd(true, "XLSX file exported successfully");
//     } catch (error) {
//       console.error("XLSX export error:", error);
//       handleExportEnd(false, "Failed to export XLSX file");
//     }
//   };

//   const exportToPDF = async () => {
//     handleExportStart("PDF");
//     try {
//       if (!data || data.length === 0) {
//         handleExportEnd(false, "No data to export");
//         return;
//       }

//       const doc = new jsPDF();

//       // Title and date
//       doc.setFontSize(18);
//       doc.text(`${filename.toUpperCase()} REPORT`, 10, 10);
//       doc.setFontSize(10);
//       doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 17);

//       const headers = Object.keys(data[0]);
//       const rows = data.map((row) =>
//         headers.map((header) => row[header] ?? "")
//       );

//       // Print table headers
//       let startY = 25;
//       doc.setFontSize(12);
//       doc.text(headers.join(" | "), 10, startY);
//       startY += 7;

//       // Print table rows with simple pagination logic
//       const lineHeight = 7;
//       rows.forEach((row, index) => {
//         if (startY > 280) {
//           doc.addPage();
//           startY = 10;
//         }
//         doc.setFontSize(10);
//         doc.text(row.join(" | "), 10, startY);
//         startY += lineHeight;
//       });

//       doc.save(`${filename}.pdf`);

//       handleExportEnd(true, "PDF exported successfully");
//     } catch (error) {
//       console.error("PDF export error:", error);
//       handleExportEnd(false, "Failed to export PDF");
//     }
//   };

//   const exportToJSON = async () => {
//     handleExportStart("JSON");
//     try {
//       if (!data || data.length === 0) {
//         handleExportEnd(false, "No data to export");
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

//       handleExportEnd(true, "JSON exported successfully");
//     } catch (error) {
//       handleExportEnd(false, "Failed to export JSON");
//     }
//   };

//   const menuItemClasses =
//     "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors duration-150";

//   const buttonClasses = `${
//     className ?? ""
//   } cursor-pointer hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors duration-150`;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           size="sm"
//           className={buttonClasses}
//           disabled={isExporting}
//           aria-label="Export data"
//         >
//           {isExporting && exportType ? (
//             <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
//           ) : (
//             <Download className="h-4 w-4 mr-2" />
//           )}
//           {isExporting ? `Exporting ${exportType}...` : "Export"}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-56 bg-popover" forceMount>
//         <DropdownMenuItem
//           onClick={exportToCSV}
//           disabled={isExporting}
//           className={menuItemClasses}
//         >
//           <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500" />
//           Export as CSV
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onClick={exportToExcel}
//           disabled={isExporting}
//           className={menuItemClasses}
//         >
//           <FileSpreadsheet className="h-4 w-4 mr-2 text-blue-600" />
//           Export as Excel (XLS)
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onClick={exportToXLSX}
//           disabled={isExporting}
//           className={menuItemClasses}
//         >
//           <FileSpreadsheet className="h-4 w-4 mr-2 text-purple-600" />
//           Export as XLSX
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onClick={exportToPDF}
//           disabled={isExporting}
//           className={menuItemClasses}
//         >
//           <FileText className="h-4 w-4 mr-2 text-red-600" />
//           Export as PDF
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onClick={exportToJSON}
//           disabled={isExporting}
//           className={menuItemClasses}
//         >
//           <Database className="h-4 w-4 mr-2 text-yellow-600" />
//           Export as JSON
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
