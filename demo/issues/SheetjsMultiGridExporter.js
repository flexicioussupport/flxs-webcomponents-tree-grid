/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
(function (window) {
    "use strict";
    var SheetJs_Multigrid_Exporter, uiUtil = flexiciousNmsp.UIUtils, flxConstants = flexiciousNmsp.Constants;
    /**
     * Exports the grid in CSV format
     * @constructor
     * @namespace
     * @extends Exporter
     */
    SheetJs_Multigrid_Exporter = function () {


        /**
         * object representing the columns
         */
        //this.columns = [];

        /**
         * object representing the data
         */
        this.data = [];

        this._exportFileName = "exported-grid";

    };
    flexiciousNmsp.SheetJs_Multigrid_Exporter = SheetJs_Multigrid_Exporter; //add to name space
    SheetJs_Multigrid_Exporter.prototype.typeName = SheetJs_Multigrid_Exporter.typeName = 'SheetJs_Multigrid_Exporter';//for quick inspection


    /**
     * @private
     * @param grid
     * @return
     *
     */
    SheetJs_Multigrid_Exporter.prototype.writeHeader = function (grid) {

        var colIndex = 0;
        var columns = [];

        for (var i = 0; i < grid.getExportableColumns().length; i++) {
            var col = grid.getExportableColumns()[i];
            if (!grid.excelOptions.exporter.isIncludedInExport(col))
                continue;
            columns.push(this.getText(flexiciousNmsp.Exporter.getColumnHeader(col, colIndex)));
            colIndex++;
        }

        this.data.push(columns);
        return "";
    };

    /**
     * Writes an individual record in csv format
     * @param grid
     * @param record
     * @return
     *
     */
    SheetJs_Multigrid_Exporter.prototype.writeRecord = function (grid, record) {

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

    SheetJs_Multigrid_Exporter.prototype.writeFooter = function (grid, dataProvider) {

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

            this.data.push(footerColumns);
        }

        return "";
    };

    /**
     *
     * @param gridProps each property should have {grid: <grid>, sheet: <sheet-name>} such structure
     * @param multiTab default set to false
     */
    SheetJs_Multigrid_Exporter.prototype.generate = function (gridProps, multiTab) {

        if (typeof multiTab === 'undefined') multiTab = false;

        var i;

        /* build workbook */
        var new_wb = XLSX.utils.book_new();

        for (i = 0; i < gridProps.length; i++) {
            this.writeHeader(gridProps[i].grid);
            [].forEach.call(gridProps[i].grid.getDataProviderNoPaging(), function (data) {
                this.writeRecord(gridProps[i].grid, data);
            }, this);

            this.writeFooter(gridProps[i].grid, gridProps[i].grid.getDataProviderNoPaging());

            if (multiTab) {
                XLSX.utils.book_append_sheet(new_wb, XLSX.utils.aoa_to_sheet(this.data), this.getValidSheetName(gridProps[i]));
                this.data = [];
            } else {
                this.data.push([]);
            }
        }

        if (!multiTab) {
            /* build excel-sheet */
            var new_ws = XLSX.utils.aoa_to_sheet(this.data);
            XLSX.utils.book_append_sheet(new_wb, new_ws, this.getValidSheetName(gridProps[gridProps.length - 1]));
        }

        /* write file and trigger a download */
        var wbout = XLSX.write(new_wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
        var fname = this._exportFileName + "." + this.getExtension();
        try {
            saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), fname);
        } catch (e) { if (typeof console != 'undefined') console.log(e, wbout); }

        this.columns = [];
        this.data = [];
    };

    /* ==================== Utils methods ====================== */

    SheetJs_Multigrid_Exporter.prototype.s2ab = function (s) {
        var b = new ArrayBuffer(s.length), v = new Uint8Array(b);
        for (var i = 0; i != s.length; ++i) v[i] = s.charCodeAt(i) & 0xFF;
        return b;
    }

    SheetJs_Multigrid_Exporter.prototype.getText = function (htmlText) {
        // parse html too and fetch textContent from that html
        var parser = new DOMParser();
        var doc = parser.parseFromString('<span>' + htmlText + '</span>', "text/xml");
        htmlText = doc.firstChild.outerText || doc.firstChild.textContent;
        console.log(htmlText);
        return htmlText;
    }

    /* ========================== x ============================ */

    /**
     * set name of the download file.
     * @return
     *
     */
    SheetJs_Multigrid_Exporter.prototype.setFileName = function (filename) {
        this._exportFileName = filename;
    };

    /**
     * Extension of the download file.
     * @return
     *
     */
    SheetJs_Multigrid_Exporter.prototype.getExtension = function () {
        return "xlsx";
    };

    SheetJs_Multigrid_Exporter.prototype.getValidSheetName = function (gridProps) {
        return gridProps.hasOwnProperty('sheet') && gridProps.sheet ? gridProps.sheet : undefined;
    };

}(window));
