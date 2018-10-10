(function(window) {
    "use strict";
    var CustomMSCB, uiUtil = flexiciousNmsp.UIUtils, flxConstants = flexiciousNmsp.Constants;
    /**
    * A MultiSelectComboBoxRenderer is a custom item renderer, that defines how to use custom cells with logic that you can control
    * @constructor
    * @namespace flexiciousNmsp
    * @extends MultiSelectComboBox
    */
    CustomMSCB=function(){
        //make sure to call constructor
        flexiciousNmsp.MultiSelectComboBox.apply(this);//second parameter is the tag name for the dom element.

        this.blankValuesData = '_none_';
    };

    flexiciousNmsp.CustomMSCB = CustomMSCB; //add to name space
    CustomMSCB.prototype = new flexiciousNmsp.MultiSelectComboBox(); //setup hierarchy
    CustomMSCB.prototype.typeName = CustomMSCB.typeName = 'CustomMSCB';//for quick inspection
    /**
     * this is a mechanism to replicate the "is" and "as" keywords of most other OO programming languages.
     */
    CustomMSCB.prototype.getClassNames=function(){
        //we need to implement ICustomMatchFilterControl because we want to tell the grid to call our isMatch method to do the filter
        //we need to implement IFilterControl to tell the grid that we are actually a filter control, and not a placeholder for non-filterable columns
        return ["CustomMSCB","MultiSelectComboBox", "UIComponent", "IFilterControl", "IMultiSelectFilterControl", "ISelectFilterControl", "ICustomMatchFilterControl"];
    };

    CustomMSCB.prototype.initialize = function () {
        flexiciousNmsp.TextInput.prototype.initialize.apply(this);
        if(this.grid) {
            this.grid.addEventListener(this, flexiciousNmsp.FlexDataGrid.EVENT_FILTERPAGESORTCHANGE, this.onFilterPageSortChange);
        }
        this.getTextBox().readOnly = true;
        if (!this.getHeight()) {
            this.setActualSize(this.defaultWidth, flxConstants.DEFAULT_MSCB_HEIGHT);//defaults
        }
        this.setLabel();
        
    };

    CustomMSCB.prototype.setDataProvider = function(items) {
        // maniplate before call super.setDataProvider
        if(items && items.length>0 && items[0].hasOwnProperty('selected')) {
            flexiciousNmsp.MultiSelectComboBox.prototype.setDataProvider.apply(this, [items]);
            return;
        }
        var col = this.parent.getColumn();
        var val, 
            letters = [],
            letterItems = [];
        items.forEach(function(item) {
            val = item.data || '';
            if(!val) {
                letterItems.push({ label: col.blankValuesLabel, data: this.blankValuesData });
            }
            for(var i=0;i<val.length;i++) {
                var ch = val.charAt(i);
                if(letters.indexOf(ch) === -1) {
                    letters.push(ch);
                    letterItems.push({ label: !ch?col.blankValuesLabel:ch, data: ch });
                }
            }
        }, this);
        uiUtil.sortOn(letterItems,"label");

        flexiciousNmsp.MultiSelectComboBox.prototype.setDataProvider.apply(this, [letterItems]);
    }
    
    CustomMSCB.prototype.onFilterPageSortChange = function (evt) {
        if (evt.cause === "filterChange") {
            var triggerEvent = evt.triggerEvent.triggerEvent;
            if(!triggerEvent || triggerEvent.target !== this) {
                var flatValues = this.grid.getFilteredPagedSortedData({}, true);
                var collection = this.gridColumn.getDistinctValues(flatValues);
                this.setDataProvider(collection);

                for (var i = 0; i < this.selectedValues.length; i++) {
                    var found = false;
                    for (var k = 0; k < collection.length; k++) {
                        if (this.selectedValues[i] === collection[k][this.dataField]) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        this.selectedValues.splice(i--, 1);
                    }
                }
                this.invalidateDisplayList();
            }
        }
    }

    CustomMSCB.prototype.isMatch=function(o, exp){
        let val, 
            expr = exp.expression,
            column = this.parent.getColumn();

        if(o && o.hasOwnProperty(column.dataField) && expr.length > 0) {
            val = o[column.dataField] || '';
            for(let i=0;i<expr.length;i++) {
                var ex = expr[i] === this.blankValuesData ? '' : expr[i];
                if((!val && !ex) || (val && ex && (val.indexOf(ex) !==-1 || ex.indexOf(val) !== -1))) {
                    return true;
                }
            }
            return false;
        }
        return true;
    };

    CustomMSCB.prototype.kill = function() {
        this.grid.removeEventListener(flexiciousNmsp.FlexDataGrid.EVENT_FILTERPAGESORTCHANGE, this.onFilterPageSortChange);
        flexiciousNmsp.MultiSelectComboBox.prototype.kill.apply(this);
    }

  }(window));
