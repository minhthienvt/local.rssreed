/**
 * @class: Util
 * @description: Defines Util functions
 * @version: 1.0
 **/
 var Duke = {
	isJson: function(json){
		try {
			JSON.parse(json);
		} catch (e) {
			return false;
		}
		return true;
	},
	memory: {
		currentPage: null,
		currentIndex: -1,
		menuItems: null,
		animNavComplete: true,
		navComplete: true,
		idealWidth: 1404,
		idealHeight: 936,
		idealFontSize: 72
	}

};

/**
 * @name smScroll
 * @description description
 * @version 1.0
 * @options
 *		option
 * @events
 *		event
 * @methods
 *		init
 *		publicMethod
 *		destroy
 */
;(function($, window, undefined){
	var pluginName = 'smScroll';
	var privateVar = null;
	var privateMethod = function(){

	};
	var touchable = 'ontouchstart' in document.documentElement;
	var userAgent = navigator.userAgent.toLowerCase();
	var isIOS = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);

	function Plugin(element, options){

		this.element = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.nameSpace = '.' + pluginName + Math.round(Math.random() * 1000).toString();

		this.scrollContent = $(this.options.content, this.element);
		if(/vertical|both/.test(this.options.type)){
			this.upBtn = this.element.find(this.options.upBtn);
			this.downBtn = this.element.find(this.options.downBtn);
			this.scroller = this.element.find(this.options.scroller);
			this.vType = true;
		}
		if(/horizontal|both/.test(this.options.type)){
			this.hScroller = this.element.find(this.options.hScroller);
			this.prevBtn = this.element.find(this.options.prevBtn);
			this.nextBtn = this.element.find(this.options.nextBtn);
			this.hType = true;
		}

		var vars = {};
		this.vars = vars;

		this.refresh();

		this.init();
	};

	Plugin.prototype = {
		init: function(){
			var thisObj = this;
			var vars = thisObj.vars;
			if(vars.maxContentTop <= 0 && thisObj.vType){
				this.scroller.parent().css('display', 'none');
				this.upBtn.css('display', 'none');
				this.downBtn.css('display', 'none');
				return;
			}
			if(vars.maxContentLeft <= 0 && thisObj.hType){
				this.hScroller.parent().css('display', 'none');
				this.prevBtn.css('display', 'none');
				this.nextBtn.css('display', 'none');
				return;
			}
			this.scroller && this.scroller.parent().css('display', 'block');
			this.prevBtn && this.prevBtn.css('display', 'inline');
			this.nextBtn && this.nextBtn.css('display', 'inline');
			this.upBtn && this.downBtn.css('display', 'inline');
			this.downBtn && this.downBtn.css('display', 'inline');

			vars.curScrollerTop = 0;
			vars.curContentTop = 0;

			vars.curScrollerLeft = 0;
			vars.curContentLeft = 0;

			var vDragging = false;
			var hDragging = false;
			var startX = 0,
				startY = 0;
			var prevScrollerTop = 0,
				curScrollerTop = 0;
			var prevScrollerLeft = 0,
				curScrollerLeft = 0;

			this.scroller && !isIOS && this.scroller.unbind('mousedown' + this.nameSpace).bind('mousedown' + this.nameSpace, function(e){
				e.preventDefault();
				vDragging = true;
				startY = e.pageY;
				prevScrollerTop = vars.curScrollerTop;
			});

			this.hScroller && !isIOS && this.hScroller.unbind('mousedown' + this.nameSpace).bind('mousedown' + this.nameSpace, function(e){
				e.preventDefault();
				hDragging = true;
				startX = e.pageX;
				prevScrollerLeft = vars.curScrollerLeft;
			});

			$(document).unbind('mousemove' + this.nameSpace).bind('mousemove' + this.nameSpace, function(e){
				e.preventDefault();
				if(vDragging){
					curScrollerTop = prevScrollerTop + e.pageY - startY;
					vars.curContentTop = -curScrollerTop / vars.maxScrollerTop * vars.maxContentTop;
					thisObj.scroll(vars.curContentTop);
				}
				if(hDragging){
					curScrollerLeft = prevScrollerLeft + e.pageX - startX;
					vars.curContentLeft = -curScrollerLeft / vars.maxScrollerLeft * vars.maxContentLeft;
					thisObj.hScroll(vars.curContentLeft);
				}
			}).unbind('mouseup' + this.nameSpace).bind('mouseup' + this.nameSpace, function(e){
				vDragging = false;
				hDragging = false;
				clearInterval(vars.holdInterval);
				clearInterval(vars.hHoldInterval);
				clearTimeout(vars.waitHoldTimeout);
				clearTimeout(vars.hWaitHoldTimeout);
			})
			.unbind('keydown' + this.nameSpace).bind('keydown' + this.nameSpace, function(e){
				if($.fn[pluginName].curSMScroll == null){
					return;
				}
				var curScroll = $.fn[pluginName].curSMScroll;
				if(e.which == 38){
					e.preventDefault();
					curScroll.vars.curContentTop += curScroll.options.keydownStep;
					curScroll.scroll(curScroll.vars.curContentTop);
				}
				if(e.which == 40){
					e.preventDefault();
					curScroll.vars.curContentTop -= curScroll.options.keydownStep;
					curScroll.scroll(curScroll.vars.curContentTop);
				}
			});

			this.element.unbind('mousewheel' + this.nameSpace).bind('mousewheel' + this.nameSpace, function(e, delta){
				e.preventDefault();

				if(thisObj.options.type == 'vertical' || thisObj.options.type == 'both'){
					vars.curContentTop += delta * thisObj.options.wheelStep
					thisObj.scroll(vars.curContentTop);
				}
				if(thisObj.options.type == 'horizontal'){
					vars.curContentLeft += delta * thisObj.options.wheelStep
					thisObj.hScroll(vars.curContentLeft);
				}
			}).unbind('mouseenter' + this.nameSpace).bind('mouseenter' + this.nameSpace, function(){
				$.fn[pluginName].curSMScroll = thisObj;
			}).unbind('mouseleave' + this.nameSpace).bind('mouseleave' + this.nameSpace, function(){
				$.fn[pluginName].curSMScroll = null;
			});

			if(thisObj.vType){
				this.upBtn.unbind('click' + this.nameSpace).bind('click' + this.nameSpace, function(e){
					e.preventDefault();
				}).unbind('mousedown' + this.nameSpace).bind('mousedown' + this.nameSpace, function(){

					thisObj.scroll(vars.curContentTop + thisObj.options.keydownStep);
					clearTimeout(vars.waitHoldTimeout);
					vars.waitHoldTimeout = setTimeout(function(){
						vars.holdInterval = setInterval(function(){
							if(vars.curContentTop >= 0){
								clearInterval(vars.holdInterval);
							}else{
								thisObj.scroll(vars.curContentTop + thisObj.options.keydownStep);
							}
						}, 100);
					}, thisObj.options.holdDelay);
				});

				this.downBtn.unbind('click' + this.nameSpace).bind('click' + this.nameSpace, function(e){
					e.preventDefault();
				}).unbind('mousedown' + this.nameSpace).bind('mousedown' + this.nameSpace, function(){
					thisObj.scroll(vars.curContentTop - thisObj.options.keydownStep);
					clearTimeout(vars.waitHoldTimeout);
					vars.waitHoldTimeout = setTimeout(function(){
						vars.holdInterval = setInterval(function(){
							if(vars.curContentTop <= -vars.maxContentTop){
								clearInterval(vars.holdInterval);
							}else{
								thisObj.scroll(vars.curContentTop - thisObj.options.keydownStep);
							}
						}, thisObj.options.holdInterval);
					}, thisObj.options.holdDelay);
				});
			}

			if(thisObj.hType){
				this.prevBtn.unbind('click' + this.nameSpace).bind('click' + this.nameSpace, function(e){
					e.preventDefault();
				}).unbind('mousedown' + this.nameSpace).bind('mousedown' + this.nameSpace, function(){
					thisObj.hScroll(vars.curContentLeft + thisObj.options.keydownStep);
					clearTimeout(vars.hWaitHoldTimeout);
					vars.hWaitHoldTimeout = setTimeout(function(){
						vars.hHoldInterval = setInterval(function(){
							if(vars.curContentLeft >= 0){
								clearInterval(vars.hHoldInterval);
							}else{
								thisObj.hScroll(vars.curContentLeft + thisObj.options.keydownStep);
							}
						}, thisObj.options.hHoldInterval);
					}, thisObj.options.holdDelay);
				});

				this.nextBtn.unbind('click' + this.nameSpace).bind('click' + this.nameSpace, function(e){
					e.preventDefault();
				}).unbind('mousedown' + this.nameSpace).bind('mousedown' + this.nameSpace, function(){
					thisObj.hScroll(vars.curContentLeft - thisObj.options.keydownStep);
					clearTimeout(vars.hWaitHoldTimeout);
					vars.hWaitHoldTimeout = setTimeout(function(){
						vars.hHoldInterval = setInterval(function(){
							if(vars.curContentLeft <= -vars.maxContentLeft){
								clearInterval(vars.hHoldInterval);
							}else{
								thisObj.hScroll(vars.curContentLeft - thisObj.options.keydownStep);
							}
						}, thisObj.options.hHoldInterval);
					}, thisObj.options.holdDelay);
				});
			}
		},
		scroll: function(contentTop, scrollOptions){
			var thisObj = this;
			var vars = this.vars;

			vars.curContentTop = Math.max(Math.min(0, contentTop), - vars.maxContentTop);
			vars.curScrollerTop = -vars.curContentTop / vars.maxContentTop * vars.maxScrollerTop;

			var contentDuration = this.options.contentEaseDuration;
			var contentEase = this.options.contentEase;
			var scrollerDuration = this.options.scrollerEaseDuration;
			var scrollerEase = this.options.scrollerEase;

			if(scrollOptions){
				contentDuration = scrollOptions.contentEaseDuration;
				contentEase = scrollOptions.contentEase;
				scrollerDuration = scrollOptions.scrollerEaseDuration;
				scrollerEase = scrollOptions.scrollerEase;
			}

			clearTimeout(vars.hideScroller);
			thisObj.scroller.css({
				'opacity': 1,
				'display': ''
			});
			this.scrollContent.stop().animate({
				'margin-top': vars.curContentTop
			}, contentDuration, contentEase);
			this.scroller.stop().animate({
				'margin-top': vars.curScrollerTop
			}, scrollerDuration, scrollerEase, function(){
				if(thisObj.options.scrollerAutoHide){
					vars.hideScroller = setTimeout(function(){
						thisObj.scroller.fadeOut();
					}, thisObj.options.hideScrollTime);
				}
			});
		},
		hScroll: function(contentLeft, scrollOptions){
			var thisObj = this;
			var vars = this.vars;
			vars.curContentLeft = Math.max(Math.min(0, contentLeft), -vars.maxContentLeft);
			vars.curScrollerLeft = -vars.curContentLeft / vars.maxContentLeft * vars.maxScrollerLeft;

			var contentDuration = this.options.contentEaseDuration;
			var contentEase = this.options.contentEase;
			var scrollerDuration = this.options.scrollerEaseDuration;
			var scrollerEase = this.options.scrollerEase;

			if(scrollOptions){
				contentDuration = scrollOptions.contentEaseDuration;
				contentEase = scrollOptions.contentEase;
				scrollerDuration = scrollOptions.scrollerEaseDuration;
				scrollerEase = scrollOptions.scrollerEase;
			}

			clearTimeout(vars.hideHScroller);
			thisObj.hScroller.css({
				'opacity': 1,
				'display': ''
			});
			this.scrollContent.stop().animate({
				'margin-left': vars.curContentLeft
			}, contentDuration, contentEase);
			this.hScroller.stop().animate({
				'margin-left': vars.curScrollerLeft
			}, scrollerDuration, scrollerEase, function(){
				if(thisObj.options.scrollerAutoHide){
					vars.hideHScroller = setTimeout(function(){
						thisObj.hScroller.fadeOut();
					}, thisObj.options.hideScrollTime);
				}
			});
		},
		refresh: function(){
			var vars = this.vars;

			if(this.options.scrollerAutoHide){
				this.scroller && this.scroller.fadeOut(1);
				this.hScroller && this.hScroller.fadeOut(1);
			}

			if(this.options.type == 'vertical' || this.options.type == 'both'){

				var scrollerContentHeight = this.scroller.parent().innerHeight();
				vars.contentHeight = this.scrollContent.outerHeight();
				vars.viewportHeight = (this.options.contentContainer == null)?
					this.scrollContent.parent().innerHeight():$(this.options.contentContainer, this.element).innerHeight();
				vars.maxContentTop = vars.contentHeight - vars.viewportHeight;
				if(!this.options.scrollerHeightFixed){

					this.scroller.css({
						height: vars.viewportHeight / vars.contentHeight * scrollerContentHeight
					});
				}
				vars.maxScrollerTop = scrollerContentHeight - this.scroller.outerHeight();
			}

			if(this.options.type == 'horizontal' || this.options.type == 'both'){

				var hScrollerContentHeight = this.hScroller.parent().innerWidth();
				if(!this.options.isUlContent){
					vars.contentWidth = this.scrollContent.outerWidth();
				}else{
					vars.contentWidth = this.scrollContent.children().length * this.scrollContent.children().outerWidth(true);
				}

				vars.viewportWidth = (this.options.contentContainer == null)?
					this.scrollContent.parent().innerWidth():$(this.options.contentContainer, this.element).innerWidth();
				vars.maxContentLeft = vars.contentWidth - vars.viewportWidth;
				if(!this.options.scrollerHeightFixed){
					this.hScroller.css({
						width: vars.viewportWidth / vars.contentWidth * hScrollerContentHeight
					});
				}
				vars.maxScrollerLeft = hScrollerContentHeight - this.hScroller.outerWidth();
			}
		},
		destroy: function(){
			this.scroller.unbind('mousedown' + this.nameSpace);
			this.element.unbind('mousewheel' + this.nameSpace);
			$(document).unbind('mousemove' + this.nameSpace).unbind('mouseup' + this.nameSpace);
			this.prevBtn.unbind('click' + this.nameSpace).unbind('mousedown' + this.nameSpace);
			this.nextBtn.unbind('click' + this.nameSpace).unbind('mousedown' + this.nameSpace);
		}
	};

	$.fn[pluginName] = function(options, params){
		return this.each(function(){
			var instance = $.data(this, pluginName);
			if(!instance){
				$.data(this, pluginName, new Plugin(this, options));
			}else if(instance[options]){
				if($.isArray(params)){
					instance[options].apply(instance, params);
				}else{
					instance[options](params);
				}
			}else{
				console.warn(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
			}
		});
	};

	$.fn[pluginName].defaults = {
		type: 'vertical', // horizontal, both
		content: null,
		isUlContent: false,
		contentContainer: null,
		upBtn: null,
		downBtn: null,
		prevBtn: null,
		nextBtn: null,
		scroller: null,
		hScroller: null,
		scrollerHeightFixed: true,
		scrollerAutoHide: false,

		wheelStep: 20,
		keydownStep: 5,
		holdDelay: 700,
		holdInterval: 33,
		hideScrollTime: 1000,

		contentEase: 'linear',
		contentEaseDuration: 0,
		scrollerEase: 'linear',
		scrollerEaseDuration: 0
	};
})(jQuery, window);


