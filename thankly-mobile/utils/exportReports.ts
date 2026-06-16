import ExcelJS from "exceljs";
import { Buffer } from "buffer";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { Asset } from "expo-asset";

global.Buffer = global.Buffer || Buffer;

type Transaction = {
  id: string;
  tip_amount?: number | null;
  fee_amount?: number | null;
  stripe_fee?: number | null;
  worker_receives?: number | null;
  tax_reserve_amount?: number | null;
  available_amount?: number | null;
  customer_covered_fee?: boolean | null;
  status?: string | null;
  created_at: string;
};

function money(cents: number | null | undefined) {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

function shortId(id: string) {
  return id.slice(0, 8);
}

function readableDate(value: string) {
  return new Date(value).toLocaleString();
}

function safeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

async function getLogoBase64() {
  const asset = Asset.fromModule(
    require("../assets/logos/thankly-logo-primary.png")
  );

  await asset.downloadAsync();

  const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return `data:image/png;base64,${base64}`;
}

export async function exportTransactionsPdf(
  transactions: Transaction[],
  workerName: string,
  reportPeriod: string
) {
  const totalGross = transactions.reduce((s, tx) => s + (tx.tip_amount ?? 0), 0);
  const totalNet = transactions.reduce((s, tx) => s + (tx.worker_receives ?? 0), 0);
  const totalTax = transactions.reduce((s, tx) => s + (tx.tax_reserve_amount ?? 0), 0);
  const totalAvailable = transactions.reduce((s, tx) => s + (tx.available_amount ?? 0), 0);

  const logoBase64 = await getLogoBase64();

  const rows = transactions
    .map(
      (tx) => `
      <tr>
        <td>${readableDate(tx.created_at)}</td>
        <td>${money(tx.tip_amount)}</td>
        <td>${money(tx.worker_receives)}</td>
        <td>${money(tx.tax_reserve_amount)}</td>
        <td>${money(tx.available_amount)}</td>
        <td>${tx.status ?? "completed"}</td>
        <td>${shortId(tx.id)}</td>
      </tr>`
    )
    .join("");

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 28px; color:#0f172a;">
        <div style="
          background:#0f4c81;
          padding:22px 28px;
          border-radius:14px;
          margin-bottom:28px;
          display:flex;
          align-items:center;
          gap:18px;
        ">
          <img
            src="${logoBase64}"
            style="width:125px;height:auto;object-fit:contain;display:block;"
          />

          <div>
            <div style="color:white;font-size:30px;font-weight:800;margin-bottom:6px;">
              Thankly Tip Report
            </div>

            <div style="color:#dbeafe;font-size:14px;font-weight:500;">
              Official Earnings Summary • Thankly LLC • getthankly.com
            </div>
          </div>
        </div>

        <p><strong>Worker:</strong> ${workerName}</p>
        <p><strong>Period:</strong> ${reportPeriod}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>

        <h2>Summary</h2>
        <p>Total Gross Tips: ${money(totalGross)}</p>
        <p>Total Net Payout: ${money(totalNet)}</p>
        <p>Total Estimated Tax Pocket: ${money(totalTax)}</p>
        <p>Total Available After Tax Savings Rate: ${money(totalAvailable)}</p>

        <table width="100%" border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; margin-top: 20px; font-size: 11px;">
          <tr>
            <th>Date</th>
            <th>Tip</th>
            <th>Payout</th>
            <th>Tax</th>
            <th>Available</th>
            <th>Status</th>
            <th>ID</th>
          </tr>
          ${rows}
        </table>

        <h2 style="margin-top: 28px;">Certification</h2>
        <p>I certify that these tips were received through Thankly during the period stated above.</p>

        <div style="margin-top:18px;font-size:15px;color:#334155;line-height:1.5;">
          Processed and documented through <strong>Thankly LLC</strong> • getthankly.com
        </div>

        <p style="margin-top: 32px;">Employee Signature: _______________________</p>
        <p>Date: ___________________</p>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  const today = new Date().toISOString().slice(0, 10);
  const path =
    FileSystem.documentDirectory +
    `thankly-tip-report-${safeFileName(workerName)}-${today}.pdf`;

  await FileSystem.copyAsync({ from: uri, to: path });
  await Sharing.shareAsync(path);
}

export async function exportTransactionsCsv(
  transactions: Transaction[],
  workerName: string,
  reportPeriod: string
) {
  const header = [
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

  const rows = transactions.map((tx) => [
    readableDate(tx.created_at),
    money(tx.tip_amount),
    money(tx.fee_amount),
    money(tx.stripe_fee),
    money(tx.worker_receives),
    money(tx.tax_reserve_amount),
    money(tx.available_amount),
    tx.customer_covered_fee ? "Yes" : "No",
    tx.status ?? "completed",
    shortId(tx.id),
  ]);

  const csv = [
    ["Thankly Tip Report"],
    [`Worker: ${workerName}`],
    [`Period: ${reportPeriod}`],
    [`Generated: ${new Date().toLocaleString()}`],
    [],
    header,
    ...rows,
  ]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const today = new Date().toISOString().slice(0, 10);
  const path =
    FileSystem.documentDirectory +
    `thankly-tip-report-${safeFileName(workerName)}-${today}.csv`;

  await FileSystem.writeAsStringAsync(path, csv);
  await Sharing.shareAsync(path);
}
export async function exportTransactionsXlsx(
  transactions: Transaction[],
  workerName: string,
  reportPeriod: string
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Tip Report");

  worksheet.pageSetup.orientation = "landscape";
  worksheet.pageSetup.fitToPage = true;
  worksheet.pageSetup.fitToWidth = 1;
  worksheet.pageSetup.margins = {
    left: 0.3,
    right: 0.3,
    top: 0.35,
    bottom: 0.35,
    header: 0.15,
    footer: 0.15,
  };

  /*
   * LOGO
   */

  //try {
 //   const logoBase64 = await getLogoBase64();

//  const logoId = workbook.addImage({
//     base64: logoBase64.replace("data:image/png;base64,", "").trim(),
//      extension: "png",
//    });

//    worksheet.addImage(logoId, {
//      tl: { col: 0.35, row: 0.28 },
//      ext: { width: 92, height: 92 },
//    });
//  } catch (err) {
//    console.log("Logo failed to load in XLSX:", err);
//  }

worksheet.headerFooter.oddHeader =
  "&L&BThankly&Rgetthankly.com";

worksheet.headerFooter.oddFooter = 
  "&CThankly LLC • Official Earnings Summary";
  /*
   * HEADER
   */

  worksheet.mergeCells("B1:J1");
  worksheet.mergeCells("B2:J2");

  worksheet.getRow(1).height = 34;
  worksheet.getRow(2).height = 22;
  worksheet.getRow(3).height = 8;

  for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 10; col++) {
      worksheet.getRow(row).getCell(col).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0F4C81" },
      };
    }
  }

  worksheet.getCell("B1").value = "Thankly Tip Report";
  worksheet.getCell("B1").font = {
    bold: true,
    size: 22,
    color: { argb: "FFFFFF" },
  };
  worksheet.getCell("B1").alignment = {
    vertical: "middle",
    horizontal: "left",
  };

  worksheet.getCell("B2").value =
    "Official Earnings Summary • Thankly LLC • getthankly.com";

  worksheet.getCell("B2").font = {
    bold: true,
    size: 12,
    color: { argb: "DBEAFE" },
  };

  worksheet.getCell("B2").alignment = {
    vertical: "middle",
    horizontal: "left",
  };

  /*
   * WORKER INFO
   */

  worksheet.getCell("A5").value = "Worker";
  worksheet.getCell("B5").value = workerName;

  worksheet.getCell("A6").value = "Period";
  worksheet.getCell("B6").value = reportPeriod;

  worksheet.getCell("A7").value = "Generated";
  worksheet.getCell("B7").value = new Date().toLocaleString();

  ["A5", "A6", "A7"].forEach((cell) => {
    worksheet.getCell(cell).font = {
      bold: true,
      size: 12,
    };
  });

  /*
   * SUMMARY
   */

  const summary = {
    grossTips: transactions.reduce((s, tx) => s + (tx.tip_amount ?? 0), 0),
    netPayout: transactions.reduce(
      (s, tx) => s + (tx.worker_receives ?? 0),
      0
    ),
    taxPocket: transactions.reduce(
      (s, tx) => s + (tx.tax_reserve_amount ?? 0),
      0
    ),
    available: transactions.reduce(
      (s, tx) => s + (tx.available_amount ?? 0),
      0
    ),
  };

  worksheet.getCell("A9").value = "Summary";
  worksheet.getCell("A9").font = {
    bold: true,
    size: 18,
    color: { argb: "0F172A" },
  };

  const summaryCards = [
    ["A11:B12", "Gross Tips", summary.grossTips],
    ["C11:D12", "Net Payout", summary.netPayout],
    ["E11:F12", "Est. Tax Pocket", summary.taxPocket],
    ["G11:H12", "Available", summary.available],
  ] as const;

  summaryCards.forEach(([range, label, value]) => {
    worksheet.mergeCells(range);

    const cell = worksheet.getCell(range.split(":")[0]);

    cell.value = `${label}\n$${(value / 100).toFixed(2)}`;

    cell.font = {
      bold: true,
      size: 13,
      color: { argb: "0F172A" },
    };

    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "EFF6FF" },
    };

    cell.border = {
      top: { style: "thin", color: { argb: "BFDBFE" } },
      left: { style: "thin", color: { argb: "BFDBFE" } },
      bottom: { style: "thin", color: { argb: "BFDBFE" } },
      right: { style: "thin", color: { argb: "BFDBFE" } },
    };
  });

  worksheet.getRow(11).height = 42;
  worksheet.getRow(12).height = 42;

  /*
   * TABLE HEADER
   */

  worksheet.getRow(15).values = [
    "Date / Time",
    "Tip Amount",
    "Thankly Fee",
    "Stripe Fee",
    "Worker Payout",
    "Tax Pocket",
    "Available",
    "Paid by Client",
    "Status",
    "Transaction ID",
  ];

  worksheet.getRow(15).height = 24;

  worksheet.getRow(15).font = {
    bold: true,
    color: { argb: "FFFFFF" },
  };

  worksheet.getRow(15).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "173F73" },
  };

  /*
   * TRANSACTIONS
   */

  transactions.forEach((tx) => {
    worksheet.addRow([
      readableDate(tx.created_at),
      (tx.tip_amount ?? 0) / 100,
      (tx.fee_amount ?? 0) / 100,
      (tx.stripe_fee ?? 0) / 100,
      (tx.worker_receives ?? 0) / 100,
      (tx.tax_reserve_amount ?? 0) / 100,
      (tx.available_amount ?? 0) / 100,
      tx.customer_covered_fee ? "Yes" : "No",
      tx.status ?? "completed",
      shortId(tx.id),
    ]);
  });

  /*
   * COLUMN WIDTHS
   */

  worksheet.columns = [
    { width: 24 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 16 },
    { width: 16 },
    { width: 16 },
    { width: 15 },
    { width: 14 },
    { width: 16 },
  ];

  /*
   * MONEY FORMAT
   */

  for (let rowNumber = 16; rowNumber <= worksheet.rowCount; rowNumber++) {
    [2, 3, 4, 5, 6, 7].forEach((col) => {
      worksheet.getRow(rowNumber).getCell(col).numFmt = "$#,##0.00";
    });
  }

  /*
   * EXPORT
   */

  const buffer = await workbook.xlsx.writeBuffer();

  const today = new Date().toISOString().slice(0, 10);

  const path =
    FileSystem.documentDirectory +
    `thankly-tip-report-${safeFileName(workerName)}-${today}.xlsx`;

  await FileSystem.writeAsStringAsync(
    path,
    Buffer.from(buffer).toString("base64"),
    {
      encoding: FileSystem.EncodingType.Base64,
    }
  );

  await Sharing.shareAsync(path);
}
