window.MppPopupEditor = (function (window, document, $) {
  //Document Ready
  var app = {
    debug: false,
    prefix: 'mpp_',
    style_to_paste: [],
    DELAY_ON_ADD_ELEMENT: 1500,
  };
  var MPP;//Admin Master Popups
  var xbox;//Xbox Framework
  var ElementContent;

  $(function () {
    xbox = window.XBOX;
    MPP = window.AdminMasterPopup;
    ElementContent = window.MppElementContent;
    app.init();
  });

  app.init = function () {
    app.$form = $('body.post-type-master-popups form[name="post"]');
    app.$post_body = $('body.post-type-master-popups #post-body');

    //Save post
    app.$post_body.on('click', '#save-popup:not(.ampp-disabled)', app.submit_save_post);

    app.$tab_device = app.$post_body.find('.tab-device-editor');
    app.$dk_els_row = app.$post_body.find('.xbox-row.xbox-row-id-mpp_desktop-elements');
    app.$mb_els_row = app.$post_body.find('.xbox-row.xbox-row-id-mpp_mobile-elements');
    app.$dk_els_list = app.$dk_els_row.find('.xbox-group-control').first();
    app.$mb_els_list = app.$mb_els_row.find('.xbox-group-control').first();
    app.$dk_els_group = app.$dk_els_row.find('.xbox-group-wrap').first();
    app.$mb_els_group = app.$mb_els_row.find('.xbox-group-wrap').first();
    app.$canvas_wrap = app.$post_body.find('#mc-wrap');
    app.$canvas = app.$post_body.find('#mc');
    app.$canvas_dk_content = app.$canvas.find('.ampp-desktop-content');
    app.$canvas_mb_content = app.$canvas.find('.ampp-mobile-content');

    app.add_type_icon_to_elements(app.$dk_els_list);
    app.add_type_icon_to_elements(app.$mb_els_list);

    app.add_visibility_icon_to_elements(app.$dk_els_list);
    app.add_visibility_icon_to_elements(app.$mb_els_list);

    app.$dk_els_group.on('click', '> .xbox-group-item', app.on_click_group_item);
    app.$mb_els_group.on('click', '> .xbox-group-item', app.on_click_group_item);
    //app.$dk_els_group.find('> .xbox-group-item:eq(0)').trigger('click');

    app.$dk_els_row.on('xbox_after_add_group_item', app.after_add_group_item);
    app.$mb_els_row.on('xbox_after_add_group_item', app.after_add_group_item);
    app.$dk_els_row.on('xbox_on_active_group_item', app.on_active_group_item);
    app.$mb_els_row.on('xbox_on_active_group_item', app.on_active_group_item);
    app.$dk_els_row.on('xbox_after_remove_group_item', app.after_remove_group_item);
    app.$mb_els_row.on('xbox_after_remove_group_item', app.after_remove_group_item);
    app.$dk_els_group.on('xbox_on_sortable_group_item', app.xbox_on_sortable_group_item);

    app.$tab_device.on('click', '.xbox-visibility-group-item', app.toggle_element_visibility);
    app.$canvas.on('mousedown touchstart', '.mc-element', app.on_active_max_element);

    app.$canvas.on('drag', '.mc-element', app.on_drag_draggable_element);
    app.$canvas.on('dragstop', '.mc-element', app.on_stop_draggable_element);
    app.$canvas.on('resize', '.mc-element', app.on_resize_resizable_element);
    app.$canvas.on('resizestop', '.mc-element', app.on_stop_resizable_element);
    app.$canvas.on('keydown', '.mc-element', app.on_keydown_element);

    app.$canvas.on('mouseenter', '.mc-element', app.on_mouseenter_element);
    app.$canvas.on('mouseleave', '.mc-element', app.on_mouseleave_element);
    app.$canvas.on('dblclick', '.mc-element', app.on_dblclick_element);

    //Inicializamos lienzo de edición
    app.$canvas_wrap.maxCanvasEditor({
      app: app,
      xbox: xbox,
    });

    app.$post_body.on('click', '.ampp-open-icon-library', app.open_icon_library);
    app.$post_body.on('click', '.ampp-open-object-library', app.open_object_library);

    app.show_hide_form_elements();

    //Copy Desktop Design
    $('#row-mc-options .mobile-browser-width').append('<span class="mc-copy-desktop-design" title="Copy Desktop Design"><i class="xbox-icon xbox-icon-eyedropper"></i><i class="xbox-icon xbox-icon-desktop"></i></span>');
    app.$post_body.on('click', '.mc-copy-desktop-design', app.maybe_copy_desktop_elements);
  };

  app.submit_save_post = function (event) {
    event.preventDefault();

    var form_valid = true;
    var check_form = false;
    if (typeof app.$form[0].checkValidity === 'function') {
      check_form = true;
    }
    if (check_form) {
      form_valid = app.$form[0].checkValidity();
    }
    if (check_form && !form_valid) {
      var message = app.$form.getValidationMessages('input[type="date"], input[type="time"]');
      alert(message);
      return;
    }

    var $btn = $(this);
    $btn.addClass('ampp-disabled').find('i').remove();
    $btn.append("<i class='mpp-icon mpp-icon-spinner mpp-icon-spin ampp-loader'></i>");

    $.xboxConfirm({
      title: MPP_ADMIN_JS.text.saving_changes,
      content: MPP_ADMIN_JS.text.please_wait,
      hide_confirm: true,
      hide_cancel: true,
      hide_close: true,
      wrap_class: 'ampp-transparent-confirm',
    });

    var save_interval = setInterval(function () {
      if (!$('#publish').hasClass('disabled')) {
        clearInterval(save_interval);
        //Remove source fields
        app.$post_body.find('.xbox-source-item').remove();

        //Eliminar el input hidden anterior
        app.$dk_els_row.find('input[name="mpp_desktop-elements"]').remove();

        //Serializamos datos para evitar "Warning: Unknown: Input variables exceeded 1000":max_input_vars
        var data_desktop = app.$dk_els_row.find('input[name],select[name],textarea[name]').serialize();

        app.$dk_els_row.find('.xbox-row').css('visibility', 'hidden');
        app.$dk_els_row.find('input[name],select[name],textarea[name]').remove();
        app.$dk_els_row.append('<input type="hidden" name="mpp_desktop-elements"/>');
        app.$dk_els_row.find('input[name="mpp_desktop-elements"]').val(data_desktop);

        app.$mb_els_row.find('.xbox-row').css('visibility', 'hidden');
        app.$mb_els_row.find('input[name],select[name],textarea[name]').remove();
        app.$mb_els_row.append('<input type="hidden" name="mpp_mobile-elements"/>');
        app.$mb_els_row.find('input[name="mpp_mobile-elements"]').val('');

        //Save post
        $('#publish').click();
      }
    }, 300);
  };

  app.open_icon_library = function (event) {
    event.preventDefault();
    var $group_item = $(this).closest('.xbox-group-item');
    var $field = $group_item.find('.xbox-field-id-mpp_e-content-textarea');
    var $textarea = $field.find('.xbox-element');

    var data = {
      ajax_nonce: XBOX_JS.ajax_nonce,
      action: 'mpp_get_icons_library',
      icon_font: true,
      svg: false,
      index: $group_item.data('index'),
    };
    $.xboxConfirm({
      title: MPP_ADMIN_JS.text.object_library,
      content: {
        data: data,
        dataType: 'html',
        url: XBOX_JS.ajax_url,
        onSuccess: function (response) {
        }
      },
      hide_confirm: true,
      hide_cancel: true,
      wrap_class: 'ampp-object-library',
    });

    $(document).off('click', '.ampp-object-library .xbox-icons-wrap .xbox-item-icon-selector');
    $(document).on('click', '.ampp-object-library .xbox-icons-wrap .xbox-item-icon-selector', function (event) {
      $textarea.insertTextInCursor('<i class="' + $(this).data('value') + '"></i>');
      xbox.set_field_value($field, $textarea.val());
      $(this).closest('.ampp-object-library').find('.xbox-confirm-close-btn').trigger('click');
    });
    return false;
  };

  app.open_object_library = function (event) {
    event.preventDefault();
    var $group_item = $(this).closest('.xbox-group-item');
    var $field = $group_item.find('.xbox-field-id-mpp_e-content-object');

    var data = {
      ajax_nonce: XBOX_JS.ajax_nonce,
      action: 'mpp_get_icons_library',
      icon_font: true,
      svg: true,
      index: $group_item.data('index'),
    };

    $.xboxConfirm({
      title: MPP_ADMIN_JS.text.object_library,
      content: {
        data: data,
        dataType: 'html',
        url: XBOX_JS.ajax_url,
        onSuccess: function (response) {
        }
      },
      hide_confirm: true,
      hide_cancel: true,
      wrap_class: 'ampp-object-library',
    });

    $(document).off('click', '.ampp-object-library .xbox-icons-wrap .xbox-item-icon-selector');
    $(document).on('click', '.ampp-object-library .xbox-icons-wrap .xbox-item-icon-selector', function (event) {
      xbox.set_field_value($field, $(this).data('value'));
      $(this).closest('.ampp-object-library').find('.xbox-confirm-close-btn').trigger('click');
    });
    return false;
  };

  app.after_add_group_item = function (event, args) {
    if (!args.duplicate) {
      setTimeout(function(){
        app.set_field_values(MPP_TYPES[args.type].field_values, args.index);
      }, 400);

      //Si el tipo de elemento es 'object' abrimos popup
      if (args.type == 'object') {
        args.$group_item.find('.xbox-row-id-mpp_e-content-object .ampp-open-object-library').trigger('click');
      } else if (args.type == 'custom_field_input_checkbox_gdpr') {
        setTimeout(function () {
          var $last_group_item = app.get_last_group_item(app.get_active_device());
          app.add_gdpr_values($last_group_item);
        }, app.DELAY_ON_ADD_ELEMENT);
      }
    }
    app.add_type_icon_to_element(args);
    app.add_element_to_canvas(args);
    app.show_hide_form_elements();

    if (args.duplicate) {
      setTimeout(function () {
        args.$group_item.trigger('click');
      }, 150);
    }
  };

  app.add_gdpr_values = function ($group_item) {
    if ($group_item.data('type') != 'text-html') {
      return;
    }
    var index = $group_item.data('index');
    var data = xbox.get_group_object_values($group_item);
    var group_values = app.get_group_values(data, app.get_active_device(), index);
    var field_values = [
      { name: 'e-content-textarea', value: 'Read and accept the Terms and Conditions' },
      { name: 'e-position-left', value: parseInt(group_values['e-position-left']) + 30 },
      { name: 'e-onclick-action', value: 'redirect-to-url' },
      { name: 'e-onclick-url', value: 'http://google.com' },
      { name: 'e-onclick-target', value: '_blank' },
      { name: 'e-cursor', value: 'pointer' },
    ];
    app.set_field_values(field_values, index);
  };

  app.show_hide_form_elements = function () {
    var $group_control = app.get_group_control(app.get_active_device());
    $.each(app.unique_form_elements(), function (index, type) {
      var $btn = app.$canvas.find('#mc-types .xbox-add-group-item[data-item-type="' + type + '"]');
      if ($group_control.children('.xbox-group-control-item[data-type="' + type + '"]').length) {
        $btn.hide();
      } else {
        $btn.show();
      }
    });
  };

  app.on_active_max_element = function (event) {
    event.preventDefault();
    event.stopPropagation();
    var $control_item = app.get_control_item($(this).data('device'), $(this).data('index'));
    xbox.active_control_item($control_item);
  };

  app.on_click_group_item = function (event) {
    var device = app.get_active_device($(this));
    var $element = app.get_element(device, $(this).data('index'));
    $element.addClass('mc-selected').siblings().removeClass('mc-selected');
    app.$canvas.removeClass('mc-not-selected');
  };

  app.on_active_group_item = function (event, args) {
    var device = app.get_active_device(args.$control_item);
    var $element = app.get_element(device, args.index);
    $element.addClass('mc-selected').siblings().removeClass('mc-selected');
    app.$canvas.removeClass('mc-not-selected');
  };

  app.after_remove_group_item = function (event, index) {
    var device = app.get_active_device($(this));
    var $container = app.get_device_container(device);
    if ($container.children('.ampp-element').length == 1) {
      $container.children('.ampp-element').attr('data-index', -1).data('index', '-1');
    } else {
      app.get_element(device, index).remove();
      app.sort_elements($container);
    }
    app.show_hide_form_elements();
  };

  app.add_type_icon_to_element = function (args) {
    var icon_class = args.$btn.find('i').attr('class');
    if (args.duplicate) {
      icon_class = args.$btn.closest('.xbox-actions').find('.xbox-sort-group-item i').attr('class');
    }
    args.$control_item.find('.xbox-sort-group-item i').attr('class', icon_class);
  };

  app.set_field_values = function (field_values, index, $target) {
    var $group_item = app.get_group_item(app.get_active_device($target), index);
    $.each(field_values, function (index, field) {
      var $field = $group_item.find('.xbox-field-id-mpp_' + field.name);
      xbox.set_field_value($field, field.value, field.unit);
    });
  };

  app.add_element_to_canvas = function (args) {
    var device = app.get_active_device(args.$btn);
    var $container = app.get_device_container(device);
    var $source_item = $container.find('.ampp-element').last();
    if (args.duplicate) {
      $source_item = $container.find('.ampp-element').eq(args.index - 1);
    }
    var $new_element = $source_item.clone();
    $new_element = app.cook_element($new_element, args, device);

    if ($source_item.data('index') > -1) {
      $source_item.after($new_element);
    } else {
      $source_item.remove();
      $container.append($new_element);
    }
    //Ordenar
    app.sort_elements($container);

    if (args.duplicate) {
      //Nueva posición al duplicar
      var data = xbox.get_group_object_values(args.$group_item);
      var group_values = app.get_group_values(data, device, args.index);
      var field_values = [
        { name: 'e-position-top', value: parseInt(group_values['e-position-top']) },
        { name: 'e-position-left', value: parseInt(group_values['e-position-left']) }
      ];
      app.set_field_values(field_values, args.index);
    }
  };

  //Preparamos el elemento con sus estilos antes de ser agregado al lienzo
  app.cook_element = function ($element, args, device) {
    $element.find('.ui-resizable-handle').remove();
    $element.removeClass('ui-resizable ui-draggable ui-draggable-handle');
    $element.attr('data-type', args.type);
    $element.attr('data-index', args.index);
    $element.alterClass('mpp-element-*', 'mpp-element-' + args.type);
    $element.alterClass('ampp-element-*', 'ampp-element-' + args.index);

    //Estilos
    var data = xbox.get_group_object_values(args.$group_item);
    var group_values = app.get_group_values(data, device, args.index);
    if( ! args.duplicate ){
      group_values = app.merge_group_values(group_values, MPP_TYPES[args.type].field_values);
    }

    var $field = args.$group_item.find('.xbox-field').first();

    //Element
    var styles = {
      'z-index': args.index + 1,
      'width': MPP.css.number(group_values['e-size-width'], group_values['e-size-width_unit']),
      'height': MPP.css.number(group_values['e-size-height'], group_values['e-size-height_unit']),
      'top': MPP.css.number(group_values['e-position-top'], 'px'),
      'left': MPP.css.number(group_values['e-position-left'], 'px'),

      //Advanced
      'overflow': group_values['e-overflow'],
    };
    if (args.duplicate) {
      var top = parseInt(group_values['e-position-top']) + 20;
      var left = parseInt(group_values['e-position-left']) + 20;
      styles.top = MPP.css.number(top, 'px');
      styles.left = MPP.css.number(left, 'px');
    }

    $.each(styles, function (property, value) {
      app.set_style_to_element({
        event: args.event,
        $target: $field,
        $element: $element,
        property: property,
        value: value,
        style_type: 'normal',
      });
    });

    //Element content
    styles = {
      //Content
      'content': ElementContent.get_content($element, group_values, args),

      //Size & Position
      'padding-top': MPP.css.number(group_values['e-padding-top'], 'px'),
      'padding-right': MPP.css.number(group_values['e-padding-right'], 'px'),
      'padding-bottom': MPP.css.number(group_values['e-padding-bottom'], 'px'),
      'padding-left': MPP.css.number(group_values['e-padding-left'], 'px'),

      //Font
      'font-family': group_values['e-font-family'],
      'font-size': MPP.css.number(group_values['e-font-size'], group_values['e-font-size_unit']),
      'color': group_values['e-font-color'],
      'font-weight': group_values['e-font-weight'],
      'font-style': group_values['e-font-style'],
      'text-align': group_values['e-text-align'],
      'line-height': MPP.css.number(group_values['e-line-height'], group_values['e-line-height_unit']),
      'white-space': group_values['e-white-space'],
      'text-transform': group_values['e-text-transform'],
      'text-decoration': group_values['e-text-decoration'],
      'letter-spacing': group_values['e-letter-spacing'],
      'text-shadow': group_values['e-text-shadow'],

      //Background
      'background': '',
      'background-color': group_values['e-bg-color'],
      'background-repeat': group_values['e-bg-repeat'],
      'background-size': group_values['e-bg-size'],
      'background-position': group_values['e-bg-position'],
      'background-image': 'url(' + group_values['e-bg-image'] + ')',

      //Border
      'border-color': group_values['e-border-color'],
      'border-style': group_values['e-border-style'],
      'border-top-width': MPP.css.number(group_values['e-border-top-width'], 'px'),
      'border-right-width': MPP.css.number(group_values['e-border-right-width'], 'px'),
      'border-bottom-width': MPP.css.number(group_values['e-border-bottom-width'], 'px'),
      'border-left-width': MPP.css.number(group_values['e-border-left-width'], 'px'),
      'border-radius': MPP.css.number(group_values['e-border-radius'], 'px'),

      //Advanced
      'opacity': MPP.css.number(group_values['e-opacity']),
      'box-shadow': group_values['e-box-shadow'],
    };
    $.each(styles, function (property, value) {
      app.set_style_to_element({
        event: args.event,
        $target: $field,
        $element: $element.find('.ampp-el-content'),
        property: property,
        value: value,
        style_type: 'normal',
      });
    });

    //Hover
    styles = {
      'color': group_values['e-hover-font-color'],
      'background-color': group_values['e-hover-bg-color'],
      'border-color': group_values['e-hover-border-color'],
    };
    $.each(styles, function (property, value) {
      app.set_style_to_element({
        event: args.event,
        $target: $field,
        $element: $element.find('.ampp-el-content'),
        property: property,
        value: value,
        style_type: 'hover',
      });
    });

    return $element;
  };

  app.xbox_on_sortable_group_item = function (event, old_index, new_index) {
    var $group_wrap = $(this);
    var device = app.get_active_device($group_wrap);
    var $container = app.get_device_container(device);
    var $element = app.get_element(device, old_index);
    var $element_reference = app.get_element(device, new_index);

    if (old_index < new_index) {
      $element.insertAfter($element_reference);
    } else {
      $element.insertBefore($element_reference);
    }
    app.sort_elements($container);
  };

  app.set_style_to_popup = function (object) {
    var $target = '';
    if (object.$element == 'popup') {
      $target = app.$canvas.find('.ampp-popup');
    } else if (object.$element == 'wrap') {
      $target = app.$canvas.find('.ampp-wrap');
    } else if (object.$element == 'content') {
      $target = app.$canvas.find('.ampp-content');
    } else if (object.$element == 'overlay') {
      $target = app.$canvas.find('.ampp-overlay');
    }
    if ($target.length) {
      var new_css = {};
      new_css[object.property] = object.value;
      $target.css(new_css);
    }
  };

  app.set_style_to_element = function (object) {
    var element = '';
    var $group_item = object.$target.closest('.xbox-group-item');
    object.type = $group_item.data('type');
    object.index = $group_item.data('index');
    object.device = app.get_active_device(object.$target);
    object.style_type = object.style_type || 'normal';

    if (typeof object.$element == 'object') {
      object.$el_content = object.$element;
      if (object.$element.hasClass('ampp-element')) {
        element = 'element';
        object.style = object.$element.find('.ampp-el-content').data('style');
      } else if (object.$element.hasClass('ampp-el-content')) {
        element = 'el_content';
        object.style = object.$el_content.data('style');
      }
    } else {
      element = object.$element;
      object.$container = app.get_device_container(object.device);
      object.$element = app.get_element(object.device, object.index);
      object.$el_content = object.$element.find('.ampp-el-content');
      object.style = object.$el_content.data('style');
    }
    if (!object.$element.length || !object.$el_content.length || MPP.is_empty(object.style)) {
      return;
    }

    if (object.property == 'content') {
      if (element == 'el_content') {
        object.$el_content.html(object.value);
        app.$canvas.trigger('mpp_element_content_updated', [
          object.$el_content.closest('.ampp-element'),
          object.value] );
      }
    } else {

      var new_css = {};
      new_css[object.property] = object.value;

      if (element == 'element' && object.style_type == 'normal') {
        object.$element.css(new_css);
        if (object.property == 'top' || object.property == 'left') {
          setTimeout(function () {
            app.$canvas_wrap.maxCanvasEditor('set_position_to_element_controls', object.$element);
          }, 5);
        }
      }

      if (element == 'el_content' && object.style_type == 'normal') {
        if (object.property == 'font-family') {
          app.add_link_rel_google_font(object.$el_content, object.value);
        }
        if( object.type === 'countdown' ){
          object.$el_content.attr('style', '');
          app.add_css_to_countdown(object.$target, new_css, object.style_type);
        } else {
          object.$el_content.css(new_css);
        }
      }

      //Update css
      if (element == 'el_content') {
        if (object.property == 'background') {
          //Eliminar propiedades para que app.on_mouseleave_element() funcione correctamente.
          delete object.style[object.style_type]['background-color'];
          delete object.style[object.style_type]['background-repeat'];
          delete object.style[object.style_type]['background-size'];
          delete object.style[object.style_type]['background-position'];
          delete object.style[object.style_type]['background-image'];
        }
        if (object.property !== undefined) {
          object.style[object.style_type][object.property] = object.value;
          object.$el_content.attr('data-style', JSON.stringify(object.style));
        }
      }

    }

    //Para la funcionalidad Ctrl + Z
    if (!MPP.is_empty(object.name)) {
      var changes = object.$element.data('changes');
      if (MPP.is_empty(changes)) {
        changes = [];
        changes.push({
          name: object.name, value: object.value
        });
      } else {
        var last = changes[changes.length - 1];
        if (last.name == object.name) {
          changes[changes.length - 1] = {
            name: object.name, value: object.value
          };
        } else {
          changes.push({
            name: object.name, value: object.value
          });
        }
      }
      object.$element.data('changes', changes);
    }
    return object;
  };

  app.add_css_to_countdown = function ($target, cssObj, style_type) {
  }

  app.set_style_to_countdown = function (object) {
  }

  app.get_group_values = function (data, device, group_index) {
    var full_values = {};
    $.each(data, function (index, field) {
      var name = field.name.replace('mpp_' + device + '-elements[' + group_index + ']', '');
      //checkbox [mpp_e-field-name][]
      if( name.indexOf('[]', name.length - 2) !== -1 ){//for checkboxs
        full_values[name] = full_values[name] ? full_values[name] + ','+field.value : field.value;
      } else {
        full_values[name] = field.value;
      }
    });
    var values = {};
    $.each(full_values, function (name, value) {
      name = name.replace('mpp_', '');
      name = name.slice(1, -1);//Remove "[" and "]"
      if (name.indexOf('][') === -1) {
        values[name] = value;
      } else {
        name = name.replace('][', '');
        values[name] = value.split(',');
      }
    });
    return values;
  };

  app.get_field_value = function (field_id, device, index) {
    var $group_item = app.get_group_item(device, index);
    var data = xbox.get_group_object_values($group_item);
    var group_values = app.get_group_values(data, device, index);
    if (group_values && group_values.hasOwnProperty(field_id)) {
      return group_values[field_id];
    }
    return '';
  };

  app.add_type_icon_to_elements = function ($els_list) {
    $els_list.find('.xbox-group-control-item').each(function (index, el) {
      var type = $(el).data('type');
      if( MPP_TYPES[type] ){
        $(el).find('.xbox-sort-group-item i').attr('class', MPP_TYPES[type].icon);
      }
    });
  };

  app.add_visibility_icon_to_elements = function ($els_list) {
    $els_list.find('.xbox-group-control-item').each(function (index, el) {
      var visibility = $(el).find('.xbox-input-group-item-visibility').val();
      if (visibility != 'visible') {
        $(el).find('.xbox-visibility-group-item i').attr('class', 'xbox-icon xbox-icon-eye-slash');
      }
    });
  };

  app.toggle_element_visibility = function (event) {
    event.stopPropagation();
    var index = $(this).closest('.xbox-group-control-item').data('index');
    var $input = $(this).closest('.xbox-group-control-item').find('.xbox-input-group-item-visibility');
    var $element = app.get_element(app.get_active_device(), index);
    var value = 'visible';

    if ($input.val() == 'visible') {
      $(this).find('i').attr('class', 'xbox-icon xbox-icon-eye-slash');
      value = 'hidden';
    } else {
      $(this).find('i').attr('class', 'xbox-icon xbox-icon-eye');
    }
    $input.val(value);
    app.set_style_to_element({
      event: event,
      $target: $(this),
      $element: $element,
      property: 'visibility',
      value: value,
      style_type: 'normal',
    });
  };

  app.on_drag_draggable_element = function (event, ui) {
    if (ui.helper.data('type') == 'text-html') {
      var $group_item = app.get_group_item(ui.helper.data('device'), ui.helper.data('index'));
      var $field = $group_item.find('.xbox-field-id-mpp_e-size-width');
      ui.helper.css('width', MPP.css.number($field.find('.xbox-element').val(), 'px'));
      $field = $group_item.find('.xbox-field-id-mpp_e-size-height');
      ui.helper.css('height', MPP.css.number($field.find('.xbox-element').val(), 'px'));
    }
    //Update position
    //Funcionalidad movida a app.on_stop_draggable_element();
  };

  app.on_stop_draggable_element = function (event, ui) {
    var $group_item = app.get_group_item(ui.helper.data('device'), ui.helper.data('index'));
    var $field = $group_item.find('.xbox-field-id-mpp_e-size-width');
    ui.helper.css('width', MPP.css.number($field.find('.xbox-element').val(), $field.find('input.xbox-unit-number').val()));
    $field = $group_item.find('.xbox-field-id-mpp_e-size-height');
    ui.helper.css('height', MPP.css.number($field.find('.xbox-element').val(), $field.find('input.xbox-unit-number').val()));

    //Update position
    var field_values = [
      { name: 'e-position-top', value: parseInt(ui.position.top) },
      { name: 'e-position-left', value: parseInt(ui.position.left) }
    ];
    app.set_field_values(field_values, ui.helper.data('index'));
  };

  app.on_resize_resizable_element = function (event, ui) {
    if ($(this).data('type') == 'image' || $(this).data('type') == 'object') {
      $(this).resizable("option", "aspectRatio", 1).data('uiResizable')._aspectRatio = 1;
    }
  };

  app.on_stop_resizable_element = function (event, ui) {
    var field_values;
    if (ui.element.data('type') == 'image' || ui.element.data('type') == 'object') {
      var $image = ui.element.find('.ampp-el-content > img');
      if ($image.length) {
        var height = ui.size.height;
        setTimeout(function () {
          var image_height = parseInt($image.outerHeight());
          height = image_height;
          field_values = [
            { name: 'e-size-height', value: height }
          ];
          app.set_field_values(field_values, ui.element.data('index'));
        }, 100);
      }
    }
    //Update size
    field_values = [
      { name: 'e-size-width', value: parseInt(ui.size.width) },
      { name: 'e-size-height', value: parseInt(ui.size.height) }
    ];
    app.set_field_values(field_values, ui.element.data('index'));

    //Update position (Necesario cuando redimensiona desde un control izquierdo)
    field_values = [
      { name: 'e-position-top', value: ui.position.top },
      { name: 'e-position-left', value: ui.position.left }
    ];
    app.set_field_values(field_values, ui.element.data('index'));
  };

  app.on_keydown_element = function (event) {
    var key = event.which;
    //c(key);
    var $element = $(this);
    var type = $element.data('type');
    var device = $element.data('device');
    var index = $element.data('index');
    var $group_item = app.get_group_item(device, index);
    var $group_control = app.get_group_control(device);
    var $control_item = app.get_control_item(device, index);
    var value = '';
    var ctrlDown = event.ctrlKey || event.metaKey;// Mac support
    var shiftDown = event.shiftKey;

    switch (event.which) {
      case 83: //Open/hide settings
        app.$canvas.find('#mc-open-settings').trigger('click');
        break;

      case 46: //Remove element
      case 8: //Remove element
        app.remove_element($control_item);
        break;

      case 37: //Left
        if (shiftDown) {
          value = $element.position().left - 10;
        } else {
          value = $element.position().left - 1;
        }
        app.set_field_values([{ name: 'e-position-left', value: value.toString() }], index);
        break;

      case 38: //Up
        if (shiftDown) {
          value = $element.position().top - 10;
        } else {
          value = $element.position().top - 1;
        }
        app.set_field_values([{ name: 'e-position-top', value: value.toString() }], index);
        break;

      case 39: //Right
        if (shiftDown) {
          value = $element.position().left + 10;
        } else {
          value = $element.position().left + 1;
        }
        app.set_field_values([{ name: 'e-position-left', value: value.toString() }], index);
        break;

      case 40: //Down
        if (shiftDown) {
          value = $element.position().top + 10;
        } else {
          value = $element.position().top + 1;
        }
        app.set_field_values([{ name: 'e-position-top', value: value.toString() }], index);
        break;

      case 68: //Ctrl  + d
      case 74: //Ctrl  + j
        if ($.inArray(type, app.unique_form_elements()) > -1) {
          return;
        }
        if (ctrlDown) {
          app.duplicate_element($element);
        }
        break;
      case 67: //Ctrl  + c
        if ($.inArray(type, app.unique_form_elements()) > -1) {
          return;
        }
        if (ctrlDown) {
          $element.data('copy', true);
        }
        break;
      case 86: //Ctrl  + v
        if ($.inArray(type, app.unique_form_elements()) > -1) {
          return;
        }
        if (ctrlDown) {
          if ($element.data('copy')) {
            app.duplicate_element($element);
          }
        }
        break;
      case 90: //Ctrl  + z
        if (ctrlDown) {
          app.undo_changes_element($element, device, index);
        }
        break;
      default:
        break;
    }
    return false;
  };

  app.undo_changes_element = function ($element, device, index) {
    var changes = $element.data('changes');
    var $group_item = app.get_group_item(device, index);
    var value, unit;
    if (!MPP.is_empty(changes)) {
      var reverse = changes.reverse();
      var first = reverse[0];
      var count = 1;
      //Comprobamos si hay varios registros del último cambio
      $.each(reverse, function (index, val) {
        if (val !== undefined && index > 0) {
          if (first.name == val.name) {
            count++;
          }
        }
      });
      var exists = false;
      var undo = {};
      var new_changes = [];
      reverse[0] = undefined;
      //Recorremos los cambios para obtener el valor del registro previo
      $.each(reverse, function (index, val) {
        if (val !== undefined && index > 0) {
          if (!exists && first.name == val.name) {
            exists = true;
            undo = val;
            if (count <= 2) {
              new_changes.push(val);
            }
          } else {
            new_changes.push(val);
          }
        }
      });
      $element.removeData('changes');
      if (exists) {
        value = MPP.number_object(undo.value).value;
        unit = MPP.number_object(undo.value).unit;
        xbox.set_field_value($group_item.find('.xbox-field-id-mpp_' + undo.name), value, unit);
      } else {
        var $field = $group_item.find('.xbox-field-id-mpp_' + first.name);
        var type = $field.closest('.xbox-row').data('field-type');
        switch (type) {
          case 'text':
          case 'colorpicker':
          case 'number':
          case 'switcher':
          case 'file':
            value = $field.find('.xbox-element').data('value');
            if (type == 'number ') {
              unit = $field.find('.xbox-element').data('unit');
            }
            break;
          case 'select':
            value = $field.find('.xbox-element input[type="hidden"]').data('value');
        }
        xbox.set_field_value($field, value, unit);
      }
      new_changes = new_changes.reverse();
      $element.data('changes', new_changes);
    }
  };

  app.on_mouseenter_element = function (event, ui) {
    var $element = $(this);
    var $el_content = $element.find('.ampp-el-content');
    var $group_item = app.get_group_item($element.data('device'), $element.data('index'));
    var style = $el_content.data('style');

    if( $element.data('type') === 'countdown' ){
      $el_content = $el_content.find('.mpp-count-digit .mpp-count');
    }

    if ($group_item.find('.xbox-field-id-mpp_e-hover-font-enable .xbox-element').val() == 'on') {
      $el_content.css({
        'color': style.hover.color
      });
    }
    if ($group_item.find('.xbox-field-id-mpp_e-hover-bg-enable .xbox-element').val() == 'on') {
      $el_content.css({
        'background': style.hover.background
      });
    }
    if ($group_item.find('.xbox-field-id-mpp_e-hover-border-enable .xbox-element').val() == 'on') {
      $el_content.css({
        'border-color': style.hover['border-color']
      });
    }
  };

  app.on_mouseleave_element = function (event, ui) {
    //Le agregamos los estilos normales
    var $element = $(this);
    var $el_content = $element.find('.ampp-el-content');
    var style = $el_content.data('style');

    if( $element.data('type') === 'countdown' ){
      app.add_css_to_countdown($el_content, style.normal, 'normal');
    } else {
      $el_content.css(style.normal);
    }
  };

  app.on_dblclick_element = function (event) {
    var $max_element = $(this);
    var $group_item = app.get_group_item($max_element.data('device'), $max_element.data('index'));
    var $field, $textarea;
    var $tab = $group_item.find('>.xbox-tab');
    var canvas_height = app.$canvas.outerHeight();
    if ($tab.hasClass('accordion')) {
      $tab.find('>.xbox-tab-body > h3:eq(0) a').trigger('click');
    } else {
      $tab.find('>.xbox-tab-header .xbox-item:eq(0) a').trigger('click');
    }

    switch ($max_element.data('type')) {
      case 'close-icon':
        $field = $group_item.find('.xbox-field-id-mpp_e-content-close-icon');
        MPP.scroll_to($field, 500, canvas_height, function () {
          $field.find('input.xbox-search-icon').focus();
        });
        break;

      case 'object':
        $field = $group_item.find('.xbox-field-id-mpp_e-content-object');
        MPP.scroll_to($field, 500, canvas_height, function () {
        });
        break;

      case 'text-html':
      case 'shape':
      case 'button':
      case 'field_submit':
        $textarea = $group_item.find('.xbox-field-id-mpp_e-content-textarea .xbox-element');
        MPP.scroll_to($textarea, 500, canvas_height, function () {
          MPP.set_focus_end($textarea);
        });
        break;
      case 'image':
        $field = $group_item.find('.xbox-field-id-mpp_e-content-image');
        MPP.scroll_to($field, 500, canvas_height, function () {
          MPP.set_focus_end($field.find('.xbox-element'));
        });
        break;
      case 'video':
        $field = $group_item.find('.xbox-field-id-mpp_e-content-video');
        if (!$field.is(':visible')) {
          $field = $group_item.find('.xbox-field-id-mpp_e-content-video-html5');
        }
        MPP.scroll_to($field, 500, canvas_height, function () {
          MPP.set_focus_end($field.find('.xbox-element'));
        });
        break;
      case 'shortcode':
        $textarea = $group_item.find('.xbox-field-id-mpp_e-content-shortcode .xbox-element');
        MPP.scroll_to($textarea, 500, canvas_height, function () {
          MPP.set_focus_end($textarea);
        });
        break;
      case 'field_first_name':
      case 'field_last_name':
      case 'field_email':
      case 'field_phone':
      case 'field_message':
      case 'custom_field_input_text':
      case 'custom_field_input_hidden':
      case 'custom_field_input_checkbox':
      case 'custom_field_input_checkbox_gdpr':
      case 'custom_field_dropdown':
        $field = $group_item.find('.xbox-field-id-mpp_e-field-name');
        MPP.scroll_to($field, 500, canvas_height, function () {
          MPP.set_focus_end($field.find('.xbox-element'));
        });
        break;
    }
  };

  app.duplicate_element = function ($item) {
    if (!MPP.is_empty($item) && typeof $item == 'object') {
      if ($item.hasClass('xbox-group-control-item')) {
        $item.find('.xbox-duplicate-group-item').trigger('click');
        return true;
      } else if ($item.hasClass('ampp-element')) {
        $item = app.get_control_item($item.data('device'), $item.data('index'));
        if ($item) {
          $item.find('.xbox-duplicate-group-item').trigger('click');
          return true;
        }
      }
    }
    return false;
  };

  app.remove_element = function ($item) {
    if (!MPP.is_empty($item) && typeof $item == 'object') {
      if ($item.hasClass('xbox-group-control-item')) {
        $item.find('.xbox-remove-group-item').trigger('click');
        return true;
      } else if ($item.hasClass('ampp-element')) {
        $item = app.get_control_item($item.data('device'), $item.data('index'));
        if ($item) {
          $item.find('.xbox-remove-group-item').trigger('click');
          return true;
        }
      }
    }
    return false;
  };

  app.copy_style_element = function ($element) {
    var device = $element.data('device');
    var $group_item = app.get_group_item(device, $element.data('index'));
    var data = xbox.get_group_object_values($group_item);
    var group_values = app.get_group_values(data, device, $element.data('index'));
    var styles_to_copy = [
      'e-size-width', 'e-size-height',
      'e-padding-top', 'e-padding-right', 'e-padding-bottom', 'e-padding-left',

      'e-bg-repeat', 'e-bg-size', 'e-bg-position', 'e-bg-image', 'e-bg-color',
      'e-bg-enable-gradient', 'e-bg-color-gradient', 'e-bg-angle-gradient',
      'e-hover-bg-enable', 'e-hover-bg-color',

      'e-border-top-width', 'e-border-right-width', 'e-border-bottom-width', 'e-border-left-width', 'e-border-color', 'e-border-style', 'e-border-radius',
      'e-hover-border-enable', 'e-hover-border-color', 'e-focus-border-enable', 'e-focus-border-color',

      'e-font-family', 'e-font-color', 'e-font-size', 'e-font-weight', 'e-font-style', 'e-text-align', 'e-line-height', 'e-white-space', 'e-text-transform', 'e-text-decoration', 'e-letter-spacing', 'e-text-shadow',
      'e-hover-font-enable', 'e-hover-font-color',

      //'e-animation-enable', 'e-open-animation', 'e-open-delay', 'e-open-duration',

      'e-opacity', 'e-overflow', 'e-box-shadow',
    ];
    var fields_values_to_copy = [];
    $.each(styles_to_copy, function (index, field_name) {
      fields_values_to_copy.push({
        name: field_name,
        value: group_values[field_name],
        unit: group_values[field_name+'_unit'],
      });
    });
    app.style_to_paste = fields_values_to_copy;

    $.xboxConfirm({
      title: '',
      content: '<i class="xbox-icon xbox-icon-check-circle xbox-color-teal ampp-big-icon"></i>' + MPP_ADMIN_JS.text.styles_copied,
      hide_confirm: true,
      hide_cancel: true,
      hide_close: true,
      wrap_class: 'ampp-transparent-confirm',
      close_delay: 1100,
    });
    return false;
  };

  app.paste_style_element = function ($element) {
    $.xboxConfirm({
      title: MPP_ADMIN_JS.text.replacing_styles + '...',
      content: MPP_ADMIN_JS.text.please_wait,
      hide_confirm: true,
      hide_cancel: true,
      hide_close: true,
      wrap_class: 'ampp-transparent-confirm',
      close_delay: 1500,
      onOpen: function(){
        setTimeout(function(){
          if (app.style_to_paste.length > 0) {
            app.set_field_values(app.style_to_paste, $element.data('index'));
          }
        }, 700);
      }
    });
  };

  app.maybe_copy_desktop_elements = function(e){
    MPP.pro_version_confirm('Copy Desktop Design');
  }

  app.sort_elements = function ($container) {
    $container.children('.ampp-element').each(function (index, el) {
      $(el).data('index', index).attr('data-index', index).css('z-index', index + 1);
    });
  };

  app.get_active_device = function ($el) {
    if (MPP.is_empty($el)) {
      return app.$canvas.find('#mc-device').data('device');
    } else {
      if ( $el.closest('.ampp-content').length) {
        return $el.closest('.ampp-content').attr('class').indexOf('mobile') > -1 ? 'mobile' : 'desktop';
      }
      if ($el.closest('.xbox-tab-content').length) {
        return $el.closest('.xbox-tab-content').attr('class').indexOf('mobile') > -1 ? 'mobile' : 'desktop';
      }
    }
    return 'desktop';
  };

  app.get_device_container = function (device) {
    return app.$canvas.find('.ampp-' + device + '-content');
  };

  app.get_device_group = function (device) {
    return device == 'desktop' ? app.$dk_els_group : app.$mb_els_group;
  };

  app.get_group_item = function (device, index) {
    var $group = app.get_device_group(device);
    return $group.children('.xbox-group-item').eq(index);
  };

  app.get_last_group_item = function (device) {
    var $group = app.get_device_group(device);
    return $group.children('.xbox-group-item').last();
  };

  app.get_group_control = function (device) {
    if (typeof device == 'object') {
      return device.closest('.xbox-type-group').find('.xbox-group-control').first();
    }
    return device == 'desktop' ? app.$dk_els_list : app.$mb_els_list;
  };

  app.get_control_item = function (device, index) {
    var $group_control = app.get_group_control(device);
    return $group_control.children('.xbox-group-control-item').eq(index);
  };

  app.get_last_control_item = function (device) {
    var $group_control = app.get_group_control(device);
    return $group_control.children('.xbox-group-control-item').last();
  };

  app.get_element = function (device, index) {
    var $container = app.get_device_container(device);
    return $container.children('.ampp-element').eq(index);
  };

  app.get_last_element = function (device) {
    var $container = app.get_device_container(device);
    return $container.children('.ampp-element').last();
  };

  app.merge_group_values = function (values, new_values) {
    var obj = {};
    var modified = false;
    $.each(new_values, function (index, field) {
      if(field.name){
        modified = true;
        obj[field.name] = field.value !== undefined ? field.value : '';
        if( field.unit ){
          obj[field.name+'_unit'] = field.unit;
        }
      } else {
        return false;//break each loop
      }
    });
    if( modified ){
      new_values = obj;
    }
    return $.extend({}, values, new_values);
  }

  app.add_link_rel_google_font = function ($el_content, value) {
    if ($.inArray(value, MPP_ADMIN_JS.google_fonts) > -1) {
      value = value.replace(/\s+/g, '+');
      $el_content.next('link').remove();
      $el_content.after('<link href="//fonts.googleapis.com/css?family=' + value + ':100,200,300,400,500,600,700,800,900&subset=latin,latin-ext,greek,greek-ext,cyrillic,cyrillic-ext,vietnamese"  rel="stylesheet" type="text/css">');
    }
  };

  app.unique_form_elements = function () {
    return ['field_first_name', 'field_last_name', 'field_email', 'field_phone', 'field_message', 'field_submit'];
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