(function($){

	$.fn.custSelect = function(options){
		var defaults = {
			containerClass: 'mask-select',
			optionsClass: 'select-items',
			selectedClass: 'selected',
			emptyText: '...',
			offset: {x: 0, y: 0},
			wndpad: {x: 0, y: 0},
			limit:10,
			onSelect:null
		};

		options = $.extend(defaults, options);

		this.each(function(){
			var joriginal = $(this);
			var	jcontainer = $('<span class="custom-select">'+
                                   '<input type="text" class="jsel-text" value="Fichiers joints" name="' + joriginal.attr('name') + '-jsel" readonly="readonly"/>'+
                                   '<a class="select-text" href="javascript:;" title="">&nbsp;</a>'+
                               '</span>').insertAfter(joriginal),
				jtext = jcontainer.find('input.jsel-text'),
				joptions = $('<ul class="' + options.optionsClass + '"></ul>').appendTo(document.body),
				jopts = joriginal.children();

				if(joriginal.parent().find('#zipcode').length)
				{
					var dataZipCode = joriginal .parent().find('#zipcode').children();
				}

			if(jopts.length){
				var defaultsel, selected, focused, timerHide,
					blocking = false,
					maxwidth = jcontainer.outerWidth();

				select = function(){
					var item = $(this);

					if(dataZipCode)
					{
						if(item.index() != 0)
						{
							$('#txtZipCodeBy').val(dataZipCode.eq(item.index()).text());
						}
						else
						{
							$('#txtZipCodeBy').val('');
						}
					}
					jtext.val(item.data('text'));
					joriginal.val(item.data('value'));

					if(selected){
						selected.removeClass(options.selectedClass);
					}

					selected = item.addClass(options.selectedClass);
					if (options.onSelect){
						options.onSelect.call(joriginal, item.data('text'), item.data('value'));
					}
					joptions.slideUp('fast');
				};

				jopts.each(function(idx, opt){
					var item = $(opt),
						newopt = $('<li>' + item.text() + '</li>')
							.data('value', item.attr('value'))
							.data('text', item.text())
							.mousedown(select)
							.appendTo(joptions);

					if(item.attr('selected')){
						newopt.addClass(options.selectedClass);
						jtext.val(item.text());

						selected = newopt;
						defaultsel = selected;
					}
				});

				if(maxwidth > joptions.outerWidth()){
					joptions.css('width', maxwidth - parseInt(joptions.css('padding-left')) - parseInt(joptions.css('padding-right')) - parseInt(joptions.css('border-left-width')) - parseInt(joptions.css('border-right-width')));
				}

				var opitems = joptions.find('li');
				if (opitems.length && opitems.length > options.limit){
					var joptionsHeight = 0;
					for (var i = 0; i < options.limit;i++){
						joptionsHeight += $(opitems[i]).outerHeight();
					}
					joptions.css({
						'height': joptionsHeight,
						'overflow-y': 'auto',
						'overflow-x': 'hidden'
					});
					if ($.browser.msie && parseInt($.browser.version) <= 7){
						var jOpWidth = joptions.css('width');
						joptions.css('width',parseInt(jOpWidth)+20);
					}
				}

				if(!defaultsel.length){
					defaultsel = opitems.eq(0);
				}
				if(defaultsel.length){
					jtext.val(defaultsel.data('text'));
					joriginal.val(defaultsel.data('value'));
				}

				if ($.browser.msie && parseInt($.browser.version) < 7){
					if (opitems.length){
						opitems.each(function(){
							$(this).bind({
								'mouseenter':function(){
									$(this).addClass('itHover');
								},
								'mouseleave':function(){
									$(this).removeClass('itHover');
								}
							});
						});
					}
				}
				jcontainer.click(function(){
					if(blocking){
						return false;
					}
					var jwnd = $(window),
						jdoc= $('html'),
						wsize = {x: jwnd.width(), y: jwnd.height()},
						esize = {x: jcontainer.outerWidth(true), y: jcontainer.outerHeight(true)},
						scroll = {x: jwnd.scrollLeft(), y: jwnd.scrollTop()},
						tip = {x: joptions.outerWidth(true), y: joptions.outerHeight(true)},
						props = {x: 'left', y: 'top'},
						dfpos = {x: jcontainer.parent().offset().left + 100, y: jcontainer.parent().offset().top + 19},
						obj = {};
					for (var z in props){
						obj[props[z]] = dfpos[z] + options.offset[z];
						if ((obj[props[z]] + tip[z] - scroll[z]) > wsize[z] - options.wndpad[z]){
							obj[props[z]] = dfpos[z] - options.offset[z] - tip[z] - esize[z];
						}
					}

					joptions.css(obj).slideToggle('fast');

					return false;
				}).hover(function(){
					clearTimeout(timerHide);
				}, function(){
					timerHide = setTimeout(function(){
						joptions.slideUp('fast');
					}, 600);
				});

				joptions.hover(function(){
					clearTimeout(timerHide);
				}, function(){
					timerHide = setTimeout(function(){
						joptions.slideUp('fast');
					}, 600);
				}).css('display', 'none');

				joriginal.data('resetFunction', function(){
					joptions.children().removeClass('selected');
					defaultsel.addClass('selected');
					jtext.val(defaultsel.data('text'));
					joriginal.val(defaultsel.data('value'));
				});
			}else{
				joptions.remove();
			}
		});
    };

	$.fn.fullscreenSlide = function(options){

		var defaults = {
			autoplay: 1,
			random: 0,
			slideInterval: 2500,
			transitionDuration:	250,
			pauseOnHover: 0,
			keyboardNav: 1,
			performance: 1,
			minWidth: 10,
			minHeight: 10,
			verticalCenter: 1,
			horizontalCenter: 1,
			fitPortrait: 0,
			fitLandscape: 0,
			slideCounter: 1,
			instanceId: 'zunique'
    	};

		options = $.extend(defaults, options);

		return this.each(function(){
			var jcontainer = $(this),
				jdisplay = jcontainer.find('.slideshow-inner'),
				jloader = jcontainer.find('.fullSlideLoader'),
				slideshowIntervalId = null,
				animating = false,
				availableNext = false,
				availablePrev = false,
				forceNext = false,
				forcePrev = false,
				isPaused = false,
				counterLen = 0,
				currentSlide = 0,
				preloadImages = [];

			if(!options.slides.length || !jdisplay.length){
				return false;
			}

			if (options.performance == 3){
				jdisplay.addClass('speed');
			} else if ((options.performance == 1) || (options.performance == 2)){
				jdisplay.addClass('quality');
			}

			if(options.random){
				arr = options.slides;
				for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
				options.slides = arr;
			}

			var resizeFullScreen = function(){
				var browserWidth = $(window).width();
				var browserHeight = $(window).height();

				jdisplay.find('img').each(function(i){
					var jimage = $(this);
					var imageInst = new Image();

					imageInst.onload = function(){
						var ratio = 1400 / 933;

						if(this.naturalWidth && this.naturalHeight){
							ratio = this.naturalHeight / this.naturalWidth;
						}else if(this.width && this.height){
							ratio = this.height / this.width;
						}

						if ((browserHeight <= options.minHeight) && (browserWidth <= options.minWidth)){

							if ((browserHeight / browserWidth) > ratio){
								options.fitLandscape && ratio <= 1 ? resizeWidth(true) : resizeHeight(true);
							} else {
								options.fitPortrait && ratio > 1 ? resizeHeight(true) : resizeWidth(true);
							}

						} else if (browserWidth <= options.minWidth){

							if ((browserHeight/browserWidth) > ratio){
								options.fitLandscape && ratio <= 1 ? resizeWidth(true) : resizeHeight();
							} else {
								options.fitPortrait && ratio > 1 ? resizeHeight() : resizeWidth(true);
							}

						} else if (browserHeight <= options.minHeight){

							if ((browserHeight/browserWidth) > ratio){
								options.fitLandscape && ratio <= 1 ? resizeWidth() : resizeHeight(true);
							} else {
								options.fitPortrait && ratio > 1 ? resizeHeight(true) : resizeWidth();
							}

						} else {

							if ((browserHeight/browserWidth) > ratio){
								options.fitLandscape && ratio <= 1 ? resizeWidth() : resizeHeight();
							} else {
								options.fitPortrait && ratio > 1 ? resizeHeight() : resizeWidth();
							}
						}

						function resizeWidth(minimum){
							if (minimum){
								if(jimage.width() < browserWidth || jimage.width() < options.minWidth ){
									if (jimage.width() * ratio >= options.minHeight){
										jimage.width(options.minWidth);
										jimage.height(jimage.width() * ratio);
									}else{
										resizeHeight();
									}
								}
							}else{
								if (options.minHeight >= browserHeight && !options.fitLandscape){
									if (browserWidth * ratio >= options.minHeight || (browserWidth * ratio >= options.minHeight && ratio <= 1)){
										jimage.width(browserWidth);
										jimage.height(browserWidth * ratio);
									} else if (ratio > 1){
										jimage.height(options.minHeight);
										jimage.width(jimage.height() / ratio);
									} else if (jimage.width() < browserWidth) {
										jimage.width(browserWidth);
										jimage.height(jimage.width() * ratio);
									}
								}else{
									jimage.width(browserWidth);
									jimage.height(browserWidth * ratio);
								}
							}
						};

						function resizeHeight(minimum){
							if (minimum){
								if(jimage.height() < browserHeight){
									if (jimage.height() / ratio >= options.minWidth){
										jimage.height(options.minHeight);
										jimage.width(jimage.height() / ratio);
									}else{
										resizeWidth(true);
									}
								}
							}else{
								if (options.minWidth >= browserWidth){
									if (browserHeight / ratio >= options.minWidth || ratio > 1){
										jimage.height(browserHeight);
										jimage.width(browserHeight / ratio);
									} else if (ratio <= 1){
										jimage.width(options.minWidth);
										jimage.height(jimage.width() * ratio);
									}
								}else{
									jimage.height(browserHeight);
									jimage.width(browserHeight / ratio);
								}
							}
						};

						if (options.horizontalCenter){
							jimage.css('left', (browserWidth - jimage.width())/2);
						}

						if(i==0){
							jdisplay.children('a').eq(0).css('left',  -browserWidth);
						}

						if (options.verticalCenter){
							jimage.css('top', (browserHeight - jimage.height())/2);
						}

						imageInst.onload = null;
						imageInst = null;
					};

					imageInst.src = jimage.attr('src');
				});
			},

			nextSlide = function(){
				if(animating || !availableNext){
					return false;
				}else{
					animating = true;
				}

				var slides = options.slides,
					currentslide = jdisplay.find('.activeSlide').removeClass('activeSlide');

				if(currentslide.length == 0){
					currentslide = jdisplay.find('a:last');
				}

				var nextslide = currentslide.next().length ? currentslide.next() : jdisplay.find('a:first'),
					prevslide = nextslide.prev().length ? nextslide.prev() : jdisplay.find('a:last');

				jdisplay.find('.prevSlide').removeClass('prevSlide');
				prevslide.addClass('prevSlide');

				currentSlide + 1 == slides.length ? currentSlide = 0 : currentSlide++;

				if(options.performance == 1){
					jdisplay.removeClass('quality').addClass('speed');
				}

				var loadSlide = false;

				availableNext = false;
				availablePrev = true;
				currentSlide == slides.length - 1 ? loadSlide = 0 : loadSlide = currentSlide + 1;
				$('<img/>').bind('load', readyNext).attr('src', options.slides[loadSlide]).appendTo(jdisplay).wrap('<a></a>');

				currentslide.prev().remove();

				jloader.hide('fast');

				var memory = Duke.memory;
				if($.browser.safari && parseFloat($.browser.version) > 500 && memory.hasTransform && !memory.isIDevice && !memory.chromeOnMac){
					nextslide.addClass('activeSlide');

					memory.setPosition(nextslide[0], $(window).width(), 0);
					memory.setPosition(currentslide[0], 0, 0);
					memory.startAnimation(nextslide[0], $(window).width(), 0, 0, 0, currentslide[0], 0, 0, -$(window).width(), 0, options.transitionDuration);

					setTimeout(afterAnimation, options.transitionDuration);
				}else{
					nextslide.hide().addClass('activeSlide').css({left: $(window).width()}).show().animate({left: 0}, options.transitionDuration, afterAnimation);
					currentslide.animate({ left: -$(window).width() }, options.transitionDuration);
				}
			},

			prevSlide = function(){
				if(animating || !availablePrev){
					return false;
				}else{
					animating = true;
				}

				var slides = options.slides,
					currentslide = jdisplay.find('.activeSlide').removeClass('activeSlide');

				if (currentslide.length == 0){
					currentslide = $(jdisplay).find('a:first');
				}

				var nextslide = currentslide.prev().length ? currentslide.prev() : $(jdisplay).find('a:last'),
					prevslide = nextslide.next().length ? nextslide.next() : $(jdisplay).find('a:first');

				jdisplay.find('.prevSlide').removeClass('prevSlide');
				prevslide.addClass('prevSlide');

				currentSlide == 0 ? currentSlide = slides.length - 1 : currentSlide--;

				if(options.performance == 1){
					jdisplay.removeClass('quality').addClass('speed');
				}

				var loadSlide = false;
				availablePrev = false;
				availableNext = true;
				currentSlide - 1 < 0  ? loadSlide = slides.length - 1 : loadSlide = currentSlide - 1;
				$('<img/>').bind('load', readyPrev).attr('src', options.slides[loadSlide]).prependTo(jdisplay).wrap('<a></a>');

				currentslide.next().remove();

				jloader.hide('fast');

				var memory = Duke.memory;
				if($.browser.safari && parseFloat($.browser.version) > 500 && memory.hasTransform && !memory.isIDevice && !memory.chromeOnMac){
					nextslide.addClass('activeSlide');

					memory.setPosition(nextslide[0], -$(window).width(), 0);
					memory.setPosition(currentslide[0], 0, 0);
					memory.startAnimation(nextslide[0], -$(window).width(), 0, 0, 0, currentslide[0], 0, 0, $(window).width(), 0, options.transitionDuration);

					setTimeout(afterAnimation, options.transitionDuration);
				}else{
					nextslide.hide().addClass('activeSlide').css({left : -$(window).width()}).show().animate({left: 0}, options.transitionDuration, afterAnimation);
					currentslide.animate({left: $(window).width()}, options.transitionDuration);
				}
			},

			afterAnimation = function(){
				animating = false;

				if (options.performance == 1){
					jdisplay.removeClass('speed').addClass('quality');
				}

				resizeFullScreen();
			},

			readyNext = function(){
				availableNext = true;
				if(forceNext){
					jloader.hide('fast');
					nextSlide();
					forceNext = false;
				}
			},

			readyPrev = function(){
				availablePrev = true;

				if(forcePrev){
					jloader.hide('fast');
					prevSlide();
					forcePrev = false;
				}
			},

			padText = function(num, len){
				var text = num.toString();
				while(text.length < len){
					text = '0' + text;
				}

				return text;
			};

			var loadPrev = currentSlide - 1 < 0 ? options.slides.length - 1 : loadPrev = currentSlide - 1;
				loadNext = 0;

			$('<img/>').bind('load', readyPrev).attr('src', options.slides[loadPrev]).appendTo(jdisplay).wrap('<a></a>');
			$('<img/>').bind('load', resizeFullScreen).attr('src', options.slides[currentSlide]).appendTo(jdisplay).wrap('<a class="activeSlide"></a>');

			if (options.slides.length > 1){
				loadNext = (currentSlide == options.slides.length - 1) ? 0 : currentSlide + 1;
				$('<img/>').bind('load', resizeFullScreen).bind('load', readyNext).attr('src', options.slides[loadNext]).appendTo(jdisplay).wrap('<a></a>');
			}

			jloader.hide();
			jdisplay.fadeIn('normal');

			if(options.slides.length > 1){

				if(!options.autoplay){
					clearInterval(slideshowIntervalId);
					isPaused = true;
				}else{
					slideshowIntervalId = setInterval(nextSlide, options.slideInterval);
				}

				jcontainer.find('.lnk-next').unbind('click.zslide').bind('click.zslide', function(){
					if(animating){
						return false;
					}

					forceNext = false;
					if(!availableNext){
						jloader.show('fast');
						forceNext = true;
						return false;
					}

					clearInterval(slideshowIntervalId);
					nextSlide();

					if(!isPaused){
						slideshowIntervalId = setInterval(nextSlide, options.slideInterval);
					}

					return false;
				});

				jcontainer.find('.lnk-previous').unbind('click.zslide').bind('click.zslide', function() {
					if(animating){
						return false;
					}

					forcePrev = false;
					if(!availablePrev){
						jloader.show('fast');
						forcePrev = true;
						return false;
					}

					clearInterval(slideshowIntervalId);
					prevSlide();

					if(!isPaused){
						slideshowIntervalId = setInterval(nextSlide, options.slideInterval);
					}

					return false;
				});
			}

			if (options.keyboardNav && options.slides.length > 1){
				$(document.documentElement).unbind('keyup.zslide' + options.instanceId).bind('keyup.zslide' + options.instanceId, function(event){

					clearInterval(slideshowIntervalId);

					if(jdisplay.closest('section').hasClass('hidden')){
						return true;
					}

					if((event.keyCode == 37) || (event.keyCode == 40)){

						if(animating){
							return false;
						}

						clearInterval(slideshowIntervalId);
						prevSlide();

						if(!isPaused){
							slideshowIntervalId = setInterval(nextslide, options.slideInterval);
						}

						return false;

					}else if((event.keyCode == 39) || (event.keyCode == 38)){

						if(animating){
							return false;
						}

						clearInterval(slideshowIntervalId);
						nextSlide();

						if(!isPaused){
							slideshowIntervalId = setInterval(nextslide, options.slideInterval);
						}

						return false;

					}
				});
			}

			if(options.pauseOnHover  && options.slides.length > 1){
				$(jdisplay).unbind('.zslide').bind('mouseenter.zslide', function(){
					if(animating){
						return false;
					}

					if(!isPaused && options.navigation){
						if ($(pauseplay).attr('src')) $(pauseplay).attr('src', image_path + 'pause.png');
						clearInterval(slideshowIntervalId);
					}
				}).bind('mouseleave.zslide', function() {
					if(!isPaused && options.navigation){
						if ($(pauseplay).attr('src')) $(pauseplay).attr('src', image_path + 'pause_dull.png');
						slideshowIntervalId = setInterval(nextslide, options.slideInterval);
					}
				});
			}

			$(window).unbind('resize.zslide' + options.instanceId).bind('resize.zslide' + options.instanceId, resizeFullScreen);
		});

		jcontainer[0]._onEnter = resizeFullScreen;
	};

	$.fn.resizePopupInfo = function(options){
		var defaults = {
			minWidth: 10,
			minHeight: 10,
			fitLandscape: 0,
			fitPortrait: 1,
			horizontalCenter: 0,
			zIndex: 0,
			verticalCenter: 0
		};

		options = $.extend(defaults, options);
		var collections = this.find('#container-inner'),
			browserWidth = $(window).width(),
			browserHeight = $(window).height();

		collections.css({
			'width': browserWidth,
			'height': browserHeight
		});

		$(window).unbind('resize.resizePopupInfo').bind('resize.resizePopupInfo', function(){
			browserWidth = $(window).width();
			browserHeight = $(window).height();

			collections.css({
				'width': browserWidth,
				'height': browserHeight
			});

			if(collections.data('smScroll')){
				collections.smScroll('refresh');
			}

		}).trigger('resize.resizePopupInfo');

	};

    $.fn.showPopup = function(options){
        var defaults = {
            zIndex: 1100,
            opacity: 0.7,
            closeButtons: ['.lnk-close'],
            overlayDuration: 250,
            popupDuration: 250,
            autoClose: false,
            noOverlay: false,
            removeOnHide: false,
			playVideo: false,
			reloadOnClose: false,
            confirmPopup: false,
            confirmOK: '',
            dockPanel: false, //1 = top left, 2 = top right, 3 = bottom left, 4 = bottom right, default = center
            offset: {
                x: 0,
                y: 0
            },
            dockOffset: 15,
            onShow: null,
            onHide: null,
            onDestroy: null,
            onConfirm: null
        };

        return this.each(function(){
            var jpopup = $(this),
            jwindow = $(window),
            jhtml = $($.browser.msie ? 'body' : 'html'),
            initScrollTop = jwindow.scrollTop(),
			overlay = null,
            opt = $.extend(defaults, options);

            if(!opt.noOverlay){
				overlay = $('#zoverlay');
				if(!overlay.length){
					overlay = $('<div id="zoverlay"></div>').css({
						'display': 'block',
						'visibility': 'visible',
						'position': 'absolute',
						'top': 0,
						'left': 0,
						'width': 1,
						'height': 1,
						'zIndex': opt.zIndex,
						'backgroundColor': '#000',
						'opacity': 0
					}).css({
						'width': Math.max(1018, Math.max(jwindow.width(), jhtml.innerWidth())),
						'height': Math.max(jwindow.height(), $($.browser.msie ? (parseInt($.browser.version) >= 8 ? document : 'body') : 'html').height())
					}).appendTo(document.body);
				}

				if(overlay[0]._retain){
					overlay[0]._retain++;
				}else{
					overlay[0]._retain = 1;
				}

				jpopup.insertAfter(overlay);
            }

            var rePosition = function(){
                var winWidth = jwindow.width(),
					winHeight = jwindow.height(),
					popupWidth = jpopup.width(),
					popupHeight = jpopup.height(),
					top = Math.max(0, (winHeight - popupHeight)/2),
					left = Math.max(0, (winWidth - popupWidth)/2);

                if(opt.dockPanel){
                    switch (opt.dockPanel){
                        case 1: //top left
                            top = left = opt.dockOffset;
                            break;

                        case 2: //top right
                            top = opt.dockOffset;
                            left = Math.max(0, winWidth - popupWidth - opt.dockOffset);
                            break;

                        case 3: //bottom left
                            top = Math.max(0, winHeight - popupHeight - opt.dockOffset);
                            left = opt.dockOffset;
                            break;

                        case 4: //bottom right
                            top = Math.max(0, winHeight - popupHeight - opt.dockOffset);
                            left = Math.max(0, winWidth - popupWidth - opt.dockOffset);
                            break;

                        default: //same as center
                            break;
                    }
                }

                return {
                    top: top,
                    left: left
                };
            }, windowScroll = function(){
                if(opt.el){
                    var newpos = rePosition();
                    jpopup.css({
                        'top': newpos.top,
                        'left': newpos.left
                    });
                }
                else{
                    if($.browser.msie && parseInt($.browser.version) < 7){
                        var newpos = rePosition();
                        jpopup.css({
                            'position': 'absolute',
                            'top': newpos.top + $(window).scrollTop()
                        });

                    }else if(jwindow.height() < jpopup.outerHeight(true) || jwindow.width() < jpopup.outerWidth(true)){
                        jpopup.css({
                            'position': 'absolute',
                            'top': initScrollTop
                        });
                    }else{
                        if(jpopup.css('position') != 'fixed'){
                            var newpos = rePosition();

                            jpopup.css({
                                'position': 'fixed',
                                'top': newpos.top
                            });
                        }
                    }
                }
            }, windowResize = function(){
                var newpos = rePosition();

                if($.browser.msie && parseInt($.browser.version) < 7){
                    jpopup.css({
                        'position': 'absolute',
                        'top': newpos.top + $(window).scrollTop()
                    });
                }else if(opt.el){
                    jpopup.css({
                        'top': newpos.top,
                        'left': newpos.left
                    });
                }
                else{
					var position = ((jwindow.height() < jpopup.outerHeight(true)) || (jwindow.width() < jpopup.outerWidth(true))) ? 'absolute' : 'fixed';
					if(position == 'absolute'){
						newpos.top += $(window).scrollTop();
					}

                    jpopup.css({
                        'position': position,
                        'top': newpos.top,
                        'left': newpos.left
                    });
                }


                if(overlay){
                    overlay.css({
						'width': Math.max(1018, Math.max(jwindow.width(), jhtml.innerWidth())),
						'height': Math.max(jwindow.height(), $($.browser.msie ? (parseInt($.browser.version) >= 8 ? document : 'body') : 'html').height())
                    });
                }
            }, closePopup = function(){

                if(opt.onHide){
                    opt.onHide.call(jpopup);
                }

				if(opt.playVideo){
					$('video')[0].play();
				}
				if(opt.dockPanel == 7){
					if($('.form-contact').length){
						$('.form-contact').closePopup();
					}
					$('.form-rh').closePopup()
				}
                if($.browser.msie && parseFloat($.browser.version) < 9){
                    setTimeout(function(){
                        if(opt.removeOnHide){
                            jpopup.remove();
                        }else{
                            jpopup.css('top', -7000);
                        }

						if(opt.onDestroy){
							opt.onDestroy.call(jpopup);
						}

						if(opt.reloadOnClose){
							window.location.href = window.location.href;
						}

                    }, opt.popupDuration / 3);

                }else{
                    jpopup.stop(true).fadeTo(opt.popupDuration, 0, function(){
                        if(opt.removeOnHide){
                            jpopup.remove();
                        }else{
                            jpopup.css('top', -7000);
                        }

						if(opt.onDestroy){
							opt.onDestroy.call(jpopup);
						}

						if(opt.reloadOnClose){
							window.location.href = window.location.href;
						}
                    });
                }

                if(overlay){
					if(overlay[0]._retain){
						overlay[0]._retain--;
					}else{
						overlay[0]._retain = 0;
					}

					if(overlay[0]._retain == 0){
						overlay.stop(true).fadeTo(opt.overlayDuration, 0, function(){
							if(overlay[0]._retain == 0){
								overlay.remove();
							}
						});
					}
                }



                return false;
            };

            if(opt.dockPanel != 5){
                jwindow.bind('scroll.jpopupev', windowScroll);
                jwindow.bind('resize.jpopupev', windowResize);
            }

            var closeBtn = jpopup.find(opt.closeButtons[0]);
            if(closeBtn.length){
                closeBtn.unbind('click.jpopupev').bind('click.jpopupev', closePopup);

                if(opt.closeButtons.length > 1){
                    jpopup.find(opt.closeButtons.slice(1).join(',')).unbind('click.jpopupev').bind('click.jpopupev', function(){
                        closeBtn.trigger('click');
                        return false;
                    });
                }
            }

            if(overlay && !opt.confirmPopup){
                overlay.unbind('click.jpopupev').bind('click.jpopupev', closePopup);
            }

            var pos = rePosition();

			if(((jwindow.height() < jpopup.outerHeight(true)) || (jwindow.width() < jpopup.outerWidth(true))) || opt.dockPanel == 5){
				jpopup.css({
					'position': 'absolute',
					'top': pos.top + initScrollTop,
					'left': pos.left,
					'zIndex': opt.zIndex + 1
				});
			}else{
				jpopup.css({
					'position': 'fixed',
					'top': pos.top,
					'left': pos.left,
					'zIndex': opt.zIndex + 1
				});
			}

            if(overlay){
                overlay.stop(true).fadeTo(opt.overlayDuration, opt.opacity);
            }

            if(opt.onShow){
                opt.onShow.call(jpopup);
            }

            if($.browser.msie && parseFloat($.browser.version) < 9){
                setTimeout(function(){
                    jpopup.css('display', 'block');
                }, opt.popupDuration / 3);
            }else{
                jpopup.css('opacity', 0).stop(true).fadeTo(opt.popupDuration, 1);
            }

			windowResize();
        });
    };

	$.fn.closePopup = function(options){
        var defaults = {
            closeButtons: ['.close-popup']
        };

		options = $.extend(defaults, options);

        return this.each(function(){
            var jpopup = $(this),
				closeBtn = jpopup.find(options.closeButtons[0]);
            if(closeBtn.length){
                closeBtn.trigger('click');
            }
        });
    };

	$.fn.resizeBg = function(options){
		var defaults = {
			minWidth: 10,
			minHeight: 10,
			fitLandscape: 0,
			fitPortrait: 1,
			horizontalCenter: 0,
			zIndex: 0,
			hideImg: true,
			verticalCenter: 0
		};

		options = $.extend(defaults, options);
		var collections = this.find('.rzbackground').eq(options.zIndex),
			browserWidth = $(window).width(),
			browserHeight = $(window).height(),

		resizeWidth = function(jimage, ratio, minimum){
			if (minimum){
				if(jimage.width() < browserWidth || jimage.width() < options.minWidth ){
					if (jimage.width() * ratio >= options.minHeight){
						jimage.width(options.minWidth);
						jimage.height(jimage.width() * ratio);
					}else{
						resizeHeight(jimage, ratio);
					}
				}
			}else{
				if (options.minHeight >= browserHeight && !options.fitLandscape){
					if (browserWidth * ratio >= options.minHeight || (browserWidth * ratio >= options.minHeight && ratio <= 1)){
						jimage.width(browserWidth);
						jimage.height(browserWidth * ratio);
					} else if (ratio > 1){
						jimage.height(options.minHeight);
						jimage.width(jimage.height() / ratio);
					} else if (jimage.width() < browserWidth) {
						jimage.width(browserWidth);
						jimage.height(jimage.width() * ratio);
					}
				}else{
					jimage.width(browserWidth);
					jimage.height(browserWidth * ratio);
				}
			}
		},

		resizeHeight = function(jimage, ratio, minimum){
			if (minimum){
				if(jimage.height() < browserHeight){
					if (jimage.height() / ratio >= options.minWidth){
						jimage.height(options.minHeight);
						jimage.width(jimage.height() / ratio);
					}else{
						resizeWidth(jimage, ratio, true);
					}
				}
			}else{
				if (options.minWidth >= browserWidth){
					if (browserHeight / ratio >= options.minWidth || ratio > 1){
						jimage.height(browserHeight);
						jimage.width(browserHeight / ratio);
					} else if (ratio <= 1){
						jimage.width(options.minWidth);
						jimage.height(jimage.width() * ratio);
					}
				}else{
					jimage.height(browserHeight);
					jimage.width(browserHeight / ratio);
				}
			}
		},

		resizeMe = function(image){
			var jimage = $(image);
			var naturalHeight = image.naturalHeight;
			var naturalWidth = image.naturalWidth;
			if (!naturalHeight){
				naturalHeight = image.height;
				naturalWidth = image.width;
			}

			ratio = (naturalHeight / naturalWidth);

			if ((browserHeight <= options.minHeight) && (browserWidth <= options.minWidth)){

				if ((browserHeight / browserWidth) > ratio){
					options.fitLandscape && ratio <= 1 ? resizeWidth(jimage, ratio, true) : resizeHeight(jimage, ratio, true);
				} else {
					options.fitPortrait && ratio > 1 ? resizeHeight(jimage, ratio, true) : resizeWidth(jimage, ratio, true);
				}

			} else if (browserWidth <= options.minWidth){
				if ((browserHeight/browserWidth) > ratio){
					options.fitLandscape && ratio <= 1 ? resizeWidth(jimage, ratio, true) : resizeHeight(jimage, ratio);
				} else {
					options.fitPortrait && ratio > 1 ? resizeHeight(jimage, ratio) : resizeWidth(jimage, ratio, true);
				}
			} else if (browserHeight <= options.minHeight){
				if ((browserHeight/browserWidth) > ratio){
					options.fitLandscape && ratio <= 1 ? resizeWidth(jimage, ratio) : resizeHeight(jimage, ratio, true);
				} else {
					options.fitPortrait && ratio > 1 ? resizeHeight(jimage, ratio, true) : resizeWidth(jimage, ratio);
				}
			} else {
				if ((browserHeight/browserWidth) > ratio){
					options.fitLandscape && ratio <= 1 ? resizeWidth(jimage, ratio) : resizeHeight(jimage, ratio);
				} else {
					options.fitPortrait && ratio > 1 ? resizeHeight(jimage, ratio) : resizeWidth(jimage, ratio);
				}
			}

			if (options.horizontalCenter){
				$(this).css('left', (browserWidth - $(this).width())/2);
			}

			if (options.verticalCenter){
				$(this).css('top', (browserHeight - $(this).height())/2);
			}

		};

		var timeout = null;
		$(window).unbind('resize.zrzbg').bind('resize.zrzbg', function(){

			browserWidth = $(window).width();
			browserHeight = $(window).height();

			collections.each(function(){
				var imageBg = this;
				if(imageBg._loaded){
					resizeMe(imageBg);
				}else{
					var image = new Image();
					image.onload = function(){
						imageBg._loaded = true;
						resizeMe(imageBg);
					};
					image.src = imageBg.getAttribute('src');
				}
			});

		}).trigger('resize.zrzbg');

		var hiddenImages = collections,
			totalHImage = hiddenImages.length,
			hImgLoaded = 0;

		if(options.hideImg){
			hiddenImages.each(function(){
				var himage = this,
					image = new Image();

				image.onload = function(){
					this._loaded = true;
					resizeMe(himage);

					hImgLoaded++;

					$(himage).css('opacity', 1);

					if($.browser.msie && parseInt($.browser.version) < 9){
						$('#header img:first').removeClass('hidden');
					}else{
						$('#header img:first').css('opacity', 1);
					}

					if(hImgLoaded >= totalHImage && options.onComplete){
						options.onComplete();
					}
				};

				if($.browser.opera){
					setTimeout(function(){
						image.src = himage.getAttribute('src');
					}, 10);
				}else{
					image.src = himage.getAttribute('src');
				}
			});
		}
	};

	$.fn.menuNavigation = function(options){
        var defaults = {
        };

		return this.each(function(){
			var that = $(this),
				aTag = that.find('li > a:first'),
				liTag = that.find('li'),
				divBlockVideo = $('.block-video'),
				divShowreel = $('#nav-right'),
				divBlockContent = $('.block-content'),
				divContent = $('.content-type-1'),
				divPatner = $('.lnk-show');
			aTag.unbind('click.menuNavigation').bind('click.menuNavigation', function(){
				if(liTag.hasClass('off')){
					if(divBlockContent.length){
						divBlockContent.addClass('hidden');
					}
					if(divContent.length){
						divContent.addClass('hidden');
					}
					divBlockVideo.addClass('hidden');
					divShowreel.addClass('hidden');
					divPatner.addClass('hidden');
					liTag.removeClass('off').addClass('on');
				}else{
					if(divBlockContent.length){
						divBlockContent.removeClass('hidden');
					}
					if(divContent.length){
						divContent.removeClass('hidden');
					}
					divBlockVideo.removeClass('hidden');
					divShowreel.removeClass('hidden');
					divPatner.removeClass('hidden');
					liTag.removeClass('on').addClass('off');
				}
				return false;
			});
		});
    };

	$.fn.slideNavigationRight = function(options){
        var defaults = {
        };

		return this.each(function(){
			var that = $(this),
				aTag = that.find('.lnk-slide'),
				divTag = that.find('.logo-client'),
				textTitle = aTag.attr('title');
			aTag.unbind('click.slideNavigationRight').bind('click.slideNavigationRight', function(e){
				e.preventDefault();
				if(that.hasClass('off')){
					that.stop(true).animate({
						'margin-right': 0
					}, 500, function(){
						that.removeClass('off').addClass('on');
						aTag.attr('title', aTag.attr('data-zlang'));
						if($('#zVideo').length){
							$('#zVideo').removeAttr('controls');
						}
					});
				}else{
					that.stop(true).animate({
						'margin-right': -249
					}, 500, function(){
						that.removeClass('on').addClass('off');
						aTag.attr('title', textTitle);
						if($('#zVideo').length){
							$('#zVideo').attr('controls', 'controls');
						}
					});
				}
				return false;
			});
			divTag.unbind('click.slideNavigationRight').bind('click.slideNavigationRight', function(e){
				e.preventDefault();
				aTag.trigger('click.slideNavigationRight');
				return false;
			});
		});
    };

	$.fn.validationFrmContact = function(options){
        var defaults = {
        };

		return this.each(function(){
			var frm = $(this),
				txtName = frm.find('#name'),
				txtFName = frm.find('#first_name'),
				txtEmail = frm.find('#e_mail'),
				popupMess = $('.popup-type-1'),
				txtPhone = frm.find('#phone');

			frm.unbind('submit.validationFrmContact').bind('submit.validationFrmContact', function(){
				if(!AlertForm.requireField(txtName, '')){
					AlertForm.show(txtName, L10N.required.username);
					return false;
				}
				if(!AlertForm.requireField(txtFName, '')){
					AlertForm.show(txtFName, L10N.required.fname);
					return false;
				}
				if(!AlertForm.requireField(txtEmail, '')){
					AlertForm.show(txtEmail, L10N.required.email);
					return false;
				}
				if(!AlertForm.requireField(txtPhone, '')){
					AlertForm.show(txtPhone, L10N.required.phone);
					return false;
				}
				if(!AlertForm.checkPhone(txtPhone, '')){
					AlertForm.show(txtPhone, L10N.valid.phone);
					return false;
				}
				if(!AlertForm.validEmail(txtEmail, '')){
					AlertForm.show(txtEmail, L10N.valid.email);
					return false;
				}
				$.ajax({
					'url':'/ajax.php?lang='+frm.find('#lang').val(),
					'type':'POST',
					'data': frm.serialize(),
					beforeSend: function(){

					},
					success:function(result){
						var textMess = result.split(' ');
						popupMess.showPopup({
							noOverlay: false,
							zIndex: 3000,
							removeOnHide: true,
							dockPanel: 7,
							onShow: function(){
								if(textMess.length == 6){
									$(this).find('h1').text(textMess[0]+' '+textMess[1]);
									$(this).find('h2').text(textMess[2]+' '+textMess[3]+' '+textMess[4]);
									$(this).find('h3').text(textMess[5]);
								}else{
									$(this).find('h1').text(textMess[0]+' '+textMess[1]);
									$(this).find('h2').text(textMess[2]+' '+textMess[3]);
									$(this).find('h3').text(textMess[4]);
								}
							},
							closeButtons: ['.close-popup']
						});
					}
				});
				return false;
			});
		});
    };

	$.fn.fileUpload = function(options){
		var defaults = {
			action: 'upload.php',
			name: 'userfile',

			autoSubmit: true,
			triggerSubmit: '',
			triggerChoose: '',
			nameFile:'',
			langName:'',
			hoverClass: 'hover',
			disabledClass: 'disabled',

			onChange: null,
			onSubmit: null,
			onComplete: null,
			onFailedSubmit: null,

			onHover: false,
			onOut: false,

			disabled: false
		};

		return this.each(function(){
			var vars = $.extend(defaults, options),
				jelems = {
					jcontainer: $(this)
				},

				getUID = (function(){
					var id = 0;

					return function(){
						return 'jfileupload-' + id++;
					};
				}
				)(),

				initialize = function(button){

					var jbutton = $(button).unbind('mouseover.zupload').bind('mouseover.zupload', function(){
						if (vars.disabled)
						{
							return;
						}

						if (!jelems.jfile)
						{
							createInput();
						}

						var offset = jbutton.offset();
						jelems.jfileCont.css(
							{
								display: 'block',
								visibility: 'visible',
								top: offset.top,
								width: jbutton.outerWidth(),
								height: jbutton.outerHeight(),
								left: offset.left
							}
						);
					});

					jelems.jbutton = jbutton;
					fuEnable();

					if(vars.triggerSubmit && !vars.autoSubmit)
					{
						jelems.jcontainer.find(vars.triggerSubmit).unbind('click.zupload').bind('click.zupload', function()
							{
								fuSubmit();

								return false;
							}
						);
					}
				},

				fuDisable = function()
				{
					jelems.jbutton.addClass(vars.disabledClass);
					vars.disabled = true;
					if(jelems.jfileCont)
					{
						jelems.jfileCont.css('visibility', 'hidden');
					}
				},

				fuEnable = function()
				{
					jelems.jbutton.removeClass(vars.disabledClass);
					vars.disabled = false;
				},

				createInput = function()
				{
					var jfile = $('<input type="file" name="' + vars.name +'"/>').css(
						{
							position : 'absolute',
							right : 0,
							margin : 0,
							padding : 0,
							fontSize : '360px',
							cursor: 'pointer',
							fontFamily : 'sans-serif'
						}
					);

					var jfileCont = $('<div></div>').css(
						{
							display : 'block',
							position : 'absolute',
							overflow : 'hidden',
							margin : 0,
							padding : 0,
							opacity : 0,
							direction : 'ltr',
							zIndex: 2147483583
						}
					);

					if(vars.onHover){
						jfileCont.mouseenter(vars.onHover);
					}

					if(vars.onOut){
						jfileCont.mouseenter(vars.onOut);
					}

					jfile.change(function()
						{
							if(vars.onChange && vars.onChange.call(jelems.jcontainer, jfile.val()) == false){
								clearInput();
								return;
							}

							if (vars.autoSubmit){
								fuSubmit();
							}
						}
					).mouseover(function()
						{
							jelems.jbutton.addClass(vars.hoverClass);
						}
					).mouseout(function()
						{
							jelems.jbutton.removeClass(vars.hoverClass);
							jfileCont.css(
								{
									visibility: 'hidden'
								}
							);
						}
					);

					jfileCont.append(jfile).appendTo(document.body);

					jelems.jfile = jfile;
					jelems.jfileCont = jfileCont;
				},

				clearInput = function()
				{
					if(!jelems.jfile)
					{
						return;
					}

					jelems.jfile.remove();
					jelems.jfileCont.remove();
					jelems.jfile = null;
					jelems.jfileCont = null;
				},

				fuSubmit = function(data)
				{
					if(!jelems.jfile || !jelems.jfile.val())
					{
						if(vars.onFailedSubmit)
						{
							vars.onFailedSubmit.call(jelems.jcontainer);
						}

						return;
					}

					if(vars.onSubmit && vars.onSubmit.call(jelems.jcontainer, jelems.jfile.val()) == false)
					{
						clearInput();
						return;
					}

					var newid = getUID(),
						iframe = $('<iframe src="javascript:false;" id="' + newid + '" name="' + newid + '"/>').css('display', 'none').appendTo(document.body),
						form = $('<form method="post" action="' + vars.action + '?lang='+ vars.langName+'" target="' + newid + '" enctype="multipart/form-data"><input name="field" value="' + vars.nameFile + '"/></form>').css('display', 'none').appendTo(document.body);

					if(data)
					{
						for (var key in data)
						{
							var pair = data[key];
							form.append('<input name="' + pair.name + '" value="' + pair.value + '"/>');
						}
					}

					jelems.jbutton.removeClass(vars.hoverClass);
					form.append(jelems.jfile);
					form.submit();

					setTimeout(function()
						{
							form.remove();
							clearInput();
						},
						100
					);

					var complete = false;
					iframe.bind('load', function()
						{
							if(this.src == "javascript:'%3Chtml%3E%3C/html%3E';" || this.src == "javascript:'<html></html>';")
							{
								if(complete)
								{
									setTimeout(function()
									{
										iframe.remove();
									}, 100);
								}

								return;
							}

							var doc = this.contentDocument ? this.contentDocument : window.frames[this.id].document;
							if(doc.readyState && doc.readyState != 'complete')
							{
							   return;
							}

							if(doc.body && doc.body.innerHTML == 'false')
							{
								return;
							}

							var response;
							if(doc.XMLDocument)
							{
								response = doc.XMLDocument;
							}
							else if (doc.body)
							{
								response = doc.body.innerHTML;
							}
							else
							{
								response = doc;
							}

							if(vars.onComplete)
							{
								vars.onComplete.call(jelems.jcontainer, response);
							}

							complete = true;
							this.src = "javascript:'<html></html>';";
						}
					);
				};


			return initialize(jelems.jcontainer.find(vars.triggerChoose));
		});
	};

	$.fn.validationFrmRH = function(options){
        var defaults = {
        };

		return this.each(function(){
			var frm = $(this),
				txtName = frm.find('#name'),
				txtFName = frm.find('#first_name'),
				txtEmail = frm.find('#E-mail'),
				txtPhone = frm.find('#phone'),
				txtDate = frm.find('#date'),
				txtUpCV = frm.find('#cv'),
				popupMess = $('.popup-type-1'),
				txtUpLetter = frm.find('#letter');

			$('#cv').parent().fileUpload({
				action: '/ajax.php',
				name: 'compFile',
				nameFile: $('#cv').attr('id'),
				langName: $('#lang').val(),
				autoSubmit: true,
				triggerChoose: '.uploadImg',
				triggerSubmit: '.blueBtn',

				hoverClass: 'hover',
				disabledClass: 'disabled',

				onChange: function(fname){
					var ext = fname.substring(fname.lastIndexOf('.') + 1).toLowerCase(),
						allowExt = ['pdf', 'doc', 'ppt', 'docx', 'pptx'];

					for(var i = 0, len = allowExt.length; i < len; i++){
						if(ext == allowExt[i]){
							uploadCurr = this.find('.customfile-feedback');
							uploadCurr.val(fname);
							return true;
						}
					}
					AlertForm.show(this, L10N.valid.imgtype);
					return false;
				},
				onFailedSubmit: function(){
					AlertForm.show(this, L10N.valid.imgtype);
				},
				onSubmit: function(fname){

				},
				onHover: function(){

				},
				onComplete: function(response){
					// alert(response);
				}
			});

			$('#letter').parent().fileUpload({
				action: '/ajax.php',
				name: 'compFile',
				nameFile: $('#letter').attr('id'),
				langName: $('#lang').val(),
				autoSubmit: true,
				triggerChoose: '.uploadImg',
				triggerSubmit: '.blueBtn',

				hoverClass: 'hover',
				disabledClass: 'disabled',

				onChange: function(fname){
					var ext = fname.substring(fname.lastIndexOf('.') + 1).toLowerCase(),
						allowExt = ['pdf', 'doc', 'ppt', 'docx', 'pptx'];

					for(var i = 0, len = allowExt.length; i < len; i++){
						if(ext == allowExt[i]){
							uploadCurr = this.find('.customfile-feedback');
							uploadCurr.val(fname);
							return true;
						}
					}
					AlertForm.show(this, L10N.valid.imgtype);
					return false;
				},
				onFailedSubmit: function(){
					AlertForm.show(this, L10N.valid.imgtype);
				},
				onSubmit: function(fname){

				},
				onHover: function(){

				},
				onComplete: function(response){
					// alert(response);
				}
			});

			$('#book').parent().fileUpload({
				action: '/ajax.php',
				name: 'compFile',
				nameFile: $('#book').attr('id'),
				langName: $('#lang').val(),
				autoSubmit: true,
				triggerChoose: '.uploadImg',
				triggerSubmit: '.blueBtn',

				hoverClass: 'hover',
				disabledClass: 'disabled',

				onChange: function(fname){
					var ext = fname.substring(fname.lastIndexOf('.') + 1).toLowerCase(),
						allowExt = ['pdf', 'doc', 'ppt', 'docx', 'pptx'];

					for(var i = 0, len = allowExt.length; i < len; i++){
						if(ext == allowExt[i]){
							uploadCurr = this.find('.customfile-feedback');
							uploadCurr.val(fname);
							return true;
						}
					}
					AlertForm.show(this, L10N.valid.imgtype);
					return false;
				},
				onFailedSubmit: function(){
					AlertForm.show(this, L10N.valid.imgtype);
				},
				onSubmit: function(fname){

				},
				onHover: function(){

				},
				onComplete: function(response){
					// alert(response);
				}
			});

			frm.unbind('submit.validationFrmContact').bind('submit.validationFrmContact', function(){
				if(!AlertForm.requireField(txtName, '')){
					AlertForm.show(txtName, L10N.required.username);
					return false;
				}
				if(!AlertForm.requireField(txtFName, '')){
					AlertForm.show(txtFName, L10N.required.fname);
					return false;
				}
				if(!AlertForm.requireField(txtEmail, '')){
					AlertForm.show(txtEmail, L10N.required.email);
					return false;
				}
				if(!AlertForm.validEmail(txtEmail, '')){
					AlertForm.show(txtEmail, L10N.valid.email);
					return false;
				}
				if(!AlertForm.requireField(txtPhone, '')){
					AlertForm.show(txtPhone, L10N.required.phone);
					return false;
				}
				if(!AlertForm.checkPhone(txtPhone, '')){
					AlertForm.show(txtPhone, L10N.valid.phone);
					return false;
				}
				if(!AlertForm.requireField(txtDate, '')){
					AlertForm.show(txtDate, L10N.required.date);
					return false;
				}
				if(!AlertForm.checkDate(txtDate, '')){
					AlertForm.show(txtDate, L10N.valid.date);
					return false;
				}
				if(!AlertForm.requireField(txtUpCV, '')){
					AlertForm.show(txtUpCV, L10N.required.cv);
					return false;
				}
				if(!AlertForm.requireField(txtUpLetter, '')){
					AlertForm.show(txtUpLetter, L10N.required.letter);
					return false;
				}
				$.ajax({
					'url':'/ajax.php?lang='+frm.find('#lang').val(),
					'type':'POST',
					'data': frm.serialize(),
					beforeSend: function(){

					},
					success:function(result){
						var textMess = result.split(' ');
						popupMess.showPopup({
							noOverlay: false,
							zIndex: 3000,
							removeOnHide: true,
							dockPanel: 7,
							onShow: function(){
								if(textMess.length == 6){
									$(this).find('h1').text(textMess[0]+' '+textMess[1]);
									$(this).find('h2').text(textMess[2]+' '+textMess[3]+' '+textMess[4]);
									$(this).find('h3').text(textMess[5]);
								}else{
									$(this).find('h1').text(textMess[0]+' '+textMess[1]);
									$(this).find('h2').text(textMess[2]+' '+textMess[3]);
									$(this).find('h3').text(textMess[4]);
								}
							},
							closeButtons: ['.close-popup']
						});
					}
				});
				return false;
			});

		});
    };

	$.fn.showPrivacyPopup = function(options){
        var defaults = {

        },

        options = $.extend(defaults, options);
		var ulContent = $(this),
			liTag = ulContent.find('li').eq(1);
			liTag.unbind('click.showPrivacyPopup').bind('click.showPrivacyPopup', function(){
				$.ajax({
					'url':liTag.find('a:first').attr('href'),
					'type':'GET',
					async: false,
					beforeSend: function(){

					},
					success:function(result){
						var zPopup = $(result).appendTo(document.body);
						zPopup.showPopup({
							removeOnHide: true,
							noOverlay: true,
							onShow: function(){
								$(this).resizePopupInfo();
								if(Duke.isiOS){
									$(this).find('.sm-scroller-popup').remove();
									var scrollbar = new iScroll($(this).find('#container-inner')[0], {fadeScrollbar: true, hideScrollbar: false, scrollbarClass:'scroll-ios-'});
								}
								else{
									$(this).find('#container-inner').smScroll({
										content: '.blockpopup',
										upBtn: '.sm-scroll-up',
										downBtn: '.sm-scroll-dn',
										scroller: '.ui-slider-handle'
									});
									$(this).resizePopupInfo();
								}
							},
							closeButtons: ['.close-popup']
						});
					}
				});
				return false;
			});
    };

	$.fn.showEnSavoirPopup = function(options){
        var defaults = {

        },

        options = $.extend(defaults, options);
		var ulContent = $(this),
			liTag = ulContent.find('li').eq(0);
			liTag.unbind('click.showEnSavoirPopup').bind('click.showEnSavoirPopup', function(){
				$.ajax({
					'url':liTag.find('a:first').attr('href'),
					'type':'GET',
					async: false,
					beforeSend: function(){

					},
					success:function(result){
						var zPopup = $(result).appendTo(document.body);
						$('video')[0].pause();
						zPopup.showPopup({
							removeOnHide: true,
							noOverlay: true,
							playVideo: true,
							onShow: function(){
								$(this).resizePopupInfo();
								if(Duke.isiOS){
									$(this).find('.sm-scroller-popup').remove();
									var scrollbar = new iScroll($(this).find('#container-inner')[0], {fadeScrollbar: true, hideScrollbar: false, scrollbarClass:'scroll-ios-'});
								}
								else{
									$(this).find('#container-inner').smScroll({
										content: '.blockpopup',
										upBtn: '.sm-scroll-up',
										downBtn: '.sm-scroll-dn',
										scroller: '.ui-slider-handle'
									});
									$(this).resizePopupInfo();
								}
							},
							closeButtons: ['.close-popup']
						});
					}
				});
				return false;
			});
    };

	$.fn.showHRPopupFrom = function(options){
        var defaults = {

        },
        options = $.extend(defaults, options);
		var that = $(this),
			blockContents = that.children();
			blockContents.each(function(){
				var blockContent = $(this),
					blockContentPopup = blockContent.find('.content-popup'),
					aTag = blockContentPopup.find('.hr-form');
				if(!aTag.length){
					return ;
				}
				aTag.unbind('click.showHRPopupFrom').bind('click.showHRPopupFrom', function(){
					$.ajax({
						'url':aTag.attr('href'),
						'type':'GET',
						async: false,
						beforeSend: function(){

						},
						success:function(result){
							var zPopup = $(result).appendTo(document.body);
							zPopup.showPopup({
								removeOnHide: true,
								noOverlay: true,
								zIndex:1999,
								closeButtons: ['.close-popup']
							});
							$('#form-rh-1').validationFrmRH();
							$('.custSelect').custSelect();
						}
					});
					return false;
				});
			});
    };

	$.fn.showDiaporamaPopupFrom = function(options){
        var defaults = {

        },
        options = $.extend(defaults, options);
		var that = $(this),
			ulContent = that.find('ul:first'),
			aTag = ulContent.find('.zDiaporama > a:first');

			aTag.unbind('click.showDiaporamaPopupFrom').bind('click.showDiaporamaPopupFrom', function(){
				$.ajax({
					'url': aTag.attr('href'),
					'type': 'GET',
					async: false,
					beforeSend: function(){

					},
					success:function(result){
						if(Duke.isJson(result))
						{
							result = jQuery.parseJSON(result);
						}
						if (jQuery.browser.msie && parseInt(jQuery.browser.version) < 8){
							result = jQuery.parseJSON(result);
						}
						var zPopup = $(result.htmlContent).appendTo(document.body),
							closePopup = zPopup.find('.lnk-close');
						if(Duke.isiOS){
							$(document.body).children().css('display', 'none');
							zPopup.css({
								display: 'block',
								top: 0,
								left: 0,
								position : 'absolute',
								width: '100%',
								height: '100%',
								zIndex: 9999
							}).fullscreenSlide({
								instanceId: 'slideshow',
								autoplay: 0,
								random: 0,
								slideInterval: 2500,
								transitionDuration:	300,
								pauseOnHover: 0,
								keyboardNav: 1,
								performance: 2,

								minWidth: 10,
								minHeight: 10,
								verticalCenter: 1,
								horizontalCenter: 1,
								fitPortrait: 1,
								fitLandscape: 0,

								navigation: 1,
								slideCounter: 1,
								slides: result.listGallery
							});
						closePopup.unbind('click.ajaxShowGalleryFullScreen').bind('click.ajaxShowGalleryFullScreen', function(){
							$(document.body).children().css('display', 'block');
							zPopup.css('display','none').remove();
							return false;
						});
						}else{
							zPopup.showPopup({
								removeOnHide: true,
								noOverlay: true,
								onShow: function(){
									$(this).fullscreenSlide({
										instanceId: 'slideshow',
										autoplay: 0,
										random: 0,
										slideInterval: 2500,
										transitionDuration:	300,
										pauseOnHover: 0,
										keyboardNav: 1,
										performance: 2,

										minWidth: 10,
										minHeight: 10,
										verticalCenter: 1,
										horizontalCenter: 1,
										fitPortrait: 1,
										fitLandscape: 0,

										navigation: 1,
										slideCounter: 1,
										slides: result.listGallery
									});
								},
								closeButtons: ['.lnk-close']
							});
						}
					}
				});
				return false;
			});

    };

	$.fn.showHRFrm = function(options){
        var defaults = {

        },

        options = $.extend(defaults, options);

		var that = $(this),
			aTag = that.find('.hr-form');
			aTag.unbind('click.showPrivacyPopup').bind('click.showPrivacyPopup', function(){
				$.ajax({
					'url':aTag.attr('href'),
					'type':'GET',
					async: false,
					beforeSend: function(){

					},
					success:function(result){
						var zPopup = $(result).appendTo(document.body);
						zPopup.showPopup({
							removeOnHide: true,
							noOverlay: true,
							zIndex:1099,
							closeButtons: ['.close-popup']
						});
						$('#form-rh-1').validationFrmRH();
						$('.custSelect').custSelect();
					}
				});
				return false;
			});
    };

	$.fn.changeBGHome = function(options){
        var defaults = {
			slides: []
        };
		options = $.extend(defaults, options);
		if(typeof listImg == 'undefined'){
			return;
		}
		options.slides = listImg;
		return this.each(function(){
			var that = $(this),
				divContent = that.find('.content-type-inner-1'),
				zTitle = divContent.find('h3:first'),
				zContent = divContent.find('p:first'),
				zLink = divContent.find('a:first'),
				ulContent = that.find('.list-number'),
				imgBgHome = $('.rzbackground'),
				zindex = 0,
				liTags = ulContent.children();
			liTags.each(function(index){
				var liTag = $(this),
					liTagSiblings = liTag.siblings(),
					dataTitle = liTag.attr('data-title'),
					dataContent = liTag.attr('data-content'),
					dataLink = liTag.attr('data-link');
				if(index){
                                        bgIndex = 'rzbackground' + index;
					imgBgHome.clone().css({
						'opacity':0,
						'z-index':0
					}).insertAfter(imgBgHome).attr({
						'src': options.slides[index],
                                                'id': bgIndex
					});
                                        imgBgHome = $('#' + bgIndex);
				}
				liTag.unbind('click.changeBGHome').bind('click.changeBGHome', function(){
					imgBgHome = $('.rzbackground');

					if(liTag.hasClass('active')){
						return;
					}

					liTagSiblings.removeClass('active');
					imgBgHome.eq(zindex).css('opacity', 1).stop(true).animate({
						'opacity': 0
					}, 1000);

					zindex = index;
					liTag.addClass('active');
					jQuery('#container').resizeBg({
						'zIndex': zindex,
						'hideImg': false
					});
					imgBgHome.eq(zindex).css('opacity', 0).stop(true).animate({
						'opacity': 1,
						'z-index': 0
					}, 1000, function(){
						zTitle.text(dataTitle);
						zContent.html(dataContent);
						zLink.text(dataLink).attr({
							'href': dataLink,
							'title': dataLink
						});
					});
					return false;
				});
			});
		});
    };

	$.fn.ajaxShowGalleryFullScreen = function(options){
        var defaults = {
        };
		options = $.extend(defaults, options);
		return this.each(function(){
			var ulContent = $(this),
				liTags = ulContent.children();
			liTags.each(function(){
				var liTag = $(this);
				liTag.unbind('click.ajaxShowGalleryFullScreen').bind('click.ajaxShowGalleryFullScreen', function(){
					if(!liTag.find('a:first').hasClass('z-click')){
						return;
					}
					$.ajax({
						'url':liTag.find('a:first').attr('href'),
						'type':'GET',
						async: false,
						beforeSend: function(){

						},
						success:function(result){
							if(Duke.isJson(result))
							{
								result = jQuery.parseJSON(result);
							}
							if (jQuery.browser.msie && parseInt(jQuery.browser.version) < 8){
								result = jQuery.parseJSON(result);
							}
							var zPopup = $(result.htmlContent).appendTo(document.body),
								closePopup = zPopup.find('.lnk-close');
							if(Duke.isiOS){
								$(document.body).children().css('display', 'none');
								zPopup.css({
									display: 'block',
									top: 0,
									left: 0,
									position : 'absolute',
									width: '100%',
									height: '100%',
									zIndex: 9999
								}).fullscreenSlide({
									instanceId: 'slideshow',
									autoplay: 0,
									random: 0,
									slideInterval: 2500,
									transitionDuration:	300,
									pauseOnHover: 0,
									keyboardNav: 1,
									performance: 2,

									minWidth: 10,
									minHeight: 10,
									verticalCenter: 1,
									horizontalCenter: 1,
									fitPortrait: 1,
									fitLandscape: 0,

									navigation: 1,
									slideCounter: 1,
									slides: result.listGallery
								});
						closePopup.unbind('click.ajaxShowGalleryFullScreen').bind('click.ajaxShowGalleryFullScreen', function(){
							$(document.body).children().css('display', 'block');
							zPopup.css('display','none').remove();
							return false;
						});
							}else{
								zPopup.showPopup({
									removeOnHide: true,
									noOverlay: true,
									onShow: function(){
										$(this).fullscreenSlide({
											instanceId: 'slideshow',
											autoplay: 0,
											random: 0,
											slideInterval: 2500,
											transitionDuration:	300,
											pauseOnHover: 0,
											keyboardNav: 1,
											performance: 2,

											minWidth: 10,
											minHeight: 10,
											verticalCenter: 1,
											horizontalCenter: 1,
											fitPortrait: 1,
											fitLandscape: 0,

											navigation: 1,
											slideCounter: 1,
											slides: result.listGallery
										});
									},
									closeButtons: ['.lnk-close']
								});
							}
						}
					});
					return false;
				});
			});
		});
    };

	$.fn.ajaxShowPopupFullScreen = function(options){
        var defaults = {
        };
		options = $.extend(defaults, options);
		return this.each(function(){
			var that = $(this),
				divContent = that.find('.scroll-block-inner'),
				divTags = divContent.children();
			if(divTags[0].tagName == 'DIV'){
				if(divTags.length == 1){
					return;
				}
				if(divTags.length == 2 && divTags.eq(1).hasClass('block-siderbar')){
					var ulContent = divTags.eq(1).find('ul:first'),
						liTags = ulContent.children();
					liTags.each(function(){
						var liTag = $(this);
						liTag.unbind('click.ajaxShowPopupFullScreen').bind('click.ajaxShowPopupFullScreen', function(){
							$.ajax({
								'url':liTag.find('a:first').attr('href'),
								'type':'GET',
								async: false,
								beforeSend: function(){

								},
								success:function(result){
									var zPopup = $(result).appendTo(document.body);
									zPopup.showPopup({
										removeOnHide: true,
										noOverlay: true,
										onShow: function(){
											$(this).resizePopupInfo();
											if(Duke.isiOS){
												$(this).find('.sm-scroller-popup').remove();
												var scrollbar = new iScroll($(this).find('#container-inner')[0], {fadeScrollbar: true, hideScrollbar: false, scrollbarClass:'scroll-ios-'});
												var zPageX = $(this).find('#active-page').position().top,
													zPageY = $(this).find('#active-page').position().left;
												scrollbar.scrollToPage(zPageY, zPageX, 1000);
											}
											else{
												$(this).find('#container-inner').smScroll({
													content: '.blockpopup',
													upBtn: '.sm-scroll-up',
													downBtn: '.sm-scroll-dn',
													scroller: '.ui-slider-handle'
												});
												$(this).find('#container-inner').smScroll('scroll', [-zPopup.find('#active-page').position().top, {
													contentEaseDuration: 1000,
													contentEase: 'easeOutCirc',
													scrollerEaseDuration: 1000,
													scrollerEase: 'easeOutCirc'
												}]);
												$(this).resizePopupInfo();
												$('.blockpopup').showHRPopupFrom();
											}
										},
										closeButtons: ['.close-popup']
									});
								}
							});
							return false;
						});
					});
				}
				if(divTags.length == 2 && divTags.eq(0).hasClass('block-inner')){
					var ulContent = divTags.eq(0).find('ul:first'),
						liTags = ulContent.children();
					if(ulContent.length == 0){
						return;
					}
					liTags.each(function(){
						var liTag = $(this),
							siblings = liTag.siblings();
						liTag.unbind('click.ajaxShowPopupFullScreen').bind('click.ajaxShowPopupFullScreen', function(){
							siblings.removeClass('active');
							liTag.addClass('active');
							$.ajax({
								'url': $(this).find('a').attr('data-url'),
								'type':'GET',
								async: false,
								beforeSend: function(){

								},
								success:function(result){
									var ulContent = $(result);
									if(ulContent.length == 0){
										return false;
									}
									$('#career-right').replaceWith(ulContent);
								}
							});
							jQuery('.scroll-block-outer').ajaxShowPopupFullScreen();
							return false;
						});
					});
				}
				if(divTags.length == 2 && divTags.eq(1).hasClass('block-map')){
					return;
				}
				if(divTags.length == 2 && divTags.eq(0).hasClass('block-address')){
					return;
				}
				divTags.each(function(){
					var divTag = $(this);
					divTag.unbind('click.ajaxShowPopupFullScreen').bind('click.ajaxShowPopupFullScreen', function(){
						$.ajax({
							'url':divTag.attr('data-url'),
							'type':'GET',
							async: false,
							beforeSend: function(){

							},
							success:function(result){
								var zPopup = $(result).appendTo(document.body);
								zPopup.showPopup({
									removeOnHide: true,
									noOverlay: true,
									onShow: function(){
										$(this).resizePopupInfo();
										if(Duke.isiOS){
											$(this).find('.sm-scroller-popup').remove();
											var scrollbar = new iScroll($(this).find('#container-inner')[0], {fadeScrollbar: true, hideScrollbar: false, scrollbarClass:'scroll-ios-'});
											var zPageX = $(this).find('#active-page').position().top,
												zPageY = $(this).find('#active-page').position().left;
											scrollbar.scrollToPage(zPageY, zPageX, 1000);
										}
										else{
											$(this).find('#container-inner').smScroll({
												content: '.blockpopup',
												upBtn: '.sm-scroll-up',
												downBtn: '.sm-scroll-dn',
												scroller: '.ui-slider-handle'
											});
											$(this).find('#container-inner').smScroll('scroll', [-zPopup.find('#active-page').position().top, {
												contentEaseDuration: 1000,
												contentEase: 'easeOutCirc',
												scrollerEaseDuration: 1000,
												scrollerEase: 'easeOutCirc'
											}]);
											$(this).resizePopupInfo();
										}
									},
									closeButtons: ['.close-popup']
								}).showBigImgManagers();
							}
						});
						return false;
					});
				});
			}
			if(divTags[0].tagName == 'UL'){
                var liTags = divTags.children();
				if(divTags.hasClass('zContact')){
					liTags.each(function(){
						var liTag = $(this);
						liTag.unbind('click.ajaxShowPopupFullScreen').bind('click.ajaxShowPopupFullScreen', function(){
							$.ajax({
									'url':liTag.find('a:first').attr('href'),
									'type':'GET',
									async: false,
									beforeSend: function(){

									},
									success:function(result){
										var zPopup = $(result).appendTo(document.body);
										zPopup.showPopup({
											removeOnHide: true,
											noOverlay: true,
											zIndex:1099,
											closeButtons: ['.close-popup']
										});
										$('#form-contact-1').validationFrmContact();
										$('.custSelect').custSelect();
									}
							});
							return false;
						});
                    });
				}else{
					liTags.each(function(){
						var liTag = $(this);
						liTag.unbind('click.ajaxShowPopupFullScreen').bind('click.ajaxShowPopupFullScreen', function(){
							$.ajax({
								'url':liTag.find('a:first').attr('href'),
								'type':'GET',
								async: false,
								beforeSend: function(){

								},
								success:function(result){
									var zPopup = $(result).appendTo(document.body),
										zImgs = zPopup.find('img'),
										zNumImg = zImgs.length,
										zIndex = 0;
										zImgs.each(function(){
											var zImg = this;
											zImg.onload = function(){
												zIndex++;
												if(zIndex == zNumImg){
													zPopup.showPopup({
														removeOnHide: true,
														noOverlay: true,
														onShow: function(){
															if(Duke.isiOS){
																$(this).find('.sm-scroller-popup').remove();
																var scrollbar = new iScroll($(this).find('#container-inner')[0], {fadeScrollbar: true, hideScrollbar: false, scrollbarClass:'scroll-ios-'});
																var zPageX = $(this).find('#active-page').position().top,
																	zPageY = $(this).find('#active-page').position().left;
																scrollbar.scrollToPage(zPageY, zPageX, 1000);
															}
															else{
																$(this).resizePopupInfo();
																$(this).find('#container-inner').smScroll({
																		content: '.blockpopup',
																		upBtn: '.sm-scroll-up',
																		downBtn: '.sm-scroll-dn',
																		scroller: '.ui-slider-handle'
																});
																$(this).find('#container-inner').smScroll('scroll', [-zPopup.find('#active-page').position().top, {
																		contentEaseDuration: 1000,
																		contentEase: 'easeOutCirc',
																		scrollerEaseDuration: 1000,
																		scrollerEase: 'easeOutCirc'
																}]);
																$(this).resizePopupInfo();
															}
														},
														closeButtons: ['.close-popup']
													});
												}
											}
										});
								}
							});
								return false;
						});
					});
				}
			}
		});
    };

	$.fn.layerOurWork = function(options){
        var defaults = {
        };
		options = $.extend(defaults, options);
		return this.each(function(){
			var that = $(this),
				layerLink = that.find('.nav-sub-1').css({
					'display': 'block',
					'opacity': 0
				}),
				videoContent = that.find('#zVideo'),
				layerInfo = that.find('#zLayerInfo'),
				closevideoContent = layerInfo.find('.close-popup'),
				hiddenLayer = null;

			videoContent.unbind('mouseover.layerOurWork').bind('mouseover.layerOurWork', function(){
				if($.browser.mozilla){
					layerLink.css({
						'display': 'block',
						'top': 300
					}).stop(true).animate({
						'opacity': 1
					});
				}
			});

			videoContent.unbind('mouseout.layerOurWork').bind('mouseout.layerOurWork', function(){
				hiddenLayer = setTimeout(function(){
					layerLink.stop(true).animate({
						'opacity': 0
					}, function(){
						layerLink.css('display', 'none');
					});
				});
			});

			layerLink.unbind('mouseenter.layerOurWork').bind('mouseenter.layerOurWork', function(){
				if (hiddenLayer) {
					clearTimeout(hiddenLayer);
				}
			});

			layerLink.unbind('mouseleave.layerOurWork').bind('mouseleave.layerOurWork', function(){
				hiddenLayer = setTimeout(function(){
					layerLink.stop(true).animate({
						'opacity': 0
					}, function(){
						layerLink.css('display', 'none');
					});
				});
			});

			$('#zVideo').bind('ended', function() {
				if(layerInfo.length){
					layerInfo.css({
						'display': 'block',
						'opacity': 0
					}).stop(true).animate({
						'opacity': 1
					}, 500);
					$(this).removeAttr('controls');
				}
			});

			document.addEventListener("fullscreenchange", function () {
				if(!document.fullscreen){
					$('#nav').css('display', 'block');
					$('#header').css('display', 'block');
					$('.lang').css('display', 'block');
				}else{
					$('#nav').css('display', 'none');
					$('#header').css('display', 'none');
					$('.lang').css('display', 'none');
				}
			}, false);

			document.addEventListener("mozfullscreenchange", function () {
				if(!document.mozFullScreen){
					$('#nav').css('display', 'block');
					$('#header').css('display', 'block');
					$('.lang').css('display', 'block');
				}else{
					$('#nav').css('display', 'none');
					$('#header').css('display', 'none');
					$('.lang').css('display', 'none');
				}
			}, false);

			document.addEventListener("webkitfullscreenchange", function () {
				if(!document.webkitIsFullScreen){
					$('#nav').css('display', 'block');
					$('#header').css('display', 'block');
					$('.lang').css('display', 'block');
				}else{
					$('#nav').css('display', 'none');
					$('#header').css('display', 'none');
					$('.lang').css('display', 'none');
				}
			}, false);

			closevideoContent.unbind('click.layerOurWork').bind('click.layerOurWork', function(e){
				e.preventDefault();
				$('#zVideo').attr('controls', 'controls');
				layerInfo.stop(true).animate({
					'opacity': 0
				}, function(){
					layerInfo.css('display', 'none');
				});
				return false;
			});
		});
    };

	$.fn.showBigImgManagers = function(options){
		var defaults = {

		};

		options = $.extend(defaults, options);
		return this.each(function(){
			var that = $(this),
				aTags = that.find('.view-fullsize');
				aTags.each(function(){
					var aTag = $(this),
						zImgBig = aTag.next();
						// var offs = zImgBig.offset();
						// var dimension = {
							// width: zImgBig.outerWidth(),
							// height: zImgBig.outerHeight()
						// };

						if(Duke.isiOS){
							aTag.unbind('click.showBigImgManagers').bind('click.showBigImgManagers', function(){
								zImgBig.show();
							});

							zImgBig.unbind('click.showBigImgManagers').bind('click.showBigImgManagers', function(){
								zImgBig.hide();
							});

						}else{
							aTag.unbind('mouseover.showBigImgManagers').bind('mouseover.showBigImgManagers', function(){
								zImgBig.show();
							});

							zImgBig.unbind('mouseout.showBigImgManagers').bind('mouseout.showBigImgManagers', function(e){
								// var x = e.pageX;
								// var y = e.pageY;
								// var maxLeft = offs.left + dimension.width;
								// var minLeft = offs.left;
								// var maxTop = offs.top + dimension.height;
								// var minTop = offs.top;
								// if (y < minTop || y > maxTop){
									// zImgBig.hide();
								// }
								// if (x < minLeft || x > maxLeft){
									zImgBig.hide();
								// }
							});
						}
				});
		});

	};

	$.fn.initVideoGallery = function(options){
		var defaults = {

		};

		options = $.extend(defaults, options);

		return this.each(function(){
			var jcontainer = $(this),
				jVideo = jcontainer.find('#zVideo'),
				srcVideo = $(srcVideo);
				if(jVideo.length){
					jVideo.remove();
				}
				if(srcVideo.length){
					setTimeout(function(){
						var sObj = new SWFObject("/wp-content/themes/digitas-duke/skin/swf/VideoPlayer.swf", "zVideos", "613", "360", "0", "#000000");
						sObj.addVariable("video", srcVideo);
						sObj.addVariable("external1", "EN SAVOIR PLUS, function1");
						sObj.addVariable("external2", "VOIR LE SITE, function2");
						sObj.addVariable("share", "SHARE VIDEO");
						sObj.addVariable("facebook", "FACEBOOK,facebook.com");
						sObj.addVariable("twitter", "TWITTER,twitter.com");
						sObj.addVariable("permalink", '"PERMALINK,'+zPermalink+'"');
						sObj.addParam("allowfullscreen", "true");
						sObj.write("video-outer");
					}, 100);
				}
		});
	};

})(jQuery);

