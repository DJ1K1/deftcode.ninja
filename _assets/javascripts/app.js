/**
 * DEFTCODE APP MODULE (C) 2014
 */

// Root object (window, ..)
// Factory is the module object that contains our module methods
(function (root, factory) {

	// Export module with the related root object
	if (typeof define === 'function' && define.amd) {
		define([], factory());
	}
	else if (typeof exports === 'object') {
		module.exports = factory();
	}
	else {
		root.APP = factory();
	}

// 'this' pointer to the root object (window, ..) & initialize our module object
}(this, function () {

	var exports = {},
	_config     = {},
	_d          = window.document,
	_metas      = document.getElementsByTagName('meta'), i;


	/**
	 * BASE STUFF 
	 */


	// Add a cross-browser events listener
	var AddCrossEvent = function(ptr, evt, funct) {

		if (typeof ptr.addEventListener !== "undefined") {
			ptr.addEventListener(evt, funct, false);
		}
		else if (typeof ptr.attachEvent !== "undefined") {
			ptr.attachEvent('on' + evt, funct);
		}
		else {
			throw "Invalid event handler";
		}

	};

	// Viewport iPhone scale
	exports.ViewPort = function() {

		if (navigator.userAgent.match(/iPhone/i)) {
			for (i = 0; i < metas.length; i++) {
				if (metas[i].name == "viewport") {
					metas[i].content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
				}
			}

			AddCrossEvent(_d, "gesturestart", _ManageViewport);
		}

	};

	// Manage scales
	var _ManageViewport = function() {

		for (i = 0; i < metas.length; i++) {
			if (metas[i].name == "viewport") {
				metas[i].content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
			}
		}

	};


	// Enable toggle
	exports.Toggle = function() {

		exports.t = _d.getElementById("toggle");
		AddCrossEvent(exports.t, "click", _ManageToggle);

	};

	// Page width management
	var _ManageToggle = function() {

		var h = _d.getElementsByTagName("header")[0],
			f = _d.getElementsByTagName("footer")[0],
			s = _d.getElementsByTagName("section")[0];

		if (exports.t.className == "standard-width") {
			exports.t.className = "full-width";
			h.style.display = f.style.display = "none";
			s.style.float = "none";
			s.style.width = "auto";
		}
		else {
			exports.t.className = "standard-width";
			h.removeAttribute("style");
			f.removeAttribute("style");
			s.removeAttribute("style");
		}

	};


	/**
	 * SCROLLBAR STUFF 
	 */


	// Init scrollbar
	exports.start = function(content) {

		// get scroll content by id
		_config.content = document.getElementById(content);

		// check for a valid element in DOM
		if (_config.content instanceof Object !== true) {
			throw "Error: element not found in DOM.";
		}

		// create wrapper and wrap around content
		_config.wrapper = document.createElement("div");
		_config.wrapper = _config.content.parentElement.insertBefore( _config.wrapper, _config.content);
		_config.wrapper.appendChild(_config.content);
		_config.wrapper.style.height = _config.content.offsetHeight + "px";
		_config.wrapper.style.width  = (_config.content.offsetWidth + 10) + "px";
		_config.wrapper.className    = "myScrollbar_wrapper";

		// create scrollbar wrapper
		_config.scrollbarW = document.createElement("div");
		_config.scrollbarW = _config.wrapper.appendChild(_config.scrollbarW);
		_config.scrollbarW.className = "scrollbar_wrapper";

		// create scrollbar
		_config.scrollbar = document.createElement("div");
		_config.scrollbar = _config.scrollbarW.appendChild(_config.scrollbar);
		_config.scrollbar.className = "scrollbar";

		// set size of scrollbar
		_config.scrollbar.style.height = (_config.wrapper.offsetHeight * 1/3) + "px";

		// for each pixel movement on scrollbar we have to move _config.ratio pixels in content
		_config.ratio = ((_config.wrapper.scrollHeight - _config.scrollbarW.offsetHeight) /
		(_config.scrollbarW.offsetHeight - _config.scrollbar.offsetHeight));

		// define events
		_config.scrollbar.events = {
			"mousedown":  enableMoving,
			"mousemove":  moveContent,
			"mouseup":    stopMoving,
			"mouseleave": stopMoving,
			'mousewheel': eventScroll,
			'DOMMouseScroll': eventScroll
		};

		// bind events
		for (var value in _config.scrollbar.events) {
			AddCrossEvent(_config.wrapper, value, _config.scrollbar.events[value], false);
		}

	};

	// Do scroll function event
	var eventScroll = function(e) {

		_config.scrollbar.top = _config.scrollbar.offsetTop;

		if (_config.scrollbar.top <= 0) {
			_config.scrollbar.top = 1;
		}
		else if (_config.scrollbar.top >= _config.scrollbarW.offsetHeight - _config.scrollbar.offsetHeight) {
			_config.scrollbar.top -= 1;
		}

		if (e.wheelDelta == -120) {
			_config.scrollbar.style.top = _config.scrollbar.top + 1 + "px";
		}
		else {
			_config.scrollbar.style.top = _config.scrollbar.top - 1 + "px";
		}

		_config.content.style.top = -(_config.scrollbar.top * _config.ratio);

		e.preventDefault();

	};

	// Enable content moving
	var enableMoving = function(e) {

		e.preventDefault();

		_config.scrollbar.className = "scrollbar draggable";
		_config.scrollbar.startDrag = _config.scrollbar.startDrag || (e.clientY - e.layerY + _config.scrollbar.offsetHeight * 1/2);

	};

	// Stop content moving
	var stopMoving = function(e) {

		_config.scrollbar.className = "scrollbar";

	};

	// Do content move
	var moveContent = function(e) {

		e.preventDefault();

		if (_config.scrollbar.className === "scrollbar draggable") {
			_config.scrollbar.top =  (e.clientY - _config.scrollbar.startDrag);

			if (_config.scrollbar.top < 0) {
				_config.scrollbar.top = 0;
			}

			else if (_config.scrollbar.top > _config.scrollbarW.offsetHeight - _config.scrollbar.offsetHeight){
				_config.scrollbar.top = _config.scrollbarW.offsetHeight - _config.scrollbar.offsetHeight;
			}

			_config.scrollbar.style.top = _config.scrollbar.top + "px";
			_config.content.style.top = -(_config.scrollbar.top * _config.ratio) + "px";
		}

	};


	return exports;

}));

//APP.start('content');
APP.ViewPort();
APP.Toggle();