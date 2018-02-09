(function () {

    var uiUtil = flexiciousNmsp.UIUtils;
    var flxConstants = flexiciousNmsp.Constants;

    var oldSortIconPlacementFunction = flexiciousNmsp.FlexDataGridHeaderCell.prototype.placeSortIcon;
    flexiciousNmsp.FlexDataGridHeaderCell.prototype.placeSortIcon = function () {
        oldSortIconPlacementFunction.apply(this);
        if (this.level && this.level && this.level.grid && this.level.grid.sortIconPlacementFunction) {
            this.level.grid.sortIconPlacementFunction(this);
        }
    };
    var applyJustifyFromTextAlign = function (domElement) {
        if (domElement.style.textAlign == "right") {
            domElement.style.justifyContent = "flex-end"
        } else if (domElement.style.textAlign == "center") {
            domElement.style.justifyContent = "center"
        } else {
            domElement.style.justifyContent = "";
        }
    }
    //because we made cell display to flex to vertically center align the items, the stock textAlign no longer works.
    //we need to use justify-content
    var stockDataCellRefresh = flexiciousNmsp.FlexDataGridDataCell.prototype.refreshCell;
    flexiciousNmsp.FlexDataGridDataCell.prototype.refreshCell = function () {
        stockDataCellRefresh.apply(this);
        if (this._renderer && this._renderer.domElement) {
            applyJustifyFromTextAlign(this._renderer.domElement);
        }
    }

    //for MSCB - so it uses the template document to insert itself - and not the main window document
    //and lets add some positioning code because the older code assumes that the parent is the top level
    //document, but in our case, we are the document fragment, which could mean we are placed 
    //anywhere within the overall document.
    var oldMSCBShowDialog = flexiciousNmsp.MultiSelectComboBox.prototype.showPopup;
    flexiciousNmsp.MultiSelectComboBox.prototype.showPopup = function (parent) {
        var documentComponent = new flexiciousNmsp.UIComponent();
        documentComponent.setDomElement(this.grid ? this.grid.domElement : parent.domElement);
        oldMSCBShowDialog.apply(this, [parent || documentComponent]);
        var pt = new flexiciousNmsp.Point(0, 0);
        pt = this.localToGlobal(pt);
        var pt1 = new flexiciousNmsp.Point(0, 0);
        pt1 = documentComponent.localToGlobal(pt1);
        this.popup.move(pt.x - pt1.x, pt.y - pt1.y + this.getHeight());
    };
    flexiciousNmsp.MultiSelectComboBox.prototype.onDocumentMouseUp = function (e) {
        if (e.triggerEvent.path && this.popup && (e.triggerEvent.path.indexOf(this.popup.domElement) >= 0)) {

        }
        else if (this.owns(e.triggerEvent.target)) {

        } else {
            this.restoreStateAndDestroyPopup();
        }
    };
    flexiciousNmsp.SpinnerBehavior.prototype.showSpinner = function (msg) {
        if (typeof msg == "undefined") msg = '';


        var elsToBlur = this.ownerComponent.getElementsToBlur();

        for (var i = 0; i < elsToBlur.length; i++) {
            var child = elsToBlur[i];
            uiUtil.attachClass(child.domElement || child, 'lessOpacity');
        }

        var rad = this.ownerComponent.getStyle("spinnerRadius") || 10;
        var spinnerColors = this.ownerComponent.getStyle("spinnerColors") || '#000';



        if (msg == '')
            msg = this.ownerComponent.spinnerLabel;

        var opts = {
            lines: 13, // The number of lines to draw
            length: 7, // The length of each line
            width: 4, // The line thickness
            radius: rad, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            color: spinnerColors, // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'inherit !important', // Top position relative to parent in px
            left: 'inherit !important' // Left position relative to parent in px
        };
        if (!this.spinner) {
            this.ownerComponent.spinnerFactory.properties = opts;
            this.spinner = this.ownerComponent.spinnerFactory.newInstance();
            this.spinner.grid = this.ownerComponent;
        }
        this.spinner.spin(this.ownerComponent.domElement);
        if (msg) {

            this.ownerComponent.addChild(this.label);
            this.label.setText(msg);
            //uiUtil.positionComponent(this.spinner.el||this.spinner.domElement,this.label,"center top","center bottom",0,30);
        }

        this.spinnerVisible = true;
    };
    flexiciousNmsp.SpinnerBehavior.prototype.showMessage = function (msg) {
        if (this.spinner)
            this.spinner.stop();
        if (this.label.parent) {
            uiUtil.removeChild(this.ownerComponent, this.label);
        }
        this.ownerComponent.addChild(this.label);
        this.label.setText(msg);
        //uiUtil.positionComponent(this.ownerComponent,this.label,"center center","center center",0,30);
    };

    /**
     * Check for changes to the div that holds us. HTML does not have a resize event, so we have to periodically inspect
     * the dom element to see if there were any changes to the container size.
     * @method checkResize
     */

    flexiciousNmsp.FlexDataGrid.prototype.checkResize = function () {
        if (this.getBodyContainer()._inEdit)
            return;

        if (!this.domElement) {
            this.resizeTimer.kill();
        }
        if ((this.domElement.offsetWidth != this.placedWidth) && (this.domElement.offsetWidth > 0)) {
            this.invalidateWidth();
        }
        //this means we are percent based.
        if ((this.domElement.offsetHeight != this.placedHeight) && (this.domElement.offsetHeight > 0)) {
            this.invalidateHeight();
        }
    };

    //both localToGlobal and globalToLocal are causing problems because polymer shadow dom means document is something else
    //that is why we have to use boundingClientRect instead of the default document offset code.
    flexiciousNmsp.UIComponent.prototype.globalToLocal = function (ptIn) {
        var offset = uiUtil.adapter.offset(this.domElement);
        if (offset && offset.top == 0 && offset.left == 0) {
            var rect = this.domElement.getBoundingClientRect();
            offset = rect;
        }
        return new flexiciousNmsp.Point(ptIn.x - (offset ? offset.left : 0) + this.domElement.scrollLeft, ptIn.y - (offset ? offset.top : 0) + this.domElement.scrollTop);
    };
    flexiciousNmsp.UIComponent.prototype.localToGlobal = function (ptIn) {
        var offset = uiUtil.adapter.offset(this.domElement);
        if (offset && offset.top == 0 && offset.left == 0) {
            var rect = this.domElement.getBoundingClientRect();
            offset = rect;
        }
        return new flexiciousNmsp.Point(offset.left + ptIn.x, offset.top + ptIn.y);
    };


    flexiciousNmsp.JQueryAdapter.prototype.showDialog = function (a, f, b, d, g, l, h) {
        $(a).dialog({
            appendTo: f.domElement,
            modal: b,
            minHeight: g + 50,
            minWidth: d,
            zIndex: 700,
            title: l,
            position: {
                my: "top",
                at: "top",
                of: f.domElement,
                collision: "none"
            },
            close: function () {
                $(this).remove();
                if (h && h.context && h.method)
                    h.context[h.method]()
            }
        })
    }
    

    

    

    var template = new flexiciousNmsp.FlexDataGrid();
    var gridPropsAndBehaviors = flexiciousNmsp.SettingsParser.getPropertiesAndBehaviors(template);
    var behaviors = gridPropsAndBehaviors.behaviors, properties = gridPropsAndBehaviors.properties;
    properties["dataprovider"].observer = "_onDataProviderChanged";
    var allStyles = [

        /**
         *  Bounding box sides.
         *  A space-delimited String that specifies the sides of the border to show.
         *  The String can contain <code>"left"</code>, <code>"top"</code>,
         *  <code>"right"</code>, and <code>"bottom"</code> in any order.
         *  The default value is <code>"left top right bottom"</code>,
         *  which shows all four sides.
         *
         */
        "border-sides",
        /**
         *  The width of  the numeric value representing the order of the column sort.
         *  @default 10
         *
         * [Style(name="multiColumnSortNumberWidth", type="Number", inherit="no")]
         * @type {Number}
         * @property multiColumnSortNumberWidth
         * @default null
         */

        "multi-column-sort-number-width",
        /**
         *  The height of  the numeric value representing the order of the column sort.
         *  @default 15
         *
         * [Style(name="multiColumnSortNumberHeight", type="Number", inherit="no")]
         * @type {Number}
         * @property multiColumnSortNumberHeight
         * @default null
         */

        "multi-column-sort-number-height",
        /**
         *  The name of a CSS style declaration for controlling other aspects of
         *  the appearance of the numeric value representing the order of the column sort.
         *  @default "multiColumnSortNumberStyle"
         *
         * [Style(name="multiColumnSortNumberStyleName", type="String", inherit="no")]
         * @type {String}
         * @property multiColumnSortNumberStyleName
         * @default null
         */

        "multi-column-sort-number-style-name",
        /**
         *  The name of a CSS style declaration for controlling other aspects of
         *  the appearance of the column groups.
         *  @default "columnGroupStyle"
         *
         * [Style(name="columnGroupStyleName", type="String", inherit="no")]
         * @type {String}
         * @property columnGroupStyleName
         * @default null
         */

        "column-group-style-name",
        /**
         *  The name of a CSS style declaration for controlling other aspects of
         *  the appearance of the column headers.
         *  @default "dataGridStyles"
         *
         * [Style(name="headerStyleName", type="String", inherit="no")]
         * @type {String}
         * @property headerStyleName
         * @default null
         */

        "header-style-name",
        /**
         *  The name of a CSS style declaration for controlling other aspects of
         *  the appearance of the pager bar(toolbar).
         *
         * [Style(name="pagerStyleName", type="String", inherit="no")]
         * @type {String}
         * @property pagerStyleName
         * @default null
         */
        "pager-style-name",
        /**
         *  The name of a CSS style declaration for controlling other aspects of
         *  the appearance of the column headers.
         *  @default "dataGridStyles"
         * [Style(name="footerStyleName", type="String", inherit="no")]
         * @type {String}
         * @property footerStyleName
         * @default null
         */

        "footer-style-name",
        /**
         *  Flag that indicates whether to show vertical grid lines between
         *  the columns.
         *  If <code>true</code>, shows vertical grid lines.
         *  If <code>false</code>, hides vertical grid lines.
         *  @default true
         * [Style(name="verticalGridLines", type="Boolean", inherit="no")]
         * @type {Boolean}
         * @property verticalGridLines
         * @default null
         */

        "vertical-grid-lines",
        /**
         *  Flag that indicates whether to show horizontal grid lines between
         *  the rows.
         *  If <code>true</code>, shows horizontal grid lines.
         *  If <code>false</code>, hides horizontal grid lines.
         *  @default false
         * [Style(name="horizontalGridLines", type="Boolean", inherit="no")]
         * @type {Boolean}
         * @property horizontalGridLines
         * @default null
         */

        "horizontal-grid-lines",
        /**
         *  The color of the vertical grid lines.
         *  @default 0x666666
         * [Style(name="verticalGridLineColor", type="uint", format="Color", inherit="yes")]
         * @type {uint}
         * @property verticalGridLineColor
         * @default null
         */

        "vertical-grid-line-color",
        /**
         *  The color of the horizontal grid lines.
         * [Style(name="horizontalGridLineColor", type="uint", format="Color", inherit="yes")]
         * @type {uint}
         * @property horizontalGridLineColor
         * @default null
         */

        "horizontal-grid-line-color",
        /**
         *  Thickness of the horizontal grid lines.
         *  @default 1
         * [Style(name="horizontalGridLineThickness", type="Number", format="Length", inherit="yes")]
         * @type {Number}
         * @property horizontalGridLineThickness
         * @default null
         */

        "horizontal-grid-line-thickness",
        /**
         *  Thickness of the vertical grid lines.
         *  @default 1
         * [Style(name="verticalGridLineThickness", type="Number", format="Length", inherit="yes")]
         * @type {Number}
         * @property verticalGridLineThickness
         * @default null
         */

        "vertical-grid-line-thickness",
        /**
         *  Flag that indicates whether to show vertical grid lines between
         *  the columns.
         *  If <code>true</code>, shows vertical grid lines.
         *  If <code>false</code>, hides vertical grid lines.
         *  @default true
         * [Style(name="headerVerticalGridLines", type="Boolean", inherit="no")]
         * @type {Boolean}
         * @property headerVerticalGridLines
         * @default null
         */

        "header-vertical-grid-lines",
        /**
         *  Flag that indicates whether to show horizontal grid lines between
         *  the rows.
         *  If <code>true</code>, shows horizontal grid lines.
         *  If <code>false</code>, hides horizontal grid lines.
         *  @default false
         * [Style(name="headerHorizontalGridLines", type="Boolean", inherit="no")]
         * @type {Boolean}
         * @property headerHorizontalGridLines
         * @default null
         */

        "header-horizontal-grid-lines",
        /**
         *  The color of the vertical grid lines.
         *  @default 0x666666
         * [Style(name="headerVerticalGridLineColor", type="uint", format="Color", inherit="yes")]
         * @type {uint}
         * @property headerVerticalGridLineColor
         * @default null
         */

        "header-vertical-grid-line-color",
        /**
         *  The color of the horizontal grid lines.
         * [Style(name="headerHorizontalGridLineColor", type="uint", format="Color", inherit="yes")]
         * @type {uint}
         * @property headerHorizontalGridLineColor
         * @default null
         */

        "header-horizontal-grid-line-color",
        /**
         *  Thickness of the header horizontal grid lines.
         *  @default 1
         * [Style(name="headerHorizontalGridLineThickness", type="Number", format="Length")]
         * @type {Number}
         * @property headerHorizontalGridLineThickness
         * @default null
         */

        "header-horizontal-grid-line-thickness",
        /**
         *  Thickness of the header vertical grid lines.
         * [Style(name="headerVerticalGridLineThickness", type="Number", format="Length")]
         *  @default 1
         * @type {Number}
         * @property headerVerticalGridLineThickness
         */

        "header-vertical-grid-line-thickness",
        /**
         *  Flag that indicates whether to force the top border
         * [Style(name="headerDrawTopBorder", type="Boolean", inherit="no")]
         *  @default false
         * @type {Boolen}
         * @property headerDrawTopBorder
         */

        "header-draw-top-border",
        /**
         * [Style(name="columnGroupVerticalGridLines", type="Boolean", inherit="no")]
         *  Flag that indicates whether to show vertical grid lines between
         *  the columns.
         *  If <code>true</code>, shows vertical grid lines.
         *  If <code>false</code>, hides vertical grid lines.
         *  @default true
         * @type {Boolean}
         * @property columnGroupVerticalGridLines
         */

        "column-group-vertical-grid-lines",
        /**
         * [Style(name="columnGroupHorizontalGridLines", type="Boolean", inherit="no")]
         *  Flag that indicates whether to show horizontal grid lines between
         *  the rows.
         *  If <code>true</code>, shows horizontal grid lines.
         *  If <code>false</code>, hides horizontal grid lines.
         *  @default false
         * @type {Boolean}
         * @property columnGroupHorizontalGridLines
         */

        "column-group-horizontal-grid-lines",
        /**
         * [Style(name="columnGroupVerticalGridLineColor", type="uint", format="Color", inherit="yes")]
         *  The color of the vertical grid lines.
         *  @default 0x666666
         * @type {uint}
         * @property columnGroupVerticalGridLineColor
         */

        "column-group-vertical-grid-line-color",
        /**
         * [Style(name="columnGroupHorizontalGridLineColor", type="uint", format="Color", inherit="yes")]
         *  The color of the horizontal grid lines.
         * @default nill
         * @type {uint}
         * @property columnGroupHorizontalGridLineColor
         */

        "column-group-horizontal-grid-line-color",
        /**
         * [Style(name="columnGroupHorizontalGridLineThickness", type="Number", format="Length")]
         *  Thickness of the header horizontal grid lines.
         *  @default 1
         * @type {Number}
         * @property columnGroupHorizontalGridLineThickness
         */

        "column-group-horizontal-grid-line-thickness",
        /**
         * [Style(name="columnGroupVerticalGridLineThickness", type="Number", format="Length")]
         *  Thickness of the header vertical grid lines.
         *  @default 1
         * @type {Number}
         * @property columnGroupVerticalGridLineThickness
         */

        "column-group-vertical-grid-line-thickness",
        /**
         * [Style(name="columnGroupDrawTopBorder", type="Boolean", inherit="no")]
         *  Flag that indicates whether to force the top border
         *  @default false
         * @type {Boolean}
         * @property columnGroupDrawTopBorder
         */

        "column-group-draw-top-border",
        /**
         * [Style(name="filterVerticalGridLines", type="Boolean", inherit="no")]
         *  Flag that indicates whether to show vertical grid lines between
         *  the columns.
         *  If <code>true</code>, shows vertical grid lines.
         *  If <code>false</code>, hides vertical grid lines.
         *  @default true
         * @type {Boolean}
         * @property filterVerticalGridLines
         */

        "filter-vertical-grid-lines",
        /**
         * [Style(name="filterHorizontalGridLines", type="Boolean", inherit="no")]
         *  Flag that indicates whether to show horizontal grid lines between
         *  the rows.
         *  If <code>true</code>, shows horizontal grid lines.
         *  If <code>false</code>, hides horizontal grid lines.
         *  @default false
         * @type {Boolean}
         * @property filterHorizontalGridLines
         */

        "filter-horizontal-grid-lines",
        /**
         * [Style(name="filterVerticalGridLineColor", type="uint", format="Color", inherit="yes")]
         *  The color of the vertical grid lines.
         *  @default 0x666666
         * @type {uint}
         * @property filterVerticalGridLineColor
         */

        "filter-vertical-grid-line-color",
        /**
         *  The color of the horizontal grid lines.
         * [Style(name="filterHorizontalGridLineColor", type="uint", format="Color", inherit="yes")]
         * @default 0x666666
         * @type {uint}
         * @property filterHorizontalGridLineColor
         *
         */

        "filter-horizontal-grid-line-color",
        /**
         * [Style(name="filterHorizontalGridLineThickness", type="Number", format="Length")]
         *  Thickness of the filter horizontal grid lines.
         *  @default 1
         * @type {Number}
         * @property filterHorizontalGridLineThickness
         */

        "filter-horizontal-grid-line-thickness",
        /**
         * [Style(name="filterVerticalGridLineThickness", type="Number", format="Length")]
         *  Thickness of the filter vertical grid lines.
         *  @default 1
         *  @type {Number}
         *  @property filterVerticalGridLineThickness
         *
         */

        "filter-vertical-grid-line-thickness",
        /**
         * [Style(name="filterDrawTopBorder", type="Boolean", inherit="no")]
         *  Flag that indicates whether to force the top border, when horizontal gridlines are not drawn
         *  @default false
         *  @type {Boolean}
         *  @property filterDrawTopBorder
         *
         */

        "filter-draw-top-border",
        /**
         * [Style(name="footerVerticalGridLines", type="Boolean", inherit="no")]
         *  Flag that indicates whether to show vertical grid lines between
         *  the columns.
         *  If <code>true</code>, shows vertical grid lines.
         *  If <code>false</code>, hides vertical grid lines.
         *  @default true
         *  @type {Boolean}
         *  @property footerVerticalGridLines
         *
         */

        "footer-vertical-grid-lines",
        /**
         * [Style(name="footerHorizontalGridLines", type="Boolean", inherit="no")]
         *  Flag that indicates whether to show horizontal grid lines between
         *  the rows.
         *  If <code>true</code>, shows horizontal grid lines.
         *  If <code>false</code>, hides horizontal grid lines.
         *  @default false
         *  @type {Boolean}
         *  @property footerHorizontalGridLines
         *
         */

        "footer-horizontal-grid-lines",
        /**
         * [Style(name="footerVerticalGridLineColor", type="uint", format="Color", inherit="yes")]
         *  The color of the vertical grid lines.
         *  @default 0x666666
         *  @type {uint}
         *  @property footerVerticalGridLineColor
         *
         */

        "footer-vertical-grid-line-color",
        /**
         * [Style(name="footerHorizontalGridLineColor", type="uint", format="Color", inherit="yes")]
         *  The color of the horizontal grid lines.
         *  @default null
         *  @type {uint}
         *  @property footerHorizontalGridLineColor
         */

        "footer-horizontal-grid-line-color",
        /**
         * [Style(name="footerHorizontalGridLineThickness", type="Number", format="Length")]
         *  Thickness of the footer horizontal grid lines.
         *  @default 1
         *  @type {Number}
         *  @property footerHorizontalGridLineThickness
         */

        "footer-horizontal-grid-line-thickness",
        /**
         * [Style(name="footerVerticalGridLineThickness", type="Number", format="Length")]
         *  Thickness of the footer vertical grid lines.
         *  @default 1
         *  @type {Number}
         *  @property footerVerticalGridLineThickness
         */

        "footer-vertical-grid-line-thickness",
        /**
         * [Style(name="footerDrawTopBorder", type="Boolean", inherit="no")]
         *  Flag that indicates whether to force the top border, when horizontal gridlines are not drawn
         *  @default false
         *  @type {Boolean}
         *  @property  footerDrawTopBorder
         */

        "footer-draw-top-border",
        /**
         * [Style(name="pagerVerticalGridLines", type="Boolean", inherit="no")]
         *  Flag that indicates whether to show vertical grid lines between
         *  the columns.
         *  If <code>true</code>, shows vertical grid lines.
         *  If <code>false</code>, hides vertical grid lines.
         *  @default true
         *  @type {Boolean}
         *  @property pagerVerticalGridLines
         */

        "pager-vertical-grid-lines",
        /**
         * [Style(name="pagerHorizontalGridLines", type="Boolean", inherit="no")]
         *  Flag that indicates whether to show horizontal grid lines between
         *  the rows.
         *  If <code>true</code>, shows horizontal grid lines.
         *  If <code>false</code>, hides horizontal grid lines.
         *  @default false
         *  @type {Boolean}
         *  @property pagerHorizontalGridLines
         */

        "pager-horizontal-grid-lines",
        /**
         * [Style(name="pagerVerticalGridLineColor", type="uint", format="Color", inherit="yes")]
         *  The color of the vertical grid lines.
         *  @default 0x666666
         *  @type {uint}
         *  @property pagerVerticalGridLineColor
         */

        "pager-vertical-grid-line-color",
        /**
         * [Style(name="pagerHorizontalGridLineColor", type="uint", format="Color", inherit="yes")]
         *  The color of the horizontal grid lines.
         *  @type {uint}
         *  @property pagerHorizontalGridLineColor
         */

        "pager-horizontal-grid-line-color",
        /**
         * [Style(name="pagerHorizontalGridLineThickness", type="Number", format="Length")]
         *  Thickness of the pager horizontal grid lines.
         *  @default 1
         *  @type {Number}
         *  @property pagerHorizontalGridLineThickness
         */

        "pager-horizontal-grid-line-thickness",
        /**
         * [Style(name="pagerVerticalGridLineThickness", type="Number", format="Length")]
         *  Thickness of the pager vertical grid lines.
         *  @default 1
         *  @type {Number}
         *  @property pagerVerticalGridLineThickness
         */

        "pager-vertical-grid-line-thickness",
        /**
         * [Style(name="pagerDrawTopBorder", type="Boolean", inherit="no")]
         *  Flag that indicates whether to force the top border, when horizontal gridlines are not drawn
         *  @default false
         *  @type {Boolean}
         *  @property pagerDrawTopBorder
         */

        "pager-draw-top-border",
        /**
         * [Style(name="rendererVerticalGridLines", type="Boolean", inherit="no")]
         *  Flag that indicates whether to show vertical grid lines between
         *  the columns.
         *  If <code>true</code>, shows vertical grid lines.
         *  If <code>false</code>, hides vertical grid lines.
         *  @default true
         *  @type {Boolean}
         *  @property rendererVerticalGridLines
         */

        "renderer-vertical-grid-lines",
        /**
         * [Style(name="rendererHorizontalGridLines", type="Boolean", inherit="no")]
         *  Flag that indicates whether to show horizontal grid lines between
         *  the rows.
         *  If <code>true</code>, shows horizontal grid lines.
         *  If <code>false</code>, hides horizontal grid lines.
         *  @default false
         *  @type {Boolean}
         *  @property rendererHorizontalGridLines
         */

        "renderer-horizontal-grid-lines",
        /**
         * [Style(name="rendererVerticalGridLineColor", type="uint", format="Color", inherit="yes")]
         *  The color of the vertical grid lines.
         *  @default 0x666666
         *  @type {uint}
         *  @property rendererVerticalGridLineColor
         */

        "renderer-vertical-grid-line-color",
        /**
         * [Style(name="rendererHorizontalGridLineColor", type="uint", format="Color", inherit="yes")]
         *  The color of the horizontal grid lines.
         *  @default null
         *  @type {uint}
         *  @property rendererHorizontalGridLineColor
         */

        "renderer-horizontal-grid-line-color",
        /**
         * [Style(name="rendererHorizontalGridLineThickness", type="Number", format="Length")]
         *  Thickness of the renderer horizontal grid lines.
         *  @default 1
         *  @type {Number}
         *  @property rendererHorizontalGridLineThickness
         */

        "renderer-horizontal-grid-line-thickness",
        /**
         * [Style(name="rendererVerticalGridLineThickness", type="Number", format="Length")]
         *  Thickness of the renderer vertical grid lines.
         *  @default 1
         *  @type {Number}
         *  @property rendererVerticalGridLineThickness
         */

        "renderer-vertical-grid-line-thickness",
        /**
         * [Style(name="rendererDrawTopBorder", type="Boolean", inherit="no")]
         *  Flag that indicates whether to force the top border, when horizontal gridlines are not drawn
         *  @default false
         *  @type {Boolean}
         *  @property rendererDrawTopBorder
         */

        "renderer-draw-top-border",
        /**
         * [Style(name="headerDrawTopBorder", type="Boolean", inherit="no")]
         *  Flag that indicates whether to force the top border, when horizontal gridlines are not drawn
         *  @default false
         *  @type {Boolean}
         *  @property headerDrawTopBorder
         */

        "header-draw-top-border",
        /**
         * [Style(name="filterDrawTopBorder", type="Boolean", inherit="no")]
         *  Flag that indicates whether to force the top border, when horizontal gridlines are not drawn
         *  @default false
         *  @type {Boolean}
         *  @property filterDrawTopBorder
         */

        "filter-draw-top-border",
        /**
         * [Style(name="footerDrawTopBorder", type="Boolean", inherit="no")]
         *  Flag that indicates whether to force the top border, when horizontal gridlines are not drawn
         *  @default false
         *  @type {Boolean}
         *  @property footerDrawTopBorder
         */

        "footer-draw-top-border",
        /**
         * [Style(name="pagerDrawTopBorder", type="Boolean", inherit="no")]
         *  Flag that indicates whether to force the top border, when horizontal gridlines are not drawn
         *  @default false
         *  @type {Boolean}
         *  @property pagerDrawTopBorder
         */

        "pager-draw-top-border",
        /**
         * [Style(name="rendererDrawTopBorder", type="Boolean", inherit="no")]
         *  Flag that indicates whether to force the top border, when horizontal gridlines are not drawn
         *  @default false
         *  @type {Boolean}
         *  @property rendererDrawTopBorder
         */

        "renderer-draw-top-border",
        /**
         * [Style(name="selectionColor", type="uint", format="Color", inherit="yes")]
         *  The color of the background for the row when the user selects
         *  an item renderer in the row.
         *
         *  The default value for the Halo theme is <code>0x7FCEFF</code>.
         *  The default value for the Spark theme is <code>0xA8C6EE</code>.
         */

        "selection-color",

        /**
         * [Style(name="sortArrowSkin", type="Class", inherit="no")]
         *  The class to use as the skin for the arrow that indicates the column sort
         *  direction.
         */

        "sort-arrow-skin",

        /**
         * [Style(name="sortArrowSkin", type="Class", inherit="no")]
         *  The class to use as the skin for the checkbox that appears when you drag and drop a header cell to reposition the column, and you
         *  drop it on a header cell where you can actually complete the re-order operation
         */

        "check-icon-class",


        /**
         * [Style(name="sortArrowSkin", type="Class", inherit="no")]
         *  The class to use as the skin for the checkbox that appears when you drag and drop a header cell to reposition the column, and you
         *  drop it on a header cell where you can NOT  complete the re-order operation
         *
         */

        "cross-icon-class",
        /**
         * [Style(name="paddingLeft", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 1
         *  @type {Number}
         *  @property paddingLeft
         */

        "padding-left",
        /**
         * [Style(name="paddingRight", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 0
         *  @type {Number}
         *  @property paddingRight
         */

        "padding-right",
        /**
         * [Style(name="paddingTop", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property paddingTop
         */

        "padding-top",
        /**
         * [Style(name="paddingBottom", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property paddingBottom
         */

        "padding-bottom",
        /**
         * [Style(name="headerPaddingLeft", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 1
         *  @type {Number}
         *  @property headerPaddingLeft
         */

        "header-padding-left",
        /**
         * [Style(name="headerPaddingRight", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 0
         *  @type {Number}
         *  @property headerPaddingRight
         */

        "header-padding-right",
        /**
         * [Style(name="headerPaddingTop", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property headerPaddingTop
         */

        "header-padding-top",
        /**
         * [Style(name="headerPaddingBottom", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property headerPaddingBottom
         */

        "header-padding-bottom",
        /**
         * [Style(name="columnGroupPaddingLeft", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 1
         *  @type {Number}
         *  @property columnGroupPaddingLeft
         */

        "column-group-padding-left",
        /**
         * [Style(name="columnGroupPaddingRight", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 0
         *  @type {Number}
         *  @property columnGroupPaddingRight
         */

        "column-group-padding-right",
        /**
         * [Style(name="columnGroupPaddingTop", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property columnGroupPaddingTop
         */

        "column-group-padding-top",
        /**
         * [Style(name="columnGroupPaddingBottom", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property columnGroupPaddingBottom
         */

        "column-group-padding-bottom",

        /**
         * [Style(name="footerPaddingLeft", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 1
         *  @type {Number}
         *  @property footerPaddingLeft
         */

        "footer-padding-left",
        /**
         * [Style(name="footerPaddingRight", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 0
         *  @type {Number}
         *  @property footerPaddingRight
         */

        "footer-padding-right",
        /**
         * [Style(name="footerPaddingTop", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property footerPaddingTop
         */

        "footer-padding-top",
        /**
         * [Style(name="footerPaddingBottom", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property footerPaddingBottom
         */

        "footer-padding-bottom",
        /**
         * [Style(name="filterPaddingLeft", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 1
         *  @type {Number}
         *  @property filterPaddingLeft
         */

        "filter-padding-left",
        /**
         * [Style(name="filterPaddingRight", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 0
         *  @type {Number}
         *  @property filterPaddingRight
         */

        "filter-padding-right",
        /**
         * [Style(name="filterPaddingTop", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property filterPaddingTop
         */

        "filter-padding-top",
        /**
         * [Style(name="filterPaddingBottom", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property filterPaddingBottom
         */

        "filter-padding-bottom",
        /**
         * [Style(name="pagerPaddingLeft", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 1
         *  @type {Number}
         *  @property pagerPaddingLeft
         */

        "pager-padding-left",
        /**
         * [Style(name="pagerPaddingRight", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 0
         *  @type {Number}
         *  @property pagerPaddingRight
         */

        "pager-padding-right",
        /**
         * [Style(name="pagerPaddingTop", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property pagerPaddingTop
         */

        "pager-padding-top",
        /**
         * [Style(name="pagerPaddingBottom", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property pagerPaddingBottom
         */

        "pager-padding-bottom",
        /**
         * [Style(name="rendererPaddingLeft", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 1
         *  @type {Number}
         *  @property rendererPaddingLeft
         */

        "renderer-padding-left",
        /**
         * [Style(name="rendererPaddingRight", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 0
         *  @type {Number}
         *  @property rendererPaddingRight
         */

        "renderer-padding-right",
        /**
         * [Style(name="rendererPaddingTop", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's left border
         *  and the left edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property rendererPaddingTop
         */

        "renderer-padding-top",
        /**
         * [Style(name="rendererPaddingBottom", type="Number", format="Length", inherit="no")]
         *  Number of pixels between the control's right border
         *  and the right edge of its content area.
         *
         *  @default 2
         *  @type {Number}
         *  @property rendererPaddingBottom
         */

        "renderer-padding-bottom",
        /**
         * [Style(name="alternatingItemColors", type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  The colors to use for the backgrounds of the items in the grid.
         *  The value is an array of two or more colors.
         *  The backgrounds of the list items alternate among the colors in the array.
         *  @default undefined
         *  @type {Number}
         *  @property alternatingItemColors
         */

        "alternating-item-colors",
        /**
         * [Style(name="alternatingTextColors", type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  The colors to use for the text of the items in the grid.
         *  The value is an array of two colors.
         *  The text color of the list items alternate among the colors in the array.
         *  @default [ #000000, #000000]
         *  @type {Array}
         *  @property alternatingTextColors
         */

        "alternating-text-colors",
        /**
         * [Style(name="editItemColor", type="Array", arrayType="uint", format="Color")]
         *  The colors to use for the backgrounds of the items in the grid in the editable mode.
         *  The value is an array two colors.
         *  @default undefined
         *  @type {Array}
         *  @property editItemColor
         */

        "edit-item-color",
        /**
         * [Style(name="editTextColor", format="Color")]
         *  The colors to use for the text of the items in the editable grid.
         *  @default null
         *  @type {null}
         *  @property editTextColor
         */

        "edit-text-color",

        /**
         * [Style(name="selectionDisabledColor", type="uint", format="Color", inherit="yes")]
         *  The color of the background of a renderer when the component is disabled.
         *  @default null
         *  @type {uint}
         *  @property selectionDisabledColor
         */

        "selection-disabled-color",
        /**
         * [Style(name="disclosureOpenIcon", type="Class", format="EmbeddedFile", inherit="no")]
         *  The icon that is displayed next to an open branch node of the navigation tree.
         *  The default value is <code>TreeDisclosureOpen</code> in the assets.swf file.
         *  @default null
         *  @type {Class}
         *  @property disclosureOpenIcon
         */

        "disclosure-open-icon",
        /**
         * [Style(name="disclosureClosedIcon", type="Class", format="EmbeddedFile", inherit="no")]
         *  The icon that is displayed next to a closed branch node of the navigation tree.
         *  The default value is <code>TreeDisclosureClosed</code> in the assets.swf file.
         *  @default null
         *  @type {Class}
         *  @property disclosureClosedIcon
         */

        "disclosure-closed-icon",
        /**
         * [Style(name="columnGroupOpenIcon", type="Class", format="EmbeddedFile", inherit="no")]
         *  The icon that is displayed next to an open column group.
         *  The default value is <code>TreeDisclosureOpen</code> in the assets.swf file.
         *  @default null
         *  @type {Class}
         *  @property columnGroupOpenIcon
         */

        "column-group-open-icon",
        /**
         * [Style(name="columnGroupClosedIcon", type="Class", format="EmbeddedFile", inherit="no")]
         *  The icon that is displayed next to a closed column group.
         *
         *  The default value is <code>TreeDisclosureClosed</code> in the assets.swf file.
         *  @default null
         *  @type {Class}
         *  @property columnGroupClosedIcon
         */

        "column-group-closed-icon",
        /**
         * [Style(name="rollOverColor", type="uint", format="Color", inherit="yes")]
         *  The color of the row background when the user rolls over the row.
         *
         *  The default value for the Halo theme is <code>0xB2E1FF</code>.
         *  The default value for the Spark theme is <code>0xCEDBEF</code>.
         *  @default null
         *  @type {uint}
         *  @property rollOverColor
         */

        "roll-over-color",
        /**
         * [Style(name="activeCellColor", type="uint", format="Color", inherit="yes")]
         *  The color of the cell directly under the mouse or if using keyboard navigation, current keyboard seed.
         *  @default #000000
         *  @type {uint}
         *  @property activeCellColor
         */

        "active-cell-color",
        /**
         * [Style(name="footerColors", type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  An array of two colors used to draw the footer background gradient.
         *  The first color is the top color.
         *  The second color is the bottom color.
         *  @default [0xCFCFCF, 0xCCCCCC]
         *  @type {Array}
         *  @property footerColors
         */

        "footer-colors",
        /**
         * [Style(name="footerRollOverColors",  type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  The color of the row background when the user rolls over the footer.
         *  The default value is [0xCCCCCC,0xCFCFCF]
         *  @type {Array}
         *  @property footerRollOverColors
         */

        "footer-roll-over-colors",
        /**
         * [Style(name="filterColors",  type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  The color of the row background for the filter.
         *  The default value is [0xCFCFCF,0xCFCFCF]
         *  @type {Array}
         *  @property filterColors
         */

        "filter-colors",
        /**
         * [Style(name="filterRollOverColors",  type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  The color of the row background when the user rolls over the filter.
         *  The default value is [0xCFCFCF,0xCFCFCF]
         *  @type {Array}
         *  @property filterRollOverColors
         */

        "filter-roll-over-colors",
        /**
         * [Style(name="headerColors", type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  An array of two colors used to draw the header background gradient.
         *  The first color is the top color.
         *  The second color is the bottom color.
         *  @default [0xFFFFFF, 0xE6E6E6]
         *  @type {Array}
         *  @property headerColors
         */

        "header-colors",
        /**
         * [Style(name="headerRollOverColors",  type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  The color of the row background when the user rolls over the header.
         *
         *  The default value is [0xE6E6E6,0xFFFFFF]
         *  @type {Array}
         *  @property headerRollOverColors
         */

        "header-roll-over-colors",
        /**
         * [Style(name="columnGroupColors", type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  An array of two colors used to draw the Column Groups background gradient.
         *  The first color is the top color.
         *  The second color is the bottom color.
         *  @default [0xFFFFFF, 0xE6E6E6]
         *  @type {Array}
         *  @property columnGroupColors
         */

        "column-group-colors",
        /**
         * [Style(name="columnGroupRollOverColors",  type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  The color of the row background when the user rolls over the Column Groups.
         *
         *  The default value is [0xE6E6E6,0xFFFFFF]
         *  @type {Array}
         *  @property columnGroupRollOverColors
         */

        "column-group-roll-over-colors",
        /**
         * [Style(name="rendererColors", type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  An array of two colors used to draw the renderer background gradient.
         *  The first color is the top color.
         *  The second color is the bottom color.
         *  @default [0xFFFFFF, 0xFFFFFF]
         *  @type {Array}
         *  @property rendererColors
         */

        "renderer-colors",
        /**
         * * [Style(name="rendererRollOverColors", type="uint", format="Color", inherit="yes")]
         *  The color of the row background when the user rolls over a level renderer.
         *  The default value is [0xFFFFFF,0xFFFFFF]
         *  @type {uint}
         *  @property rendererRollOverColors
         */

        "renderer-roll-over-colors",
        /**
         * [Style(name="pagerColors", type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  An array of two colors used to draw the pager background gradient.
         *  The first color is the top color.
         *  The second color is the bottom color.
         *  @default [0xCCCCCC, 0xCCCCCC]
         *  @type {Array}
         *  @property pagerColors
         */

        "pager-colors",
        /**
         * [Style(name="pagerRollOverColors",type="Array", arrayType="uint", format="Color", inherit="yes")]
         *  The color of the row background when the user rolls over the pager.
         *  The default value is [0xE6E6E6,0xFFFFFF]
         *  @type {Array}
         *  @property pagerRollOverColors
         */

        "pager-roll-over-colors",
        /**
         * [Style(name="textSelectedColor", type="uint", format="Color", inherit="yes")]
         *  Color of the text when the user selects a row.
         *  @default 0x000000
         *  @type {uint}
         *  @property textSelectedColor
         */

        "text-selected-color",
        /**
         * [Style(name="textRollOverColor", type="uint", format="Color", inherit="yes")]
         *  Color of the text when the user rolls over a row.
         *
         *  @default 0x000000
         *  @type {uint}
         *  @property textRollOverColor
         */

        "text-roll-over-color",
        /**
         * [Style(name="textDisabledColor", type="uint", format="Color", inherit="yes")]
         *  The color of the text of a renderer when the component is disabled.
         *  @default 0xDDDDDD
         *  @type {uint}
         *  @property textDisabledColor
         */

        "text-disabled-color",

        /**
         * [Style(name="lockedSeperatorThickness", type="Number", inherit="yes")]
         *  The width of the vertical seperators for the locked content.
         * @default 1
         *  @type {Number}
         *  @property lockedSeperatorThickness
         */

        "locked-seperator-thickness",
        /**
         * [Style(name="lockedSeperatorColor", type="uint", format="Color", inherit="yes")]
         *  The color of the vertical seperators for the locked content.
         * @default #000000
         *  @type {uint}
         *  @property lockedSeperatorColor
         */

        "locked-seperator-color",
        /**
         * [Style(name="errorBackgroundColor", type="uint", format="Color", inherit="yes")]
         * The background color of the row that has the error .
         * @default #FCDCDF
         *  @type {uint}
         *  @property errorBackgroundColor
         */

        "error-background-color",
        /**
         * [Style(name="errorBorderColor", type="uint", format="Color", inherit="yes")]
         * The border color of the cell that has the error .
         * @default #F23E2C
         *  @type {uint}
         *  @property errorBorderColor
         */

        "error-border-color",
        /**
         * [Style(name="dragAlpha", type="Number")]
         *  Alpha for the drag operation.
         *  @default 0.8
         *  @type {Number}
         *  @property dragAlpha
         */

        "drag-alpha",
        /**
         * [Style(name="dragRowBorderStyle", type="String")]
         *  Border for the drag row for the drag operation.
         *  @default 0.8
         *  @type {String}
         *  @property dragRowBorderStyle
         */

        "drag-row-border-style",

        /**
         * [Style(name="fixedColumnFillColors", type="Array", arrayType="uint", format="Color", inherit="yes")]
         * A box to cover the space left behind by the horizontal scrollbar when horizontalScrollPolicy=on and there are left locked columns
         *  @default null
         *  @type {Array}
         *  @property fixedColumnFillColors
         */

        "fixed-column-fill-colors",

        /**
         * [Style(name="columnMoveResizeSeparatorColor", format="Color")]
         * The color of the line to draw when the user is moving or resizing the column
         *  @default null
         *  @type {null}
         *  @property columnMoveResizeSeparatorColor
         */

        "column-move-resize-separator-color",
        /**
         * [Style(name="headerSortSeparatorColor", format="Color")]
         * The color of the line between header and the sort section for multi column sort
         *  @default null
         *  @type {null}
         *  @property headerSortSeparatorColor
         */

        "header-sort-separator-color",
        /**
         * [Style(name="headerSortSeparatorRight", format="int")]
         * The distance between the sort line and the right edge of the header cell
         *  @default null
         *  @type {null}
         *  @property headerSortSeparatorRight
         */

        "header-sort-separator-right",
        /**
         * [Style(name="columnMoveAlpha")]
         * The alpha to apply to the glyph when moving the column.
         * @deprecated    Starting in 2.9 we no longer draw a glyph, we simply draw a line. This is to add support
         * for dropping column on both sides of the target cell.
         *  @default null
         *  @type {null}
         *  @property columnMoveAlpha
         */

        "column-move-alpha",


        "enable-column-group-separators",
        /**
         * The color of the vertical seperators for the column group border.
         * [Style(name="columnGroupSeparatorColor", type="uint", format="Color", inherit="yes")]
         * @type {uint}
         * @property columnGroupSeparatorColor
         * @default null
         */

        "column-group-separator-color",
        /**
         *  The width of the vertical seperators for the column group border.
         *  @default 1
         * [Style(name="columnGroupSeparatorThickness", type="Number", format="Length", inherit="yes")]
         * @type {Number}
         * @property columnGroupSeparatorThickness
         * @default null
         */

        "column-group-separator-thickness"];


    Polymer({
        is: 'flxs-tree-grid',
        properties: properties,
        behaviors: [
            Polymer.IronResizableBehavior
        ],

        /**
         * @property grid
         * @type FlexiDataGrid
         * @default null
         */
        grid: null,

        /**
         * On create element but not attached to DOM
         */
        created: function () {
            if(!this.style)
            this.style = {};
            flexiciousNmsp.SettingsParser.log("grid created")
        },
        ready: function () {
            flexiciousNmsp.SettingsParser.log("grid ready")

        },
        applyCustomStyle: function (prop) {
            var styleValue = this.getComputedStyleValue("--flxs-" + prop);
            if (styleValue != '') {
                var camelCased = prop.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
                this.grid.applyAttribute(this.grid, camelCased, styleValue, true);
            }
        },
        /**
         * On attached element to DOM
         */
        attached: function () {
            flexiciousNmsp.SettingsParser.log("grid attached")
            this.listen(this, 'iron-resize', '_resizeHandler');

            if (this.width) {
                this.$.gridContainer.style.width = this.width;
            }
            if (this.height) {
                this.$.gridContainer.style.height = this.height;
            }

            this.grid = new flexiciousNmsp.FlexDataGrid(this.$.gridContainer);

            this.grid.pdfOptions.popupParent = this.grid;
            this.grid.printOptions.popupParent = this.grid;
            this.grid.sortIconPlacementFunction = this._placeSortIcon;
            if (!this.grid.cellTextColorFunction)
                this.grid.cellTextColorFunction = this._cellTextColorFunction;
            this.grid.cellBackgroundColorFunction = this._cellBackgroundColorFunction;

            for (var i = 0; i < allStyles.length; i++) {
                this.applyCustomStyle(allStyles[i]);
            }
            var pendingDataProvider = null;
            for (var key in properties) {
                if (this[key.toLowerCase()] || (
                    this[key.toLowerCase()]=="" && key.toLowerCase() =="nodatamessage"
                )) 
                {
                    if (key === "style") {
                        //this is thehtmlstyle
                    }
                    else if (key.toLowerCase() === "dataprovider") {
                        pendingDataProvider = this[key.toLowerCase()];
                    } else {
                        this.grid.applyAttribute(this.grid, properties[key].orig, this[key.toLowerCase()], true);
                    }
                }
            }


            this.processChildren();



            if (pendingDataProvider) {
                this.grid.setDataProvider(pendingDataProvider);
            }

            this.grid.initComplete = true;
            this.grid.dispatchEvent(new flexiciousNmsp.BaseEvent(flxConstants.EVENT_CREATION_COMPLETE));

        },
        processChildren: function () {
            var grid = this.grid;
            var cols = [];
            var items3 = this.childNodes;
            for (var k = 0; k < items3.length; k++) {
                var gridChildNode = items3[k];
                if (!this.getLocalName(gridChildNode)) continue;
                if (this.getLocalName(gridChildNode) == 'flxs-tree-grid-column-level') {
                    this.extractLevel(gridChildNode, grid.getColumnLevel());
                }
                else if (this.getLocalName(gridChildNode) == 'flxs-tree-grid-column-group') {
                    cols.push((gridChildNode));
                }
                else if (this.getLocalName(gridChildNode) == 'flxs-tree-grid-column') {
                    cols.push((gridChildNode));
                }
            }
            if (cols.length > 0)
                this.extractColumns(grid.getColumnLevel(), cols);
            grid.getColumnLevel().initializeLevel(grid);
            grid.rebuild();
        },
        extractColumns: function (lvl, colNodes) {
            var cols = [];
            var hasColumnGroups = false;
            for (var j = 0; j < colNodes.length; j++) {
                var colNode = colNodes[j];
                if (!this.getLocalName(colNode)) continue;
                if (this.getLocalName(colNode) == "flxs-tree-grid-column-group") {
                    hasColumnGroups = true;
                    cols.push(this.extractColGroup(colNode));
                }
                else
                    cols.push(this.extractCol(colNode));
            }
            if (hasColumnGroups)
                lvl.setGroupedColumns(cols);
            else
                lvl.setColumns(cols);
            return { cols: cols, hasColumnGroups: hasColumnGroups, j: j, colNode: colNode };
        },
        extractCol: function (colNode) {
            var col = new flexiciousNmsp.FlexDataGridColumn();
            if (colNode.attributes.getNamedItem('type') && colNode.attributes.getNamedItem('type').value == "checkbox")
                col = new flexiciousNmsp.FlexDataGridCheckBoxColumn();

            colNode.parseColumn(col, this.grid);
            return col;
        },
        extractLevel: function (levelNode, level) {
            var cols = [];
            levelNode.parseLevel(level, this.grid);
            var items2 = levelNode.childNodes;
            for (var i = 0; i < items2.length; i++) {
                var levelNodeChild = items2[i];
                if (!this.getLocalName(levelNodeChild)) continue;
                if (this.getLocalName(levelNodeChild) == 'flxs-tree-grid-column-level') {
                    level.nextLevel = new flexiciousNmsp.FlexDataGridColumnLevel(level.grid);
                    this.extractLevel(levelNodeChild, level.nextLevel);
                }
                else if (this.getLocalName(levelNodeChild) == 'flxs-tree-grid-column') {
                    cols.push((levelNodeChild));
                }
            }
            this.extractColumns(level, cols);
        },
        extractColGroup: function (cgNode) {
            var cg = new flexiciousNmsp.FlexDataGridColumnGroup();
            cgNode.parseColumnGroup(cg, this.grid)
            var cols = [];
            var hasColumnGroups = false;
            var realChild = 0;

            var items3 = cgNode.childNodes;
            for (var k = 0; k < items3.length; k++) {
                var colNode = items3[k];
                if (!this.getLocalName(colNode)) continue;
                if (this.getLocalName(colNode) == "flxs-tree-grid-column-group") {
                    hasColumnGroups = true;
                    cols.push(this.extractColGroup(colNode));
                }
                else if (this.getLocalName(colNode) == "flxs-tree-grid-column")
                    cols.push(this.extractCol(colNode));
            }
            if (hasColumnGroups)
                cg.columnGroups = (cols);
            else
                cg.setColumns(cols);
            return cg;
        },
        getLocalName: function (node) {
            return node.localName || node.baseName;
        },
        /**
         * Try to destroy instance if hadn't been destroyed
         */
        detached: function () {
            //this.grid.kill()
            this.unlisten(this, 'iron-resize', '_resizeHandler');
        },
        /**
         * A handler for the `iron-resize` event triggered by `IronResizableBehavior`
         * when the element is resized.
         */
        _resizeHandler: function () {
            this.grid.checkResize();

        },
        attributeChanged: function () {
            this._onChanged();
        },

        _onChanged: function () {
            // var settings;
            //TODO - dynamic updates
        },
        _onDataProviderChanged: function (value) {
            if (this.grid) {
                this.grid.setDataProvider(value);
            }
        },

        _placeSortIcon: function (cell) {
            if (cell.icon) {
                cell.icon.move(cell.icon.getX() - 4, cell.icon.getY() + 2);
            }
        },

        _cellTextColorFunction: function (cell) {
            if (this.currentCell && this.currentCell.rowInfo === cell.rowInfo) {
                if (cell.rowInfo.rowPositionInfo.levelNestDepth > 1) {
                    return 0x61A6ED;
                }
            }
            return null;
        },

        _cellBackgroundColorFunction: function (cell) {
            // on mouse roll over
            if (cell.rowInfo.getIsDataRow()) {
                if (cell.rowInfo.rowPositionInfo.levelNestDepth > 1) {
                    if (cell.level.isItemSelected(cell.rowInfo.getData())) {
                        return null;
                    }
                    return cell.rowInfo.rowPositionInfo.rowIndex % 2 == 0 ? 0x333333 : 0x222222;
                }
            }
            return null;
        }
    });
}());
