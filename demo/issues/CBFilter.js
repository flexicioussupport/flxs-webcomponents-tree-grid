(function (window) {
    var CBFilter, uiUtil = flexiciousNmsp.UIUtils, flxConstants = flexiciousNmsp.Constants;
    /**
    * A CBFilter is a custom item renderer, that defines how to use custom cells with logic that you can control
    * @constructor
    * @namespace com.flexicious.controls
    * @extends UIComponent
    */
    CBFilter = function () {

        //make sure to call constructor
        flexiciousNmsp.ComboBox.apply(this);//we extend from the built in flexicious combobox, which gives us a bunch of properties (like selected value etc)
        /**
        * This is a getter/setter for the data property. When the cell is created, it belongs to a row
        * The data property points to the item in the grids dataprovider that is being rendered by this cell.
        * @type {*}
        */
        this.data = null;
    };

    flexiciousNmsp.CBFilter = CBFilter; //add to name space
    CBFilter.prototype = new flexiciousNmsp.ComboBox(); //setup hierarchy
    CBFilter.prototype.typeName = CBFilter.typeName = 'CBFilter';//for quick inspection
    CBFilter.prototype.getClassNames = function () {
        return ["CBFilter", "IFilterControl","ISingleSelectFilterControl","ISelectFilterControl", "UIComponent"]; //this is a mechanism to replicate the "is" and "as" keywords of most other OO programming languages
    };

    CBFilter.prototype.initialize = function () {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        var that = this;
        setTimeout(function() {
            that.setDataProvider(that.getItems());
        }, this, 1000);
    };

    CBFilter.prototype.getItems = function () {
        var cell = this.parent;
        var items = [];
        if(cell) {
            var dataProvider = cell.level.grid.getDataProvider(),
                col = cell.getColumn();

            [].forEach.call(col.getDistinctValues(dataProvider), function (data) {
                items.push(data);
            });
        }

        return items;
    }

})(window);
