/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
(function (window) {
    "use strict";
    var ExcelBuilderMultiGridExporter, uiUtil = flexiciousNmsp.UIUtils, flxConstants = flexiciousNmsp.Constants;
    /**
     * Exports the grid in CSV format
     * @constructor
     * @namespace
     * @extends Exporter
     */
    ExcelBuilderMultiGridExporter = function () {


        /**
         * object representing the columns
         */
        //this.columns = [];

        /**
         * object representing the data
         */
        this.data = [];

        this._exportFileName = "exported-grid";

        this._headerIndices = [];

        this._footerIndices = [];

    };
    flexiciousNmsp.ExcelBuilderMultiGridExporter = ExcelBuilderMultiGridExporter; //add to name space
    ExcelBuilderMultiGridExporter.prototype.typeName = ExcelBuilderMultiGridExporter.typeName = 'ExcelBuilderMultiGridExporter';//for quick inspection


    /**
     * @private
     * @param grid
     * @return
     *
     */
    ExcelBuilderMultiGridExporter.prototype.writeHeader = function (grid) {

        var colIndex = 0;
        var columns = [];

        for (var i = 0; i < grid.getExportableColumns().length; i++) {
            var col = grid.getExportableColumns()[i];
            if (!grid.excelOptions.exporter.isIncludedInExport(col))
                continue;
            var val = this.getText(flexiciousNmsp.Exporter.getColumnHeader(col, colIndex));
            columns.push(val);
            colIndex++;
        }

        if (colIndex > 0) {
            this._headerIndices.push(this.data.push(columns) - 1);
        }
        return "";
    };

    /**
     * Writes an individual record in csv format
     * @param grid
     * @param record
     * @return
     *
     */
    ExcelBuilderMultiGridExporter.prototype.writeRecord = function (grid, record) {

        var colIndex = 0;
        var exporter = grid.excelOptions.exporter;

        var item = [];
        for (var i = 0; i < grid.getExportableColumns().length; i++) {
            var col = grid.getExportableColumns()[i];
            if (!exporter.isIncludedInExport(col))
                continue;
            var value = flexiciousNmsp.UIUtils.resolveExpression(record, col.dataField);
            value = value ? this.getText(value) : "";
            item.push(value ? isNaN(value) ? value : Number(value) : "");
        }
        this.data.push(item);
        return "";

    };

    ExcelBuilderMultiGridExporter.prototype.writeFooter = function (grid, dataProvider) {

        var colIndex = 0;
        var footerColumns = [];
        var exporter = grid.excelOptions.exporter;

        if (grid.excelOptions.includeFooters) {
            var i = 0;
            if (!exporter.reusePreviousLevelColumns) {
                while (i++ < exporter.getNestDepth()) {
                    footerColumns.push('');
                }
            }

            for (var i = 0; i < grid.getExportableColumns().length; i++) {
                var col = grid.getExportableColumns()[i];
                if (!exporter.isIncludedInExport(col))
                    continue;
                var spaces = exporter.getSpaces(col);
                var value = this.getText(col.calculateFooterValue(dataProvider));
                footerColumns.push(spaces ? spaces + value : (value ? isNaN(value) ? value : Number(value) : ""));
                colIndex++;
            }

            if (colIndex > 0) {
                this._footerIndices.push(this.data.push(footerColumns) - 1);
            }
        }

        return "";
    };

    /**
     *
     * @param gridProps each property should have {grid: <grid>, sheet: <sheet-name>} such structure
     * @param multiTab default set to false
     */
    ExcelBuilderMultiGridExporter.prototype.generate = function (gridProps, multiTab) {

        if (typeof multiTab === 'undefined') multiTab = false;

        var i;
        var ws;

        /* build workbook */
        var new_wb = ExcelBuilder.Builder.createWorkbook();
        this.stylesheet = new_wb.getStyleSheet();

        for (i = 0; i < gridProps.length; i++) {
            this.writeHeader(gridProps[i].grid);
            [].forEach.call(gridProps[i].grid.getDataProviderNoPaging(), function (data) {
                this.writeRecord(gridProps[i].grid, data);
            }, this);

            this.writeFooter(gridProps[i].grid, gridProps[i].grid.getDataProviderNoPaging());

            if (multiTab) {
                ws = new_wb.createWorksheet({ name: this.getValidSheetName(gridProps[i]) });
                this.attachWorkSheet(new_wb, ws, this.data[0], "");
                this.data = [];
            } else {
                this.data.push([]);
            }
        }

        if (!multiTab) {
            /* build excel-sheet */
            ws = new_wb.createWorksheet({ name: this.getValidSheetName(gridProps[gridProps.length - 1]) });
            this.attachWorkSheet(new_wb, ws, this.data[0], "");
        }

        /* write file and trigger a download */
        ExcelBuilder.Builder.createFile(new_wb).then(function (data) {
            var fname = this._exportFileName + "." + this.getExtension();
            try {
                saveAs(this.b64toBlob(data, "application/octet-stream"), fname);
            } catch (e) { if (typeof console != 'undefined') console.log(e, wbout); }

            this.columns = [];
            this.data = [];
        }.bind(this));
    };

    /* ==================== Utils methods ====================== */

    ExcelBuilderMultiGridExporter.prototype.b64toBlob = function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    ExcelBuilderMultiGridExporter.prototype.getText = function (htmlText) {
        // parse html too and fetch textContent from that html
        var parser = new DOMParser();
        var doc = parser.parseFromString('<span>' + htmlText + '</span>', "text/xml");
        htmlText = doc.firstChild.outerText || doc.firstChild.textContent;
        return htmlText;
    }

    ExcelBuilderMultiGridExporter.prototype.setColumnsWidth = function (ws, grid) {
        var wscols = [];

        [].forEach.call(grid.getExportableColumns(), function (col) {
            if (grid.excelOptions.exporter.isIncludedInExport(col)) {
                wscols.push({ wpx: col.getWidth() });
            }
        });

    };

    ExcelBuilderMultiGridExporter.prototype.attachWorkSheet = function (workbook, worksheet, columns, style) {
        var table = new ExcelBuilder.Table();
        var data = this.data || [];
        // table.styleInfo.themeStyle = style || '';
        if (columns && Array.isArray(columns) && columns.length > 0 && data.length > 0 && this._headerIndices.length>0) {
            table.setReferenceRange([1, 1], [columns.length, data.length]);
            table.setTableColumns(columns);
        }

        var headerFm = this.stylesheet.createFormat({
            font: {
                bold: true, underline: true, size: 18, fontName: 'Times New Roman'
            }, alignment: {
                horizontal: 'center',
                vertical: 'center'
            }, fill: {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '88FF8800',
                bgColor: '88002222'
            }, border: {
                bottom: { style: 'thick', color: 'FF000000' }
            }
        });

        var footerFm = this.stylesheet.createFormat({
            font: {
                bold: true, size: 18, fontName: 'Times New Roman'
            }, alignment: {
                horizontal: 'center',
                vertical: 'center'
            }, border: {
                top: { style: 'thick', color: 'FF222222' },
                left: { style: 'thin', color: 'FFDDDDDD' },
                right: { style: 'thin', color: 'FFDDDDDD' },
                bottom: { style: 'thick', color: 'FFDDDDDD' },
            }
        });

        var dataFm = this.stylesheet.createFormat({
            font: {
                size: 14.5, fontName: 'Times New Roman'
            }, alignment: {
                horizontal: 'center',
                vertical: 'center'
            }, border: {
                top: { style: 'thin', color: '884F4F4F' },
                left: { style: 'thin', color: '884F4F4F' },
                right: { style: 'thin', color: '884F4F4F' },
                bottom: { style: 'thin', color: '884F4F4F' },
                outline: true
            }
        });

        var dataFmOdd = this.stylesheet.createFormat({
            font: {
                size: 14.5, fontName: 'Times New Roman'
            }, alignment: {
                horizontal: 'center',
                vertical: 'center'
            }, fill: {
                type: 'pattern',
                patternType: 'solid',
                fgColor: 'FFFFEF00',
                bgColor: 'FF000000'
            }, border: {
                top: { style: 'thin', color: '404F4F4F' },
                left: { style: 'thin', color: '404F4F4F' },
                right: { style: 'thin', color: '404F4F4F' },
                bottom: { style: 'thin', color: '404F4F4F' },
                outline: true
            }
        });

        var fmIdObject = { headerFmId: headerFm.id, fmId: dataFm.id, fmOddId: dataFmOdd.id, footerFmId: footerFm.id };

        worksheet.sheetView.showGridLines = true;
        worksheet.setData(this.updateStyles(this.data, fmIdObject));
        worksheet.setColumns([{ width: 25 }, { width: 25 }, { width: 25 }]);
        workbook.addWorksheet(worksheet);

        worksheet.addTable(table);
        workbook.addTable(table);
    };

    ExcelBuilderMultiGridExporter.prototype.updateStyles = function (data, formatIdObject) {
        if (typeof formatIdObject === 'undefined') formatIdObject = {};
        var newdata = [];
        var i = 0;
        [].forEach.call(data, function (row) {
            var newItem = [];
            [].forEach.call(row, function (cell) {
                var d = {};
                d['value'] = cell;
                d['metadata'] = { style: this._headerIndices.indexOf(i) != -1 ? formatIdObject.headerFmId || 0 : this._footerIndices.indexOf(i) != -1 ? formatIdObject.footerFmId || 0 : i % 2 === 0 ? formatIdObject.fmId || 0 : formatIdObject.fmOddId || 0 };
                newItem.push(d);
            }.bind(this));
            newdata.push(newItem);
            i++;
        }.bind(this));

        return newdata;
    }

    /* ========================== x ============================ */

    /**
     * set name of the download file.
     * @return
     *
     */
    ExcelBuilderMultiGridExporter.prototype.setFileName = function (filename) {
        this._exportFileName = filename;
    };

    /**
     * Extension of the download file.
     * @return
     *
     */
    ExcelBuilderMultiGridExporter.prototype.getExtension = function () {
        return "xlsx";
    };

    ExcelBuilderMultiGridExporter.prototype.getValidSheetName = function (gridProps) {
        return gridProps.hasOwnProperty('sheet') && gridProps.sheet ? gridProps.sheet : undefined;
    };

}(window));
