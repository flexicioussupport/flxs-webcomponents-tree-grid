/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
(function(window)
{
    "use strict";
    var CustomExportOptionsView, uiUtil = flexiciousNmsp.UIUtils, flxConstants = flexiciousNmsp.Constants;
    /**
     * A CustomExportOptionsView that which can be used within the filtering/binding infrastructure.
     * @constructor
     * @class CustomExportOptionsView
     * @namespace flexiciousNmsp
     * @extends Label
     */
    CustomExportOptionsView=function(){
        flexiciousNmsp.UIComponent.apply(this,["div"]);
        uiUtil.attachClass(this.domElement,"flexiciousGrid");
        this.cbxColumns = new flexiciousNmsp.MultiSelectComboBox();
        this.cbxColumns.alwaysVisible=true;

        this.cbxExporters = new flexiciousNmsp.ComboBox();

        this.setWidth(500);

        this.exportOptions=new flexiciousNmsp.ExportOptions();

    };

    flexiciousNmsp.CustomExportOptionsView = CustomExportOptionsView; //add to name space
    CustomExportOptionsView.prototype = new flexiciousNmsp.Label(); //setup hierarchy
    CustomExportOptionsView.prototype.typeName = CustomExportOptionsView.typeName = 'CustomExportOptionsView';//for quick inspection
    /**
     *
     * @return {Array}
     */
    CustomExportOptionsView.prototype.getClassNames=function(){
        return ["CustomExportOptionsView","UIComponent"];
    };

    CustomExportOptionsView.prototype.setGrid = function(val) {
        this._grid=val;
        this.enablePaging = val.getEnablePaging();
        this.pageCount = val.getPageSize()>0?Math.ceil(val.getTotalRecords()/val.getPageSize()):1;
        this.selectedObjectsCount = val.getSelectedObjectsTopLevel().length;
    };

    CustomExportOptionsView.prototype.titlewindow1_creationCompleteHandler=function (event){

        if(this.exportOptions.columnsToExport.length>0)
            this.cbxColumns.selectedValues=uiUtil.extractPropertyValues(exportOptions.columnsToExport,'name');

    };

    CustomExportOptionsView.prototype.onOK=function (){
        var pagingRadios = document.getElementsByName("flxsExportpaging");

        for(var i = 0; i <= pagingRadios.length; i++) {
            if(pagingRadios[i].checked == true) {
                this.exportOptions.printExportOption =  pagingRadios[i].value;
                break;
            }
        }

        var pgFrom=parseInt(uiUtil.adapter.findElementWithClassName(this.domElement,'txtPageFrom').value);
        var pgTo=parseInt(uiUtil.adapter.findElementWithClassName(this.domElement,'txtPageTo').value);
        if(uiUtil.adapter.findElementWithClassName(this.domElement,'RBN_SELECT_PGS').checked){
            if(pgFrom>=1 && pgTo>=1 && pgFrom <=(this.pageCount)&& pgTo <=(this.pageCount ) && pgFrom<=pgTo){
                this.exportOptions.pageFrom = pgFrom;
                this.exportOptions.pageTo = pgTo;
                this.close(flxConstants.ALERT_OK);

            }else{
                window.alert("Please ensure that the 'page from' is less than or equal to 'page to'");
            }
        }
        else{
            this.close(flxConstants.ALERT_OK);
        }
    };

    CustomExportOptionsView.prototype.close=function (dialogResult){
        var closeEvent = new flexiciousNmsp.BaseEvent(flxConstants.EVENT_CLOSE);
        closeEvent.detail=dialogResult;
        this.dispatchEvent(closeEvent);
        //uiUtil.removePopUp(this);
    };

    CustomExportOptionsView.prototype.updateExportColumns=function (){
        this.exportOptions.columnsToExport=(this.cbxColumns.getSelectedItems());
        if (this.exportOptions.columnsToExport.length == 1 && this.exportOptions.columnsToExport[0].name == "All")
        {
            this.exportOptions.columnsToExport=[];
        }
     };

    CustomExportOptionsView.prototype.onChangeExportOptions=function (){
        this.exportOptions.exporter=this.cbxExporters.getSelectedItem();
    };

    CustomExportOptionsView.prototype.onCancel=function (evt){
        uiUtil.removePopUp(this);
    };
    /**
     * Initializes the auto complete and watermark plugins
     */
    CustomExportOptionsView.prototype.initialize=function(){
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        var container = new flexiciousNmsp.UIComponent("div");
        container.domElement.className= "exportOptionsView";
        this.addChild(container);
        var html ="   <div class='columnsLabel'>This is a custom export popup"+flxConstants.EXP_LBL_COLS_TO_EXPORT_TEXT+"</div>  <div class='options'>" +
            "   <input type='radio' class='RBN_CURRENT_PAGE' checked name='flxsExportpaging'  value='"+flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_CURRENT_PAGE+"'> "+flxConstants.EXP_RBN_CURRENT_PAGE_LABEL+"<br/>"  +
            "   <input type='radio' class='RBN_ALL_PAGES' name='flxsExportpaging' value='"+flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_ALL_PAGES+"'> "+flxConstants.EXP_RBN_ALL_PAGES_LABEL+"<br/>" +
            "   <input type='radio' class='RBN_SELECT_PGS' name='flxsExportpaging' value='"+flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_PAGES+"'> "+flxConstants.EXP_RBN_SELECT_PGS_LABEL+"<br/>"+
            "   <input  type='number' class='txtPageFrom' maxlength='5 '>"+
            "   <label> "+flxConstants.PGR_TO+"</label>" +
            "   <input   type='number' class='txtPageTo' maxlength='5'>" +
            "   <label>"+(this.pageCount )+"</label><br/>"+
            "   <input "+(this.selectedObjectsCount>0?'':'disabled')+" type='radio' class='rbnSelectedRecords'   name='flxsExportpaging' value='"+flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_RECORDS+"'> "
            +flxConstants.SELECTED_RECORDS+"(" + (this.selectedObjectsCount==0?'None Selected)':this.selectedObjectsCount+" selected)")+ "<br/>" +
            "   <label class='LBL_EXPORT_FORMAT'> "+flxConstants.EXP_LBL_EXPORT_FORMAT_TEXT+"</label>"+
            "</div><br/><br/>";
            html +="<div class='bottomButtonBar'>" +
                " <a class='BTN_EXPORT button' alt='Export'>"+(this.exportOptions.openNewWindow?flxConstants.PRT_BTN_PRINT_LABEL:flxConstants.EXP_BTN_EXPORT_LABEL)+"</a>" +
                " <a class='BTN_CANCEL button' alt='Cancel'>"+flxConstants.EXP_BTN_CANCEL_LABEL+"</a>" +
                "</div>";

        container.setInnerHTML(html);


        var exportBtn=uiUtil.adapter.findElementWithClassName(this.domElement,'BTN_EXPORT');
        var cancelBtn=uiUtil.adapter.findElementWithClassName(this.domElement,'BTN_CANCEL');

        flexiciousNmsp.UIUtils.addDomEventListener(this, exportBtn, "click", function (evt){
            uiUtil.adapter.findAncestorByClassName(evt.target || evt.srcElement, 'flexiciousGrid').component.onOK();
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, cancelBtn, "click", function (evt){
            uiUtil.adapter.findAncestorByClassName(evt.target || evt.srcElement, 'flexiciousGrid').component.onCancel();
        });

        this.cbxColumns.setDataProvider(this.exportOptions.availableColumns);
        this.cbxColumns.labelField="name";
        this.cbxColumns.dataField="name";
        this.cbxColumns.addEventListener(this,flxConstants.EVENT_CHANGE,this.updateExportColumns);
        container.addChild(this.cbxColumns);
        this.cbxColumns.showPopup(container);

        this.cbxExporters.setDataProvider(this.exportOptions.exporters);
        this.cbxExporters.labelField="name";
        this.cbxExporters.dataField="name";
        this.cbxExporters.setSelectedValue(this.exportOptions.getExporterName());
        this.cbxExporters.addEventListener(this,flxConstants.EVENT_CHANGE,this.onChangeExportOptions);
        container.addChild(this.cbxExporters);

    };
}(window));