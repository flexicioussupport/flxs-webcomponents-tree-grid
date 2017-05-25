/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
(function (window) {
    "use strict";
    var CustomSettingsPopup, uiUtil = flexiciousNmsp.UIUtils, flxConstants = flexiciousNmsp.Constants;
    /**
     * A CustomSettingsPopup that which can be used within the filtering/binding infrastructure.
     * @constructor
     * @class CustomSettingsPopup
     * @namespace flexiciousNmsp
     * @extends UIComponent
     */

    CustomSettingsPopup = function () {
        flexiciousNmsp.UIComponent.apply(this, ["div"]);

        this.cbxColumns = new flexiciousNmsp.MultiSelectComboBox();
        this.cbxColumns.alwaysVisible=true;
        uiUtil.attachClass(this.domElement,"flexiciousGrid");
        this.setWidth(500);
        this.invalidateDisplayList();

    };
    /**
     *
     * @type {Function}
     */
    flexiciousNmsp.CustomSettingsPopup = CustomSettingsPopup; //add to name space
    CustomSettingsPopup.prototype = new flexiciousNmsp.UIComponent(); //setup hierarchy
    CustomSettingsPopup.prototype.typeName = CustomSettingsPopup.typeName = 'CustomSettingsPopup';//for quick inspection
    /**
     *
     * @return {Array}
     */
    CustomSettingsPopup.prototype.getClassNames = function () {
        return ["CustomSettingsPopup", "UIComponent"];
    };
    /**
     *
     * @param val
     */
    CustomSettingsPopup.prototype.setGrid = function (val) {
        this.grid = val;
        var visibleCols = [];
        var cols = this.grid.getSettingsColumns();
        for (var i = 0; i < cols.length; i++) {
            var col = cols[i];
            if (col.getVisible())
                visibleCols.push(col);

        }
        if (cols.length != visibleCols.length){
            this.cbxColumns.selectedValues=uiUtil.extractPropertyValues(visibleCols,"uniqueIdentifier");
        }
        this.cbxColumns.setDataProvider(cols);
        this.cbxColumns.dataField="uniqueIdentifier";
        this.cbxColumns.labelField="headerText";

//        uiUtil.adapter.findElementWithClassName(this.domElement, 'cbxColumns').setDataProvider((cols));
//        uiUtil.adapter.findElementWithClassName(this.domElement, 'cbxColumns').validateNow();
//        if (cols.length != visibleCols.length)
//            uiUtil.adapter.findElementWithClassName(this.domElement, 'cbxColumns').selectedItems = visibleCols;//other wise let it pick ALL by default
        //uiUtil.adapter.findElementWithClassName(this.domElement, 'cbxColumns').invalidateList();
        this._filterVisible = this.grid.getFilterVisible();
        this._footerVisible = this.grid.getFooterVisible();
        this._pageSize = this.grid.getPageSize();
        this._enablePaging = this.grid.getEnablePaging();
        this._enableFilters = this.grid.getEnableFilters();
        this._enableFooters = this.grid.getEnableFooters();

//        var cbFooter=uiUtil.adapter.findElementWithClassName(this.domElement,'cbFooter');
//        var cbFilters=uiUtil.adapter.findElementWithClassName(this.domElement,'cbFilters');
//        if(cbFooter){
//            cbFooter.checked = this._enableFooters && this._footerVisible;
//        }
//        if(cbFooter){
//            cbFooter.checked = this._enableFooters;
//        }
    };
    /**
     *
     * @type {on}
     */
    CustomSettingsPopup.prototype.onOK = function () {

        var collection = this.cbxColumns.selectedValues;
        var cols = this.grid.getSettingsColumns();
        var items = this.grid.getColumns();
        for (var i = 0; i < items.length; i++)
        {
            var col = items[i];
            if (cols.indexOf(col) != -1)
                col.setVisible(collection.indexOf(col.getUniqueIdentifier())>=0 || this.cbxColumns.getIsAllSelected());
        }
        if(this._enableFilters)
            this.grid.setFilterVisible(uiUtil.adapter.findElementWithClassName(this.domElement, 'cbFilters').checked);
        if(this._enableFooters)
            this.grid.setFooterVisible(uiUtil.adapter.findElementWithClassName(this.domElement, 'cbFooter').checked);
        this.grid.validateNow();
        if(this._enablePaging)
            this.grid.setPageSize(parseInt(uiUtil.adapter.findElementWithClassName(this.domElement, 'txtPageSize').value));
        this.grid.refreshLayout();
        uiUtil.removePopUp(this);
    };
    /**
     *
     * @param evt
     */
    CustomSettingsPopup.prototype.onCancel = function (evt) {
        uiUtil.removePopUp(this);
    }
    /**
     * Initializes the auto complete and watermark plugins
     */
    CustomSettingsPopup.prototype.initialize = function () {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);

        var container = new flexiciousNmsp.UIComponent("div");
        container.domElement.className= "settingsPopup";
        this.addChild(container);
        var html = "<div>This is a custom settings popup</div>";

        html += "  <div class='columnsLabel'> "+flxConstants.SETTINGS_COLUMNS_TO_SHOW+"</div> " +
            " <div class='options'>" +
            " <input type='checkbox' "+(this._enableFooters?'':'style="visibility:hidden"')+" class='cbFooter' "+(this._footerVisible?'checked':'')+"/> "
            + " <span "+(this._enableFooters?'':'style="visibility:hidden"')+"> " + flxConstants.SETTINGS_SHOW_FOOTERS+"</span>" +
            " <br/>" +
            " <input type='checkbox' "+(this._enableFilters?'':'style="visibility:hidden"')+" class='cbFilters' "+(this._filterVisible?'checked':'')+"/> "
            + " <span "+(this._enableFilters?'':'style="visibility:hidden"')+"> " + flxConstants.SETTINGS_SHOW_FILTER+"</span>"
            +"<br/><br/>" +
            " <div "+(this._enablePaging?'':'style="visibility:hidden"')+"><span>"+flxConstants.SETTINGS_RECORDS_PER_PAGE+"</span>" +
            " <input class='txtPageSize' type='number' value='" + this._pageSize + "'></div>" +
            "</div>";

        html +="<div class='bottomButtonBar'>"+ " <a  class='BTN_SAVE_PREF button' alt='"+flxConstants.SETTINGS_APPLY+"'>"+flxConstants.SETTINGS_APPLY+"</a>" +
            " <a class='BTN_CANCEL button' alt='"+flxConstants.SETTINGS_CANCEL+"'>"+flxConstants.SETTINGS_CANCEL+"</a>" +
            "</div>";

        container.setInnerHTML(html);

        var saveBtn=uiUtil.adapter.findElementWithClassName(this.domElement,'BTN_SAVE_PREF');
        var cancelBtn=uiUtil.adapter.findElementWithClassName(this.domElement,'BTN_CANCEL');

        flexiciousNmsp.UIUtils.addDomEventListener(this, saveBtn, "click", function (evt){
            uiUtil.adapter.findAncestorByClassName(evt.target || evt.srcElement, 'flexiciousGrid').component.onOK();
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, cancelBtn, "click", function (evt){
            uiUtil.adapter.findAncestorByClassName(evt.target || evt.srcElement, 'flexiciousGrid').component.onCancel();
        });

        container.addChild(this.cbxColumns);
        this.cbxColumns.showPopup(container );
    };
}(window));