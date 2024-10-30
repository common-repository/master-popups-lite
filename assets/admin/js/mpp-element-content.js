window.MppElementContent = (function (window, document, $) {
  var xbox;
  var PE;//Popup Editor
  var app = {
    debug: true,
  };

  //Document Ready
  $(function () {
    xbox = window.XBOX;
    PE = window.MppPopupEditor;
    app.init();
  });


  app.init = function () {
    app.$post_body_popup_editor = $('body.post-type-master-popups #post-body');

  };

  app.get_content = function ($element, values, args) {
    var content = '';
    switch (args.type) {
      case 'close-icon':
        content = app.get_content_type_object(values['e-content-close-icon']);
        break;

      case 'object':
        content = app.get_content_type_object(values['e-content-object']);
        break;

      case 'text-html':
      case 'shape':
      case 'object':
      case 'button':
      case 'sticky_control':
        content = values['e-content-textarea'];
        break;

      case 'image':
        content = app.get_content_type_image(values['e-content-image']);
        break;

      case 'video':
        content = app.get_content_type_video(values);
        break;

      case 'shortcode':
        content = values['e-content-shortcode'];
        break;

      case 'iframe':
        content = app.get_content_type_iframe(values['e-content-url']);
        break;

      case 'countdown':
        content = app.get_content_type_countdown(values);
        break;

      case 'field_first_name':
      case 'field_last_name':
      case 'field_email':
      case 'field_phone':
      case 'field_message':
      case 'field_submit':

      case 'custom_field_input_text':
      case 'custom_field_input_hidden':
      case 'custom_field_input_checkbox':
      case 'custom_field_input_checkbox_gdpr':
        content = app.get_content_form_fields(values, args.type);
        break;
    }
    return content;
  };

  app.get_content_type_object = function (value) {
    if (value.indexOf('.svg') > -1) {
      return '<img src="' + value + '">';
    }
    return '<i class="' + value + '"></i>';
  };

  app.get_content_type_image = function (value) {
    return '<img src="' + value + '">';
  };

  app.get_content_type_video = function (values) {
    var content = '';
    content = '<div class="mpp-video-poster" style="background-image: url(' + values['e-video-poster'] + ')">';
    content += '<div class="mpp-video-caption">' + values['e-video-type'] + ' video</div>';
    content += '<div class="mpp-play-icon"><i class="' + values['e-play-icon'] + '"></i></div>';
    content += '</div>';
    return content;
  };

  app.get_content_type_iframe = function (value) {
    var content = '';
    return content;
  };

  app.get_content_type_countdown = function (values) {
    content = '<div class="mpp-countdown-wrap">';
    content += '<div class="mpp-countdown"></div>';
    content += '</div>';
    $countdown = $(content).find('.mpp-countdown');
    return $countdown.parent();
  };

  app.get_values_countdown = function ($target) {
    var $group_item = $target.closest('.xbox-group-item');
    var data = xbox.get_group_object_values($target.closest('.xbox-group-item'));
    var group_values = PE.get_group_values(data, PE.get_active_device($target), $group_item.data('index'));
    return group_values;
  };

  app.get_content_form_fields = function (values, type) {
    var content = '';
    if ($.inArray(type, ['field_first_name', 'field_last_name', 'field_email', 'field_phone', 'custom_field_input_text']) > -1) {
      content = '<span>' + values['e-field-placeholder'] + '</span>';
    } else if ($.inArray(type, ['custom_field_input_checkbox', 'custom_field_input_checkbox_gdpr']) > -1) {
      content = '<label><input type="checkbox" name=""/><i class="mpp-icon mpp-icon-check"></i></label>';
    } else if (type == 'field_message') {
      content = values['e-field-placeholder'];
    } else if (type == 'field_submit') {
      content = values['e-content-textarea'];
    }
    return content;
  };


  app.get_values_form_fields = function ($target) {
    var values = {};
    var $group_item = $target.closest('.xbox-group-item');
    values['e-field-placeholder'] = $group_item.find('.xbox-field-id-mpp_e-field-placeholder .xbox-element').val();
    values['e-content-textarea'] = $group_item.find('.xbox-field-id-mpp_e-content-textarea .xbox-element').val();
    return values;
  };

  app.get_values_type_video = function ($target) {
    var values = {};
    var $group_item = $target.closest('.xbox-group-item');
    values['e-content-video'] = $group_item.find('.xbox-field-id-mpp_e-content-video .xbox-element').val();
    values['e-content-video-html5'] = $group_item.find('.xbox-field-id-mpp_e-content-video-html5 .xbox-element').val();
    values['e-video-type'] = $group_item.find('.xbox-field-id-mpp_e-video-type .xbox-element:checked').val();
    values['e-video-poster'] = $group_item.find('.xbox-field-id-mpp_e-video-poster .xbox-element').val();
    values['e-play-icon'] = $group_item.find('.xbox-field-id-mpp_e-play-icon .xbox-element').val();
    return values;
  };

  app.get_background_values = function ($target) {
    var $group_item = $target.closest('.xbox-group-item');
    var values = {
      repeat: $group_item.find('.xbox-field-id-mpp_e-bg-repeat .xbox-element input[type="hidden"]').val(),
      size: $group_item.find('.xbox-field-id-mpp_e-bg-size .xbox-element input[type="hidden"]').val(),
      position: $group_item.find('.xbox-field-id-mpp_e-bg-position .xbox-element').val(),
      image: $group_item.find('.xbox-field-id-mpp_e-bg-image .xbox-element').val(),
      color: $group_item.find('.xbox-field-id-mpp_e-bg-color .xbox-element').val(),
      enable_gradient: $group_item.find('.xbox-field-id-mpp_e-bg-enable-gradient .xbox-element').val(),
      color_gradient: $group_item.find('.xbox-field-id-mpp_e-bg-color-gradient .xbox-element').val(),
      angle_gradient: $group_item.find('.xbox-field-id-mpp_e-bg-angle-gradient .xbox-element').val(),
    };
    return values;
  };


  //Debug
  function c(msg) {
    console.log(msg);
  }

  function cc(msg, msg2) {
    console.log(msg, msg2);
  }

  function clog(msg) {
    if (app.debug) {
      console.log(msg);
    }
  }

  return app;

})(window, document, jQuery);
