(window => {
if (!flexiciousNmsp) flexiciousNmsp = {};
flexiciousNmsp.FlxsTreeGridEditor = class FlxsTreeGridEditor extends flexiciousNmsp.UIComponent {
  constructor(element){
    super("div");
    element.flxsTreeGridEditor = this;
    element.isEscapePressed = false;
    this._element = element;
    this.data = null;
    this.domElement.appendChild(element);
    this._grid = undefined;
  }
  getClassNames() {
    return ['FlxsTreeGridEditor', 'UIComponent'];
  }
  destroy(){
    super.destroy();
  }
  getSelect(){
    return this._element;
  }
  setValue(e) {
    this._element._setValue(e);
  }
  getValue(){
    return this._element._getValue();
  }

  set grid(grid){
    this._grid = grid;
    this._element.grid = grid;
  }

  get grid(){
    return this._grid;
  }
  initialize() {
    super.initialize();
    this._element._initialize();
  }
  setText(val) {
    super.setText(val);
  }
  setWidth(w){
    super.setWidth(w);
  }
  setData(val){
    super.setData(val);
  }
  focus(){
    this._element._onFocus();
  }
  kill(){
    super.kill();
  }
};
})(window);
