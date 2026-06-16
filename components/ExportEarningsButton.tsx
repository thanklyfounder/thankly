"use client";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Language = "en" | "es";

type Transaction = {
  id: string;
  tip_amount: number;
  fee_amount: number;
  stripe_fee?: number;
  worker_receives: number;
  tax_reserve_amount: number;
  available_amount: number;
  customer_covered_fee?: boolean;
  status: string;
  created_at: string;
};

type ExportEarningsButtonProps = {
  workerName: string;
  transactions: Transaction[];
  language?: Language;
};

function money(cents: number | null | undefined) {
  return ((cents ?? 0) / 100).toFixed(2);
}

function moneyNumber(cents: number | null | undefined) {
  return (cents ?? 0) / 100;
}

function shortId(id: string) {
  return id.slice(0, 8);
}

function readableDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ExportEarningsButton({
  workerName,
  transactions,
  language = "en",
}: ExportEarningsButtonProps) {
  const excelLabel =
    language === "es"
      ? "Exportar Excel"
      : "Export Excel";

  const pdfLabel =
    language === "es"
      ? "Exportar PDF"
      : "Export PDF";

  const now = new Date();

  const totalGrossTips = transactions.reduce(
    (sum, tx) => sum + (tx.tip_amount ?? 0),
    0
  );

  const totalThanklyFees = transactions.reduce(
    (sum, tx) => sum + (tx.fee_amount ?? 0),
    0
  );

  const totalStripeFees = transactions.reduce(
    (sum, tx) => sum + (tx.stripe_fee ?? 0),
    0
  );

  const totalNetPayout = transactions.reduce(
    (sum, tx) => sum + (tx.worker_receives ?? 0),
    0
  );

  const totalEstimatedTax = transactions.reduce(
    (sum, tx) => sum + (tx.tax_reserve_amount ?? 0),
    0
  );

  const totalAvailable = transactions.reduce(
    (sum, tx) => sum + (tx.available_amount ?? 0),
    0
  );

  const sortedDates = transactions
    .map((tx) => new Date(tx.created_at))
    .sort((a, b) => a.getTime() - b.getTime());

  const startDate =
    sortedDates.length > 0
      ? sortedDates[0].toLocaleDateString()
      : "N/A";

  const endDate =
    sortedDates.length > 0
      ? sortedDates[sortedDates.length - 1].toLocaleDateString()
      : "N/A";

  async function handleExcelExport() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tip Report");

    worksheet.mergeCells("A1:J1");

    worksheet.getCell("A1").value = "Thankly Tip Report";

    worksheet.getCell("A1").font = {
      bold: true,
      size: 18,
    };

    worksheet.getCell("A1").alignment = {
      horizontal: "center",
    };

    worksheet.getCell("A3").value = "Employee Name";
    worksheet.getCell("B3").value = workerName;

    worksheet.getCell("A4").value = "Period";
    worksheet.getCell("B4").value =
      `${startDate} → ${endDate}`;

    worksheet.getCell("A5").value = "Generated";
    worksheet.getCell("B5").value =
      now.toLocaleString();

    worksheet.getCell("A7").value = "Summary";

    worksheet.getCell("A7").font = {
      bold: true,
      size: 14,
    };

    worksheet.getCell("A8").value =
      "Total Gross Tips";

    worksheet.getCell("B8").value =
      moneyNumber(totalGrossTips);

    worksheet.getCell("A9").value =
      "Total Net Payout";

    worksheet.getCell("B9").value =
      moneyNumber(totalNetPayout);

    worksheet.getCell("A10").value =
      "Total Estimated Tax";

    worksheet.getCell("B10").value =
      moneyNumber(totalEstimatedTax);

    worksheet.getCell("A11").value =
      "Total Available After Tax Savings Rate";

    worksheet.getCell("B11").value =
      moneyNumber(totalAvailable);

    worksheet.getCell("A12").value =
      "Total Thankly Fees";

    worksheet.getCell("B12").value =
      moneyNumber(totalThanklyFees);

    worksheet.getCell("A13").value =
      "Total Stripe Fees";

    worksheet.getCell("B13").value =
      moneyNumber(totalStripeFees);

    ["B8", "B9", "B10", "B11", "B12", "B13"].forEach(
      (cell) => {
        worksheet.getCell(cell).numFmt =
          "$#,##0.00";
      }
    );

    const headerRow = worksheet.getRow(15);

    headerRow.values = [
      "Date / Time",
      "Tip Amount",
      "Thankly Fee",
      "Stripe Fee",
      "Worker Amount Payout",
      "Estimated Tax Pocket",
      "Available After Tax Savings Rate",
      "Paid by Client",
      "Status",
      "Transaction ID",
    ];

    headerRow.font = { bold: true };

    transactions.forEach((tx) => {
      worksheet.addRow([
        readableDate(tx.created_at),
        moneyNumber(tx.tip_amount),
        moneyNumber(tx.fee_amount),
        moneyNumber(tx.stripe_fee),
        moneyNumber(tx.worker_receives),
        moneyNumber(tx.tax_reserve_amount),
        moneyNumber(tx.available_amount),
        tx.customer_covered_fee ? "Yes" : "No",
        tx.status,
        shortId(tx.id),
      ]);
    });

    const totalsRow = worksheet.addRow([
      "TOTALS",
      moneyNumber(totalGrossTips),
      moneyNumber(totalThanklyFees),
      moneyNumber(totalStripeFees),
      moneyNumber(totalNetPayout),
      moneyNumber(totalEstimatedTax),
      moneyNumber(totalAvailable),
      "",
      "",
      "",
    ]);

    totalsRow.font = { bold: true };

    for (
      let rowNumber = 16;
      rowNumber <= worksheet.rowCount;
      rowNumber++
    ) {
      [2, 3, 4, 5, 6, 7].forEach((colNumber) => {
        worksheet
          .getRow(rowNumber)
          .getCell(colNumber).numFmt =
          "$#,##0.00";
      });
    }

    worksheet.addRow([]);
    worksheet.addRow(["Certification"]);

    worksheet.addRow([
      "I certify that these tips were received through Thankly during the period stated above.",
    ]);

    worksheet.addRow([]);

    worksheet.addRow([
      "Employee Signature: _______________________",
    ]);

    worksheet.addRow([
      "Date: ___________________",
    ]);

    worksheet.columns = [
      { width: 26 },
      { width: 14 },
      { width: 14 },
      { width: 14 },
      { width: 22 },
      { width: 24 },
      { width: 14 },
      { width: 16 },
      { width: 14 },
      { width: 16 },
    ];

    worksheet.views = [
      { state: "frozen", ySplit: 15 },
    ];

    const buffer =
      await workbook.xlsx.writeBuffer();

    const today =
      now.toISOString().slice(0, 10);

    const safeName = workerName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    saveAs(
      new Blob([buffer]),
      `thankly-tip-report-${safeName}-${today}.xlsx`
    );
  }

  function handlePdfExport() {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Thankly Tip Report",
      105,
      18,
      { align: "center" }
    );

    doc.setFontSize(11);

    doc.text(
      `Employee Name: ${workerName}`,
      14,
      32
    );

    doc.text(
      `Period: ${startDate} - ${endDate}`,
      14,
      39
    );

    doc.text(
      `Generated: ${now.toLocaleString()}`,
      14,
      46
    );

    doc.setFontSize(13);

    doc.text("Summary", 14, 60);

    doc.setFontSize(11);

    doc.text(
      `Total Gross Tips: $${money(totalGrossTips)}`,
      14,
      70
    );

    doc.text(
      `Total Net Payout: $${money(totalNetPayout)}`,
      14,
      77
    );

    doc.text(
      `Total Estimated Tax: $${money(totalEstimatedTax)}`,
      14,
      84
    );

    doc.text(
      `Total Available After Tax Savings Rate: $${money(totalAvailable)}`,
      14,
      91
    );

    autoTable(doc, {
      startY: 100,
      head: [[
        "Date",
        "Tip",
        "Thankly",
        "Stripe",
        "Payout",
        "Tax",
        "Available After Tax Savings Rate",
      ]],
      body: transactions.map((tx) => [
        readableDate(tx.created_at),
        `$${money(tx.tip_amount)}`,
        `$${money(tx.fee_amount)}`,
        `$${money(tx.stripe_fee)}`,
        `$${money(tx.worker_receives)}`,
        `$${money(tx.tax_reserve_amount)}`,
        `$${money(tx.available_amount)}`,
      ]),
      foot: [[
        "TOTALS",
        `$${money(totalGrossTips)}`,
        `$${money(totalThanklyFees)}`,
        `$${money(totalStripeFees)}`,
        `$${money(totalNetPayout)}`,
        `$${money(totalEstimatedTax)}`,
        `$${money(totalAvailable)}`,
      ]],
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [37, 99, 235],
      },
      footStyles: {
        fillColor: [15, 23, 42],
      },
    });

    const finalY =
      (doc as any).lastAutoTable.finalY || 160;

    doc.setFontSize(11);

    doc.text(
      "Certification",
      14,
      finalY + 15
    );

    doc.text(
      "I certify that these tips were received through Thankly during the period stated above.",
      14,
      finalY + 24
    );

    doc.text(
      "Employee Signature: _______________________",
      14,
      finalY + 42
    );

    doc.text(
      "Date: ___________________",
      14,
      finalY + 52
    );

    const today =
      now.toISOString().slice(0, 10);

    const safeName = workerName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    doc.save(
      `thankly-tip-report-${safeName}-${today}.pdf`
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleExcelExport}
        className="rounded-2xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition"
      >
        {excelLabel}
      </button>

      <button
        type="button"
        onClick={handlePdfExport}
        className="rounded-2xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition"
      >
        {pdfLabel}
      </button>
    </div>
  );
}

