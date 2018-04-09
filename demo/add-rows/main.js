
var getFooter = function (col) {
    var level = col.level;
    var grid = level.grid;
    return "Total : " + grid.getBodyContainer().itemVerticalPositions.length;
}
var timeSpentFiltering = 0;
var timeSpentSorting = 0;
var timeSpentRedering = 0;


var grid;
var maxRecords = 15000;
var currentIntervalId = -1;
var idx = 0;

function getRandom(minNum, maxNum) {
    return Math.ceil(Math.random() * (maxNum - minNum + 1)) + (minNum - 1);
};

var dataSource = [];
function processDeltaArray(){
    if(dataSource[0].add){
        addItems()
    }
    if(dataSource[0].update){
        updateItems()
    }
    if(dataSource[0].delete){
        deleteItems()
    }
    if(dataSource[0].childrenModified){
        modifiedChildren();
    }
}

function updateDataProvider(elem) {
    readJsonFile('data/GridAPITestDATA_' + elem.value.toUpperCase() + '.json', function(data) {
        dataSource = data;
        grid.setDataProvider(dataSource[0].before);
        grid.expandAll();
    });
}

function updateDataProviderFromConfig(config) {
    try {
        dataSource = JSON.parse(config);
        grid.setDataProvider(dataSource[0].before);
        grid.expandAll();
    } catch(e) {
        console.log(e);
    }
}

function addItems() {
    var action = 'add';
    var items = dataSource[0].add;

    grid.processDelta(action, items, document.querySelector('hierarchical-grid-demo').$.cbFilterRows.checked, document.querySelector('hierarchical-grid-demo').$.cbSortRows.checked, document.querySelector('hierarchical-grid-demo').$.cbUpdateDataProvider.checked)

    setTimeout(function() {
        if(dataSource[0].after && !grid.getDataProvider().equals(dataSource[0].after))
            updateLogger(action, items);
    }, [], 250);
}

function deleteItems() {
    var action = 'remove';
    grid.processDelta(action, dataSource[0].delete, document.querySelector('hierarchical-grid-demo').$.cbFilterRows.checked, document.querySelector('hierarchical-grid-demo').$.cbSortRows.checked, document.querySelector('hierarchical-grid-demo').$.cbUpdateDataProvider.checked);
    if(dataSource[0].after && !grid.getDataProvider().equals(dataSource[0].after))
       updateLogger(action, dataSource[0].delete);
}

function modifiedChildren() {
    var action = 'childrenModified';
    grid.processDelta(action, dataSource[0].childrenModified, document.querySelector('hierarchical-grid-demo').$.cbFilterRows.checked, document.querySelector('hierarchical-grid-demo').$.cbSortRows.checked, document.querySelector('hierarchical-grid-demo').$.cbUpdateDataProvider.checked);
    if(dataSource[0].after && !grid.getDataProvider().equals(dataSource[0].after))
       updateLogger(action, dataSource[0].childrenModified);
}

function updateItems() {
    var action = 'update';
    //moving the copy code from here to core. In core we should be updating the dataprovider, not here.
    grid.processDelta(action, dataSource[0].update, document.querySelector('hierarchical-grid-demo').$.cbFilterRows.checked, document.querySelector('hierarchical-grid-demo').$.cbSortRows.checked, document.querySelector('hierarchical-grid-demo').$.cbUpdateDataProvider.checked);
    if(dataSource[0].after && !grid.getDataProvider().equals(dataSource[0].after))
       updateLogger(action, dataSource[0].update);
}


function updateLogger(action, items) {
    var logger = document.querySelector('hierarchical-grid-demo').$.loggerArea;

    var log = logger.innerHTML || '';

    log += '<h3>::===================  ' + action + " rows" + '  ===================::</h3>';
    [].forEach.call(items, function(item) {
        log += '<p>';
        [].forEach.call(Object.keys(item), function(key) {
            if(key !== 'children')
                log += '<span class="field">' + key + ': </span>' + item[key] + ' ';
            else {
                log += '<br><span class="field"> >>>>>>>>> children <<<<<<<<<< </span>';
                [].forEach.call(item[key], function(child) {
                    log += '<p>';
                    [].forEach.call(Object.keys(child), function(childkey) {
                        log += '<span class="field">' + childkey + ': </span>' + child[childkey] + ' ';
                    });
                    log += '</p>';
                });
                log += '<span class="field"> <<<<<<<<<< end of children >>>>>>>>> </span>';
            }
        });
        log += '</p><br>';
    });

    log += '<br>';

    logger.innerHTML = log;
    logger.scrollTop = logger.scrollHeight;
}

const copyProperties = function (src, dest, override) {

    if (typeof override === 'undefined') override = false;
    for (var key in src) {
        if (!dest.hasOwnProperty(key) || override) {
            dest[key] = src[key];
        }
    }
};

Array.prototype.equals = function (arr, isEquals) {

    isEquals = isEquals || true;

    if(!isEquals) return isEquals;

    if( this.length != arr.length )
       return false;

    for (var i = 0; i < this.length; i++) {
        var src = this[i];
        var dest = arr[i];

        if( Object.keys(src).length != Object.keys(dest).length )
            return false;
            
        for (var key in src) {
            if (!(isEquals = (dest.hasOwnProperty(key) || (dest[key] === src[key])))) {
                break;
            } else if( key === 'children') {
                isEquals = !!src[key].equals(dest[key], isEquals);
                if( !isEquals )
                    break;
            }
        }
    }
    return isEquals;
};

function readJsonFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(JSON.parse(rawFile.responseText));
        }
    }
    rawFile.send(null);
}

function toggleLoadConfigButtonState(elem) {
    var textarea = elem;
    var loadConfigBtn = textarea.parentElement.nextElementSibling;
    setTimeout(function() {
        loadConfigBtn.disabled = !textarea.value;
    }, 0);
}
