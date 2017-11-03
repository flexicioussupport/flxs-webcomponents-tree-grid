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
    created: function () {
      flexiciousNmsp.SettingsParser.log("level created")
    },
    ready: function () {
      flexiciousNmsp.SettingsParser.log("level ready")
    },
    parseLevel: function (gridColumnLevel, grid) {
      for (var key in properties) {
        if (this[key.toLowerCase()]) {
          grid.applyAttribute(gridColumnLevel, properties[key].orig, this[key.toLowerCase()], true);
        }
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