/**
 * @class: AlertForm
 * @description: minimal validation formulaire
 **/

var AlertForm = {
    vars: {
        layerClass: 'alert-layer',
        timeHide: 2000,
        timeWait: null,
        reEmail: /^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
        reString: /(([a-zA-Z]_*)+)/,
		reDate: /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/
    },
    initialize: function(options){
        jQuery.extend(this.vars, options);

        this.layer = jQuery('<div id="alert-form" class="' + this.vars.layerClass + '">' +
							'<p class="message">Error</p>' +
						'</div>').appendTo(document.body).css('top' , -70000);

        jQuery(document).unbind('mousedown.zhlayer').bind('mousedown.zhlayer', function(){
            AlertForm.hide();
        });
    },
    show: function(element, message, offset){
        var elm = jQuery(element),
        offs = {
            x: 0,
            y: 0,
            w: 11,
            h: 0
        },
        elmoffs = elm.offset();

        jQuery.extend(offs, offset);
        this.layer.css('width', 'auto').find('p.message').html(message);
        this.layer.css({
            'top': elmoffs.top + elm.outerHeight() + offs.y,
            'left': elmoffs.left + offs.x,
            'width': Math.max(0, Math.min(jQuery(window).width() - elmoffs.left + offs.x, Math.max(elm.outerWidth() -6, this.layer.width()))) + offs.w - 15 //10 = padding left + right of layer
        });

        var tag = elm[0].tagName;
        if(tag == 'INPUT' || tag == 'TEXTAREA'){
            elm[0].select();
            elm[0].focus();
        }

        this.layer.stop(true).fadeTo(300, 1);
        this.layer.data('show', 1);

		var scrollTop = jQuery(window).scrollTop(),
			wndHeight = jQuery(window).height(),
			layerTop = this.layer.offset().top;

		if(layerTop < scrollTop){
			jQuery('html, body').stop().animate({
				scrollTop: Math.max(0, layerTop - 50)
			});
		}else if(layerTop > scrollTop + wndHeight){
			jQuery('html, body').stop().animate({
				scrollTop: Math.max(0, layerTop - wndHeight + 50)
			});
		}

        var that = this;
        clearInterval(this.vars.timeWait);
        this.vars.timeWait = setInterval(function(){
            AlertForm.hide();
        }, this.vars.timeHide);
    },
    hide: function(){
        if(this.layer.data('show')){
            clearInterval(this.vars.timeWait);
            this.layer.stop(true).fadeTo(200, 0, function(){
                AlertForm.layer.css('top', -50000);
            });
            this.layer.data('show', 0);
        }
    },
    range: function(element){
        var result = {
            text: '',
            start: 0,
            end: 0,
            length: 0
        };

        if (element.setSelectionRange){	/* W3C/Gecko/IE9+ */
            result.start= element.selectionStart;
            result.end	= element.selectionEnd;
            result.text	= (result.start !== result.end) ? element.value.substring(result.start, result.end): '';
        }else if (document.selection){	/* IE8- */
            var selRange, txtRange, txtRangeDup;
            if (element.tagName && element.tagName === 'TEXTAREA'){
                selRange = document.selection.createRange().duplicate();
                txtRange = element.createTextRange();
                txtRange.collapse(false);
                txtRange.moveToBookmark(selRange.getBookmark());
                if (selRange.text === ''){
                    txtRangeDup	= txtRange.duplicate();
                    txtRangeDup.moveEnd('character', 1);
                    if (selRange.boundingWidth === txtRangeDup.boundingWidth && selRange.boundingHeight === txtRangeDup.boundingHeight){
                        txtRange = txtRangeDup;
                    }
                }
            }else{
                txtRange = document.selection.createRange().duplicate();
            }

            result.text = txtRange.text;
            result.start = Math.abs(txtRange.moveStart('character', -1000000));
            result.end = result.text.length + result.start;
        }else if (document.getSelection){	/* Netscape 4 */
            result.text	= document.getSelection();
            result.end	= result.text.length;
        }

        result.length	= result.text.length;

        return result;
    },
    initAlterText: function(element, init){
        var jelm = jQuery(element);
        jelm.unbind('blur.alter').unbind('focus.alter').bind('blur.alter', function(){
            if(jQuery.trim(jelm.val()) == ''){
                jelm.val(init);
            }
        }).bind('focus.alter', function(){
            if(jQuery.trim(jelm.val()) == init){
                jelm.val('');
            }
        });
    },
    initTextRemain: function(element, counter, limit, zalert){
		jQuery(element).unbind('keypress.zcremain').bind('keypress.zcremain', function(e){
			var code = typeof(e.charCode) != 'undefined' ? e.charCode : e.keyCode,
				key = (code == 0) ? '' : String.fromCharCode(code);

			if(key != '' && this.value.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').split(' ').length >= limit)
			{
				this.value = this.value;
				AlertForm.show(element, zalert);
				return false;
			}else{
				this.value = this.value;
			}
		})
		.unbind('keyup.zcremain').bind('keyup.zcremain', function(e){
			var code = typeof(e.charCode) != 'undefined' ? e.charCode : e.keyCode,
				key = (code == 0) ? '' : String.fromCharCode(code);

			if(key != '' && this.value.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').split(' ').length >= limit){
				this.value = this.value;
				AlertForm.show(element, zalert);
				return false;
			}else{
				if(this.value.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ') != ""){
					jQuery(counter).text(this.value.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').split(' ').length + '/300 words');
				}else{
					jQuery(counter).text('0/300 words');
				}
			}
		})
		.unbind('change.zcremain').bind('change.zcremain', function(e){
			this.value = this.value;
			jQuery(counter).text(this.value.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').split(' ').length + '/300 words');
		});
	},
    restrictField: function(element, strRE){
        jQuery(element).unbind('keypress.restrict').bind('keypress.restrict', function(e){
            var code = typeof(e.charCode) != 'undefined' ? e.charCode : e.keyCode,
            key = (code == 0) ? '' : String.fromCharCode(code),
            re = new RegExp(strRE);

            if(key != '' && !re.test(key)){
                return false;
            }
        });
    },
    requireAWord: function(element){
        var val = jQuery.trim(element.value);
        if(val.length < 1 || val.indexOf(' ') != -1){
            return false;
        }

        for(var i = 0; i < val.length; i++){
            if(val.charCodeAt(i) < 127 && !/\w/.test(val.charAt(i))){
                return false;
            }
        }

        return true;
    },
    requireField: function(element, init){
        if(element && (jQuery.trim(element.val()).length == 0 || jQuery.trim(element.val()) == init)){
            return false;
        }
        return true;
    },
	clearText: function(element, text){
		element.unbind('blur.alter').unbind('focus.alter').bind('blur.alter', function(){
				if(element.val() == ''){
					element.val(text);
				}
		}).bind('focus.alter', function(){
				   if(element.val() == text){
						element.val('');
					}
			});
	},
    requireCheck: function(element){
        if(element && element.checked == false){
            return false;
        }

        return true;
    },
	checkPhone: function(element){
		if(element && (jQuery.trim(element.val()).length > 20)){
            return false;
        }
        return true;
	},
	checkDate: function(element){
		return this.vars.reDate.test(element.val());
	},
	checkSelec: function(element){
		var selectedIndex = jQuery('.month option').index(jQuery('.month option:selected'));
		if(element &&  selectedIndex == 0){
			return false;
		}

		return true;
	},
	checkConfirm: function(element, curPass){
		if(element &&  element.val() != curPass.val()){
			return false;
		}
		return true;
	},
    validEmail: function(element){
        return this.vars.reEmail.test(element.val());
    },
	validString: function(element){
        return this.vars.reString.test(element.val());
    }
};
