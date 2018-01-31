(function () {
    var InlineStyles = function () {

    };
    flexiciousNmsp.InlineStyles = InlineStyles;

    InlineStyles.getInfo = function (cell) {
        var o = {};

        var grid = cell.level.grid;
        var rowInfo = cell.rowInfo;
        var rowIndex = rowInfo.rowPositionInfo.rowInedx;
        var level = cell.level, depth = 1;
        var column = cell.getColumn();

        o.isDataRow = false;

        if (rowInfo && rowInfo.getIsDataRow()) {

            o.isDataRow = true;
            o.level = 1;
            o.isFirstRow = false;
            o.isLastRow = false;
            o.isOddRow = null;
            o.isFirstColumn = false;
            o.isLastColumn = false;
            o.isOddColumn = null;
            o.isChild = false;
            o.isGroupHead = false;
            o.isChildGroup = false;
            o.hasChildren = false;
            o.isFirstChild = false;
            o.isLastChild = false;
            o.prevHasChildren = false;
            o.nextHasChildren = false;
            o.hasErrors = false;
            o.isItemSelected = false;
            o.isCellSelected = false;
            o.isHovered = false;
            o.isPaddingCell = cell.implementsOrExtends('FlexDataGridPaddingCell');

            var verticalPositions = grid.getBodyContainer().itemVerticalPositions;
            var rowPositionInfo = rowInfo.rowPositionInfo;
            var rowPositionIndex = verticalPositions.indexOf(rowPositionInfo);
            
            var children = grid.getChildren(rowInfo.getData(), level) || [];
            var hasChildren = children.length > 0;

            var prevRowPositionInfo = verticalPositions[rowPositionIndex - 1] || null;
            var nextRowPositionInfo = verticalPositions[rowPositionIndex + 1] || null;

            if (level) {
                o.level = level.getNestDepth();
                // classesToAttach.push(cssClassPrefix + cssClassForLevelPrefix + level.getNestDepth());
            }

            o.isOddRow = (rowInfo.rowPositionInfo.getRowIndex() % 2 !== 0);
            // classesToAttach.push(cssClassPrefix + (odd ? cssClassForOddRow : cssClassForEvenRow));

            if (rowPositionIndex == 0) {
                o.isFirstRow = true;
                // classesToAttach.push(cssClassPrefix + cssClassForFirstRow);
            } else if (rowPositionIndex == verticalPositions.length - 1) {
                o.isLastRow = true;
                // classesToAttach.push(cssClassPrefix + cssClassForLastRow);
            }

            if (column) {
                var columns = grid.getColumns();
                o.colIndex = column.getColIndex();
                // classesToAttach.push(cssClassPrefix + cssClassForColumnPrefix + colIndex);
                o.isOddColumn = o.colIndex % 2 !== 0;
                // classesToAttach.push(cssClassPrefix + (colIndex % 2 !== 0 ? cssClassForOddColumn : cssClassForEvenColumn));

                if (o.colIndex == 0) {
                    o.isFirstColumn = true;
                    // classesToAttach.push(cssClassPrefix + cssClassForFirstColumn);
                } else if (o.colIndex == columns.length - 1) {
                    o.isLastColumn = true;
                    // classesToAttach.push(cssClassPrefix + cssClassForLastColumn);
                }
            }

            if(hasChildren) {
                o.hasChildren = true;
                o.isGroupHead = true;
                if(level.getNestDepth() > 1) {
                    o.isChildGroup = true;
                }
            }
            
            if (prevRowPositionInfo) {
                if(grid.getChildren(prevRowPositionInfo.rowData, cell.level).length > 0) {
                    o.prevHasChildren = true; //prevRow.rowData.grpId !== 0;
                }
                if(prevRowPositionInfo.levelNestDepth < rowPositionInfo.levelNestDepth) {
                    o.isFirstChild = true;
                }
            }
    
            if (nextRowPositionInfo) {
                if(grid.getChildren(nextRowPositionInfo.rowData, cell.level).length > 0) {
                    o.nextHasChildren = true; //nextRow.rowData.grpId !== 0;
                }
            }
            
            //This condition, I am checking if current row iteration is a part of a group(curRowData.grpId !== 0) and if it is a part of a group,
            //I will try to determind if this row is the last child for the group(or the only child of the group).
            //isLastChild = curRowData.grpId !== nextRow.rowData.grpId && nextRow.rowData.grpId === 0;
            if((!nextRowPositionInfo && hasChildren) || (level.getNestDepth() > 1 && nextRowPositionInfo && nextRowPositionInfo.levelNestDepth < rowPositionInfo.levelNestDepth)) {
                o.isLastChild = true;
            }

            if (level.grid.hasErrors && level.grid.getError(rowInfo.getData())) {
                o.hasErrors = true;
                // classesToAttach.push(cssClassPrefix + cssClassForErrorCell);
            }
            else if (level.isItemSelected(rowInfo.getData()) && level.grid.getIsRowSelectionMode()) {
                o.isItemSelected = true;
                // classesToAttach.push(cssClassPrefix + cssClassForSelectedRow);
            }
            else if (column && level.isCellSelected(rowInfo.getData(), column)) {
                o.isCellSelected = true;
                // classesToAttach.push(cssClassPrefix + cssClassForSelectedCell);
            }

            if (grid.currentCell && grid.currentCell.rowInfo === rowInfo) {
                o.isHovered = true;
                // classesToAttach.push(cssClassPrefix + cssClassForActiveCell);
            }
        }

        return o;
    };

    InlineStyles.getCellBackgroundColor = function (cell) {
        var i = flexiciousNmsp.InlineStyles.getInfo(cell);
        if (i.isDataRow) {
            // if (i.isHovered) return 0xBDD7FA;
            // if (i.isItemSelected) return 0x0D66DB;
            // if (i.isLastRow) return 0x600000;
            // if (i.level == 1 && i.hasChildren) return 0x2A4D77;
            // return !i.isOddRow ? 0x262626 : 0x404040;
            // if (i.level > 1 || !i.hasChildren) return !i.isOddRow ? 0x262626 : 0x404040;
            return 0x222222;
        }
        return null;
    };

    InlineStyles.getCellTextColor = function (cell) {
        var i = flexiciousNmsp.InlineStyles.getInfo(cell);
        if (i.isDataRow) {
            // if (i.isHovered) return 0x000000;

            return 0xffffff;
        }
        return null;
    };

    InlineStyles.getCellBorder = function (cell) {
        var i = flexiciousNmsp.InlineStyles.getInfo(cell);
        if (i.isDataRow) {
            var style = cell.domElement.style;

            style.border = 'none'; // remove all border
            
            style.borderBottom = '1px solid #69696C';
            if(i.level % 2 != 0 || !i.isPaddingCell) style.borderRight  = '1px solid #69696C';

            if(i.hasChildren) style.borderTop  = '3px solid #69696C';
            if(i.isChildGroup && i.isPaddingCell) style.borderLeft = '3px solid #FFFF00';

            if(i.isLastChild && !i.nextHasChildren) style.borderBottom = '4px solid #69696C';

            return false;
        }
        return true;
    };
    
})();
