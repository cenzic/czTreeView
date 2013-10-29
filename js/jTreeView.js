/**
* Copyright © Quoc Quach 2013-2014
* Author: Quoc Quach
* Email: quoc_cooc@yahoo.com
* Released under the MIT license
* Date: 10/29/2013
*/
(function($) {
	$.fn.jTreeView = function (data, collapsed) {
		if (!data) return;
		renderTreeView(this, data);
		setExpandableTree(this, collapsed);
		interactiveTree(this);
	};
			
	/**
	 * Set of function for selected tree
	 */
	
	/**
	 * Move current select branches up 1 level. If it hit the top then just stay as is. 
	 */
	function moveUp(event,item){
		console.log(item);
	}
	
	/**
	 * Move current select branches down 1 level
	 */
	function moveDown(){
		
	}
	
	/**
	 * Move current selected branches to top of the tree.
	 */
	function moveToTop(){
		
	}
	
	/**
	 * Move current selected branches to bottom of the tree. 
	 */
	function moveToBottom(){
		
	}
	
	/**
	 * disable the selected branches, which will not be include in serialize tree.
	 */
	function disable(){
		
	}	
	
	/**
	 * enable a disabled branch
	 */
	function enable(){
		
	}
	
	/**
	 * add extra node manually
	 */
	function addNode(){
		
	}
	
	/**
	 * delete selected branches, permanent, cannot be restore, for temporary using disabled or enabled.
	 */
	function deleteBranch(){
		
	}
	
	/**
	 * create a selected node or branch as source to create reference 
	 */
	function createReference(){
		
	}
	
	/**
	 * add reference node from the source
	 */
	function addReference(){
		
	}
	
	/**
	 * create a duplicated branches
	 */
	function duplicate(){
		
	}	
	
	/**
	 * create attribute or property of each selected node.
	 */
	function setFlag(){
		
	}
	
	/**
	 * create array of node from selected branches, if nothing selected, the whole tree will be serialize
	 */
	function serialize(){
		
	}
	
	/**
	 * after set the divisible flag for each branch, call divideTree to create multiple tree from original tree with share common nodes.
	 * which not being set as divisible
	 */
	function divideTree(){
		
	}
	
	/**
	 * group selected nodes into the branch
	 */
	function group(){
		
	}
	//===================================================
	var submenu1 = {
		label: "test submenu 1",
		tooltip:"testing sub menu 1",
		handlers: {
			"click":function(){console.log("submenu 1");}
		}
	};
	var submenu2 = {
		label: "test submenu 2",
		tooltip:"testing sub menu 2",
		handlers: {
			"click":function(){console.log("submenu 2");}
		}
	};

	var subMenu = [
	               submenu1,
	               submenu2
	               ];	
	//====================================================
	var moveToTopItem = {
			label: "Move to top",
			tooltip: "move selected node to top of the tree",
			handlers:{
				"click":moveToTop
			}			
		};
	var moveUpItem = {
			label: "Move up",
			tooltip: "Move selected items up one by one",
			handlers:{
				"click":moveUp
			},
			subMenu: subMenu
	}
	var moveDownItem = {
			label: "Move down",
			tooltip: "Move selected items down one by one",
			handlers:{
				"click":moveDown
			}
	}
	var moveToBottomItem = {
			label: "Move to bottom",
			tooltip: "Move selected items to bottom of the tree",
			handlers:{
				"click":moveToBottom
			}
	}
	var disableItem = {
			label: "Disable",
			tooltip: "disable a selected node or branch",
			handlers:{
				"click":moveUp
			}
	}
	var enableItem = {
			label: "Enable",
			tooltip: "enable a disabled node",
			handlers:{
				"click":enable
			}
	}
	var addNodeItem = {
			label: "Add node",
			tooltip: "manual add a node before selected node",
			handlers:{
				"click": addNode
			}
	};
	var deleteBranchItem = {
			label: "Delete",
			tooltip: "delete a selected node or branch",
			handlers:{
				"click": deleteBranch
			}
	};
	var createReferenceItem = {
			label: "Create node reference",
			tooltip: "Create reference from a selected node",
			handlers:{
				"click": createReference
			}
	};
	var addReferenceItem = {
			label: "Add reference",
			tooltip: "insert a node reference before selected node",
			handlers:{
				"click": addReference
			}
	};
	var duplicateItem = {
			label: "Duplicate",
			tooltip: "create a duplicate node or branch",
			handlers:{
				"click":duplicate
			}
	};
	var setFlagItem = {
			label: "Set flag",
			tooltip: "set attribute or property of selected nodes",
			handlers:{
				"click":setFlag
			}
	};
	var serializeItem = {
			label: "Serialize",
			tooltip: "Serialize a selected branch",
			handlers:{
				"click":serialize
			}
	};
	var divideTreeItem = {
			label: "Divide tree",
			tooltip: "divide tree into sub trees",
			handlers:{
				"click": divideTree
			}
	};
	var groupItem = {
			label: "Group item",
			tooltip: "group selected items base on paths",
			handlers:{
				"click": group
			},
			subMenu: subMenu
	};
	var menu = 	[
	           	 moveToTopItem,
	           	 moveUpItem,
	           	 moveDownItem,
	           	 moveToBottomItem,
	           	 disableItem,
	           	 enableItem,
	           	 addNodeItem,
	           	 deleteBranchItem,
	           	 createReferenceItem,
	           	 addReferenceItem,
	           	 duplicateItem,
	           	 setFlagItem,
	           	 serializeItem,
	           	 divideTreeItem,
	           	 groupItem,
	 	        ];
	var isNodeSelected = false;	
	function interactiveTree(jObj){
		var nodes = jObj.find("li");
		nodes.click(selectNode);		
		nodes.jMenu({trigger:"rightClick", 
					  items: menu,
				      conditional:function(jObj){
				    	  return jObj.hasClass("treeViewSelected") || jObj.parents("li.treeViewSelected").length>0;
				      }
					});
		$(document).click(function(e){			
			if(isNodeSelected && e.which!=3){
				//console.log("document.clearSelectNode : %s",e.which);
				$(".treeViewSelected").removeClass("treeViewSelected");
			}
		});
	}
	//================================================================================================
	
	function clearSelected(jNodes,setFlag){
		setFlag = setFlag==undefined ? false : true; 
		//console.log("clearSelected");
		jNodes.removeClass("treeViewSelected");
		jNodes.find("li").removeClass("treeViewSelected");
		isNodeSelected = setFlag;			
	}
	
	function selectNode(e){								
		//console.log("node name: %s",e.target.nodeName);
		if(e.target.nodeName.toLowerCase()=="ul")return;
		var jNode = $(e.target);
		if(e.target.nodeName.toLowerCase()=="span") jNode = jNode.parent();
		
		if(jNode.hasClass("treeViewSelected")){			
			if(jNode.parents("li.treeViewSelected").length==0){
				if(e.ctrlKey){
					clearSelected(jNode,true);
				}else{
					clearSelected($("li.treeViewSelected"));
				}
			}else{		
				if(e.ctrlKey){
					//console.log("clear whole thing");
					clearSelected(jNode.parents("li.treeViewSelected"));
					selectNode(e);
				}else{					
					//console.log("clear all then select one");
					clearSelected($("li.treeViewSelected"));
					selectNode(e);
				}				
			}									
		}else{			
			setTimeout(function(){
				//console.log("add selected node");
				jNode.addClass("treeViewSelected");
				jNode.find("li").addClass("treeViewSelected");
			},1);
			//console.log("isNodeSelected: %s, e.ctrlKey: %s",isNodeSelected, e.ctrlKey);
			
			if(isNodeSelected && !e.ctrlKey) clearSelected($("li.treeViewSelected"));
			isNodeSelected = true;
			
		}
		
		e.stopPropagation();
		return false;
				
	}
	
	function renderTreeView(jObj, data) {
		var ul = $('<ul class="treeView">');
		for (var i = 0; i < data.length; i++) {
			var li = $('<li><span class="paddingBorder">&nbsp;</span></li>');
			var value = $('<span>' + data[i].Value + '</span>');
			li.append(value);
			if (data[i].ChildNodes && data[i].ChildNodes.length > 0) {
				value.addClass("treeViewGroup");
				renderTreeView(li, data[i].ChildNodes);
			}
			ul.append(li);
			if(i<data.length-1) ul.append("<br/>");
		}
		jObj.append(ul);
	}

	function expandHelper(jIcon, collapsed) {
		if (collapsed) {
			jIcon.html("+");
			jIcon.css("line-height", "10px");
			jIcon.siblings("ul").hide(300);
		} else {
			jIcon.html("-");
			jIcon.css("line-height", "6px");
			jIcon.siblings("ul").show(300);
		}
	}

	function setExpandableTree(jObj, collapsed) {
		jObj.find(".treeView").each(function () {
			var jUl = $(this);
			if (jUl.parent().get(0).nodeName.toLowerCase() == "li") {
				var icon = $('<span class="expandIcon"/>');
				jUl.parent().prepend(icon);
				expandHelper(icon, collapsed);
				icon.click(function () {
					expandHelper($(this), $(this).html() == "-");
				});
			}
		});
		jObj.find("li:last-child").each(function () {
			var jLi = $(this);
			jLi.css("border-left", "none");
			jLi.css("padding-top", "1px");
			if (jLi.children("ul").length == 0) {
				jLi.prepend('<span class="vertPaddingBorder"></span>');
			}
		});
	}
	
	
})(jQuery);
