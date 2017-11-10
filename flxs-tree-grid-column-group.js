(function () {

  var template = new flexiciousNmsp.FlexDataGridColumnGroup();
  var gridPropsAndBehaviors = flexiciousNmsp.SettingsParser.getPropertiesAndBehaviors(template);
  var behaviors = gridPropsAndBehaviors.behaviors, properties = gridPropsAndBehaviors.properties;

  Polymer({
    is: 'flxs-tree-grid-column-group',
    properties: properties,
    behaviors: [
      behaviors
    ],
    parseColumnGroup: function (cg, grid) {
      for (var key in properties) {
        if (this[key.toLowerCase()]) {
          grid.applyAttribute(cg, properties[key].orig, this[key.toLowerCase()], true);
        }
      }
    },
    attributeChanged: function () {
      this._onChanged();
    },

    _onChanged: function () {
    }
  });
}());
