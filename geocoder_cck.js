/**
 * @file
 * This file manages callback functions for the geocoder_cck module.
 *
 * @author Pablo López (plopesc)
 * @ingroup Whami
 */

Drupal.behaviors.geocoder_cck = function (context) {
	Drupal.geocoderTextfield = Drupal.geocoderTextfield || {};
	if (Drupal.jsAC) {
		  /**
		   * Hides the autocomplete suggestions
		   */
		  Drupal.jsAC.prototype.hidePopup = function (keycode) {
		    // Select item if the right key or mousebutton was pressed
		    if (this.selected && ((keycode && keycode != 46 && keycode != 8 && keycode != 27) || !keycode)) {
		      this.input.value = this.selected.autocompleteValue;
		    }
		    // Hide popup
		    var popup = this.popup;
		    if (popup) {
		      this.popup = null;
		      $(popup).fadeOut('fast', function() { $(popup).remove(); });
		      // Add-on for Mapstraction CCK Geocoder module
		      if ($(this.input).attr('geoautocomplete')&& this.input.value != '') {
		        geocoder = new Drupal.Geocoder(this);
		        geocoder.process(this.input.value);
		      }
		      // Add-on for Geocoder Block module
		      if ($(this.input).attr('geocoder-textfield-autocomplete') && this.input.value != '' && this.selected) {
		    	  Drupal.geocoderTextfield.launchHook($(this.input));
		      }
		    }
		    this.selected = false;
		    
		  };
	}
	$('input[class*="geocoder-textfield"]').keypress(function(e){
      	if(e.which == 13){
      		Drupal.geocoderTextfield.launchHook($(this))
      		e.preventDefault();	}
      })

	Drupal.geocoderTextfield.launchHook = function(input) {
		if ($(input).attr('callback').length > 0) {
			// Ajax GET request for autocompletion
		    $.ajax({
		      type: "GET",
		      url: Drupal.settings.basePath + 'geocoder_cck/ajax/' + $(input).attr('callback') + '/' + $(input).val(),
		      success: function (result) {
		    	  if (result != '') {
		    		  $(input).val(result);
		    		  
		    	  }
		    	  Drupal.geocoderTextfield.hook2val[$(input).attr('id')] = $(input).val();
		      }
		    });
		}
	}
	
	Drupal.geocoderTextfield.defaultValue = {};
	Drupal.geocoderTextfield.hook2val = {};
	$('input[class*="geocoder-textfield"]').each(function(){
		Drupal.geocoderTextfield.defaultValue[$(this).attr('id')] = $(this).val();
		Drupal.geocoderTextfield.hook2val[$(this).attr('id')] = '';
	})
	$('input[class*="geocoder-textfield"]').focus(function() {
        if($(this).val() == Drupal.geocoderTextfield.defaultValue[$(this).attr('id')]) $(this).val("");
        if($(this).val() == Drupal.geocoderTextfield.hook2val[$(this).attr('id')])  $(this).select();
    }).blur(function(){
        if($(this).val().length == 0) {
        	if (Drupal.geocoderTextfield.hook2val[$(this).attr('id')].length > 0) {
        		$(this).val(Drupal.geocoderTextfield.hook2val[$(this).attr('id')]);
        	}else{
        		$(this).val(Drupal.geocoderTextfield.defaultValue[$(this).attr('id')]);
        	}
        }
    });
}