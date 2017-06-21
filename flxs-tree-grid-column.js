(function () {
  //SlotItemRenderer
  /**
   * A SlotItemRenderer is a custom item renderer, that defines how to use custom cells with logic that you can 
   * embed in slot of the column
   * @constructor
   * @namespace com.flexicious.controls
   * @extends UIComponent
   */
  var SlotItemRenderer = function (template) {
    //make sure to call constructor
    flexiciousNmsp.UIComponent.apply(this, ["div"]);//second parameter is the tag name for the dom element.
    /**
     * This is a getter/setter for the data property. When the cell is created, it belongs to a row
     * The data property points to the item in the grids dataprovider that is being rendered by this cell.
     * @type {*}
     */
    this.data = null;
    //we can use innerHTML in the constructor - this makes subsequent setData calls not recreate the dom tree.
    this.setDomElement(template.cloneNode(true));
  };
  flexiciousNmsp.SlotItemRenderer = SlotItemRenderer; //add to name space
  SlotItemRenderer.prototype = new flexiciousNmsp.UIComponent(); //setup hierarchy
  SlotItemRenderer.prototype.typeName = SlotItemRenderer.typeName = 'SlotItemRenderer';//for quick inspection
  SlotItemRenderer.prototype.getClassNames = function () {
    return ["SlotItemRenderer", "UIComponent"]; //this is a mechanism to replicate the "is" and "as" keywords of most other OO programming languages
  };

  //This sets  the inner html, and grid will try to set it. Since we are an input field, IE 8 will complain. So we ignore it since we dont need it anyway.
  SlotItemRenderer.prototype.setText = function (val) {

  };

  /**
   * can be removed once upgrade to latest library
   **/
  flexiciousNmsp.FlexDataGrid.prototype.addEventListener = function (type, listener, useCapture, priority, useWeakReference) {

    flexiciousNmsp.NdgBase.prototype.addEventListener.apply(this, [type, listener, useCapture, priority, useWeakReference]);
    if (listener == flexiciousNmsp.FlexDataGridEvent.CELL_RENDERED) {
      this.dispatchCellRenderered = true;
    } else if (listener == flexiciousNmsp.FlexDataGridEvent.RENDERER_INITIALIZED) {
      this.dispatchRendererInitialized = true;
    } else if (listener == flexiciousNmsp.FlexDataGridEvent.CELL_CREATED) {
      this.dispatchCellCreated = true;
    }
  };
  //End SlotItemRenderer

  var template = new flexiciousNmsp.FlexDataGridColumn();
  var gridPropsAndBehaviors = flexiciousNmsp.SettingsParser.getPropertiesAndBehaviors(template);
  var behaviors = gridPropsAndBehaviors.behaviors, properties = gridPropsAndBehaviors.properties;

  Polymer({
    is: 'flxs-tree-grid-column',
    properties: properties,
    behaviors: [
      behaviors
    ],
    attached: function () {

      this.gridColumn = this.getAttribute("type") == "checkbox" ? new flexiciousNmsp.FlexDataGridCheckBoxColumn() : new flexiciousNmsp.FlexDataGridColumn();
      if (this.firstChild) {
        var node = this.firstChild;
        var realNode = null;
        while (node) {
          if (node.nodeName != "#text") {
            realNode = node;
          }
          node = node.nextSibling;
        }
        if (realNode) {
          this.gridColumn.itemRenderer = (new flexiciousNmsp.ClassFactory(SlotItemRenderer, realNode, true));
        }
      }
      if (this.parentNode.gridColumnGroup) {
        if (!this.parentNode.gridColumnGroup._tempCols) {
          this.parentNode.gridColumnGroup._tempCols = [];
        }
        this.parentNode.gridColumnGroup._tempCols.push(this.gridColumn);
        this.parentNode.gridColumnGroup.setGroupedColumns(this.parentNode.gridColumnGroup._tempCols);
      } else {
        var lvl = (this.parentNode.grid) ? (this.parentNode.grid.getColumnLevel()) : this.parentNode.gridColumnLevel;
        if (!lvl._tempCols) {
          lvl._tempCols = [];
        }
        lvl._tempCols.push(this.gridColumn);
      }


      this.async(function () {
        var gridNode = this.parentNode;
        var grid = null;
        while (gridNode) {
          if (gridNode.grid) {
            grid = gridNode.grid;
            break;
          }
          gridNode = gridNode.parentNode;
        }
        for (var key in properties) {
          if (this[key.toLowerCase()]) {
            grid.applyAttribute(this.gridColumn, properties[key].orig, this[key.toLowerCase()], true);
          }
        }
      }, 1);
    },

    attributeChanged: function () {
      this._onChanged();
    },

    _onChanged: function () {
    }
  });
}());
