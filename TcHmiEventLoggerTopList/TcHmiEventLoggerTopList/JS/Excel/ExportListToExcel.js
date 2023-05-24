// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.37/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var TcHmiEventLoggerTopList;
        (function (TcHmiEventLoggerTopList) {
            async function ExportListToExcel(SheetName, FileName, List) {

                // Create a new workbook
                const workbook = new ExcelJS.Workbook();

                // Workbook properties
                workbook.creator = 'TwinCAT-HMI';
                workbook.lastModifiedBy = 'TwinCAT-HMI';
                workbook.created = new Date();

                // create a sheet with the first row frozen and red tab color
                const sheet = workbook.addWorksheet(SheetName, { views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }], properties: { tabColor: { argb: 'FFC0000' } } });

                //Define columns in sheet, width unit is mm
                sheet.columns = [
                    { header: 'Count', key: 'Count', width: 15 },
                    { header: 'EventText', key: 'EventText', width: 50 }
                ];

                // Set Row 1 Font settings.
                sheet.getRow(1).font = { size: 16, bold: true };

                //Loop array and add rows
                for (var i = 0; i < List.length; i++) {
                    //add rows
                    sheet.addRow({
                        Count: List[i].count,
                        EventText: List[i].eventText
                    });
                }

                // Write the workbook to a buffer then use FileSaver to export it in client-side
                const buffer = await workbook.xlsx.writeBuffer();
                saveAs(new Blob([buffer]), FileName + '.xlsx');

            }
            TcHmiEventLoggerTopList.ExportListToExcel = ExportListToExcel;
        })(TcHmiEventLoggerTopList = Functions.TcHmiEventLoggerTopList || (Functions.TcHmiEventLoggerTopList = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('ExportListToExcel', 'TcHmi.Functions.TcHmiEventLoggerTopList', TcHmi.Functions.TcHmiEventLoggerTopList.ExportListToExcel);