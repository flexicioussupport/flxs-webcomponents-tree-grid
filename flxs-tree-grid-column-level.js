(function () {

  var template = new flexiciousNmsp.FlexDataGridColumnLevel();
  var gridPropsAndBehaviors = flexiciousNmsp.SettingsParser.getPropertiesAndBehaviors(template);
  var behaviors = gridPropsAndBehaviors.behaviors, properties = gridPropsAndBehaviors.properties;

  Polymer({
    is: 'flxs-tree-grid-column-level',
    properties: properties,
    behaviors: [
      behaviors
    ],
    attached: function () {

      this.gridColumnLevel = this.parentNode.grid ? this.parentNode.grid.getColumnLevel() : new flexiciousNmsp.FlexDataGridColumnLevel();
      this.gridColumnLevel.cellBorderFunction = this._cellBorderFunction;
      this.async(function () {
        for (var key in properties) {
          if (this[key.toLowerCase()]) {
            ((this.parentNode.grid || this.gridColumnLevel.grid)).applyAttribute(this.gridColumnLevel, properties[key].orig, this[key.toLowerCase()], true);
          }
        }

        // if (this.gridColumnLevel._tempCols && this.gridColumnLevel._tempCols.length) {
        //   this.gridColumnLevel.setColumns(this.gridColumnLevel._tempCols);
        // }
      }, 1);

      if (this.parentNode.grid) {

      } else {
        this.parentNode.gridColumnLevel.nextLevel = (this.gridColumnLevel);
      }
    },

    attributeChanged: function () {
      this._onChanged();
    },

    _onChanged: function () {
    },
    
    _cellBorderFunction: function (cell) {
      if (cell.rowInfo.getIsDataRow()) {
        if (cell.rowInfo.rowPositionInfo.levelNestDepth == 1) {
          cell.domElement.style.borderTop = "1px solid #61A6ED";
          cell.domElement.style.fontSize = "14px";
        } else {
          cell.domElement.style.border = "1px solid #3F3F3F";
          cell.domElement.style.fontSize = "13px";
        }
        return false;
      }
      return true;
    }
  });
}());
