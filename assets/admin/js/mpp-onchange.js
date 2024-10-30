;(function (window, document, $) {
  'use strict';
  var app = {};
  var PE;//Popup Editor
  var MPP;//Admin Master Popups
  var xbox;//Xbox Framework
  var ElementContent;

  //Document Ready
  $(function () {
    xbox = window.XBOX;
    MPP = window.AdminMasterPopup;
    PE = window.MppPopupEditor;
    ElementContent = window.MppElementContent;
    app.init();
  });

  app.init = function () {
    var $xbox = $('.xbox');
    PE.$post_body = $('body.post-type-master-popups #post-body');
    app.$popup = PE.$canvas.find('.ampp-popup');
    app.$wrap_powerful_editor = PE.$post_body.find('#ampp-wrap-powerful-editor');
    app.$tab_device_editor = PE.$post_body.find('.tab-device-editor');
    app.$wrap_wp_editor = PE.$post_body.find('#ampp-wrap-wp-editor');

    app.on_change_tab_device_editor();
    app.on_change_button_styles();
    app.on_change_fields_popup();
    app.on_change_fields_popup_animations();
    app.on_change_fields_overlay();

    app.on_change_fields_type_video();
    app.on_change_fields_content();
    app.on_change_fields_countdown();
    app.on_change_fields_size_position();
    app.on_change_fields_font();
    app.on_change_fields_background();
    app.on_change_fields_border();
    app.on_change_fields_element_animations();
    app.on_change_fields_advanced();

    PE.$canvas.find('#mc-device').on('ampp_changed_device', app.on_change_device);
    PE.$post_body.on('click', '#mc-icon-devices > i', function (event) {
      event.preventDefault();
      $(this).addClass('ampp-active').siblings().removeClass('ampp-active');
      if ($(this).hasClass('xbox-icon-desktop')) {
        if (PE.$tab_device.hasClass('accordion')) {
          PE.$tab_device.find('>.xbox-tab-body > h3.tab-item-device-editor-desktop a').trigger('click');
        } else {
          PE.$tab_device.find('>.xbox-tab-header li.tab-item-device-editor-desktop a').trigger('click');
        }
        PE.$post_body.find('.desktop-browser-width').show();
        PE.$post_body.find('.mobile-browser-width').hide();
      } else {
        if (PE.$tab_device.hasClass('accordion')) {
          PE.$tab_device.find('>.xbox-tab-body > h3.tab-item-device-editor-mobile a').trigger('click');
        } else {
          PE.$tab_device.find('>.xbox-tab-header li.tab-item-device-editor-mobile a').trigger('click');
        }
        PE.$post_body.find('.desktop-browser-width').hide();
        PE.$post_body.find('.mobile-browser-width').show();
      }
    });

    //Open/close WP editor
    var use_wp_editor = PE.$post_body.find('input[name="mpp_use-wp-editor"]').val();
    app.show_hide_visual_editor(use_wp_editor);
  };

  app.show_hide_visual_editor = function(use_wp_editor){
    if (use_wp_editor == 'on') {
      app.$wrap_wp_editor.show();
      app.$wrap_powerful_editor.hide();
      app.$tab_device_editor.hide();
    } else {
      app.$wrap_wp_editor.hide();
      app.$wrap_powerful_editor.show();
      app.$tab_device_editor.show();
    }
  }

  app.on_change_tab_device_editor = function (event) {
    PE.$tab_device.on('click', '>.xbox-tab-header .xbox-tab-menu a, >.xbox-tab-body > .xbox-accordion-title a', function (event) {
      event.preventDefault();
      if ($(this).attr('href').indexOf('desktop') > -1) {
        PE.$canvas.find('.ampp-desktop-content').show();
        PE.$canvas.find('.ampp-mobile-content').hide();
        PE.$canvas.find('#mc-device').data('device', 'desktop').attr('data-device', 'desktop');
        PE.$canvas.find('#mc-device').trigger('ampp_changed_device', ['desktop']);
      } else {
        PE.$canvas.find('.ampp-mobile-content').show();
        PE.$canvas.find('.ampp-desktop-content').hide();
        PE.$canvas.find('#mc-device').data('device', 'mobile').attr('data-device', 'mobile');
        PE.$canvas.find('#mc-device').trigger('ampp_changed_device', ['mobile']);
      }
    });
  };

  app.on_change_device = function (event, device) {
    var $wrap = app.$popup.find('.ampp-wrap');
    var $input_width;
    var $input_height;
    var width;
    var height;
    if (device == 'desktop') {
      $input_width = $('.xbox-field-id-mpp_width .xbox-element');
      $input_height = $('.xbox-field-id-mpp_height .xbox-element');

      //Browser size
      PE.$canvas.find('#mc-device').css({
        'width': $('.xbox-field-id-mpp_browser-width .xbox-element').val() + 'px'
      });
    } else if (device == 'mobile') {
      $input_width = $('.xbox-field-id-mpp_mobile-width .xbox-element');
      $input_height = $('.xbox-field-id-mpp_mobile-height .xbox-element');

      //Browser size
      PE.$canvas.find('#mc-device').css({
        'width': $('.xbox-field-id-mpp_mobile-browser-width .xbox-element').val() + 'px'
      });
    }
    width = MPP.css.number($input_width.val(), MPP.get_unit($input_width));
    height = MPP.css.number($input_height.val(), MPP.get_unit($input_height));

    //Popup size
    PE.set_style_to_popup({
      $target: '',
      $element: 'popup',
      property: 'width',
      value: width,
      style_type: 'normal',
    });
    PE.set_style_to_popup({
      $target: '',
      $element: 'popup',
      property: 'height',
      value: height,
      style_type: 'normal',
    });
    app.$popup.trigger('ampp_size_changed');

    PE.show_hide_form_elements();

    PE.$canvas.alterClass('mc-device-*', 'mc-device-' + device);
  };

  app.on_change_button_styles = function (event) {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-button-icon .xbox-element', function (event, value) {
      var $group_item = $(this).closest('.xbox-group-item');
      var $field = $group_item.find('.xbox-field-id-mpp_e-content-textarea');
      var $textarea = $field.find('.xbox-element');
      var content = $textarea.val().replace(/<i(.*)>(.*)<\/i>/g, '');
      value = '<i class="' + value + '"></i> ' + $.trim(content);
      xbox.set_field_value($field, value);
    });

    PE.$post_body.on('click', '.xbox-row-id-mpp_e-button-styles .mpp-btn', function () {
      var $btn = $(this);
      var $group_item = $btn.closest('.xbox-group-item');
      var button_styles = [
        { property: 'color', field_name: 'e-font-color' },
        { property: 'text-shadow', field_name: 'e-text-shadow' },

        { property: 'background-color', field_name: 'e-bg-color' },

        { property: 'border-style', field_name: 'e-border-style' },
        { property: 'border-color', field_name: 'e-border-color' },
        { property: 'border-top-width', field_name: 'e-border-top-width' },
        { property: 'border-right-width', field_name: 'e-border-right-width' },
        { property: 'border-bottom-width', field_name: 'e-border-bottom-width' },
        { property: 'border-left-width', field_name: 'e-border-left-width' },
        { property: 'border-radius', field_name: 'e-border-radius' },

        { property: 'box-shadow', field_name: 'e-box-shadow' },
      ];
      $.each(button_styles, function (index, style) {
        var unit;
        var value = $btn.css(style.property);
        if (!isNaN(parseInt(value))) {
          value = MPP.number_object(value).value;
          unit = MPP.number_object(value).unit;
        }
        if (style.property == 'background-color') {
          value = $btn.data('bg-color');
        }
        xbox.set_field_value($group_item.find('.xbox-field-id-mpp_' + style.field_name), value, unit, true);
      });
    });
  };

  app.on_change_fields_popup = function () {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_position .xbox-element', function (event, value) {
      //PRO
      var positions = ['top-bar', 'bottom-bar', 'bottom-left', 'bottom-center', 'bottom-right'];
      if( positions.indexOf(value) !== -1 ){
        MPP.pro_version_message(event);
        return;
      } else {
        $(this).closest('.xbox-content').find('.ampp-close-message').trigger('click');
      }

      app.$popup.alterClass('ampp-position-*', 'ampp-position-' + value);
      app.$popup.trigger('ampp_position_changed');

      var entry_animation = 'mpp-zoomIn';
      var exit_animation = 'mpp-zoomOut';
      var sticky_icon = 'mpp-icon-chevron-up';
      var overlay = 'on';
      switch (value) {
        case 'top-left':
        case 'top-center':
        case 'top-right':
        case 'top-bar':
          entry_animation = 'mpp-slideInDown';
          exit_animation = 'mpp-slideOutUp';
          sticky_icon = 'mpp-icon-chevron-down';
          overlay = 'off';
          break;

        case 'middle-left':
          entry_animation = 'mpp-slideInLeft';
          exit_animation = 'mpp-slideOutLeft';
          sticky_icon = 'mpp-icon-chevron-right';
          overlay = 'off';
          break;

        case 'middle-right':
          entry_animation = 'mpp-slideInRight';
          exit_animation = 'mpp-slideOutRight';
          sticky_icon = 'mpp-icon-chevron-left';
          overlay = 'off';
          break;

        case 'bottom-left':
        case 'bottom-center':
        case 'bottom-right':
        case 'bottom-bar':
          entry_animation = 'mpp-slideInUp';
          exit_animation = 'mpp-slideOutDown';
          sticky_icon = 'mpp-icon-chevron-up';
          overlay = 'off';
          break;
      }
      xbox.set_field_value(PE.$post_body.find('.xbox-field-id-mpp_open-animation'), entry_animation);
      xbox.set_field_value(PE.$post_body.find('.xbox-field-id-mpp_close-animation'), exit_animation);
      xbox.set_field_value(PE.$post_body.find('.xbox-field-id-mpp_sticky-icon'), sticky_icon);
      xbox.set_field_value(PE.$post_body.find('.xbox-field-id-mpp_overlay-show'), overlay);
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_width .xbox-element', function (event, value) {
      if (PE.get_active_device() != 'desktop') {
        return;
      }
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'popup',
        property: 'width',
        value: value,
        style_type: 'normal',
      });
      app.$popup.trigger('ampp_size_changed');
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_height .xbox-element', function (event, value) {
      if (PE.get_active_device() != 'desktop') {
        return;
      }
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'popup',
        property: 'height',
        value: value,
        style_type: 'normal',
      });
      app.$popup.trigger('ampp_size_changed');
    });

    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_full-screen .xbox-element', function (event, value) {
      //PRO
      if (value == 'on') {
        MPP.pro_version_message(event);
      } else {
      }
    });

    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_bg-color .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'content',
        property: 'background-color',
        value: value,
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_bg-repeat .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'wrap',
        property: 'background-repeat',
        value: value,
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_bg-size .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'wrap',
        property: 'background-size',
        value: value,
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_bg-position .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'wrap',
        property: 'background-position',
        value: value,
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_bg-image .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'wrap',
        property: 'background-image',
        value: 'url(' + value + ')',
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_enable-mobile-design .xbox-element', function (event, value) {
      if (value == 'on') {
        MPP.pro_version_message(event);
        PE.$post_body.find('#mc-icon-devices > i.xbox-icon-mobile').trigger('click');
      } else {
        PE.$post_body.find('#mc-icon-devices > i.xbox-icon-desktop').trigger('click');
      }
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_border-radius .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'wrap',
        property: 'border-radius',
        value: value,
        style_type: 'normal',
      });
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'content',
        property: 'border-radius',
        value: value,
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_box-shadow .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'wrap',
        property: 'box-shadow',
        value: value,
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_overflow .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'content',
        property: 'overflow',
        value: value,
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_browser-width .xbox-element', function (event, value) {
      if (PE.get_active_device() != 'desktop') {
        return;
      }
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.$canvas.find('#mc-device').css({
        'width': value
      });
    });

    //Custom Desing for Mobile
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_mobile-browser-width .xbox-element', function (event, value) {
      if (PE.get_active_device() != 'mobile') {
        return;
      }
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.$canvas.find('#mc-device').css({
        'width': value
      });
    });

    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_mobile-width .xbox-element', function (event, value) {
      if (PE.get_active_device() != 'mobile') {
        return;
      }
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'popup',
        property: 'width',
        value: value,
        style_type: 'normal',
      });
      app.$popup.trigger('ampp_size_changed');
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_mobile-height .xbox-element', function (event, value) {
      if (PE.get_active_device() != 'mobile') {
        return;
      }
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'popup',
        property: 'height',
        value: value,
        style_type: 'normal',
      });
      app.$popup.trigger('ampp_size_changed');
    });


    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_use-wp-editor .xbox-element', function (event, value) {
      app.show_hide_visual_editor(value);
    });


    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_trigger-open-on-exit .xbox-element', function (event, value) {
      xbox.set_field_value(PE.$post_body.find('.xbox-field-id-mpp_preloader-show'), value == 'on' ? 'off' : 'on');
      xbox.set_field_value(PE.$post_body.find('.xbox-field-id-mpp_open-duration'), value == 'on' ? '200' : '800');
      xbox.set_field_value(PE.$post_body.find('.xbox-field-id-mpp_close-duration'), value == 'on' ? '300' : '700');
    });

  };

  app.on_change_fields_popup_animations = function () {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_open-animation .xbox-element', function (event, value) {
      app.$popup.find('.ampp-wrap').animateCSS_MasterPopup(value, {
        delay: 0,
        duration: parseInt($('.xbox-field-id-mpp_open-duration .xbox-element').val()),
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_close-animation .xbox-element', function (event, value) {
      app.$popup.find('.ampp-wrap').animateCSS_MasterPopup(value, {
        delay: 0,
        duration: parseInt($('.xbox-field-id-mpp_close-duration .xbox-element').val()),
      });
    });
  };

  app.on_change_fields_overlay = function () {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_overlay-bg-color .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'overlay',
        property: 'background-color',
        value: value,
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_overlay-bg-repeat .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'overlay',
        property: 'background-repeat',
        value: value,
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_overlay-bg-size .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'overlay',
        property: 'background-size',
        value: value,
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_overlay-bg-position .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'overlay',
        property: 'background-position',
        value: value,
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_overlay-bg-image .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'overlay',
        property: 'background-image',
        value: 'url(' + value + ')',
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_overlay-opacity .xbox-element', function (event, value) {
      PE.set_style_to_popup({
        $target: $(this),
        $element: 'overlay',
        property: 'opacity',
        value: value,
        style_type: 'normal',
      });
    });
  };

  app.on_change_fields_content = function () {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-content-close-icon .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_type_object(value),
        style_type: 'normal',
      });
    });

    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-content-object .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_type_object(value),
        style_type: 'normal',
      });
    });

    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-content-textarea .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: value,
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-content-shortcode .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: value,
        style_type: 'normal',
      });
    });

    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-content-image .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_type_image(value),
        style_type: 'normal',
      });
    });

    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-content-url .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_type_iframe(value),
        style_type: 'normal',
      });
    });

    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-field-placeholder .xbox-element', function (event, value) {
      var values = ElementContent.get_values_form_fields($(this));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_form_fields(values, $(this).closest('.xbox-group-item').data('type')),
        style_type: 'normal',
      });
    });
  };

  app.on_change_fields_type_video = function () {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-video-type .xbox-element', function (event, value) {
      var values = ElementContent.get_values_type_video($(this));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_type_video(values),
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-content-video .xbox-element', function (event, value) {
      var values = ElementContent.get_values_type_video($(this));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_type_video(values),
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-content-video-html5 .xbox-element', function (event, value) {
      var values = ElementContent.get_values_type_video($(this));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_type_video(values),
        style_type: 'normal',
      });
    });
    PE.$post_body.on('click', '.xbox-field-id-mpp_e-video-load-thumbnail .xbox-element', function (event, value) {
      var $target = $(this);
      var values = ElementContent.get_values_type_video($target);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: XBOX_JS.ajax_url,
        data: {
          action: 'mpp_get_video_thumbnail',
          values: values,
          ajax_nonce: XBOX_JS.ajax_nonce
        },
        beforeSend: function () {
          $target.closest('.xbox-field').append("<i class='mpp-icon mpp-icon-spinner mpp-icon-spin ampp-loader'></i>");
        },
        success: function (response) {
          if (response) {
            var $field = $target.closest('.xbox-group-item').find('.xbox-field-id-mpp_e-video-poster');
            xbox.set_field_value($field, response.thumbnail);
            values = ElementContent.get_values_type_video($target);
            PE.set_style_to_element({
              $target: $target,
              $element: 'el_content',
              property: 'content',
              value: ElementContent.get_content_type_video(values),
              style_type: 'normal',
            });
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },
        complete: function (jqXHR, textStatus) {
          $target.closest('.xbox-field').find('.ampp-loader').remove();
        }
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-video-poster .xbox-element', function (event, value) {
      var values = ElementContent.get_values_type_video($(this));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_type_video(values),
        style_type: 'normal',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-play-icon .xbox-element', function (event, value) {
      var values = ElementContent.get_values_type_video($(this));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_type_video(values),
        style_type: 'normal',
      });
    });


  };

  app.on_change_fields_countdown = function () {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-content-date .xbox-element', function (event, value) {
      var values = ElementContent.get_values_countdown($(this));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_type_countdown(values),
        style_type: 'hover',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-content-time .xbox-element', function (event, value) {
      var values = ElementContent.get_values_countdown($(this));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_type_countdown(values),
        style_type: 'hover',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-countdown-labels .xbox-element', function (event, value) {
      var values = ElementContent.get_values_countdown($(this));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'content',
        value: ElementContent.get_content_type_countdown(values),
        style_type: 'hover',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-countdown-label-font-size .xbox-element', function (event, value) {
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.set_style_to_countdown({
        $target: $(this),
        selector: '.mpp-countdown',
        property: 'font-size',
        value: value,
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-countdown-label-font-color .xbox-element', function (event, value) {
      PE.set_style_to_countdown({
        $target: $(this),
        selector: '.mpp-countdown',
        property: 'color',
        value: value,
      });
    });

    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-countdown-width .xbox-element', function (event, value) {
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.set_style_to_countdown({
        $target: $(this),
        selector: '.mpp-count-digit',
        property: 'width',
        value: value,
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-countdown-height .xbox-element', function (event, value) {
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.set_style_to_countdown({
        $target: $(this),
        selector: '.mpp-count-digit',
        property: 'height',
        value: value,
      });
      PE.set_style_to_countdown({
        $target: $(this),
        selector: '.mpp-countdown .mpp-count.mpp-top',
        property: 'line-height',
        value: value,
      });
    });
  }

  app.on_change_fields_size_position = function () {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-size-width .xbox-element', function (event, value) {
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'element',
        property: 'width',
        value: value,
        style_type: 'normal',
        name: 'e-size-width',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-size-height .xbox-element', function (event, value) {
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'element',
        property: 'height',
        value: value,
        style_type: 'normal',
        name: 'e-size-height',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-position-top .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'element',
        property: 'top',
        value: value + 'px',
        style_type: 'normal',
        name: 'e-position-top',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-position-left .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'element',
        property: 'left',
        value: value + 'px',
        style_type: 'normal',
        name: 'e-position-left',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-padding-top .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'padding-top',
        value: value + 'px',
        style_type: 'normal',
        name: 'e-padding-top',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-padding-right .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'padding-right',
        value: value + 'px',
        style_type: 'normal',
        name: 'e-padding-right',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-padding-bottom .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'padding-bottom',
        value: value + 'px',
        style_type: 'normal',
        name: 'e-padding-bottom',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-padding-left .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'padding-left',
        value: value + 'px',
        style_type: 'normal',
        name: 'e-padding-left',
      });
    });
  };

  app.on_change_fields_font = function () {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-font-family .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'font-family',
        value: value,
        style_type: 'normal',
        name: 'e-font-family',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-font-size .xbox-element', function (event, value) {
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'font-size',
        value: value,
        style_type: 'normal',
        name: 'e-font-size',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-font-weight .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'font-weight',
        value: value,
        style_type: 'normal',
        name: 'e-font-weight',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-font-style .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'font-style',
        value: value,
        style_type: 'normal',
        name: 'e-font-style',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-font-color .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'color',
        value: value,
        style_type: 'normal',
        name: 'e-font-color',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-text-align .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'text-align',
        value: value,
        style_type: 'normal',
        name: 'e-text-align',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-line-height .xbox-element', function (event, value) {
      value = MPP.css.number(value, MPP.get_unit($(this)));
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'line-height',
        value: value,
        style_type: 'normal',
        name: 'e-line-height',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-white-space .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'white-space',
        value: value,
        style_type: 'normal',
        name: 'e-white-space',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-text-transform .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'text-transform',
        value: value,
        style_type: 'normal',
        name: 'e-text-transform',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-text-decoration .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'text-decoration',
        value: value,
        style_type: 'normal',
        name: 'e-text-decoration',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-letter-spacing .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'letter-spacing',
        value: value,
        style_type: 'normal',
        name: 'e-letter-spacing',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-text-shadow .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'text-shadow',
        value: value,
        style_type: 'normal',
        name: 'e-text-shadow',
      });
    });


    //Hover
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-hover-font-enable .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: undefined,
        value: value,
        style_type: 'hover',
        name: 'e-hover-font-enable',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-hover-font-color .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'color',
        value: value,
        style_type: 'hover',
        name: 'e-hover-font-color',
      });
    });
  };

  app.on_change_fields_background = function () {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-bg-color .xbox-element', function (event, value) {
      var property = 'background-color';
      var bg = ElementContent.get_background_values($(this));
      if (bg.enable_gradient == 'on') {
        property = 'background';
        value = 'linear-gradient(' + bg.angle_gradient + 'deg, ' + bg.color + ', ' + bg.color_gradient + ')';
      }
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: property,
        value: value,
        style_type: 'normal',
        name: 'e-bg-color',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-bg-repeat .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'background-repeat',
        value: value,
        style_type: 'normal',
        name: 'e-bg-repeat',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-bg-size .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'background-size',
        value: value,
        style_type: 'normal',
        name: 'e-bg-size',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-bg-position .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'background-position',
        value: value,
        style_type: 'normal',
        name: 'e-bg-position',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-bg-image .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'background-image',
        value: 'url("' + value + '")',
        style_type: 'normal',
        name: 'e-bg-image',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-bg-enable-gradient .xbox-element', function (event, value) {
      var bg = ElementContent.get_background_values($(this));
      if (value == 'on') {
        value = 'linear-gradient(' + bg.angle_gradient + 'deg, ' + bg.color + ', ' + bg.color_gradient + ')';
      } else {
        value = 'url(' + bg.image + ') ' + bg.position + ' ' + bg.repeat + ' ' + bg.color + ' / ' + bg.size;
      }
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'background',
        value: value,
        style_type: 'normal',
        name: 'e-bg-enable-gradient',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-bg-color-gradient .xbox-element', function (event, value) {
      var bg = ElementContent.get_background_values($(this));
      value = 'linear-gradient(' + bg.angle_gradient + 'deg, ' + bg.color + ', ' + bg.color_gradient + ')';
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'background',
        value: value,
        style_type: 'normal',
        name: 'e-bg-color-gradient',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-bg-angle-gradient .xbox-element', function (event, value) {
      var bg = ElementContent.get_background_values($(this));
      value = 'linear-gradient(' + bg.angle_gradient + 'deg, ' + bg.color + ', ' + bg.color_gradient + ')';
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'background',
        value: value,
        style_type: 'normal',
        name: 'e-bg-angle-gradient',
      });
    });

    //Hover
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-hover-bg-enable .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: undefined,
        value: value,
        style_type: 'hover',
        name: 'e-hover-bg-enable',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-hover-bg-color .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'background',
        value: value,
        style_type: 'hover',
        name: 'e-hover-bg-color',
      });
    });
  };

  app.on_change_fields_border = function () {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-border-color .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'border-color',
        value: value,
        style_type: 'normal',
        name: 'e-border-color',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-border-style .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'border-style',
        value: value,
        style_type: 'normal',
        name: 'e-border-style',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-border-top-width .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'border-top-width',
        value: value + 'px',
        style_type: 'normal',
        name: 'e-border-top-width',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-border-right-width .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'border-right-width',
        value: value + 'px',
        style_type: 'normal',
        name: 'e-border-right-width',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-border-bottom-width .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'border-bottom-width',
        value: value + 'px',
        style_type: 'normal',
        name: 'e-border-bottom-width',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-border-left-width .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'border-left-width',
        value: value + 'px',
        style_type: 'normal',
        name: 'e-border-left-width',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-border-radius .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'border-radius',
        value: value + 'px',
        style_type: 'normal',
        name: 'e-border-radius',
      });
    });

    //Hover
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-hover-border-enable .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: undefined,
        value: value,
        style_type: 'hover',
        name: 'e-hover-border-enable',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-hover-border-color .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'border-color',
        value: value,
        style_type: 'hover',
        name: 'e-hover-border-color',
      });
    });
  };

  app.on_change_fields_element_animations = function () {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-open-animation .xbox-element', function (event, value) {
      var $group_item = $(this).closest('.xbox-group-item');
      var $element = PE.get_element(PE.get_active_device(), $group_item.data('index'));
      $element.animateCSS_MasterPopup(value, {
        delay: 0,
        duration: parseInt($group_item.find('.xbox-field-id-mpp_e-open-duration .xbox-element').val()),
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-close-animation .xbox-element', function (event, value) {
      var $group_item = $(this).closest('.xbox-group-item');
      var $element = PE.get_element(PE.get_active_device(), $group_item.data('index'));
      $element.animateCSS_MasterPopup(value, {
        delay: 0,
        duration: parseInt($group_item.find('.xbox-field-id-mpp_e-close-duration .xbox-element').val()),
      });
    });
  };

  app.on_change_fields_advanced = function () {
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-opacity .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'opacity',
        value: value,
        style_type: 'normal',
        name: 'e-opacity',
      });
    });
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-box-shadow .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'box-shadow',
        value: value,
        style_type: 'normal',
        name: 'e-box-shadow',
      });
    });
    //Not set overflow in admin. => why????
    PE.$post_body.on('xbox_changed_value', '.xbox-field-id-mpp_e-overflow .xbox-element', function (event, value) {
      PE.set_style_to_element({
        $target: $(this),
        $element: 'el_content',
        property: 'overflow',
        value: value,
        style_type: 'normal',
      });
    });
  };

  //Debug
  function c(msg) {
    console.log(msg);
  }

  function cc(msg, msg2) {
    console.log(msg + ': ');
    console.log(msg2);
  }

  function clog(msg) {
    console.log(msg);
  }


  return app;

})(window, document, jQuery);