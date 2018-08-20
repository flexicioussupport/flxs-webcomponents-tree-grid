(function (window) {
    var TextFilter, uiUtil = flexiciousNmsp.UIUtils, flxConstants = flexiciousNmsp.Constants;
    /**
    * A TextFilter is a custom item renderer, that defines how to use custom cells with logic that you can control
    * @constructor
    * @namespace com.flexicious.controls
    * @extends UIComponent
    */
    TextFilter = function () {

        //make sure to call constructor
        flexiciousNmsp.UIComponent.apply(this);//we extend from the built in flexicious combobox, which gives us a bunch of properties (like selected value etc)
        /**
        * This is a getter/setter for the data property. When the cell is created, it belongs to a row
        * The data property points to the item in the grids dataprovider that is being rendered by this cell.
        * @type {*}
        */
        this.data = null;

        this.searchData = null;
        this.domElement.innerHTML = '<div contenteditable style="width: 100%; height: 100%; background: #ffffff; padding: 2px 5px"></div>';
        this.domElement.firstChild.addEventListener('keyup', this.onChangeHandler.bind(this));
    };

    flexiciousNmsp.TextFilter = TextFilter; //add to name space
    TextFilter.prototype = new flexiciousNmsp.UIComponent(); //setup hierarchy
    TextFilter.prototype.typeName = TextFilter.typeName = 'TextFilter';//for quick inspection
    TextFilter.prototype.getClassNames = function () {
        return ["TextFilter", "ICustomMatchFilterControl", "IFilterControl", "UIComponent"]; //this is a mechanism to replicate the "is" and "as" keywords of most other OO programming languages
    };

    TextFilter.prototype.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);

    }

    TextFilter.prototype.onChangeHandler = function(e) {
        this.setValue(e.target.textContent);
        this.dispatchEvent(new flexiciousNmsp.BaseEvent(flxConstants.EVENT_CHANGE));
        this.dispatchEvent(new flexiciousNmsp.BaseEvent(flxConstants.EVENT_VALUE_COMMIT));
    };

    /* ==================ICustomMatchFilterControl Methods===================== */

    TextFilter.prototype.isMatch = function(item) {
        let dataField = this.parent.getColumn().getDataField();
        let value = uiUtil.resolveExpression(item, dataField);
        return value === null || (value !== null && value.indexOf(this.searchData) !== -1); 
    };

    /* ==================IFilterControl Methods========================== */

    /**
     * Generic function that clear values of IFilterControl
     */
    TextFilter.prototype.clear = function () {
        this.setValue("")
    };
    /**
     * Generic function that returns the value of a IFilterControl
     */
    TextFilter.prototype.getValue = function () {
        return this.searchData;
    };

    /**
     * Generic function that sets the value of a IFilterControl
     * @param val
     */
    TextFilter.prototype.setValue = function (val) {
        this.searchData = val;
    }

})(window);
