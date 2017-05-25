/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
(function(window)
{
    "use strict";
    var CustomSaveSettingsPopup, uiUtil = flexiciousNmsp.UIUtils, flxConstants = flexiciousNmsp.Constants;
    /**
     * A CustomSaveSettingsPopup that which can be used within the filtering/binding infrastructure.
     * @constructor
     * @class CustomSaveSettingsPopup
     * @namespace flexiciousNmsp
     * @extends UIComponent
     */
    CustomSaveSettingsPopup=function(){
        flexiciousNmsp.UIComponent.apply(this,["div"]);
        uiUtil.attachClass(this.domElement,"flexiciousGrid")
        this.setWidth(600);
        this.setHeight(120);
    };

    
    /**
     *
     * @type {Function}
     */
    flexiciousNmsp.CustomSaveSettingsPopup = CustomSaveSettingsPopup; //add to name space
    CustomSaveSettingsPopup.prototype = new flexiciousNmsp.UIComponent(); //setup hierarchy
    CustomSaveSettingsPopup.prototype.typeName = CustomSaveSettingsPopup.typeName = 'CustomSaveSettingsPopup';//for quick inspection
    /**
     *
     * @return {Array}
     */
    CustomSaveSettingsPopup.prototype.getClassNames=function(){
        return ["CustomSaveSettingsPopup","UIComponent"];
    };

    CustomSaveSettingsPopup.prototype.setGrid=function (val){
        this.grid=val;
        this.preferencesSet=this.grid.preferencesSet;
        this.filtersEnabled=this.grid.getEnableFilters();
        this.preferenceName = this.grid.getCurrentPreferenceInfo()?grid.getCurrentPreferenceInfo().name:'Default';
        this.preferenceIsDefault = this.grid.getCurrentPreferenceInfo()?(grid.getCurrentPreferenceInfo().name==grid.getGridPreferencesInfo().defaultPreferenceName):'Default';

    };

    CustomSaveSettingsPopup.prototype.onClearSettings=function (evt){
        this.grid.clearPreferences();
        uiUtil.showMessage("Preferences Cleared!");
        uiUtil.removePopUp(this);

    };
    CustomSaveSettingsPopup.prototype.onCancel=function (evt){
        uiUtil.removePopUp(this);
    };

    CustomSaveSettingsPopup.prototype.onSaveSettings=function (){

        var preferencesToPersist= [];
        if(uiUtil.adapter.findElementWithClassName(this.domElement,'cbPERSIST_COLUMN_ORDER').checked)
            preferencesToPersist.push(flxConstants.PERSIST_COLUMN_ORDER);
        if(uiUtil.adapter.findElementWithClassName(this.domElement,'cbPERSIST_COLUMN_VISIBILITY').checked)
            preferencesToPersist.push(flxConstants.PERSIST_COLUMN_VISIBILITY);
        if(uiUtil.adapter.findElementWithClassName(this.domElement,'cbPERSIST_COLUMN_WIDTH').checked)
            preferencesToPersist.push(flxConstants.PERSIST_COLUMN_WIDTH);
        if(uiUtil.adapter.findElementWithClassName(this.domElement,'cbPERSIST_FILTER').checked)
            preferencesToPersist.push(flxConstants.PERSIST_FILTER);
        if(uiUtil.adapter.findElementWithClassName(this.domElement,'cbPERSIST_SORT').checked)
            preferencesToPersist.push(flxConstants.PERSIST_SORT);
        if(uiUtil.adapter.findElementWithClassName(this.domElement,'cbPERSIST_FOOTER_FILTER_VISIBILITY').checked)
            preferencesToPersist.push(flxConstants.PERSIST_FOOTER_FILTER_VISIBILITY);
        if(uiUtil.adapter.findElementWithClassName(this.domElement,'cbPERSIST_PAGE_SIZE').checked)
            preferencesToPersist.push(flxConstants.PERSIST_PAGE_SIZE);
        if(uiUtil.adapter.findElementWithClassName(this.domElement,'cbPERSIST_PRINT_SETTINGS').checked)
            preferencesToPersist.push(flxConstants.PERSIST_PRINT_SETTINGS);

        if(uiUtil.adapter.findElementWithClassName(this.domElement,'cbPERSIST_SCROLL').checked){
            preferencesToPersist.push(flxConstants.PERSIST_VERTICAL_SCROLL);
            preferencesToPersist.push(flxConstants.PERSIST_HORIZONTAL_SCROLL);
        }
        this.grid.preferencesToPersist = preferencesToPersist.join(",");
        if(this.grid.enableMultiplePreferences)
            this.grid.persistPreferences(uiUtil.adapter.findElementWithClassName(this.domElement,'txtPreferenceName').value,
            uiUtil.adapter.findElementWithClassName(this.domElement,'cbDefaultPreference').checked);
        else
            this.grid.persistPreferences();
        if(this.grid.preferencePersistenceMode!="server")
            uiUtil.showMessage("Preferences Saved!");
        uiUtil.removePopUp(this);


    };
    /**
     * Initializes the auto complete and watermark plugins
     */
    CustomSaveSettingsPopup.prototype.initialize=function(){
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        var html = "<div>This is a custom save settings popup</div>";
        html += "<div>"+flxConstants.SAVE_SETTINGS_TITLE+"</div>";
        if(this.grid.enableMultiplePreferences ){
            html += "<div style='float:left;'><span>"+flxConstants.SAVE_SETTINGS_PREFERENCE_NAME+"</span>" +
                "<input class='txtPreferenceName' value='"+this.preferenceName+"'>" +
                "<input class='cbDefaultPreference' type='checkbox' "+(this.preferenceIsDefault?'checked':'')+"> Is Default?</div><div style='clear:both;'/>";
        }
        html+= "<table border='0' style='width: 550px'> <tr><td>" +
            "   <div style='display: inline-block;'><input type='checkbox' class='cbPERSIST_COLUMN_ORDER' checked> "+flxConstants.SAVE_SETTINGS_ORDER_OF_COLUMNS+" <br/>"  +
            "   <input type='checkbox' class='cbPERSIST_COLUMN_VISIBILITY' checked> "+flxConstants.SAVE_SETTINGS_VISIBILITY_OF_COLUMNS +"<br/>" +
            "   <input type='checkbox' class='cbPERSIST_COLUMN_WIDTH' checked> "+flxConstants.SAVE_SETTINGS_WIDTHS_OF_COLUMNS +"</div>" +
            "   </td><td><div style='display: inline-block;'><input type='checkbox' class='cbPERSIST_FILTER' checked> "+flxConstants.SAVE_SETTINGS_FILTER_CRITERIA +"<br/>" +
            "   <input type='checkbox' class='cbPERSIST_SORT' checked> "+flxConstants.SAVE_SETTINGS_SORT_SETTINGS +"<br/>" +
            "   <input type='checkbox' class='cbPERSIST_SCROLL' checked> "+flxConstants.SAVE_SETTINGS_SCROLL_POSITIONS +"</div>" +
            "   </td><td><div style='display: inline-block;'><input type='checkbox' class='cbPERSIST_FOOTER_FILTER_VISIBILITY' checked> "+flxConstants.SAVE_SETTINGS_FILTER_AND_FOOTER_VISIBILITY +"<br/>" +
            "   <input type='checkbox' class='cbPERSIST_PAGE_SIZE' checked> "+flxConstants.SAVE_SETTINGS_RECORDS_PER_PAGE +"<br/>" +
            "   <input type='checkbox' class='cbPERSIST_PRINT_SETTINGS' checked> "+flxConstants.SAVE_SETTINGS_PRINT_SETTINGS +"</div>" +
            "   </td></tr></table>" +
            "</div>";

        html +="<div class='bottomButtonBar'>" + " <a  class='BTN_REMOVE_PREFS button' alt='" +
            (this.grid.enableMultiplePreferences?flxConstants.SAVE_SETTINGS_REMOVE_ALL_SAVED_PREFERENCES:flxConstants.SAVE_SETTINGS_CLEAR_SAVED_PREFERENCES)+"'>"+
            (this.grid.enableMultiplePreferences?flxConstants.SAVE_SETTINGS_REMOVE_ALL_SAVED_PREFERENCES:flxConstants.SAVE_SETTINGS_CLEAR_SAVED_PREFERENCES)+"</a>" +
            " <a  class='BTN_SAVE_PREF button' alt='"+flxConstants.SAVE_SETTINGS_SAVE_PREFERENCES+"'> "+flxConstants.SAVE_SETTINGS_SAVE_PREFERENCES +"</a>" +
            " <a class='BTN_CANCEL button' alt='"+flxConstants.SAVE_SETTINGS_CANCEL+"'>"+flxConstants.SAVE_SETTINGS_CANCEL+"</a>" +
            "</div>";

        this.setInnerHTML(html);

        var removeBtn=uiUtil.adapter.findElementWithClassName(this.domElement,'BTN_REMOVE_PREFS');
        var saveBtn=uiUtil.adapter.findElementWithClassName(this.domElement,'BTN_SAVE_PREF');
        var cancelBtn=uiUtil.adapter.findElementWithClassName(this.domElement,'BTN_CANCEL');

        flexiciousNmsp.UIUtils.addDomEventListener(this, removeBtn, "click", function (evt){
            uiUtil.adapter.findAncestorByClassName(evt.target || evt.srcElement, 'flexiciousGrid').component.onClearSettings();
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, saveBtn, "click", function (evt){
            uiUtil.adapter.findAncestorByClassName(evt.target || evt.srcElement, 'flexiciousGrid').component.onSaveSettings();
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, cancelBtn, "click", function (evt){
            uiUtil.adapter.findAncestorByClassName(evt.target || evt.srcElement, 'flexiciousGrid').component.onCancel();
        });
    };
}(window));