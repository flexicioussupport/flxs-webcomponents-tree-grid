(window => {
if (!flexiciousNmsp) flexiciousNmsp = {};
flexiciousNmsp.FlxsTreeGridEditor = class FlxsTreeGridEditor extends flexiciousNmsp.UIComponent {
  constructor(element) {
    super("div");
    this._cln = element;
    this._cln.flxsTreeGridEditor = this;
    this._cln.style.display = 'inline-block';
    this.domElement.appendChild(this._cln);
    this.data = null;
  }
  getClassNames() {
    return ['FlxsTreeGridEditor', 'UIComponent'];
  }
  destroy() {
    super.destroy();
  }
  getSelect() {
    return this._cln;
  }
  setValue(e) {
    this._cln._setValue(e);
  }
  getValue() {
    return this._cln._getValue();
  }

  set grid(grid) {
    this._cln.grid = grid;
    this._cln._setCell(grid.getCurrentEditCell());
  }

  get grid() {
    return this._cln.grid;
  }
  initialize() {
    super.initialize();
    this._cln._initialize();
  }
  setText(val) {
    super.setText(val);
  }
  setWidth(w) {
    super.setWidth(w);
  }
  setData(val) {
    super.setData(val);
  }
  focus() {
    this._cln._onFocus();
  }
  kill() {
    super.kill();
  }
};
})(window);
