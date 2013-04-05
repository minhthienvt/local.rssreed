function checkAllCheckbox(){
	var inptCheckbox = $('input[type="checkbox"]').eq(0);
	var hCheck = true;
	inptCheckbox.click(function(){
		if(hCheck){
			$('input[type="checkbox"]').attr('checked', true);
			hCheck = false;		
		}else{
			$('input[type="checkbox"]').attr('checked', false);
			hCheck = true;
		}
	});
}

function checkDelete(){
	var btnDel = $('#btn-del');
	var inptCheckboxs = $('input[type="checkbox"]');
	var hCheck = false;
	var frmRss = $('#frmRssFeed');
	btnDel.click(function(){
		if (confirm("Are you sure?")){
			inptCheckboxs.each(function(idx){
				var inptCheckbox = $(this);
				if(inptCheckbox.attr('checked') == "checked"){			
					hCheck = true;
					return false;
				}else{
					hCheck = false;				
				}			
			});		
			if(!hCheck){
				alert('Please choose at least one item !');
				return false;
			}
			frmRss.attr('action', btnDel.attr('rel')).submit();
		}
	});
}

function validateRssForm(){
	var frmRss =  $('.form-horizontal'),
		txtTitle = frmRss.find('#sm_bundle_adminbundle_rssfeedtype_title'),
		txtLink = frmRss.find('#sm_bundle_adminbundle_rssfeedtype_external_link'),
		txtBegin = frmRss.find('#sm_bundle_adminbundle_rssfeedtype_begin_refesh'),
		txtEnd = frmRss.find('#sm_bundle_adminbundle_rssfeedtype_end_refesh');
	var hCheck = false;	
	var hNum = false;	
	function checkNull(elm){
		if(elm && elm.val().length == 0){
			return false;
		}
		return true;
	}
	function showMess(elm, mess, fixMargin){
		var blockErr = $('<br/><span class="error" style="color:red; font-style:italic"></span>');
		if(fixMargin){
			elm.val('');
		}else{	
			if(!elm.parent().find('.error').length){
				blockErr.appendTo(elm.parent());
				elm.parent().find('.error').text(mess);			
			}
			elm.parent().find('.error').text(mess);	
			elm.focus();
			elm.css('border','1px solid red');	
		}
	}
	function removeMess(elm){	
		elm.parent().find('br').remove();
		elm.parent().find('.error').remove();
		elm.css('border','1px solid #ccc');		
	}
	function checkLink(elm){
		var urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/; 
			if(!urlRegex.test(elm.val())){
				return false;
			}
			return true;
	}
	function checkNum(elm){
		var reg = /^\d+$/;
			if(elm.val() != ""){
				if(!reg.test(elm.val())){
					return false;
				}else{
					if(parseInt(elm.val()) <0 ||  parseInt(elm.val()) >23){
						return false;
					}
					return true;
				}
			}
			return true;
	}
		frmRss.unbind('submit.validateRssForm').bind('submit.validateRssForm', function(e){
			hCheck = false;	
			hNum = false;	
			if(!checkNull(txtTitle)){
				hCheck = true;
				showMess(txtTitle, 'Title is requried');
			}else{
				removeMess(txtTitle);
			}
			if(!checkNull(txtLink)){
				hCheck = true;
				showMess(txtLink, 'Link is requried');
			}else{
				if(!checkLink(txtLink)){
					hCheck = true;
					showMess(txtLink, 'Invalid URL');
				}else{
					removeMess(txtLink);
				}
			}
			if(!checkNum(txtBegin)){				
				hCheck = true;
				showMess(txtBegin, '', true);
				hNum = true;
			}else{
				removeMess(txtBegin);
				hNum = false;
			}
			if(!checkNum(txtEnd)){
				hCheck = true;
				showMess(txtEnd, '', true);
			}else{
				if(hNum){
				}else{
					removeMess(txtEnd);				
				}
			}
			if(hCheck){
				return false;
			}
		});
}

$( document ).ready( function() {
	validateRssForm();
	checkAllCheckbox();
	checkDelete();
    $(".delete").click(function() {
        if (confirm("You want to delete?")) {
            window.location.href = this.rel;
        }
    });
});