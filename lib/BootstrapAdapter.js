/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
(function () {

    "use strict";
    var BootstrapAdapter;
    /**
     * A utility class that maps utility functions from Flexicious into JQuery
     * @constructor
     * @namespace com.flexicious.adapters
     */
    BootstrapAdapter = function () {

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


    flexiciousNmsp.BootstrapAdapter = BootstrapAdapter; //add to name space
    BootstrapAdapter.prototype.typeName = BootstrapAdapter.typeName = "BootstrapAdapter";//for quick inspection
    BootstrapAdapter.prototype.getClassNames = function () { //for support of "is" keyword
        return ["TypedObject", this.typeName];
    };

    /**
     * Calls the Jquery html method on the parent, passing in innner html.
     * @param parent
     * @param innerHTML
     */
    BootstrapAdapter.prototype.setHtml = function (parent, innerHTML) {
        $(parent).html(innerHTML);
    };
    /**
     * Gets the child element of gridDiv that has the specified class name.
     * There must be at least one div with that class name otherwise this method will throw an error.
     * @param gridDiv   The div to search
     * @param className The class to search
     */
    BootstrapAdapter.prototype.getElementByClassName = function( gridDiv, className) {
        return $(gridDiv).find("." + className)[0];
    };
    BootstrapAdapter.prototype.addChild = function (parent, child) {
        return $(parent).append(child);
    };
    BootstrapAdapter.prototype.insertBefore = function (child, refChild) {
        return $(child).insertBefore(refChild);
    };
    BootstrapAdapter.prototype.removeChild = function (parent, child) {
        return $(child).remove();
    };


    BootstrapAdapter.prototype.findElementWithClassName = function (parent, containerClassName) {
        return $(parent).find('.' + containerClassName).toArray()[0];
    };

    BootstrapAdapter.prototype.findElementsWithClassName = function (parent, containerClassName) {
        return $(parent).find('.' + containerClassName).toArray();
    };

    BootstrapAdapter.prototype.findFirstElementByTagName = function (parent, tagName) {
        return $(parent).find('>' + tagName).toArray()[0];
    };
    BootstrapAdapter.prototype.ieVersion = -1;
    BootstrapAdapter.prototype.isIE = function () {
        if(BootstrapAdapter.prototype.ieVersion = -1){
            var myNav = navigator.userAgent.toLowerCase();
            BootstrapAdapter.prototype.ieVersion=(myNav.indexOf('trident') != -1) ?11:(myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : 0;
            if(BootstrapAdapter.prototype.ieVersion==11)
            {
                BootstrapAdapter.ieVersion=11;
            }
        }
        return BootstrapAdapter.prototype.ieVersion;
    };

    BootstrapAdapter.prototype.isMoz = function () {
        return $.browser?$.browser.mozilla:navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    };

    BootstrapAdapter.prototype.isWebKit = function () {
        return $.browser?$.browser.webkit: 'WebkitAppearance' in document.documentElement.style;
    };

    BootstrapAdapter.prototype.setupAutoComplete = function (input, options) {
        if (options.autoCompleteSource) {
            options.source = options.autoCompleteSource;
        }
        $(input).autocomplete(options);
    };

    BootstrapAdapter.prototype.setupInputMask = function(input,options){
        if (options.inputMask) {
            options.mask = options.inputMask;
        }
        $(input).mask(options.mask, options);
    };

    BootstrapAdapter.prototype.setupWaterMark=function(input,options){
        if(options.watermark)
            options.watermark=options.watermark;
        if(options.watermarkStyle)
            options.watermarkStyle=options.watermarkStyle;

        $(input).Watermark(options.watermark,options.watermarkStyle);
    };

    BootstrapAdapter.prototype.offset=function(elem){
        return $(elem).offset()
    };

    BootstrapAdapter.prototype.showDialog=function(elem,parent,modal,w,h,title){
//        $(elem).dialog({"modal":modal,minHeight:h + 50,minWidth:w,zIndex: 700,"title":title,close: function(ev, ui) {
//            $(this).remove();
//        }});
        var dialog=$('<div></div>')
            .attr('class','modal fade')
            .attr('tabindex','-1')
            .attr('role','dialog')
            .append(
                $('<div></div>')
                    .attr('class','modal-dialog modal-lg')
                    .append(
                        $('<div></div>')
                            .attr('class','modal-content')
                            .append(
                                $('<div></div>')
                                    .attr('class','modal-header')
                                    .append('<button type="button" class="close" data-dismiss="modal">' +
                                        '<span aria-hidden="true">&times;</span>' +
                                        '<span class="sr-only">Close</span></button>' +
                                        '<h4 class="modal-title">' + title+ '</h4>'
                                    )
                            ).append(elem)

                            )
                    );
        $(elem).data('dia',dialog)
        dialog.on('hidden.bs.modal',function(){
            dialog.remove();

        }).modal();
    };

    BootstrapAdapter.prototype.showConfirm=function(elem,parent,modal,w,h,title,yesFunc,noFunc){
//        $(elem).dialog({"modal":modal,minHeight:h + 50,minWidth:w,zIndex: 700,"title":title,close: function(ev, ui) {
//            $(this).remove();
//        }});
        var dialog=$('<div></div>')
            .attr('class','modal fade')
            .attr('tabindex','-1')
            .attr('role','dialog')
            .append(
            $('<div></div>')
                .attr('class','modal-dialog')
                .append(
                $('<div></div>')
                    .attr('class','modal-content')
                    .append(
                    $('<div></div>')
                        .attr('class','modal-header')
                        .append('<button type="button" class="close" data-dismiss="modal">' +
                            '<span aria-hidden="true">&times;</span>' +
                            '<span class="sr-only">Close</span></button>' +
                            '<h4 class="modal-title">' + title+ '</h4>'
                    )
                    ).append(
                        $('<div></div>')
                            .attr('class','modal-body')
                            .html('<h4>'+elem+'</h4>')

                    ).append($('<div class="modal-footer"></div>')
                            .append($('<button type="button" class="btn btn-default" data-dismiss="modal">No</button>').on('click',noFunc))
                            .append($('<button type="button" class="btn btn-primary" data-dismiss="modal">Yes</button>').on('click',yesFunc)))
                )
            );

        dialog.on('hidden.bs.modal',function(){
            dialog.remove();
        }).modal();
    };

    BootstrapAdapter.prototype.setDialogTitle=function(elem,title){
        //this.findElementWithClassName(elem.parentNode,"ui-dialog-title").innerHTML= title;
        this.findElementWithClassName(elem.parentNode,"modal-title").innerHTML= title;

    };

    BootstrapAdapter.prototype.removeDialog=function(elem){
       // $(elem).remove();
        if($(elem).data('dia'))
            $(elem).data('dia').modal('hide');
        else
            $(elem).remove();
    };
    BootstrapAdapter.prototype.buildUl=function(cols){
        var html='<ul>';
        for (var j=0;j<cols.length;j++){
            html+="<li class='flexiciousSortPopupMenuItem' > <a class='"+(cols[j].type=='separator' ? 'separator' :'' )+"' href='#' uniqueidentifier='"+cols[j].data+"'>"+cols[j].label +"</a>";
            if(cols[j].children&&cols[j].children.length>0){
                html+=this.buildUl(cols[j].children);
            }
            html+="</li>";
        }
        html+="</ul>";
        return html;
    }
    BootstrapAdapter.prototype.createMenu=function(menuItems,menuTrigger,onMenuItemClick){;
            $(menuTrigger).flxsmenu({ content:this.buildUl(menuItems), flyOut: true,onMenuItemClick:onMenuItemClick });
    };

    BootstrapAdapter.prototype.destroyMenu=function(trigger){
        $(trigger).remove();
    };
    BootstrapAdapter.prototype.createDateTimePickerEditor=function(domElement,dateFormat,dflt){
        this.createDateTimePicker(domElement.getTextBox(),dateFormat,dflt);
    }
    BootstrapAdapter.prototype.createDateTimePicker=function(domElement,dateFormat,dflt){
        if(domElement.dpCreated)
        {
            return;
        }

        domElement.dpCreated=true;
        if(domElement.domElement){
            domElement=domElement.getTextBox();
        }


        $(domElement)
            .wrap('<div class="input-group date" ></div>')
            .after($('<span class="input-group-addon"><span  class="glyphicon glyphicon-calendar"></span></span>').on('click',function(){
                $(domElement).data("DateTimePicker").show({type:''});
            }))
            .addClass('form-control ')
        ;

        $(domElement).datetimepicker({
            format:dateFormat,//dateFormat
            pickTime:false
            //showOn:"both"
            //,buttonImageOnly:true,
            //changeYear:true,
           // defaultDate:dflt
           // buttonImage: flexiciousNmsp.Constants.IMAGE_PATH+'/date_picker.png'
        });
        if(dflt&&dateFormat)
            $(domElement).data("DateTimePicker").setDate(dflt);

        //$('ui-datepicker-div').focus();

    };
    BootstrapAdapter.prototype.getCurrentDatePicker=function(){
        return $('ui-datepicker-div');//???
    };
    BootstrapAdapter.prototype.getDateValue=function(dateStr,dateFormat){

        return new Date(moment(dateStr,dateFormat));

    };


    BootstrapAdapter.prototype.formatDate=function(date,dateFormat){
        return moment(date).format(dateFormat);
    };

    BootstrapAdapter.prototype.isDatePickerElement=function(elem){

        return $(elem).data("DateTimePicker")!=null;
/*
        if(elem.tagName=="OPTION")return true;//sometimes this does not get you the ancestor.
        var ans=this.findAncestorByClassName(elem,"ui-datepicker");

        return (ans?ans:false);
   */
    };

    BootstrapAdapter.prototype.setText=function(elem,text){
        return  $(elem).text(text);
    };

    BootstrapAdapter.prototype.setHtml=function(elem,html){
        return  $(elem).html(html);
    };

    BootstrapAdapter.prototype.findAncestorByClassName=function(elem,className){
        return $(elem).closest('.'+className)[0];
    };

//
//
//    BootstrapAdapter.prototype.showTooltip=function(relativeTo, tooltip, dataContext,point,leftOffset,
//                                 topOffset,offScreenMath,where,container,bounds){
//
//       $(tooltip.domElement||tooltip).position({"my":"right top","at":where+" bottom","of":$(relativeTo.domElement||relativeTo),"collision":"fit","within":$(bounds.domElement||bounds) });
//
//    };
//
//    BootstrapAdapter.prototype.positionComponent=function(relativeTo, tooltip, my, at, leftOffset,topOffset){
//
//        if(!my)my="left top";
//        if(!at)at="left bottom";
//
//        $(tooltip.domElement||tooltip).position({"my":my,"at":at,"of":$(relativeTo.domElement||relativeTo),"collision":"fit",
//            offset:(leftOffset||topOffset?leftOffset + " " + topOffset:null) });
//
//    };
    BootstrapAdapter.prototype.stringToJson=function(str){
        return  jQuery.parseJSON(str);
    };

    BootstrapAdapter.prototype.ajaxGet=function(src,callback){
        $.ajax({
            url: src,
            success: callback,
            dataType:"html"
        });
    };
    BootstrapAdapter.prototype.showToaster=function(message
        ,title
        ,type
        ,toasterPosition
        ,animationDuration
        ,visibleDuration
        ,moveAnimate
        ,fadeAnimate){

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
        type=type||"info";
        type=(type=='error')?'danger':type;

//        toastr[type](message,title)


        var str=$('<div class="alert alert-'+type+' alert-dismissible" role="alert">'+
                    '<button type="button" class="close" data-dismiss="alert">' +
                        '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>' +
                    '</button>'+
                    message+'.'+
                '</div>');

        setTimeout(function(){
            str.fadeOut(animationDuration||1000,function(){
                str.remove();
            });
        },visibleDuration||500);

        $('.alerts').prepend(str);
    };
    BootstrapAdapter.prototype.showTooltip = function (relativeTo, tooltip, dataContext, point, leftOffset, topOffset, offScreenMath, where, container, bounds) {
        flexiciousNmsp.position.processCommand((tooltip.domElement || tooltip), "processElement",
            {"my":"right top", "at":where + " bottom", "of":(relativeTo.domElement || relativeTo), "collision":"fit", "within":(bounds.domElement || bounds) });
    };

    BootstrapAdapter.prototype.positionComponent = function (domElementRelativeTo, domElementToPosition, my, at, leftOffset, topOffset) {

        if (!my)my = "left top";
        if (!at)at = "left bottom";
        domElementToPosition = (domElementToPosition.domElement || domElementToPosition);
        flexiciousNmsp.position.processCommand(domElementToPosition
            , "processElement",
            {"my":my, "at":at, "of":(domElementRelativeTo.domElement || domElementRelativeTo), "collision":"fit", offset:(leftOffset || topOffset ? leftOffset + " " + topOffset : null) });

    };

    BootstrapAdapter.toastCount=0;
    flexiciousNmsp.BootstrapAdapter = BootstrapAdapter;
}());

flexiciousNmsp.UIUtils.adapter = new flexiciousNmsp.BootstrapAdapter();