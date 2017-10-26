/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
(function () {

    "use strict";
    var VaadinAdapter;

    /**
     * A utility class that maps utility functions from Flexicious into JQuery
     * @constructor
     * @namespace com.flexicious.adapters
     */
    VaadinAdapter = function () {

    };

    var Constants = flexiciousNmsp.Constants;
    Constants.DEFAULT_DATE_FORMAT = "MM-DD-YYYY";
    Constants.SHORT_DATE_MASK = "MM/DD/YYYY";
    Constants.YMD_MASK = "YY-MMM-YYYY";
    Constants.MEDIUM_DATE_MASK = "MM DD, YY";
    Constants.LONG_DATE_MASK = "MM D, yy";
    Constants.FULL_DATE_MASK = "EEEE, MMMM D, YYYY";
    Constants.SHORT_TIME_MASK = "HH MM A";
    Constants.MEDIUM_TIME_MASK = "HH:MM:SS A";
    Constants.LONG_TIME_MASK = Constants.MEDIUM_TIME_MASK + " TZD";


    flexiciousNmsp.VaadinAdapter = VaadinAdapter; //add to name space
    VaadinAdapter.prototype.typeName = VaadinAdapter.typeName = "VaadinAdapter";//for quick inspection
    VaadinAdapter.prototype.getClassNames = function () { //for support of "is" keyword
        return ["TypedObject", this.typeName];
    };

    /**
     * Calls the Jquery html method on the parent, passing in innner html.
     * @param parent
     * @param innerHTML
     */
    VaadinAdapter.prototype.setHtml = function (parent, innerHTML) {
        $(parent).html(innerHTML);
    };

    /**
     * Gets the child element of gridDiv that has the specified class name.
     * There must be at least one div with that class name otherwise this method will throw an error.
     * @param gridDiv   The div to search
     * @param className The class to search
     */
    VaadinAdapter.prototype.getElementByClassName = function (gridDiv, className) {
        return $(gridDiv).find("." + className)[0];
    };

    VaadinAdapter.prototype.addChild = function (parent, child) {
        return $(parent).append(child);
    };

    VaadinAdapter.prototype.insertBefore = function (child, refChild) {
        return $(child).insertBefore(refChild);
    };

    VaadinAdapter.prototype.removeChild = function (parent, child) {
        return $(child).remove();
    };

    VaadinAdapter.prototype.findElementWithClassName = function (parent, containerClassName) {
        return $(parent).find('.' + containerClassName).toArray()[0];
    };

    VaadinAdapter.prototype.findElementsWithClassName = function (parent, containerClassName) {
        return $(parent).find('.' + containerClassName).toArray();
    };

    VaadinAdapter.prototype.findFirstElementByTagName = function (parent, tagName) {
        return $(parent).find('>' + tagName).toArray()[0];
    };

    VaadinAdapter.prototype.ieVersion = -1;

    VaadinAdapter.prototype.isIE = function () {
        if (VaadinAdapter.prototype.ieVersion = -1) {
            var myNav = navigator.userAgent.toLowerCase();
            VaadinAdapter.prototype.ieVersion = (myNav.indexOf('trident') != -1) ? 11 : (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : 0;
            if (VaadinAdapter.prototype.ieVersion == 11) {
                VaadinAdapter.ieVersion = 11;
            }
        }
        return VaadinAdapter.prototype.ieVersion;
    };

    VaadinAdapter.prototype.isMoz = function () {
        return $.browser ? $.browser.mozilla : navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    };

    VaadinAdapter.prototype.isWebKit = function () {
        return $.browser ? $.browser.webkit : 'WebkitAppearance' in document.documentElement.style;
    };

    VaadinAdapter.prototype.setupAutoComplete = function (input, options) {
        if (options.autoCompleteSource) {
            options.source = options.autoCompleteSource;
        }
        $(input).autocomplete(options);
    };

    VaadinAdapter.prototype.setupInputMask = function (input, options) {
        if (options.inputMask) {
            options.mask = options.inputMask;
        }
        $(input).mask(options.mask, options);
    };

    VaadinAdapter.prototype.setupWaterMark = function (input, options) {
        if (options.watermark)
            options.watermark = options.watermark;
        if (options.watermarkStyle)
            options.watermarkStyle = options.watermarkStyle;

        $(input).Watermark(options.watermark, options.watermarkStyle);
    };

    VaadinAdapter.prototype.offset = function (elem) {
        return $(elem).offset()
    };

    VaadinAdapter.prototype.showDialog = function (elem, parent, modal, w, h, title) {

        if ($('custom-paper-dialog')[0]) {
            $('custom-paper-dialog')[0].removeAllDatePickers();
            $('custom-paper-dialog')[0].parentDom = parent;
            $('custom-paper-dialog')[0].popupInstance = elem.component;
            $('custom-paper-dialog')[0].toggle();
            return;
        }

        Polymer({
            is: 'custom-paper-dialog',

            properties: {
                parentDom: {
                    type: Object,
                    value: function () { return {} }
                },
                datePickerMap: {
                    type: Object,
                    value: function () { return {} }
                },
                popupInstance: {
                    type: Array,
                    value: function () { return [] }
                }
            },

            created: function () {
                this.parentDom = parent;
                this.popupInstance = elem.component;
            },

            ready: function () {
                var dialog = document.createElement("paper-dialog");
                dialog.id = "dialog";
                dialog.modal = modal;
                dialog.style.width = w + "px";
                dialog.style.minWidth = "460px";
                dialog.style.height = h + "px";
                dialog.style.minHeight = "200px";
                this.appendChild(dialog);

                var header = document.createElement("h2");
                header.innerText = title;
                dialog.appendChild(header);

                var hrular = document.createElement('hr');
                dialog.appendChild(hrular);

                var buttonsGroup = document.createElement('div');
                buttonsGroup.className = "buttonsGroup";
                buttonsGroup.style.textAlign = "right";

                var cancelBtn = document.createElement('paper-button');
                // cancelBtn.setAttribute('dialog-dismiss', '');
                cancelBtn.innerText = 'Cancel';
                cancelBtn.onclick = function (e) {
                    document.getElementById("dialog").toggle();
                };

                var okBtn = document.createElement('paper-button');
                // okBtn.setAttribute('dialog-confirm', '');
                okBtn.setAttribute('autofocus', '');
                okBtn.innerText = 'Ok';
                okBtn.onclick = function (e) {

                    var _comp = $('custom-paper-dialog')[0];

                    if (_comp.popupInstance.implementsOrExtends('DateRangePicker')) {
                        _comp.popupInstance.startDate = new Date(_comp.popupInstance.domElement.querySelector(".datePickerStartDateInput").value);
                        _comp.popupInstance.endDate =  new Date(_comp.popupInstance.domElement.querySelector(".datePickerEndDateInput").value);
                    }

                    $(_comp.parentDom.querySelector(".okBtn")).trigger('click');
                    document.getElementById("dialog").toggle();

                    e.preventDefault();
                };

                buttonsGroup.appendChild(cancelBtn);
                buttonsGroup.appendChild(okBtn);
                dialog.appendChild(buttonsGroup);
            },

            attached: function () {
                this.open();
            },

            attachDatePicker: function (domElement, dateFormat) {
                var mountedDialog = document.getElementById("dialog");
                var datePicker = document.createElement("vaadin-date-picker");
                datePicker.id = 'vaadinDatePicker' + (Math.random() * 100000).toFixed(0);

                $(datePicker).insertBefore($('.buttonsGroup')[0]);

                this.datePickerMap[datePicker.id] = { input: domElement, dateFormat: dateFormat };

                $(datePicker).on("value-changed", function (e) {
                    var dateComponent = $('custom-paper-dialog')[0].datePickerMap[e.target.id];
                    dateComponent.input.value = moment(e.target.value, 'YYYY-MM-DD').format(dateComponent.dateFormat);
                });

                return datePicker;
            },

            removeAllDatePickers: function () {
                $(document.getElementById("dialog")).children().each(function () {
                    if (this.id.indexOf('vaadinDatePicker') !== -1) {
                        this.parentNode.removeChild(this);
                    }
                });
                $('custom-paper-dialog')[0].datePickerMap = {};
            },

            toggle: function () {
                document.getElementById("dialog").toggle();
            },

            open: function () {
                document.getElementById("dialog").open();
            }
        });

        var el1 = document.createElement('custom-paper-dialog');
        $(elem).data('dia', el1);
        document.body.appendChild(el1);
    };

    VaadinAdapter.prototype.showConfirm = function (elem, parent, modal, w, h, title) {
        
    };

    VaadinAdapter.prototype.setDialogTitle = function (elem, title) {
        //this.findElementWithClassName(elem.parentNode,"ui-dialog-title").innerHTML= title;
        this.findElementWithClassName(elem.parentNode, "modal-title").innerHTML = title;

    };

    VaadinAdapter.prototype.removeDialog = function (elem) {
        // $(elem).remove();
        if ($(elem).data('dia'))
            $(elem).data('dia').toggle();
        else
            $(elem).remove();
    };

    VaadinAdapter.prototype.buildUl = function (cols) {
        var html = '<ul>';
        for (var j = 0; j < cols.length; j++) {
            html += "<li class='flexiciousSortPopupMenuItem' > <a class='" + (cols[j].type == 'separator' ? 'separator' : '') + "' href='#' uniqueidentifier='" + cols[j].data + "'>" + cols[j].label + "</a>";
            if (cols[j].children && cols[j].children.length > 0) {
                html += this.buildUl(cols[j].children);
            }
            html += "</li>";
        }
        html += "</ul>";
        return html;
    }

    VaadinAdapter.prototype.createMenu = function (menuItems, menuTrigger, onMenuItemClick) {
        $(menuTrigger).flxsmenu({ content: this.buildUl(menuItems), flyOut: true, onMenuItemClick: onMenuItemClick });
    };

    VaadinAdapter.prototype.destroyMenu = function (trigger) {
        $(trigger).remove();
    };

    VaadinAdapter.prototype.createDateTimePickerEditor = function (domElement, dateFormat, dflt) {
        this.createDateTimePicker(domElement.getTextBox(), dateFormat, dflt);
    }

    VaadinAdapter.prototype.createDateTimePicker = function (domElement, dateFormat, dflt) {

        if (domElement.dpCreated) {
            return;
        }
        domElement.dpCreated = true;

        if (domElement.domElement) {
            domElement = domElement.getTextBox();
        }

        var datePicker = $('custom-paper-dialog')[0].attachDatePicker(domElement, dateFormat);

        if (dflt && dateFormat) {
            datePicker.initialPosition = moment(dflt, dateFormat).format('YYYY-MM-DD');
        }

    };

    VaadinAdapter.prototype.getCurrentDatePicker = function () {
        return $('ui-datepicker-div');//???
    };

    VaadinAdapter.prototype.getDateValue = function (dateStr, dateFormat) {
        return new Date(moment(dateStr, dateFormat));
    };

    VaadinAdapter.prototype.formatDate = function (date, dateFormat) {
        return moment(date).format(dateFormat);
    };

    VaadinAdapter.prototype.isDatePickerElement = function (elem) {
        return $(elem).data("DateTimePicker") != null;
    };

    VaadinAdapter.prototype.setText = function (elem, text) {
        return $(elem).text(text);
    };

    VaadinAdapter.prototype.setHtml = function (elem, html) {
        return $(elem).html(html);
    };

    VaadinAdapter.prototype.findAncestorByClassName = function (elem, className) {
        return $(elem).closest('.' + className)[0];
    };

    VaadinAdapter.prototype.stringToJson = function (str) {
        return jQuery.parseJSON(str);
    };

    VaadinAdapter.prototype.ajaxGet = function (src, callback) {
        $.ajax({
            url: src,
            success: callback,
            dataType: "html"
        });
    };

    VaadinAdapter.prototype.showToaster = function (message
        , title
        , type
        , toasterPosition
        , animationDuration
        , visibleDuration
        , moveAnimate
        , fadeAnimate) {

        /*visibleDuration=visibleDuration||5000;
        animationDuration=animationDuration||1000;
        type=type||"info";
        var opts = {};
        flexiciousNmsp.UIUtils.mergeObjects(opts,$.ui.toaster.defaults);
        flexiciousNmsp.UIUtils.mergeObjects(opts,{timeout: visibleDuration/1000,position:"tr",speed:animationDuration/1000});

        $('<div><p>'+message+'</p><div>').toaster(opts);
        */
        //        toastr.options.showDuration=visibleDuration||500;
        //        toastr.options.hideDuration=animationDuration||1000;
        //        toastr.options.closeButton= true;
        //        toastr.options.timeOut = 8000;
        type = type || "info";
        type = (type == 'error') ? 'danger' : type;

        //        toastr[type](message,title)


        var str = $('<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert">' +
            '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>' +
            '</button>' +
            message + '.' +
            '</div>');

        setTimeout(function () {
            str.fadeOut(animationDuration || 1000, function () {
                str.remove();
            });
        }, visibleDuration || 500);

        $('.alerts').prepend(str);
    };

    VaadinAdapter.prototype.showTooltip = function (relativeTo, tooltip, dataContext, point, leftOffset, topOffset, offScreenMath, where, container, bounds) {
        flexiciousNmsp.position.processCommand((tooltip.domElement || tooltip), "processElement",
            { "my": "right top", "at": where + " bottom", "of": (relativeTo.domElement || relativeTo), "collision": "fit", "within": (bounds.domElement || bounds) });
    };

    VaadinAdapter.prototype.positionComponent = function (domElementRelativeTo, domElementToPosition, my, at, leftOffset, topOffset) {

        if (!my) my = "left top";
        if (!at) at = "left bottom";
        domElementToPosition = (domElementToPosition.domElement || domElementToPosition);
        flexiciousNmsp.position.processCommand(domElementToPosition
            , "processElement",
            { "my": my, "at": at, "of": (domElementRelativeTo.domElement || domElementRelativeTo), "collision": "fit", offset: (leftOffset || topOffset ? leftOffset + " " + topOffset : null) });

    };

    VaadinAdapter.toastCount = 0;
    flexiciousNmsp.VaadinAdapter = VaadinAdapter;
}());

flexiciousNmsp.UIUtils.adapter = new flexiciousNmsp.VaadinAdapter();
