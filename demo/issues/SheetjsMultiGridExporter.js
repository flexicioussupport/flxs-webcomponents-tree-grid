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
         * Writes the header of the grid (columns) in csv format
         * @param grid
         * @return
            *
         */


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
    SheetJs_Multigrid_Exporter.prototype.buildHeaderColumns = function (grid) {

        var colIndex = 0;
		var columns = [];

        for (var i = 0; i < grid.getExportableColumns().length; i++) {
            var col = grid.getExportableColumns()[i];
            if (!grid.excelOptions.exporter.isIncludedInExport(col))
                continue;
            columns.push(flexiciousNmsp.Exporter.getColumnHeader(col, colIndex));
            colIndex++;
        }
		
		this.data.push(columns);

    };
    SheetJs_Multigrid_Exporter.prototype.generate = function (grids, exportFileType) {

		if(typeof exportFileType === 'undefined') exportFileType = '';
		
		/* build workbook */
		var new_wb = XLSX.utils.book_new();
		
		
		for(var i=0;i<grids.length;i++) {
			this.buildHeaderColumns(grids[i]);
			[].forEach.call(grids[i].getDataProvider(), function(data) {
				this.writeRecord(grids[i], data);
			}, this);
			
			if(exportFileType === flxConstants.EXPORT_EXCEL_MULTI_TABBED) {
				XLSX.utils.book_append_sheet(new_wb, XLSX.utils.aoa_to_sheet(this.data));
				this.data = [];
            } else if (exportFileType === flxConstants.EXPORT_EXCEL_MERGED ) {
                this.data.push([]);
            }
            
            if(exportFileType === flxConstants.EXPORT_EXCEL_MULTIPLE_FILE) {
                var new_ws = XLSX.utils.aoa_to_sheet(this.data);
                XLSX.utils.book_append_sheet(new_wb, new_ws);
                this.save(new_wb, this._exportFileName + i + "." + this.getExtension());
                this.data = [];
                new_wb = XLSX.utils.book_new();
            }
		}
	
		if(exportFileType === flxConstants.EXPORT_EXCEL_MERGED) {
			/* build excel-sheet */
			var new_ws = XLSX.utils.aoa_to_sheet(this.data);
			XLSX.utils.book_append_sheet(new_wb, new_ws);
		}

        if(exportFileType !== flxConstants.EXPORT_EXCEL_MULTIPLE_FILE)
            this.save(new_wb, this._exportFileName + "." + this.getExtension());

        uiUtil.removePopUp(exportOptions.exportOptionsView);
    };

    SheetJs_Multigrid_Exporter.prototype.save = function(wb, filename) {
        /* write file and trigger a download */
        var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type:'binary'});
        // var fname = this._exportFileName + "." + this.getExtension();
        try {
            saveAs(new Blob([this.s2ab(wbout)],{type:"application/octet-stream"}), filename);
        } catch(e) { if(typeof console != 'undefined') console.log(e, wbout); }

        this.columns = [];
        this.data = [];
    }


    /**
     * Writes an individual record in csv format
     * @param grid
     * @param record
     * @return
        *
     */
    SheetJs_Multigrid_Exporter.prototype.writeRecord = function (grid, record) {

        var colIndex = 0;

        var item = [];
        for (var i = 0; i < grid.getExportableColumns().length; i++) {
            var col = grid.getExportableColumns()[i];
            if (!grid.excelOptions.exporter.isIncludedInExport(col))
                continue;
            var value = col.itemToLabel(record);
            item.push(isNaN(value) ? value : Number(value));
        }
        this.data.push(item);
        return "";

    };

    SheetJs_Multigrid_Exporter.prototype.s2ab = function(s) {
		var b = new ArrayBuffer(s.length), v = new Uint8Array(b);
		for (var i=0; i != s.length; ++i) v[i] = s.charCodeAt(i) & 0xFF;
		return b;
	}
	
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

    flxConstants.EXPORT_EXCEL_MERGED = "export_excel_merged";
    flxConstants.EXPORT_EXCEL_MULTI_TABBED = "export_excel_multi_tabbed";
    flxConstants.EXPORT_EXCEL_MULTIPLE_FILE = "export_excel_multiple_file";
	
}(window));
