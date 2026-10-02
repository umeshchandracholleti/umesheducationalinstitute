const RESPONSE_SHEET_NAME = "Inquiries";
const RESPONSE_HEADERS = ["Submitted at", "Name", "Email", "Phone", "Program", "Message"];

function doPost(event) {
  try {
    const input = JSON.parse(event.postData.contents || "{}");
    const name = cleanText(input.name, 100);
    const email = cleanText(input.email, 150);
    const phone = cleanText(input.phone, 30);
    const program = cleanText(input.program, 150) || "General Inquiry";
    const message = cleanText(input.message, 5000);

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ success: false, message: "A valid name and email are required." });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.getSheetByName(RESPONSE_SHEET_NAME)
        || spreadsheet.insertSheet(RESPONSE_SHEET_NAME);

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(RESPONSE_HEADERS);
        sheet.setFrozenRows(1);
      } else {
        const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        if (!existingHeaders.includes("Program")) {
          const messageColumn = existingHeaders.indexOf("Message");
          const insertAt = messageColumn >= 0 ? messageColumn + 1 : existingHeaders.length + 1;
          sheet.insertColumnBefore(insertAt);
          sheet.getRange(1, insertAt).setValue("Program");
        }
      }

      sheet.appendRow([
        new Date(),
        protectSpreadsheetCell(name),
        protectSpreadsheetCell(email),
        protectSpreadsheetCell(phone),
        protectSpreadsheetCell(program),
        protectSpreadsheetCell(message),
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ success: true, message: "Inquiry saved." });
  } catch (error) {
    console.error("Unable to save inquiry:", error);
    return jsonResponse({ success: false, message: "Unable to save inquiry." });
  }
}

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function protectSpreadsheetCell(value) {
  return /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
