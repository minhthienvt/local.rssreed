/**
 * @class: Start
 * @description:  Start website here
 * @version: 1.0 
 **/

/**
 * Global variables
 **/
 
var Duke = Duke || {};
Duke.isiOS = (/iPad/i.test(navigator.userAgent)) || (/iPhone/i.test(navigator.userAgent));

function requestFullScreen(element){    
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod){
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined"){
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null){
            wscript.SendKeys("{F11}");
        }
    }
};

function cancelFullScreen(element){    
    var requestMethod = element.cancelFullScreen || element.webkitCancelFullScreen || element.mozCancelFullScreen || element.msCancelFullScreen;
    if (requestMethod){
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined"){
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null){
            wscript.SendKeys("{F11}");
        }
    }
};
/**
 * Website start here
 **/
jQuery(document).ready(function(){
	AlertForm.initialize();	
	jQuery('#container').resizeBg();
	jQuery('#blockcontent-news').changeBGHome();
	jQuery('.right-footer').showPrivacyPopup();
	jQuery('.nav-sub-1').showEnSavoirPopup();
	jQuery('#nav').menuNavigation();
	jQuery('.first').showDiaporamaPopupFrom();
	jQuery('#nav-right').slideNavigationRight();	
	jQuery('#form-rh-1').validationFrmRH();			
	jQuery('.block-inner').showHRFrm();					
	jQuery('.type-content-1').ajaxShowGalleryFullScreen();	
	jQuery('.scroll-block-outer').ajaxShowPopupFullScreen();	
	if(jQuery.browser.msie && parseInt(jQuery.browser.version) < 9){
		jQuery('.video-outer').initVideoGallery(); 
	}else{
		jQuery('.video-outer').layerOurWork();
	}
	if(Duke.isiOS){
		$('#sidebar').css('top', 50);
		if(jQuery('.block-outer').length != 0){
			jQuery('.block-outer').find('.sm-scroller').remove();
			var scrollbar = new iScroll(jQuery('.block-outer').find('.scroll-block-outer')[0], {fadeScrollbar: true, hideScrollbar: false, scrollbarClass:'scroll-ios-'});
		}
	}else{
		jQuery('.block-outer').smScroll({
			content: '.scroll-block-inner',											
			upBtn: '.sm-scroll-up',
			downBtn: '.sm-scroll-dn',
			scroller: '.ui-slider-handle'
		});
	}				
	jQuery('.right-footer').find('li:last').unbind('click').bind('click', function(){
		var elem = document.body;
		requestFullScreen(elem);
	});
});