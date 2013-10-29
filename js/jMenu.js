/**
* Copyright © Quoc Quach 2013-2014
* Author: Quoc Quach
* Email: quoc_cooc@yahoo.com
* Released under the MIT license
* Date: 10/29/2013
*/
(function($) {
	var defaultOptions = {
		trigger : "leftClick", //rightClick
		items : [],
		conditional: null,// conditional function, return true to show false to not show.
		position: "auto" // "auto", right, left, bottom, top
	//make it simple only on level.
	}
	function getMenuPos(x, y, orgItem, w, h, position) {
		//console.log("position: %s",position);
		switch(position){
			case "auto":  return autoPosition(x,y,w,h);
			case "top-right": return topRightPosition(orgItem,w,h);
			case "top-left": return topLeftPosition(orgItem,w,h);
			case "bottom-right": return bottomRightPosition(orgItem,w,h);
			case "bottom-left": return bottomLeftPosition(orgItem,w,h);
			default : return {top: y, left:x, position: "auto"};
		}
	};
	function topRightPosition(orgItem,w,h){
		var offset = orgItem.position();
		var top = offset.top + orgItem.outerHeight(true) - h;
		var left = orgItem.outerWidth(true);
		return {top: top, left: left, position: "auto"};
	}
	function topLeftPosition(orgItem,w,h){
		var offset = orgItem.position();
		var top =offset.top - orgItem.outerHeight(true);
		var left = - w;
		return {top: top, left: left, position: "auto"};
	}
	function bottomRightPosition(orgItem,w,h){
		var offset = orgItem.offset();
		var top = 0;
		var left = orgItem.outerWidth(true);
		return {top: top, left: left, position: "auto"};
	}
	function bottomLeftPosition(orgItem,w,h){
		var offset = orgItem.offset();
		var top = 0;
		var left = - w;
		return {top: top, left: left, position: "auto"};
	}
	function autoPosition(x,y,w,h){
		var windowWidth = $(window).innerWidth();
		var windowHeight = $(window).innerHeight();
		var offset = 5;
		var left;
		var position;
		if(x + w + offset >= windowWidth){
			left = x - w - offset;
			position = "left";
		}else{
			left = x + offset;
			position = "right";
		}
		var scrollTop = document.documentElement.scrollTop
				|| document.body.scrollTop;
		var top;
		if(y - h - offset < scrollTop){			
			if(y - scrollTop + offset + h > windowHeight){
				top = scrollTop + Math.abs(windowHeight - h)/2;
			}else{
				top = y + offset;
			}
		}else{
			top = y - h - offset;
		}
		return {
			top : top,
			left : left,
			position: position
		};
	}
	function highlightEffect(e, i) {
		var jTarget = $(e.target);
		if (e.type == "mouseenter") {
			jTarget.addClass("jMenuItemHighlight");
		} else {//assume it mouse leave
			jTarget.removeClass("jMenuItemHighlight");
		}
	}
	//definition for item.
	var MenuItem = {
		label : "",//text displayed in the menu
		tooltip : "",//title of the element        		
		handlers : {
			"mouseenter" : highlightEffect,
			"mouseleave" : highlightEffect
		},//list of all handler for each list items. "eventType":handler
		href : "",//if it a hyper link
		subMenu:[]
	};
	function clearMenu() {
		$(".jMenuList").remove();
	}
	var menuShowed = false;
	$.fn.jMenu = function(opts) {
		var options = $.extend({}, defaultOptions, opts);
		if (!options.items || options.items.length == 0) {
			console.warn("no item defined");
			return;
		}
		initializeItems(options.items);
		this.each(function() {
			generateMenu($(this), options);
		});

		$(document).click(function() {
			if(!menuShowed) return;
			clearMenu();
			menuShowed = false;
		});
	}
	
	function initializeItems(items) {
		for ( var i = 0; i < items.length; i++) {
			items[i] = $.extend(true, {}, MenuItem, items[i]);
		}
	}

	function generateMenu(jObj, options) {
		var mouseButton = options.trigger == "rightClick" ? 3 : 1;
		var target;
		jObj.bind("mousedown", function(e) {
			target = e.target;
			e.stopPropagation();
			return false;
		});
		
		jObj.bind("mouseup", function(e) {
			if(!options.conditional || options.conditional(jObj)){				
				if (target == e.target && e.which == mouseButton) {
					//set delay as work around for right click;
					setTimeout(function() {						
						renderMenuItems(e.pageX, e.pageY, options.items,
								$(e.target),options.position);
					});
				}
				else{					
					clearMenu();
				}
			}
			else{				
				clearMenu();
			}
			e.stopPropagation();
			return false;
		});
		
		if(options.trigger == "rightClick"){
			jObj.bind("contextmenu", function(e) {
				e.stopPropagation();
				return false;
			});	
		}
		
		jObj.bind("click", function(e) {			
			e.stopPropagation();
			return false;
		});	
		
	};
	function renderMenuItems(x, y, items, orgItem,position,isSubMenu) {		
		if (menuShowed && !isSubMenu) {
			clearMenu();
		}
		var ul = $('<ul class="jMenuList"/>');
		var liArr = [];
		for ( var i = 0; i < items.length; i++) {			
			var li = $('<li class="jMenuItem">');
			liArr.push(li);
			if (i == 0)
				li.css("border-top", "none");
			if (items[i].href) {
				var a = $('<a/>');
				a.attr("href", items[i].href);
				a.html(items[i].label);
				li.append(a);
			} else {
				li.html(items[i].label);
			}
			if (items[i].tooltip)
				li.get(0).title = items[i].tooltip;
			var handlers = items[i].handlers;			
			// bind event to menu item.
			for ( var j in handlers) {
				(function(eventType, handler, item) {
					li.bind(eventType, function(e) {
						handler(e, item);
						if (eventType == "click")
							clearMenu();
						e.stopPropagation();
						return false;
					});
				})(j, handlers[j], orgItem);

			}			
			
			
			ul.append(li);
		}
		if(isSubMenu) {
			orgItem.append(ul);
		}else{
			$(document.body).append(ul);
		}
		var pos = getMenuPos(x, y, orgItem, ul.outerWidth(true), ul.outerHeight(true), position);
		ul.css("top", pos.top);
		ul.css("left", pos.left);
		menuShowed = true;
		
		//handling for subMenu
		var subUl = null;
		var timeout = null;
		var trigger = null;
		for ( var i = 0; i < items.length; i++) {
			(function(k){
				var li = liArr[k];
				if(items[k].subMenu && items[k].subMenu.length>0){
					li.mouseover(function(){
						//console.log("item k: %d, li.text: %s, top: %d, left: %d",k,li.text(), li.offset().top, li.offset().left);						
						var subPos = (k > items.length/k) ? "top-" : "bottom-";
						subPos += pos.position; 						
						if(subUl===null) {
							console.log("get here")
							subUl = renderMenuItems(0,0,items[k].subMenu,li,subPos,true);
							trigger = li;
						}else{							
							if(trigger != li){		
								console.log("get there");
								subUl.remove();
								subUl = renderMenuItems(0,0,items[k].subMenu,li,subPos,true);
								trigger = li;
							}
						}
						
						if(timeout) {
							clearTimeout(timeout);
							timeout = null;							
						}
					});
					li.mouseout(function(){
						timeout = setTimeout(function(){
							console.log("remove submenu");
							if(subUl) {
								subUl.remove();	
								subUl = null;
							}
							timeout = null;
						},500);
						
					});
				}
			})(i);
		}
		return ul;
	};
})(jQuery)