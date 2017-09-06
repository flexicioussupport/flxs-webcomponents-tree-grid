 
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
(function (window) {


    /**
     * A control composed of two date fields, start date and end date, and an
     * optional DateComboBox, that allows for easy keyboard entry of date ranges.
     * @class CustomDatePicker
     * @constructor
     * @namespace flexiciousNmsp
     * @extends UIComponent
     */
    var CustomDatePicker = function () {
        flexiciousNmsp.UIComponent.apply(this, ["div"]);
        this.setWidth('100%');
        this.setHeight('100%');
        this.invalidateDisplayList();
        this.startDate = null;
        this.endDate = null;
        this._datePicker = null;
        /**
         * Date format for the custom date range popup
         */
        this.dateFormatString = 'dd-mm-yyyy';

    };
    var p = CustomDatePicker.prototype = new flexiciousNmsp.UIComponent();
    var uiUtil = flexiciousNmsp.UIUtils;
    var flxConstants = flexiciousNmsp.Constants;
    p.getClassNames = function () {
        return ["CustomDatePicker", "UIComponent","IFilterControl","ITextFilterControl","IDelayedChange"];
    };

    CustomDatePicker.prototype.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        var html = '' + 
                    '<div class="input-group input-daterange">' + 
                    '   <input type="text" class="form-control customDatePickerStartDate" style="width:45%" data-date-format="' + this.dateFormatString +'">' +
                    '   <div class="input-group-addon" style="display: inline-block">-</div>' +
                    '   <input type="text" class="form-control customDatePickerEndDate" style="width:45%" data-date-format="' + this.dateFormatString +'">' +
                    '</div>';

        this.setInnerHTML(html);

        var start = new Date();
        var end = new Date();
        
        this.startDate=start;
        this.endDate=end;
        var that=this;

        // uiUtil.adapter.createDateTimePicker(uiUtil.adapter.getElementByClassName(this.domElement, "datePickerStartDateInput"), this.dateFormatString, start);
        // uiUtil.adapter.createDateTimePicker(uiUtil.adapter.getElementByClassName(this.domElement, "datePickerEndDateInput"), this.dateFormatString, end);

        $(uiUtil.adapter.getElementByClassName(this.domElement, "customDatePickerStartDate")).datepicker().on('changeDate', function(e) {
            $(this).datepicker('hide');
            that.startDate = $(this).val();
        });

        $(uiUtil.adapter.getElementByClassName(this.domElement, "customDatePickerEndDate")).datepicker().on('changeDate', function(e) {
            $(this).datepicker('hide');
            that.endDate = $(this).val();
        });

        // this._datePicker = $(_datePickerInput).datepicker().on('changeDate', function(ev) {
            
        // }).data('datepicker');
    }

    CustomDatePicker.prototype.updateDisplayList = function (w, h) {
        flexiciousNmsp.UIComponent.prototype.updateDisplayList.apply(this, [w, h]);
    };
    
    flexiciousNmsp.CustomDatePicker = CustomDatePicker;
}(window));