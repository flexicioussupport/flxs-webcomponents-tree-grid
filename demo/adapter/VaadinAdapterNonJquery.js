/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
(function () {

    "use strict";
    var VaadinAdapterNonJquery;

    /**
     * A utility class that maps utility functions from Flexicious into JQuery
     * @constructor
     * @namespace com.flexicious.adapters
     */
    VaadinAdapterNonJquery = function () {
        flexiciousNmsp.VaadinAdapter.apply(this);
    };

    flexiciousNmsp.VaadinAdapterNonJquery = VaadinAdapterNonJquery; //add to name space
    VaadinAdapterNonJquery.prototype.typeName = VaadinAdapterNonJquery.typeName = "VaadinAdapterNonJquery";//for quick inspection

    VaadinAdapterNonJquery.prototype.e = function(element, parent) {
        const _element = document.createElement(element);
        if( typeof parent === 'undefined' )
            document.body.appendChild(_element);
        else
            parent.appendChild(_element);

        return _element;
    }

    VaadinAdapterNonJquery.prototype.setHtml = function (parent, innerHTML) {
        parent.innerHTML = innerHTML;
    }

    VaadinAdapterNonJquery.prototype.getClassNames = function () { //for support of "is" keyword
        return ["VaadinAdapterNonJquery", "VaadinAdapter", "TypedObject"];
    };

    VaadinAdapterNonJquery.prototype.getElementByClassName = function (gridDiv, className) {
        return document.querySelector(gridDiv).querySelector("." + className);
    };

    VaadinAdapterNonJquery.prototype.addChild = function (parent, child) {
        return parent.appendChild(child);
    };

    VaadinAdapterNonJquery.prototype.insertBefore = function (child, refChild) {
        return refChild.parentNode.insertBefore(child, refChild);
    };

    VaadinAdapterNonJquery.prototype.removeChild = function (parent, child) {
        return parent.removeChild(child);
    };

    VaadinAdapterNonJquery.prototype.findElementWithClassName = function (parent, containerClassName) {
        return parent.querySelector('.' + containerClassName);
    };

    VaadinAdapterNonJquery.prototype.findElementsWithClassName = function (parent, containerClassName) {
        return parent.querySelectorAll('.' + containerClassName);
    };

    VaadinAdapterNonJquery.prototype.findFirstElementByTagName = function (parent, tagName) {
        return parent.querySelector(tagName);
    };

    VaadinAdapterNonJquery.prototype.isMoz = function () {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    };

    VaadinAdapterNonJquery.prototype.isWebKit = function () {
        var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        return (isChrome || isSafari);
    };

    VaadinAdapterNonJquery.prototype.removeDialog = function (elem) {
        // $(elem).remove();
        if (elem['data-property']['dia'])
            elem['data-property']['dia'].toggle();
        else
            elem.parentNode.removeChild(elem);
    };

    VaadinAdapterNonJquery.prototype.showToaster = function (message
        , title
        , type
        , toasterPosition
        , animationDuration
        , visibleDuration
        , moveAnimate
        , fadeAnimate) {

        const adapter = this;

        if( adapter.findFirstElementByTagName(document.body, 'android-toast' )) {
            adapter.findFirstElementByTagName(document.body, 'android-toast').toggle();
            return;
        }

        Polymer({
            is: 'android-toast',
            ready: function() {
                const toast = adapter.e('paper-toast', this);
                toast.setAttribute('id', 'toast0');
                toast.setAttribute('text', message);
                toast.setAttribute('duration', visibleDuration);
                toast.setAttribute('alwaysOnTop', true);
                toast.addEventListener('opened-changed', function(e) {

                    setTimeout(function(target) {
                        target.updateStyles({
                            '--paper-toast-background-color': '#dadada',
                            '--paper-toast-color': '#008000',
                            'display': 'flex',
                            'align-items':'center',
                            'width': '100%'
                        });
                    }, 100, e.target);

                });

                const closeToast = adapter.e('paper-button', toast);
                closeToast.innerText = 'Close';
                closeToast.style.float = 'right';
                closeToast.style.marginLeft = '100px';
                closeToast.onclick = function(e) {
                    this.offsetParent.toggle();
                }
            },
            toggle: function() {
                this.firstChild.toggle();
            },
            attached: function() {
                this.firstChild.open();
            }
        });
        
        adapter.e('android-toast');
    };

})();
