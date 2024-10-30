window.XBOX = (function (window, document, $) {
  'use strict';
  var xbox = {
    duplicate: false,
    media: {
      frames: {}
    }
  };

  xbox.init = function () {
    var $xbox = $('.xbox');
    var $form = $xbox.closest('.xbox-form');
    if (!$form.length) {
      $form = $xbox.closest('form#post');
    }

    //Disable form submit on enter
    $form.on('keyup keypress', 'input', function (e) {
      var keyCode = e.which;
      if (keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });

    $(window).resize(function () {
      if (viewport().width <= 850) {
        $('#post-body').addClass('xbox-columns-1');
      } else {
        $('#post-body').removeClass('xbox-columns-1');
      }
    }).resize();


    xbox.init_image_selector();
    xbox.init_tab();
    xbox.init_switcher();
    xbox.init_spinner();
    xbox.init_checkbox();
    xbox.init_dropdown();
    xbox.init_colorpicker();
    xbox.init_code_editor();
    xbox.init_sortable_preview_items();
    xbox.init_sortable_checkbox();
    xbox.init_sortable_repeatable_items();
    xbox.init_sortable_group_items();
    xbox.init_tooltip();

    xbox.load_oembeds();
    setTimeout(function () {
      xbox.load_icons_for_icon_selector();
    }, 200);

    $xbox.on('click', '#xbox-reset', xbox.on_click_reset_values);
    $xbox.on('click', '#xbox-import', xbox.on_click_import_values);
    $xbox.on('ifClicked', '.xbox-type-import .xbox-radiochecks input', xbox.toggle_import);
    $xbox.on('click', '.xbox-type-import .xbox-radiochecks input, .xbox-wrap-import-inputs .item-key-from_url input, .xbox-wrap-import-inputs .item-key-from_file input', xbox.toggle_import);

    $xbox.on('click', '.xbox-add-group-item', xbox.new_group_item);
    $xbox.on('click', '.xbox-duplicate-group-item', xbox.new_group_item);
    $xbox.on('click', '.xbox-remove-group-item', xbox.remove_group_item);
    $xbox.on('click', '.xbox-group-control-item', xbox.on_click_group_control_item);
    $xbox.on('sort_group_items', '.xbox-group-wrap', xbox.sort_group_items);
    $xbox.on('sort_group_control_items', '.xbox-group-control', xbox.sort_group_control_items);

    $xbox.on('click', '.xbox-add-repeatable-item', xbox.add_repeatable_item);
    $xbox.on('click', '.xbox-remove-repeatable-item', xbox.remove_repeatable_item);
    $xbox.on('sort_repeatable_items', '.xbox-repeatable-wrap', xbox.sort_repeatable_items);

    $xbox.on('click', '.xbox-upload-file, .xbox-preview-item .xbox-preview-handler', xbox.wp_media_upload);
    $xbox.on('click', '.xbox-remove-preview', xbox.remove_preview_item);
    $xbox.on('click', '.xbox-get-oembed', xbox.get_oembed);
    $xbox.on('click', '.xbox-get-image', xbox.get_image_from_url);
    $xbox.on('focusout', '.xbox-type-colorpicker input', xbox.on_focusout_input_colorpicker);
    $xbox.on('click', '.xbox-type-colorpicker .xbox-colorpicker-default-btn', xbox.set_default_value_colorpicker);
    $xbox.on('click', '.xbox-section.xbox-toggle-1 .xbox-section-header, .xbox-section .xbox-toggle-icon', xbox.toggle_section);
    $xbox.on('click', '.xbox-type-number .xbox-unit-has-picker-1', xbox.toggle_units_dropdown);
    $xbox.on('click', '.xbox-units-dropdown .xbox-unit-item', xbox.set_unit_number);
    $xbox.on('focus', '.xbox-type-text input.xbox-element', xbox.on_focus_input_type_text);

    $(document).on('click', xbox.hide_units_dropdown);

    xbox.sticky_submit_buttons();
    $(window).scroll(function () {
      xbox.sticky_submit_buttons();
    });
  };

  xbox.sticky_submit_buttons = function () {
    var $header = $('.xbox-header').first();
    var $actions = $header.find('.xbox-header-actions').first();
    var $my_account = $('#wp-admin-bar-my-account');
    if (!$actions.length || !$my_account.length || !$actions.data('sticky')) {
      return;
    }
    if ($(window).scrollTop() > $header.offset().top) {
      $my_account.css('padding-right', $actions.width() + 25);
      $actions.addClass('xbox-actions-sticky');
    } else {
      $my_account.css('padding-right', '');
      $actions.removeClass('xbox-actions-sticky');
    }
  };

  xbox.on_focus_input_type_text = function (event) {
    var $helper = $(this).next('.xbox-field-helper');
    if ($helper.length) {
      $(this).css('padding-right', ($helper.outerWidth() + 6) + 'px');
    }
  };

  xbox.hide_units_dropdown = function () {
    $('.xbox-units-dropdown').slideUp(200);
  };
  xbox.toggle_units_dropdown = function (event) {
    if ($(event.target).hasClass('xbox-spinner-handler') || $(event.target).hasClass('xbox-spinner-control')) {
      return;
    }
    event.stopPropagation();
    $(this).find('.xbox-units-dropdown').slideToggle(200);
  };
  xbox.set_unit_number = function (event) {
    var $btn = $(this);
    $btn.closest('.xbox-unit').find('input.xbox-unit-number').val($btn.data('value')).trigger('change');
    $btn.closest('.xbox-unit').find('span').text($btn.text());
  };

  xbox.load_icons_for_icon_selector = function (event) {
    var fields = [];
    $('.xbox-type-icon_selector').each(function (index, el) {
      var field_id = $(el).data('field-id');
      var options = $(el).find('.xbox-icons-wrap').data('options');
      if ($.inArray(field_id, fields) < 0 && options.load_with_ajax) {
        fields.push(field_id);
      }
    });

    $.each(fields, function (index, field_id) {
      xbox.load_icon_selector($('.xbox-field-id-' + field_id));
    });

    $(document).on('input', '.xbox-search-icon', function (event) {
      event.preventDefault();
      var value = $(this).val();
      var $container = $(this).closest('.xbox-field').find('.xbox-icons-wrap');
      xbox.filter_items(value, $container, '.xbox-item-icon-selector');
    });
    $(document).on('click', '.xbox-icon-actions .xbox-btn', function (event) {
      var value = $(this).data('search');
      var $container = $(this).closest('.xbox-field').find('.xbox-icons-wrap');
      xbox.filter_items(value, $container, '.xbox-item-icon-selector');
    });

    $(document).on('click', '.xbox-icons-wrap .xbox-item-icon-selector', function (event) {
      var $field = $(this).closest('.xbox-field');
      var $container = $field.find('.xbox-icons-wrap');
      var options = $container.data('options');
      $(this).addClass(options.active_class).siblings().removeClass(options.active_class);
      $field.find('input.xbox-element').val($(this).data('value')).trigger('change');
      $field.find('.xbox-icon-active').html($(this).html());
    });
  };

  xbox.filter_items = function (value, $container, selector) {
    $container.find(selector).each(function (index, item) {
      var data = $(item).data('key');
      if (is_empty(data)) {
        $(item).hide();
      } else {
        if (value == 'all' || data.indexOf(value) > -1) {
          $(item).show();
        } else {
          $(item).hide();
        }
      }
    });
  };

  xbox.load_icon_selector = function ($field) {
    var options = $field.find('.xbox-icons-wrap').data('options');
    $.ajax({
      type: 'post',
      dataType: 'json',
      url: XBOX_JS.ajax_url,
      data: {
        action: 'xbox_get_items',
        class_name: options.ajax_data.class_name,
        function_name: options.ajax_data.function_name,
        ajax_nonce: XBOX_JS.ajax_nonce
      },
      beforeSend: function () {
        $field.find('.xbox-icons-wrap').prepend("<i class='xbox-icon xbox-icon-spinner xbox-icon-spin xbox-loader'></i>");
      },
      success: function (response) {
        if (response) {
          if (response.success) {
            $.each(response.items, function (value, html) {
              var key = 'font ' + value;
              var type = 'icon font';
              if (key.indexOf('.svg') > -1) {
                key = key.split('/');
                key = key[key.length - 1];
                type = 'svg';
              }
              var $new_item = $('<div />', {
                'class': 'xbox-item-icon-selector',
                'data-value': value,
                'data-key': key,
                'data-type': type
              });
              $new_item.html(html);
              $field.find('.xbox-icons-wrap').append($new_item);
            });
            $field.find('.xbox-icons-wrap .xbox-item-icon-selector').css({
              'width': options.size,
              'height': options.size,
              'font-size': parseInt(options.size) - 14,
            });
            //c($field.first().find('.xbox-icons-wrap .xbox-item-icon-selector').length);//total icons
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
      },
      complete: function (jqXHR, textStatus) {
        $field.find('.xbox-icons-wrap').find('.xbox-loader').remove();
      }
    });

    return '';
  };

  xbox.toggle_section = function (event) {
    event.stopPropagation();
    var $btn = $(this);
    var $section = $btn.closest('.xbox-section.xbox-toggle-1');
    var $section_body = $section.find('.xbox-section-body');
    var data_toggle = $section.data('toggle');
    var $icon = $section.find('.xbox-toggle-icon').first();
    if ($btn.hasClass('xbox-section-header') && data_toggle.target == 'icon') {
      return;
    }
    var object_toggle = {
      duration: parseInt(data_toggle.speed),
      complete: function () {
        if ($section_body.css('display') == 'block') {
          $icon.find('i').removeClass(data_toggle.close_icon).addClass(data_toggle.open_icon);
        } else {
          $icon.find('i').removeClass(data_toggle.open_icon).addClass(data_toggle.close_icon);
        }
      }
    };
    if (data_toggle.effect == 'slide') {
      $section_body.slideToggle(object_toggle);
    } else if (data_toggle.effect == 'fade') {
      $section_body.fadeToggle(object_toggle);
    }
    return false;
  };

  xbox.toggle_import = function (event) {
    c('Click import');
    var $input = $(this);
    var $wrap_input_file = $('.xbox-wrap-input-file');
    var $wrap_input_url = $('.xbox-wrap-input-url');

    if ($input.next('img').length || ($input.val() != 'from_file' && $input.val() != 'from_url')) {
      $wrap_input_file.hide();
      $wrap_input_url.hide();
    }
    if ($input.val() == 'from_file') {
      $wrap_input_file.show();
      $wrap_input_url.hide();
    }
    if ($input.val() == 'from_url') {
      $wrap_input_url.show();
      $wrap_input_file.hide();
    }
  };

  xbox.on_click_reset_values = function (event) {
    var $btn = $(this);
    var $xbox_form = $btn.closest('.xbox-form');
    $.xboxConfirm({
      title: XBOX_JS.text.reset_popup.title,
      content: XBOX_JS.text.reset_popup.content,
      confirm_class: 'xbox-btn-blue',
      confirm_text: XBOX_JS.text.popup.accept_button,
      cancel_text: XBOX_JS.text.popup.cancel_button,
      onConfirm: function () {
        $xbox_form.prepend('<input type="hidden" name="' + $btn.attr('name') + '" value="true">');
        $xbox_form.submit();
      },
      onCancel: function () {
        return false;
      }
    });
    return false;
  };

  xbox.on_click_import_values = function (event) {
    var $btn = $(this);
    var $xbox_form = $btn.closest('.xbox-form');
    if (!$xbox_form.length) {
      $xbox_form = $btn.closest('form#post');
    }
    $.xboxConfirm({
      title: XBOX_JS.text.import_popup.title,
      content: XBOX_JS.text.import_popup.content,
      confirm_class: 'xbox-btn-blue',
      confirm_text: XBOX_JS.text.popup.accept_button,
      cancel_text: XBOX_JS.text.popup.cancel_button,
      onConfirm: function () {
        $xbox_form.prepend('<input type="hidden" name="' + $btn.attr('name') + '" value="true">');
        if ($xbox_form.find('#publish').length) {
          $xbox_form.find('#publish').click();
        } else {
          $xbox_form.submit();
        }
      },
      onCancel: function () {
        return false;
      }
    });
    return false;
  };

  xbox.get_image_from_url = function (event) {
    var $btn = $(this);
    var $field = $btn.closest('.xbox-field');
    var $input = $field.find('.xbox-element-text');
    var $wrap_preview = $field.find('.xbox-wrap-preview');
    if (is_empty($input.val())) {
      $.xboxConfirm({
        title: XBOX_JS.text.validation_url_popup.title,
        content: XBOX_JS.text.validation_url_popup.content,
        confirm_text: XBOX_JS.text.popup.accept_button,
        hide_cancel: true
      });
      return false;
    }
    var image_class = $wrap_preview.data('image-class');
    var $new_item = $('<li />', { 'class': 'xbox-preview-item xbox-preview-image' });
    $new_item.html(
      '<img src="' + $input.val() + '" class="' + image_class + '">' +
      '<a class="xbox-btn xbox-btn-iconize xbox-btn-small xbox-btn-red xbox-remove-preview"><i class="xbox-icon xbox-icon-times-circle"></i></a>'
    );
    $wrap_preview.fadeOut(400, function () {
      $(this).html('').show();
    });
    $field.find('.xbox-get-image i').addClass('xbox-icon-spin');
    setTimeout(function () {
      $wrap_preview.html($new_item);
      $field.find('.xbox-get-image i').removeClass('xbox-icon-spin');
    }, 1200);
    return false;
  };

  xbox.load_oembeds = function (event) {
    $('.xbox-type-oembed').each(function (index, el) {
      if ($(el).find('.xbox-wrap-oembed').data('preview-onload')) {
        xbox.get_oembed($(el).find('.xbox-get-oembed'));
      }
    });
  };

  xbox.get_oembed = function (event) {
    var $btn;
    if ($(event.currentTarget).length) {
      $btn = $(event.currentTarget);
    } else {
      $btn = event;
    }
    var $field = $btn.closest('.xbox-field');
    var $input = $field.find('.xbox-element-text');
    var $wrap_preview = $field.find('.xbox-wrap-preview');
    if (is_empty($input.val()) && $(event.currentTarget).length) {
      $.xboxConfirm({
        title: XBOX_JS.text.validation_url_popup.title,
        content: XBOX_JS.text.validation_url_popup.content,
        confirm_text: XBOX_JS.text.popup.accept_button,
        hide_cancel: true
      });
      return false;
    }
    $.ajax({
      type: 'post',
      dataType: 'json',
      url: XBOX_JS.ajax_url,
      data: {
        action: 'xbox_get_oembed',
        oembed_url: $input.val(),
        preview_size: $wrap_preview.data('preview-size'),
        ajax_nonce: XBOX_JS.ajax_nonce
      },
      beforeSend: function () {
        $wrap_preview.fadeOut(400, function () {
          $(this).html('').show();
        });
        $field.find('.xbox-get-oembed i').addClass('xbox-icon-spin');
      },
      success: function (response) {
        if (response) {
          if (response.success) {
            var $new_item = $('<li />', { 'class': 'xbox-preview-item xbox-preview-oembed' });
            $new_item.html(
              '<div class="xbox-oembed xbox-oembed-provider-' + response.provider + ' xbox-element-oembed ">' +
              response.oembed +
              '<a class="xbox-btn xbox-btn-iconize xbox-btn-small xbox-btn-red xbox-remove-preview"><i class="xbox-icon xbox-icon-times-circle"></i></a>' +
              '</div>'
            );
            $wrap_preview.html($new_item);
          } else {
            $wrap_preview.html(response.message);
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
      },
      complete: function (jqXHR, textStatus) {
        $field.find('.xbox-get-oembed i').removeClass('xbox-icon-spin');
      }
    });
    return false;
  };

  xbox.wp_media_upload = function (event) {
    if (wp === undefined) {
      return;
    }
    var $btn = $(this);
    var media = xbox.media;
    media.$field = $btn.closest('.xbox-field');
    media.field_id = media.$field.closest('.xbox-row').data('field-id');
    media.frame_id = media.$field.closest('.xbox').attr('id') + '_' + media.field_id;
    media.$upload_btn = media.$field.find('.xbox-upload-file');
    media.$wrap_preview = media.$field.find('.xbox-wrap-preview');
    media.multiple = media.$field.hasClass('xbox-has-multiple');
    media.$preview_item = undefined;
    media.attachment_id = undefined;

    if ($btn.closest('.xbox-preview-item').length) {
      media.$preview_item = $btn.closest('.xbox-preview-item');
    } else if (!media.multiple) {
      media.$preview_item = media.$field.find('.xbox-preview-item').first();
    }
    if (media.$preview_item) {
      media.attachment_id = media.$preview_item.find('.xbox-attachment-id').val();
    }

    if (media.frames[media.frame_id] !== undefined) {
      media.frames[media.frame_id].open();
      return;
    }

    media.frames[media.frame_id] = wp.media({
      title: media.$field.closest('.xbox-type-file').find('.xbox-element-label').first().text(),
      multiple: media.multiple ? 'add' : false,
    });
    media.frames[media.frame_id].on('open', xbox.on_open_wp_media).on('select', xbox.on_select_wp_media);
    media.frames[media.frame_id].open();
  };

  xbox.on_open_wp_media = function (event) {
    var media = xbox.media;
    var selected_files = xbox.media.frames[media.frame_id].state().get('selection');
    if (is_empty(media.attachment_id)) {
      return selected_files.reset();
    }
    var wp_attachment = wp.media.attachment(media.attachment_id);
    wp_attachment.fetch();
    selected_files.set(wp_attachment ? [wp_attachment] : []);
  };

  xbox.on_select_wp_media = function (event) {
    var media = xbox.media;
    var selected_files = media.frames[media.frame_id].state().get('selection').toJSON();
    var preview_size = media.$wrap_preview.data('preview-size');
    var attach_name = media.$wrap_preview.data('field-name');
    var control_img_id = media.$field.closest('.xbox-type-group').find('.xbox-group-control').data('image-field-id');

    media.$field.trigger('xbox_before_add_files', [selected_files, xbox.media]);
    $(selected_files).each(function (index, obj) {
      var image = '';
      var inputs = '';
      var item_body = '';
      var $new_item = $('<li />', { 'class': 'xbox-preview-item xbox-preview-file' });

      if (obj.type == 'image') {
        $new_item.addClass('xbox-preview-image');
        item_body = '<img src="' + obj.url + '" style="width: ' + preview_size.width + '; height: ' + preview_size.height + '" data-full-img="' + obj.url + '" class="xbox-image xbox-preview-handler">';
      } else if (obj.type == 'video') {
        $new_item.addClass('xbox-preview-video');
        item_body = '<div class="xbox-video">';
        item_body += '<video controls style="width: ' + preview_size.width + '; height: ' + preview_size.height + '"><source src="' + obj.url + '" type="' + obj.mime + '"></video>';
        item_body += '</div>';
      } else {
        item_body = '<img src="' + obj.icon + '" class="xbox-preview-icon-file xbox-preview-handler"><a href="' + obj.url + '" class="xbox-preview-download-link">' + obj.filename + '</a><span class="xbox-preview-mime xbox-preview-handler">' + obj.mime + '</span>';
      }

      if (media.multiple) {
        inputs = '<input type="hidden" name="' + media.$upload_btn.data('field-name') + '" value="' + obj.url + '" class="xbox-element xbox-element-hidden">';
      }
      inputs += '<input type="hidden" name="' + attach_name + '" value="' + obj.id + '" class="xbox-attachment-id">';

      $new_item.html(inputs + item_body + '<a class="xbox-btn xbox-btn-iconize xbox-btn-small xbox-btn-red xbox-remove-preview"><i class="xbox-icon xbox-icon-times-circle"></i></a>');

      if (media.multiple) {
        if (media.$preview_item) {
          //Sólo agregamos los nuevos
          if (media.attachment_id != obj.id) {
            media.$preview_item.after($new_item);
          }
        } else {
          media.$wrap_preview.append($new_item);
        }
      } else {
        media.$wrap_preview.html($new_item);
        media.$field.find('.xbox-element').attr('value', obj.url);
        if (obj.type == 'image') {
          //Sincronizar con la imagen de control de un grupo
          if (media.field_id == control_img_id) {
            xbox.synchronize_selector_preview_image('.xbox-control-image', media.$wrap_preview, 'add', obj.url);
          }
          //Sincronizar con otros elementos
          xbox.synchronize_selector_preview_image('', media.$wrap_preview, 'add', obj.url);
        }
      }
    });
    media.$field.trigger('xbox_after_add_files', [selected_files, media]);
  };

  xbox.remove_preview_item = function (event) {
    var $btn = $(this);
    var $field = $btn.closest('.xbox-field');
    var field_id = $field.closest('.xbox-row').data('field-id');
    var control_data_img = $field.closest('.xbox-type-group').find('.xbox-group-control').data('image-field-id');
    var $wrap_preview = $field.find('.xbox-wrap-preview');
    var multiple = $field.hasClass('xbox-has-multiple');

    $field.trigger('xbox_before_remove_preview_item', [multiple]);

    if (!multiple) {
      $field.find('.xbox-element').attr('value', '');
    }
    $btn.closest('.xbox-preview-item').remove();

    if (!multiple && $btn.closest('.xbox-preview-item').hasClass('xbox-preview-image')) {
      if (field_id == control_data_img) {
        xbox.synchronize_selector_preview_image('.xbox-control-image', $wrap_preview, 'remove', '');
      }
      xbox.synchronize_selector_preview_image('', $wrap_preview, 'remove', '');
    }
    $field.find('.xbox-element').trigger('change');
    $field.trigger('xbox_after_remove_preview_item', [multiple]);
    return false;
  };

  xbox.synchronize_selector_preview_image = function (selectors, $wrap_preview, action, value) {
    selectors = selectors || $wrap_preview.data('synchronize-selector');
    if (!is_empty(selectors)) {
      selectors = selectors.split(',');
      $.each(selectors, function (index, selector) {
        var $element = $(selector);
        if ($element.closest('.xbox-type-group').length) {
          if ($element.closest('.xbox-group-control').length) {
            $element = $element.closest('.xbox-group-control-item.xbox-active').find(selector);
          } else {
            $element = $element.closest('.xbox-group-item.xbox-active').find(selector);
          }
        }
        if ($element.is('img')) {
          $element.fadeOut(300, function () {
            if ($element.closest('.xbox-group-control').length) {
              $element.attr('src', value);
            } else {
              $element.attr('src', value);
            }
          });
        } else {
          $element.fadeOut(300, function () {
            if ($element.closest('.xbox-group-control').length) {
              $element.css('background-image', 'url(' + value + ')');
            } else {
              $element.css('background-image', 'url(' + value + ')');
            }
          });
        }
        if (action == 'add') {
          $element.fadeIn(300);
        }
        var $input = $element.closest('.xbox-field').find('input.xbox-element');
        if ($input.length) {
          $input.attr('value', value);
        }

        var $close_btn = $element.closest('.xbox-preview-item').find('.xbox-remove-preview');
        if ($close_btn.length) {
          if (action == 'add' && $input.is(':visible')) {
            $close_btn.show();
          }
          if (action == 'remove') {
            $close_btn.hide();
          }
        }
      });
    }
  };

  xbox.reinit_js_plugins = function ($new_element) {
    //Inicializar Tabs
    $new_element.find('.xbox-tab').each(function (iterator, item) {
      xbox.init_tab($(item));
    });

    //Inicializar Switcher
    $new_element.find('.xbox-type-switcher input.xbox-element').each(function (iterator, item) {
      $(item).xboxSwitcher('destroy');
      xbox.init_switcher($(item));
    });

    //Inicializar Spinner
    $new_element.find('.xbox-type-number .xbox-field.xbox-has-spinner').each(function (iterator, item) {
      xbox.init_spinner($(item));
    });

    //Inicializar radio buttons y checkboxes
    $new_element.find('.xbox-has-icheck .xbox-radiochecks.init-icheck').each(function (iterator, item) {
      xbox.destroy_icheck($(item));
      xbox.init_checkbox($(item));
    });

    //Inicializar Colorpicker
    $new_element.find('.xbox-colorpicker-color').each(function (iterator, item) {
      xbox.init_colorpicker($(item));
    });

    //Inicializar Dropdown
    $new_element.find('.ui.selection.dropdown').each(function (iterator, item) {
      xbox.init_dropdown($(item));
    });

    //Inicializar Sortables de grupos
    $new_element.find('.xbox-group-control.xbox-sortable').each(function (iterator, item) {
      xbox.init_sortable_group_items($(item));
    });

    //Inicializar Sortable de items repetibles
    $new_element.find('.xbox-repeatable-wrap.xbox-sortable').each(function (iterator, item) {
      xbox.init_sortable_repeatable_items($(item));
    });

    //Inicializar Sortable de preview items
    $new_element.find('.xbox-wrap-preview-multiple').each(function (iterator, item) {
      xbox.init_sortable_preview_items($(item));
    });

    //Inicializar Ace editor
    $new_element.find('.xbox-code-editor').each(function (iterator, item) {
      xbox.destroy_ace_editor($(item));
      xbox.init_code_editor($(item));
    });

    //Inicializar Tooltip
    xbox.init_tooltip($new_element.find('.xbox-tooltip-handler'));
  };


  xbox.destroy_wp_editor = function ($selector) {
    if (typeof tinyMCEPreInit === 'undefined' || typeof tinymce === 'undefined' || typeof QTags == 'undefined') {
      return;
    }

    //Destroy editor
    $selector.find('.quicktags-toolbar, .mce-tinymce.mce-container').remove();
    tinymce.execCommand('mceRemoveEditor', true, $selector.find('.wp-editor-area').attr('id'));

    //Register editor to init
    $selector.addClass('init-wp-editor');
  };

  xbox.on_init_wp_editor = function (wp_editor, args) {
    $('.xbox').trigger('xbox_on_init_wp_editor', wp_editor, args);
  };

  xbox.on_setup_wp_editor = function (wp_editor) {
    $('.xbox').trigger('xbox_on_setup_wp_editor', wp_editor);
    if (typeof tinymce === 'undefined') {
      return;
    }
    var $textarea = $(wp_editor.settings.selector);
    wp_editor.on('change mouseleave input', function (e) {
      if( wp_editor ){
        var value = wp_editor.getContent();
        $textarea.text(value).val(value);
      }
    });
  };

  xbox.init_wp_editor = function ($selector) {
    if (typeof tinyMCEPreInit === 'undefined' || typeof tinymce === 'undefined' || typeof QTags == 'undefined') {
      return;
    }
    $selector.removeClass('init-wp-editor');
    $selector.removeClass('html-active').addClass('tmce-active');
    var $textarea = $selector.find('.wp-editor-area');
    var ed_id = $textarea.attr('id');
    var old_ed_id = $selector.closest('.xbox-group-wrap').find('.xbox-group-item').eq(0).find('.wp-editor-area').first().attr('id');

    $textarea.show();

    var ed_settings = jQuery.extend(tinyMCEPreInit.mceInit[old_ed_id], {
      body_class: ed_id,
      selector: '#' + ed_id,
      skin: "lightgray",
      entities: "38,amp,60,lt,62,gt",
      entity_encoding: "raw",
      preview_styles: "font-family font-size font-weight font-style text-decoration text-transform",
      relative_urls: false,
      remove_script_host: false,
      resize: "vertical",
      plugins: "charmap,colorpicker,hr,lists,media,paste,tabfocus,textcolor,fullscreen,wordpress,wpautoresize,wpeditimage,wpemoji,wpgallery,wplink,wpdialogs,wptextpattern,wpview,directionality,image",
      tabfocus_elements: ":prev,:next",
      theme: "modern",
      fix_list_elements: true,
      mode: "tmce",//tmce,exact
      menubar : false,
      toolbar1: "formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,fullscreen,wp_adv",
      toolbar2: "strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,rtl,ltr,wp_help",
      toolbar3: "",
      toolbar4: "",
      wpautop: true,
      setup: function(wp_editor) {
        xbox.on_setup_wp_editor(wp_editor);//php class-field.php set_args();
        wp_editor.on('init', function(args) {
          xbox.on_init_wp_editor(wp_editor, args);
        });
      }
    });

    tinyMCEPreInit.mceInit[ed_id] = ed_settings;

    // Initialize wp_editor tinymce instance
    tinymce.init(tinyMCEPreInit.mceInit[ed_id]);
    //tinymce.execCommand( 'mceAddEditor', true, ed_id );

    //Quick tags Settings
    var qt_settings = jQuery.extend({}, tinyMCEPreInit.qtInit[old_ed_id]);
    qt_settings.id = ed_id;
    new QTags(ed_id);
    QTags._buttonsInit();
  };

  xbox.init_switcher = function ($selector) {
    $selector = is_empty($selector) ? $('.xbox-type-switcher input.xbox-element') : $selector;
    $selector.xboxSwitcher();
  };

  xbox.init_spinner = function ($selector) {
    $selector = is_empty($selector) ? $('.xbox-type-number .xbox-field.xbox-has-spinner') : $selector;
    $selector.spinnerNum('delay', 300);
    $selector.spinnerNum('changing', function (e, newVal, oldVal) {
      $(this).trigger('xbox_changed_value', newVal);
    });
  };

  xbox.init_tab = function ($selector) {
    $selector = is_empty($selector) ? $('.xbox-tab') : $selector;
    $selector.each(function(index, el){
      var $tab = $(el);
      if( $tab.closest('.xbox-source-item').length ){
        return;//continue each
      }
      $tab.find('.xbox-tab-nav .xbox-item').removeClass('active');
      $tab.find('.xbox-accordion-title').remove();

      var type_tab = 'responsive';
      if ($tab.closest('#side-sortables').length) {
        type_tab = 'accordion';
      }
      $tab.xboxTabs({
        collapsible: true,
        type: type_tab
      });
    });
  };

  xbox.init_tooltip = function ($selector) {
    $selector = is_empty($selector) ? $('.xbox-tooltip-handler') : $selector;
    $selector.each(function (index, el) {
      var title_content = '';
      var title_tooltip = $(el).data('tipso-title');
      var position = $(el).data('tipso-position') ? $(el).data('tipso-position') : 'top';
      if (!is_empty(title_tooltip)) {
        title_content = '<h3>' + title_tooltip + '</h3>';
      }
      $(el).tipso({
        delay: 10,
        speed: 100,
        offsetY: 2,
        tooltipHover: true,
        position: position,
        titleContent: title_content,
        onBeforeShow: function ($element, element, e) {
          $(e.tipso_bubble).addClass($(el).closest('.xbox').data('skin'));
        },
        onShow: function ($element, element, e) {
          //$(e.tipso_bubble).removeClass('top').addClass(position);
        },
        //hideDelay: 1000000
      });
    });
  };

  xbox.init_checkbox = function ($selector) {
    $selector = is_empty($selector) ? $('.xbox-has-icheck .xbox-radiochecks.init-icheck') : $selector;
    $selector.find('input').iCheck({
      radioClass: 'iradio_flat-blue',
      checkboxClass: 'icheckbox_flat-blue',
    });
  };

  xbox.destroy_icheck = function ($selector) {
    $selector.find('input').each(function (index, input) {
      $(input).attr('style', '');
      $(input).next('ins').remove();
      $(input).unwrap();
    });
  };

  xbox.init_image_selector = function ($selector) {
    $selector = is_empty($selector) ? $('.xbox-type-image_selector .init-image-selector, .xbox-type-import .init-image-selector') : $selector;
    $selector.xboxImageSelector({
      active_class: 'xbox-active'
    });
  };

  xbox.init_dropdown = function ($selector) {
    $selector = is_empty($selector) ? $('.ui.selection.dropdown') : $selector;
    $selector.each(function (index, el) {
      var max_selections = parseInt($(el).data('max-selections'));
      var value = $(el).find('input[type="hidden"]').val();
      if (max_selections > 1 && $(el).hasClass('multiple')) {
        $(el).dropdownXbox({
          maxSelections: max_selections,
        });
        $(el).dropdownXbox('set selected', value.split(','));
      } else {
        $(el).dropdownXbox();
      }
    });
  };

  xbox.on_focusout_input_colorpicker = function () {
    var $field = $(this).closest('.xbox-field');
    var value = $(this).val();
    $(this).attr('value', value);
    $field.find('.xbox-colorpicker-color').attr('value', value).css('background-color', value);
    return false;
  };

  xbox.set_default_value_colorpicker = function () {
    var $field = $(this).closest('.xbox-field');
    var value = $field.data('default');
    if (value) {
      $field.find('input.xbox-element').attr('value', value);
      $field.find('.xbox-colorpicker-color').attr('value', value).css('background-color', value);
    }
  };

  xbox.init_colorpicker = function ($selector) {
    $selector = is_empty($selector) ? $('.xbox-colorpicker-color') : $selector;
    $selector.colorPicker({
      cssAddon: '.cp-color-picker {margin-top:6px;}',
      buildCallback: function ($elm) {
      },
      renderCallback: function ($elm, toggled) {
        var $field = $elm.closest('.xbox-field');
        this.$UI.find('.cp-alpha').toggle($field.hasClass('xbox-has-alpha'));
        var value = this.color.toString('rgb', true);
        if (!$field.hasClass('xbox-has-alpha')) {//|| value.endsWith(', 1)')
          value = '#' + this.color.colors.HEX;
        }
        value = value.indexOf('NAN') > -1 ? '' : value;
        $field.find('input').attr('value', value);
        $field.find('.xbox-colorpicker-color').attr('value', value).css('background-color', value);

        //Para la gestión de eventos
        $field.find('input').trigger('change');
      }
    });
  };

  xbox.destroy_ace_editor = function ($selector) {
    var $textarea = $selector.closest('.xbox-field').find('textarea.xbox-element');
    $selector.text($textarea.val());
  };

  xbox.init_code_editor = function ($selector) {
    $selector = is_empty($selector) ? $('.xbox-code-editor') : $selector;
    $selector.each(function (index, el) {
      var editor = ace.edit($(el).attr('id'));
      var language = $(el).data('language');
      var theme = $(el).data('theme');
      editor.setTheme("ace/theme/" + theme);
      editor.getSession().setMode("ace/mode/" + language);
      editor.setFontSize(15);
      editor.setShowPrintMargin(false);
      editor.getSession().on('change', function (e) {
        $(el).closest('.xbox-field').find('textarea.xbox-element').text(editor.getValue());
      });

      //Include auto complete
      ace.config.loadModule('ace/ext/language_tools', function () {
        editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true
        });
      });
    });
  };

  xbox.init_sortable_preview_items = function ($selector) {
    $selector = is_empty($selector) ? $('.xbox-wrap-preview-multiple') : $selector;
    $selector.sortable({
      items: '.xbox-preview-item',
      placeholder: "xbox-preview-item xbox-sortable-placeholder",
      start: function (event, ui) {
        ui.placeholder.css({
          'width': ui.item.css('width'),
          'height': ui.item.css('height'),
        });
      },
    }).disableSelection();
  };

  xbox.init_sortable_checkbox = function ($selector) {
    $selector = is_empty($selector) ? $('.xbox-has-icheck .xbox-radiochecks.init-icheck.xbox-sortable') : $selector;
    $selector.sortable({
      items: '>label',
      placeholder: "xbox-icheck-sortable-item xbox-sortable-placeholder",
      start: function (event, ui) {
        ui.placeholder.css({
          'width': ui.item.css('width'),
          'height': ui.item.css('height'),
        });
      },
    }).disableSelection();
  };

  xbox.init_sortable_repeatable_items = function ($selector) {
    $selector = is_empty($selector) ? $('.xbox-repeatable-wrap.xbox-sortable') : $selector;
    $selector.sortable({
      handle: '.xbox-sort-item',
      items: '.xbox-repeatable-item',
      placeholder: "xbox-repeatable-item xbox-sortable-placeholder",
      start: function (event, ui) {
        ui.placeholder.css({
          'width': ui.item.css('width'),
          'height': ui.item.css('height'),
        });
      },
      update: function (event, ui) {
        // No funciona bien con wp_editor, mejor usamos 'stop'
        // var $repeatable_wrap = $(event.target);
        // $repeatable_wrap.trigger('sort_repeatable_items');
      },
      stop: function (event, ui) {
        var $repeatable_wrap = $(event.target);
        $repeatable_wrap.trigger('sort_repeatable_items');
      }
    }).disableSelection();
  };

  xbox.init_sortable_group_items = function ($selector) {
    $selector = is_empty($selector) ? $('.xbox-group-control.xbox-sortable') : $selector;
    $selector.sortable({
      items: '.xbox-group-control-item',
      placeholder: "xbox-sortable-placeholder",
      start: function (event, ui) {
        ui.placeholder.css({
          'width': ui.item.css('width'),
          'height': ui.item.css('height'),
        });
      },
      update: function (event, ui) {
        var $group_control = $(event.target);
        var $group_wrap = $group_control.next('.xbox-group-wrap');

        var old_index = ui.item.attr('data-index');
        var new_index = $group_control.find('.xbox-group-control-item').index(ui.item);
        var $group_item = $group_wrap.children('.xbox-group-item[data-index=' + old_index + ']');
        var $group_item_reference = $group_wrap.children('.xbox-group-item[data-index=' + new_index + ']');
        var start_index = 0;
        var end_index;

        if (old_index < new_index) {
          $group_item.insertAfter($group_item_reference);
          start_index = old_index;
          end_index = new_index;
        } else {
          $group_item.insertBefore($group_item_reference);
          start_index = new_index;
          end_index = old_index;
        }

        $group_wrap.trigger('xbox_on_sortable_group_item', [old_index, new_index]);

        $group_control.trigger('sort_group_control_items');

        $group_wrap.trigger('sort_group_items', [start_index, end_index]);

        //Click event, to initialize some fields -> (WP Editors)
        if (ui.item.hasClass('xbox-active')) {
          ui.item.trigger('click');
        }
      }
    }).disableSelection();
  };

  xbox.add_repeatable_item = function (event) {
    var $btn = $(this);
    var $repeatable_wrap = $btn.closest('.xbox-repeatable-wrap');
    $repeatable_wrap.trigger('xbox_before_add_repeatable_item');

    var $source_item = $btn.prev('.xbox-repeatable-item');
    var index = parseInt($source_item.data('index'));
    var $cloned = $source_item.clone();
    var $new_item = $('<div />', { 'class': $cloned.attr('class'), 'data-index': index + 1, 'style': 'display: none' });

    xbox.set_changed_values($cloned, $repeatable_wrap.closest('.xbox-row').data('field-type'));

    $new_item.html($cloned.html());
    $source_item.after($new_item);
    $new_item.slideDown(150, function () {
      //Ordenar y cambiar ids y names
      $repeatable_wrap.trigger('sort_repeatable_items');
      //Actualizar eventos
      xbox.reinit_js_plugins($new_item);
    });
    $repeatable_wrap.trigger('xbox_after_add_repeatable_item');
    return false;
  };

  xbox.remove_repeatable_item = function (event) {
    var $repeatable_wrap = $(this).closest('.xbox-repeatable-wrap');
    if ($repeatable_wrap.find('.xbox-repeatable-item').length > 1) {
      $repeatable_wrap.trigger('xbox_before_remove_repeatable_item');
      var $item = $(this).closest('.xbox-repeatable-item');
      $item.slideUp(150, function () {
        $item.remove();
        $repeatable_wrap.trigger('sort_repeatable_items');
        $repeatable_wrap.trigger('xbox_after_remove_repeatable_item');
      });
    }
    return false;
  };

  xbox.sort_repeatable_items = function (event) {
    var $repeatable_wrap = $(event.target);
    var row_level = parseInt($repeatable_wrap.closest('[class*="xbox-row"]').data('row-level'));

    $repeatable_wrap.find('.xbox-repeatable-item').each(function (index, item) {
      xbox.update_attributes($(item), index, row_level);

      //Destroy WP Editors
      $(item).find('.wp-editor-wrap').each(function (index, el) {
        xbox.destroy_wp_editor($(el));
      });
      xbox.update_fields_on_item_active($(item));
    });
  };

  xbox.new_group_item = function (event) {
    if ($(event.currentTarget).hasClass('xbox-duplicate-group-item')) {
      xbox.duplicate = true;
      event.stopPropagation();
    } else {
      xbox.duplicate = false;
    }
    var $group = $(this).closest('.xbox-type-group');
    var $control_item = xbox.add_group_control_item(event, $(this));
    var $group_item = xbox.add_group_item(event, $(this));

    var args = {
      event: event,
      $btn: $(this),
      $group: $group,
      duplicate: xbox.duplicate,
      $group_item: $group_item,
      $control_item: $control_item,
      index: $group_item.data('index'),
      type: $group_item.data('type')
    };

    $group.trigger('xbox_after_add_group_item', [args]);

    //Active new item
    $control_item.trigger('click');

    return false;
  };

  xbox.add_group_control_item = function (event, $btn) {
    var item_type = $btn.data('item-type');
    var $group = $btn.closest('.xbox-type-group');
    var $group_wrap = $group.find('.xbox-group-wrap').first();
    var $group_control = $btn.closest('.xbox-type-group').find('.xbox-group-control').first();
    var $source_item = $group_control.find('.xbox-group-control-item').last();
    var index = -1;
    if ($source_item.length) {
      index = $source_item.data('index');
    }
    $source_item = $group_wrap.next('.xbox-source-item').find('.xbox-group-control-item');

    if (xbox.duplicate) {
      index = $btn.closest('.xbox-group-control-item').index();
      $source_item = $group_control.children('.xbox-group-control-item').eq(index);
      item_type = $source_item.find('.xbox-input-group-item-type').val();
    }
    index = parseInt(index);
    var args = {
      event: event,
      $btn: $btn,
      $group: $group,
      duplicate: xbox.duplicate,
      $group_item: $group_wrap.children('.xbox-group-item').eq(index),
      $control_item: $source_item,
      index: index,
      type: item_type
    };
    $group.trigger('xbox_before_add_group_item', [args]);

    var row_level = parseInt($source_item.closest('.xbox-row').data('row-level'));
    var $cloned = $source_item.clone();
    var $new_item = $('<li />', { 'class': $cloned.attr('class'), 'data-index': index + 1, 'data-type': item_type });

    $new_item.html($cloned.html());
    $source_item.after($new_item);

    //Add new item
    if (index == -1) {
      $group_control.append($new_item);
    } else {
      $group_control.children('.xbox-group-control-item').eq(index).after($new_item);
    }
    $new_item = $group_control.children('.xbox-group-control-item').eq(index + 1);

    $new_item.alterClass('control-item-type-*', 'control-item-type-' + item_type);
    $new_item.find('input.xbox-input-group-item-type').val(item_type);
    $group_control.trigger('sort_group_control_items');

    if (xbox.duplicate === false && $new_item.find('.xbox-control-image').length) {
      $new_item.find('.xbox-control-image').css('background-image', 'url()');
    }
    if (xbox.duplicate === false) {
      var $input = $new_item.find('.xbox-inner input');
      if ($input.length) {
        var value = $group_control.data('control-name').toString();
        $input.attr('value', value.replace(/(#\d?)/g, '#' + (index + 2)));
        if ($btn.hasClass('xbox-custom-add')) {
          $input.attr('value', $btn.text());
        }
      }
    }
    return $new_item;
  };

  xbox.add_group_item = function (event, $btn) {
    var item_type = $btn.data('item-type');
    var $group_wrap = $btn.closest('.xbox-type-group').find('.xbox-group-wrap').first();
    var $source_item = $group_wrap.children('.xbox-group-item').last();
    var index = -1;
    if ($source_item.length) {
      index = $source_item.data('index');
    }
    $source_item = $group_wrap.next('.xbox-source-item').find('.xbox-group-item');

    if (xbox.duplicate) {
      index = $btn.closest('.xbox-group-control-item').index();
      $source_item = $group_wrap.children('.xbox-group-item').eq(index);
      item_type = $btn.closest('.xbox-group-control-item').find('.xbox-input-group-item-type').val();
    }

    index = parseInt(index);
    var row_level = parseInt($source_item.closest('.xbox-row').data('row-level'));
    var $cloned = $source_item.clone();
    var $cooked_item = xbox.cook_group_item($cloned, row_level, index);
    var $new_item = $('<div />', { 'class': $cloned.attr('class'), 'data-index': index + 1, 'data-type': item_type });
    $new_item.html($cooked_item.html());
    //Add new item
    if (index == -1) {
      $group_wrap.append($new_item);
    } else {
      $group_wrap.children('.xbox-group-item').eq(index).after($new_item);
    }
    $new_item = $group_wrap.children('.xbox-group-item').eq(index + 1);
    $new_item.alterClass('group-item-type-*', 'group-item-type-' + item_type);
    $group_wrap.trigger('sort_group_items', [index + 1]);

    //Actualizar eventos
    xbox.reinit_js_plugins($new_item);

    if (xbox.duplicate === false) {
      //xbox.set_default_values( $new_item );//Ya no es necesario por el nuevo source item
    }
    return $new_item;
  };

  xbox.cook_group_item = function ($group_item, row_level, prev_index) {
    var index = prev_index + 1;

    if (xbox.duplicate) {
      xbox.set_changed_values($group_item);
    } else {
      //No es duplicado, restaurar todo, eliminar items de grupos internos
      $group_item.find('.xbox-group-wrap').each(function (index, wrap_group) {
        $(wrap_group).find('.xbox-group-item').first().addClass('xbox-active').siblings().remove();
        $(wrap_group).prev('.xbox-group-control').children('.xbox-group-control-item').first().addClass('xbox-active').siblings().remove();
      });
      $group_item.find('.xbox-repeatable-wrap').each(function (index, wrap_repeat) {
        $(wrap_repeat).find('.xbox-repeatable-item').not(':first').remove();
      });
    }

    xbox.update_attributes($group_item, index, row_level);

    return $group_item;
  };

  xbox.set_changed_values = function ($new_item, field_type) {
    var $textarea, $input;
    $new_item.find('.xbox-field').each(function (iterator, item) {
      var type = field_type || $(item).closest('.xbox-row').data('field-type');
      switch (type) {
        case 'text':
        case 'number':
        case 'oembed':
        case 'file':
        case 'image':
          $input = $(item).find('input.xbox-element');
          $input.attr('value', $input.val());
          break;
      }
    });
  };

  xbox.remove_group_item = function (event) {
    event.preventDefault();
    event.stopPropagation();
    var $btn = $(this);
    var $group_control = $btn.closest('.xbox-group-control');

    // if ( $group_control.children('.xbox-group-control-item').length == 1 ) {
    //   $.xboxConfirm({
    //     title: 'The last item cannot be deleted',
    //     content: 'This is the only item left and cannot be deleted, please add others to delete this one.',
    //     confirm_class: 'xbox-btn-blue',
    //     confirm_text: XBOX_JS.text.popup.accept_button,
    //     hide_cancel: true,
    //   });
    //   return false;
    // }

    $.xboxConfirm({
      title: XBOX_JS.text.remove_item_popup.title,
      content: XBOX_JS.text.remove_item_popup.content,
      confirm_class: 'xbox-btn-blue',
      confirm_text: XBOX_JS.text.popup.accept_button,
      cancel_text: XBOX_JS.text.popup.cancel_button,
      onConfirm: function () {
        setTimeout(function () {
          xbox.remove_group_control_item($btn);
          xbox._remove_group_item($btn);
        }, 150);
      }
    });
    return false;
  };

  xbox.remove_group_control_item = function ($btn) {
    var $group_control = $btn.closest('.xbox-group-control');
    //if ( $group_control.children('.xbox-group-control-item').length > 1 ) {
    var $item = $btn.closest('.xbox-group-control-item');
    $item.fadeOut(200, function () {
      $item.remove();
      $group_control.trigger('sort_group_control_items');
    });
    //}
  };

  xbox._remove_group_item = function ($btn) {
    var $row = $btn.closest('.xbox-type-group');
    var $group_wrap = $row.find('.xbox-group-wrap').first();
    var $group_control = $btn.closest('.xbox-group-control');
    var index = $btn.closest('.xbox-group-control-item').index();
    //if ( $group_wrap.children('.xbox-group-item').length > 1 ) {
    $row.trigger('xbox_before_remove_group_item');
    var $item = $group_wrap.children('.xbox-group-item').eq(index);
    var type = $item.data('type');
    $item.fadeOut(200, function () {
      $item.remove();
      $group_wrap.trigger('sort_group_items', [index]);
      $row.trigger('xbox_after_remove_group_item', [index, type]);
      $group_control.children('.xbox-group-control-item').eq(0).trigger('click');
    });
    //}
  };

  xbox.on_click_group_control_item = function (event) {
    var $control_item = $(this);
    xbox.active_control_item($control_item);
    return false;
  };

  xbox.active_control_item = function ($control_item) {
    var $group_control = $control_item.parent();
    var index = $control_item.index();
    var $group = $group_control.closest('.xbox-type-group');
    var $group_wrap = $group.find('.xbox-group-wrap').first();
    var $group_item = $group_wrap.children('.xbox-group-item').eq(index);

    $group_control.children('.xbox-group-control-item').removeClass('xbox-active');
    $control_item.addClass('xbox-active');

    $group_wrap.children('.xbox-group-item').removeClass('xbox-active');
    $group_item.addClass('xbox-active');

    var args = {
      $group_item: $group_item,
      $control_item: $control_item,
      index: $group_item.data('index'),
      type: $group_item.data('type')
    };

    $group.trigger('xbox_on_active_group_item', [args]);

    xbox.update_fields_on_item_active($group_item);
    return false;
  };

  xbox.update_fields_on_item_active = function ($group_item) {
    //Init WP Editor
    $group_item.find('.wp-editor-wrap.init-wp-editor').each(function (index, el) {
      xbox.init_wp_editor($(el));
    });
  };

  xbox.sort_group_control_items = function (event) {
    var $group_control = $(event.target);
    var row_level = parseInt($group_control.closest('.xbox-row').data('row-level'));
    $group_control.children('.xbox-group-control-item').each(function (index, item) {
      xbox.update_group_control_item($(item), index, row_level);
    });
  };

  xbox.sort_group_items = function (event, start_index, end_index) {
    var $group_wrap = $(event.target);
    $group_wrap.trigger('xbox_before_sort_group');
    var row_level = parseInt($group_wrap.closest('.xbox-row').data('row-level'));
    end_index = end_index !== undefined ? parseInt(end_index) + 1 : undefined;

    var $items = $group_wrap.children('.xbox-group-item');
    var $items_to_sort = $items.slice(start_index, end_index);

    $items_to_sort.each(function (i, group_item) {
      var index = $group_wrap.find($(group_item)).index();
      xbox.update_attributes($(group_item), index, row_level);

      //Destroy WP Editors
      $(group_item).find('.wp-editor-wrap').each(function (index, el) {
        xbox.destroy_wp_editor($(el));
      });
    });
    $group_wrap.trigger('xbox_after_sort_group');
  };

  xbox.update_group_control_item = function ($item, index, row_level) {
    $item.data('index', index).attr('data-index', index);
    $item.find('.xbox-info-order-item').text('#' + (index + 1));
    var value;
    if ($item.find('.xbox-inner input').length) {
      value = $item.find('.xbox-inner input').val();
      $item.find('.xbox-inner input').val(value.replace(/(#\d+)/g, '#' + (index + 1)));
    }

    //Cambiar names
    $item.find('*[name]').each(function (i, item) {
      xbox.update_name_ttribute($(item), index, row_level);
    });
  };

  xbox.update_attributes = function ($new_item, index, row_level) {
    $new_item.data('index', index).attr('data-index', index);

    $new_item.find('*[name]').each(function (i, item) {
      xbox.update_name_ttribute($(item), index, row_level);
    });

    $new_item.find('*[id]').each(function (i, item) {
      xbox.update_id_attribute($(item), index, row_level);
    });

    $new_item.find('label[for]').each(function (i, item) {
      xbox.update_for_attribute($(item), index, row_level);
    });

    $new_item.find('*[data-field-name]').each(function (i, item) {
      xbox.update_data_name_attribute($(item), index, row_level);
    });

    $new_item.find('*[data-editor]').each(function (i, item) {
      xbox.update_data_editor_attribute($(item), index, row_level);
    });

    $new_item.find('*[data-wp-editor-id]').each(function (i, item) {
      xbox.update_data_wp_editor_id_attribute($(item), index, row_level);
    });

    xbox.set_checked_inputs($new_item, row_level);
  };

  xbox.set_checked_inputs = function ($group_item, row_level) {
    $group_item.find('.xbox-field').each(function (iterator, item) {
      if ($(item).hasClass('xbox-has-icheck') || $(item).closest('.xbox-type-image_selector').length) {
        var $input = $(item).find('input[type="radio"], input[type="checkbox"]');
        $input.each(function (i, input) {
          if ($(input).parent('div').hasClass('checked')) {
            $(input).attr('checked', 'checked').prop('checked', true);
          } else {
            $(input).removeAttr('checked').prop('checked', false);
          }
          if ($(input).next('img').hasClass('xbox-active')) {
            $(input).attr('checked', 'checked').prop('checked', true);
          }
        });
      }
    });
  };

  xbox.update_name_ttribute = function ($el, index, row_level) {
    var old_name = $el.attr('name');
    var new_name = '';
    if (typeof old_name !== 'undefined') {
      new_name = xbox.nice_replace(/(\[\d+\])/g, old_name, '[' + index + ']', row_level);
      $el.attr('name', new_name);
    }
  };

  xbox.update_id_attribute = function ($el, index, row_level) {
    var old_id = $el.attr('id');
    var new_id = '';
    if (typeof old_id !== 'undefined') {
      new_id = xbox.nice_replace(/(__\d+__)/g, old_id, '__' + index + '__', row_level);
      $el.attr('id', new_id);
    }
  };

  xbox.update_for_attribute = function ($el, index, row_level) {
    var old_for = $el.attr('for');
    var new_for = '';
    if (typeof old_for !== 'undefined') {
      new_for = xbox.nice_replace(/(__\d+__)/g, old_for, '__' + index + '__', row_level);
      $el.attr('for', new_for);
    }
  };
  xbox.update_data_name_attribute = function ($el, index, row_level) {
    var old_data = $el.attr('data-field-name');
    var new_data = '';
    if (typeof old_data !== 'undefined') {
      new_data = xbox.nice_replace(/(\[\d+\])/g, old_data, '[' + index + ']', row_level);
      $el.attr('data-field-name', new_data);
    }
  };

  xbox.update_data_editor_attribute = function ($el, index, row_level) {
    var old_data = $el.attr('data-editor');
    var new_data = '';
    if (typeof old_data !== 'undefined') {
      new_data = xbox.nice_replace(/(__\d+__)/g, old_data, '__' + index + '__', row_level);
      $el.attr('data-editor', new_data);
    }
  };
  xbox.update_data_wp_editor_id_attribute = function ($el, index, row_level) {
    var old_data = $el.attr('data-wp-editor-id');
    var new_data = '';
    if (typeof old_data !== 'undefined') {
      new_data = xbox.nice_replace(/(__\d+__)/g, old_data, '__' + index + '__', row_level);
      $el.attr('data-wp-editor-id', new_data);
    }
  };

  xbox.set_default_values = function ($group) {
    $group.find('*[data-default]').each(function (iterator, item) {
      var $field = $(item);
      var default_value = $field.data('default');
      if ($field.closest('.xbox-type-number').length) {
        xbox.set_field_value($field, default_value);
      } else {
        xbox.set_field_value($field, default_value);
      }
    });
  };

  xbox.set_field_value = function ($field, value, extra_value, update_data_value) {
    if( !$field.length ){
      return;
    }
    var $input, array;
    var type = $field.closest('.xbox-row').data('field-type');
    value = is_empty(value) ? '' : value;
    update_data_value = update_data_value || false;

    switch (type) {
      case 'number':
        var $input = $field.find('input.xbox-element');
        if (value == $input.val()) {
          return;
        }
        $input.attr('value', value);
        var unit = extra_value === undefined ? $input.data('default-unit') : extra_value;
        $field.find('input.xbox-unit-number').attr('value', unit).trigger('change');
        unit = unit || '#';
        $field.find('.xbox-unit span').text(unit);
        // if (update_data_value) {
        //   $input.attr('data-value', value);
        // }
        break;

      case 'text':
      case 'hidden':
      case 'colorpicker':
      case 'date':
      case 'time':
        var $input = $field.find('input.xbox-element');
        if (value == $input.val()) {
          return;
        }
        $input.attr('value', value).trigger('change').trigger('input');
        if (type == 'colorpicker') {
          $field.find('.xbox-colorpicker-color').attr('value', value).css('background-color', value);
        }
        // if (update_data_value) {
        //   $input.attr('data-value', value);
        // }
        break;

      case 'file':
      case 'oembed':
        var $input = $field.find('input.xbox-element');
        $input.attr('value', value).trigger('change').trigger('input');
        $field.find('.xbox-wrap-preview').html('');
        // if (update_data_value) {
        //   $input.attr('data-value', value);
        // }
        break;

      case 'image':
        $field.find('input.xbox-element').attr('value', value);
        $field.find('img.xbox-element-image').attr('src', value);
        if (is_empty(value)) {
          $field.find('img.xbox-element-image').hide().next('.xbox-remove-preview').hide();
        }
        break;

      case 'select':
        var $dropdown = $field.find('.ui.selection.dropdown');
        var max_selections = parseInt($dropdown.data('max-selections'));
        $dropdown.dropdownXbox('clear');
        if (max_selections > 1 && $dropdown.hasClass('multiple')) {
          $dropdown.dropdownXbox('set selected', value.split(','));
        } else {
          $dropdown.dropdownXbox('set selected', value);
        }
        // if (update_data_value) {
        //   $field.find('.xbox-element input[type="hidden"]').attr('data-value', value);
        // }
        break;

      case 'switcher':
        $input = $field.find('input');
        if ($input.val() !== value) {
          if ($input.next().hasClass('xbox-sw-on')) {
            $input.xboxSwitcher('set_off');
          } else {
            $input.xboxSwitcher('set_on');
          }
        }
        // if (update_data_value) {
        //   $field.find('input.xbox-element').attr('data-value', value);
        // }
        break;

      case 'wp_editor':
        var $textarea = $field.find('textarea.wp-editor-area');
        $textarea.val(value);
        var wp_editor = tinymce.get($textarea.attr('id'));
        if (wp_editor) {
          wp_editor.setContent(value);
        }
        break;

      case 'textarea':
        $field.find('textarea').val(value).trigger('input');
        break;

      case 'code_editor':
        $field.find('textarea.xbox-element').text(value);
        var editor = ace.edit($field.find('.xbox-code-editor').attr('id'));
        editor.setValue(value);
        break;

      case 'icon_selector':
        $field.find('input.xbox-element').attr('value', value).trigger('change');
        var html = '';
        if (value.indexOf('.svg') > -1) {
          html = '<img src="' + value + '">';
        } else {
          html = '<i class="' + value + '"></i>';
        }
        $field.find('.xbox-icon-active').html(html);
        break;

      case 'image_selector':
        value = value.toString().toLowerCase();
        $input = $field.find('input');

        if (!$input.closest('.xbox-image-selector').data('image-selector').like_checkbox) {
          if (is_empty($input.filter(':checked').val())) {
            return;
          }
          if ($input.filter(':checked').val().toLowerCase() != value) {
            $input.filter(function (i) {
              return $(this).val().toLowerCase() == value;
            }).trigger('click.img_selector');
          }
        } else {
          if (get_value_checkbox($input, ',').toLowerCase() != value) {
            $input.first().trigger('img_selector_disable_all');
            array = value.replace(/ /g, '').split(',');
            $.each(array, function (index) {
              $input.filter(function (i) {
                return $(this).val().toLowerCase() == array[index];
              }).trigger('click.img_selector');
            });
          }
        }
        break;

      case 'checkbox':
      case 'radio':
        value = value.toString().toLowerCase();
        if ($field.hasClass('xbox-has-icheck') && $field.find('.init-icheck').length) {
          $input = $field.find('input');
          if (type == 'radio') {
            if (is_empty($input.filter(':checked').val())) {
              return;
            }
            $input.iCheck('uncheck');
            //if( $input.filter(':checked').val().toLowerCase() != value ){
            $input.filter(function (i) {
              return $(this).val().toLowerCase() == value;
            }).iCheck('check');
            //}
          } else if (type == 'checkbox') {
            if (get_value_checkbox($input, ',').toLowerCase() != value) {
              $input.iCheck('uncheck');
              array = value.replace(/ /g, '').split(',');
              $.each(array, function (index) {
                $input.filter(function (i) {
                  return $(this).val().toLowerCase() == array[index];
                }).iCheck('check');
              });
            }
          }
        }
        break;
    }
  };

  xbox.nice_replace = function (regex, string, replace_with, row_level, offset) {
    offset = offset || 0;
    //http://stackoverflow.com/questions/10584748/find-and-replace-nth-occurrence-of-bracketed-expression-in-string
    var n = 0;
    string = string.replace(regex, function (match, i, original) {
      n++;
      return (n === row_level + offset) ? replace_with : match;
    });
    return string;
  };

  xbox.get_object_id = function () {
    return $('.xbox').data('object-id');
  };

  xbox.get_object_type = function () {
    return $('.xbox').data('object-type');
  };

  xbox.get_group_object_values = function ($group_item) {
    var values = $group_item.find('input[name],select[name],textarea[name]').serializeArray();
    return values;
  };

  xbox.get_group_values = function ($group_item) {
    var object_values = xbox.get_group_object_values($group_item);
    var values = {};
    $.each(object_values, function (index, field) {
      values[field.name] = field.value;
    });
    return values;
  };

  xbox.compare_values_by_operator = function (value1, operator, value2) {
    switch (operator) {
      case '<':
        return value1 < value2;
      case '<=':
        return value1 <= value2;
      case '>':
        return value1 > value2;
      case '>=':
        return value1 >= value2;
      case '==':
      case '=':
        return value1 == value2;
      case '!=':
        return value1 != value2;
      default:
        return false;
    }
    return false;
  };

  xbox.add_style_attribute = function ($element, new_style) {
    var old_style = $element.attr('style') || '';
    $element.attr('style', old_style + '; ' + new_style);
  };

  xbox.is_image_file = function (value) {
    value = $.trim(value.toString());
    return (value.match(/\.(jpeg|jpg|gif|png)$/) !== null);
  };


  //Funciones privadas
  function is_empty(value) {
    return (value === undefined || value === false || $.trim(value).length === 0);
  }

  function get_class_starts_with($elment, starts_with) {
    return $.grep($elment.attr('class').split(" "), function (v, i) {
      return v.indexOf(starts_with) === 0;
    }).join();
  }

  function get_value_checkbox($elment, separator) {
    separator = separator || ',';
    if ($elment.attr('type') != 'checkbox') {
      return '';
    }
    var value = $elment.filter(':checked').map(function () {
      return this.value;
    }).get().join(separator);
    return value;
  }

  function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window)) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    return { width: e[a + 'Width'], height: e[a + 'Height'] };
  }


  //Debug
  function c(msg) {
    console.log(msg);
  }

  //Document Ready
  $(function () {
    xbox.init();
  });

  return xbox;

})(window, document, jQuery);


/**
 * jQuery alterClass plugin
 *
 * Remove element classes with wildcard matching. Optionally add classes:
 *   $( '#foo' ).alterClass( 'foo-* bar-*', 'foobar' )
 *
 * Copyright (c) 2011 Pete Boere (the-echoplex.net)
 * Free under terms of the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 */
(function ($) {
  $.fn.alterClass = function (removals, additions) {
    var self = this;
    if (removals.indexOf('*') === -1) {
      // Use native jQuery methods if there is no wildcard matching
      self.removeClass(removals);
      return !additions ? self : self.addClass(additions);
    }
    var patt = new RegExp('\\s' +
      removals.replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join('\\s|\\s') +
      '\\s', 'g');
    self.each(function (i, it) {
      var cn = ' ' + it.className + ' ';
      while (patt.test(cn)) {
        cn = cn.replace(patt, ' ');
      }
      it.className = $.trim(cn);
    });
    return !additions ? self : self.addClass(additions);
  };
})(jQuery);

;
XBOX.events = (function (window, document, $) {
  'use strict';
  var xbox_events = {};
  var xbox;

  xbox_events.init = function () {
    var $xbox = $('.xbox');

    xbox_events.on_change_colorpicker($xbox);

    xbox_events.on_change_code_editor($xbox);

    xbox_events.on_change_file($xbox);

    xbox_events.on_change_image_selector($xbox);

    xbox_events.on_change_icon_selector($xbox);

    xbox_events.on_change_number($xbox);

    xbox_events.on_change_oembed($xbox);

    xbox_events.on_change_radio($xbox);

    xbox_events.on_change_checkbox($xbox);

    xbox_events.on_change_switcher($xbox);

    xbox_events.on_change_select($xbox);

    xbox_events.on_change_text($xbox);

    xbox_events.on_change_date($xbox);

    xbox_events.on_change_time($xbox);

    xbox_events.on_change_textarea($xbox);

    xbox_events.on_change_wp_editor($xbox);

  };

  xbox_events.on_change_colorpicker = function ($xbox) {
    $xbox.on('change', '.xbox-type-colorpicker .xbox-element', function () {
      $(this).trigger('xbox_changed_value', $(this).val());
      xbox_events.show_hide_row($(this), $(this).val(), 'colorpicker');
    });
  };

  xbox_events.on_change_code_editor = function ($xbox) {
    $xbox.find('.xbox-code-editor').each(function (index, el) {
      var editor = ace.edit($(el).attr('id'));
      editor.getSession().on('change', function (e) {
        $(el).trigger('xbox_changed_value', editor.getValue());
        xbox_events.show_hide_row($(el), editor.getValue(), 'code_editor');
      });
    });
  };

  xbox_events.on_change_file = function ($xbox) {
    $xbox.on('change', '.xbox-type-file .xbox-element', function () {
      var value = $(this).val();
      $(this).trigger('xbox_changed_value', value);
      xbox_events.show_hide_row($(this), value, 'file');

      if (xbox.is_image_file(value)) {
        var $wrap_preview = $(this).closest('.xbox-field').find('.xbox-wrap-preview').first();
        var preview_size = $wrap_preview.data('preview-size');
        var item_body;
        var obj = {
          url: value,
        };
        var $new_item = $('<li />', { 'class': 'xbox-preview-item xbox-preview-file' });
        $new_item.addClass('xbox-preview-image');
        item_body = '<img src="' + obj.url + '" style="width: ' + preview_size.width + '; height: ' + preview_size.height + '" data-full-img="' + obj.url + '" class="xbox-image xbox-preview-handler">';
        $new_item.html(item_body + '<a class="xbox-btn xbox-btn-iconize xbox-btn-small xbox-btn-red xbox-remove-preview"><i class="xbox-icon xbox-icon-times-circle"></i></a>');
        $wrap_preview.html($new_item);
      }
    });
    $xbox.on('xbox_after_add_files', '.xbox-type-file .xbox-field', function (e, selected_files, media) {
      var value;
      if (!media.multiple) {
        $(selected_files).each(function (index, obj) {
          value = obj.url;
        });
      } else {
        value = [];
        $(selected_files).each(function (index, obj) {
          value.push(obj.url);
        });
      }
      $(this).find('.xbox-element').trigger('xbox_changed_value', [value]);
      xbox_events.show_hide_row($(this), [value], 'file');
    });
  };

  xbox_events.on_change_image_selector = function ($xbox) {
    $xbox.on('imgSelectorChanged', '.xbox-type-image_selector .xbox-element', function () {
      if ($(this).closest('.xbox-image-selector').data('image-selector').like_checkbox) {
        var value = [];
        $(this).closest('.xbox-radiochecks').find('input[type=checkbox]:checked').each(function (index, el) {
          value.push($(this).val());
        });
        $(this).trigger('xbox_changed_value', [value]);
        xbox_events.show_hide_row($(this), [value], 'image_selector');
      } else {
        $(this).trigger('xbox_changed_value', $(this).val());
        xbox_events.show_hide_row($(this), $(this).val(), 'image_selector');
      }
    });
  };

  xbox_events.on_change_icon_selector = function ($xbox) {
    $xbox.on('change', '.xbox-type-icon_selector .xbox-element', function () {
      $(this).trigger('xbox_changed_value', $(this).val());
      xbox_events.show_hide_row($(this), $(this).val(), 'icon_selector');
    });
  };

  xbox_events.on_change_number = function ($xbox) {
    $xbox.on('change', '.xbox-type-number .xbox-unit-number', function () {
      $(this).closest('.xbox-field').find('.xbox-element').trigger('input');
    });
    $xbox.on('input', '.xbox-type-number .xbox-element', function () {
      $(this).trigger('xbox_changed_value', $(this).val());
      xbox_events.show_hide_row($(this), $(this).val(), 'number');
    });
    $xbox.on('change', '.xbox-type-number .xbox-element', function () {
      var value = $(this).val();
      var arr = ['auto', 'initial', 'inherit'];
      if ($.inArray(value, arr) < 0) {
        value = value.toString().replace(/[^0-9.\-]/g, '');
      }
      var $field = $(this).closest('.xbox-field');
      xbox.set_field_value($field, value, $field.find('input.xbox-unit-number').val());
      $(this).trigger('xbox_changed_value', value);
      xbox_events.show_hide_row($(this), value, 'number');
    });
  };

  xbox_events.on_change_oembed = function ($xbox) {
    $xbox.on('change', '.xbox-type-oembed .xbox-element', function () {
      $(this).trigger('xbox_changed_value', $(this).val());
      xbox_events.show_hide_row($(this), $(this).val(), 'oembed');
    });
  };

  xbox_events.on_change_radio = function ($xbox) {
    $xbox.on('ifChecked', '.xbox-type-radio .xbox-element', function () {
      $(this).trigger('xbox_changed_value', $(this).val());
      xbox_events.show_hide_row($(this), $(this).val(), 'radio');
    });
  };

  xbox_events.on_change_checkbox = function ($xbox) {
    $xbox.on('ifChanged', '.xbox-type-checkbox .xbox-element', function () {
      var value = [];
      $(this).closest('.xbox-radiochecks').find('input[type=checkbox]:checked').each(function (index, el) {
        value.push($(this).val());
      });
      $(this).trigger('xbox_changed_value', [value]);
      xbox_events.show_hide_row($(this), [value], 'checkbox');
    });
  };

  xbox_events.on_change_switcher = function ($xbox) {
    $xbox.on('statusChange', '.xbox-type-switcher .xbox-element', function () {
      $(this).trigger('xbox_changed_value', $(this).val());
      xbox_events.show_hide_row($(this), $(this).val(), 'switcher');
    });
  };

  xbox_events.on_change_select = function ($xbox) {
    $xbox.on('change', '.xbox-type-select .xbox-element', function (event) {
      var value = $(this).find('input[type="hidden"]').val();
      $(this).trigger('xbox_changed_value', value);
      xbox_events.show_hide_row($(this), value, 'select');
    });
  };

  xbox_events.on_change_text = function ($xbox) {
    $xbox.on('input', '.xbox-type-text .xbox-element', function () {
      $(this).trigger('xbox_changed_value', $(this).val());
      xbox_events.show_hide_row($(this), $(this).val(), 'text');

      var $helper = $(this).next('.xbox-field-helper');
      if ($helper.length && $(this).closest('.xbox-helper-maxlength').length && $(this).attr('maxlength')) {
        $helper.text($(this).val().length + '/' + $(this).attr('maxlength'));
      }
    });
  };

  xbox_events.on_change_date = function ($xbox) {
    $xbox.on('change', '.xbox-type-date .xbox-element', function () {
      $(this).trigger('xbox_changed_value', $(this).val());
      xbox_events.show_hide_row($(this), $(this).val(), 'date');
    });
  };

  xbox_events.on_change_time = function ($xbox) {
    $xbox.on('change', '.xbox-type-time .xbox-element', function () {
      $(this).trigger('xbox_changed_value', $(this).val());
      xbox_events.show_hide_row($(this), $(this).val(), 'time');
    });
  };

  xbox_events.on_change_textarea = function ($xbox) {
    $xbox.on('input', '.xbox-type-textarea .xbox-element', function () {
      $(this).text($(this).val());
      $(this).trigger('xbox_changed_value', $(this).val());
      xbox_events.show_hide_row($(this), $(this).val(), 'textarea');
    });
  };

  xbox_events.on_change_wp_editor = function ($xbox) {
    var $wp_editors = $xbox.find('.xbox-type-wp_editor textarea.wp-editor-area');
    $xbox.on('input', '.xbox-type-wp_editor textarea.wp-editor-area', function () {
      $(this).trigger('xbox_changed_value', $(this).val());
      xbox_events.show_hide_row($(this), $(this).val(), 'wp_editor');
    });
    if (typeof tinymce === 'undefined') {
      return;
    }
    setTimeout(function () {
      $wp_editors.each(function (index, el) {
        var ed_id = $(el).attr('id');
        var wp_editor = tinymce.get(ed_id);
        if (wp_editor) {
          wp_editor.on('change input', function (e) {
            var value = wp_editor.getContent();
            $(el).trigger('xbox_changed_value', wp_editor.getContent());
            xbox_events.show_hide_row($(el), wp_editor.getContent(), 'wp_editor');
          });
        }
      });
    }, 1000);
  };

  xbox_events.show_hide_row = function ($el, field_value, type) {
    var prefix = $el.closest('.xbox').data('prefix');
    var $row_changed = $el.closest('.xbox-row');
    var value = '';
    var operator = '==';
    var $rows = $row_changed.siblings('.xbox-row');
    var $group_item = $row_changed.closest('.xbox-group-item');
    if ($group_item.length) {
      $rows = $group_item.find('.xbox-row');
    } else {
      $rows.each(function (index, el) {
        if ($(el).data('field-type') == 'mixed') {
          $(el).find('.xbox-row').each(function (i, mixed_row) {
            $rows.push($(mixed_row)[0]);
          });
        }
      });
    }

    $rows.each(function (index, el) {
      var $row = $(el);
      var data_show_hide = $row.data('show-hide');
      var show_if = data_show_hide.show_if;
      var hide_if = data_show_hide.hide_if;
      var show = true;
      var hide = false;
      var check_show = true;
      var check_hide = true;

      if (is_empty(show_if) || is_empty(show_if[0])) {
        check_show = false;
      }
      if (is_empty(hide_if) || is_empty(hide_if[0])) {
        check_hide = false;
      }

      //Si el campo donde se originó el cambio no afecta al campo actual, no hacer nada
      if ($row.is($row_changed) || $row_changed.data('field-id') != prefix + show_if[0]) {
        return true;
      }


      if (check_show) {
        if ($.isArray(show_if[0])) {

        } else {
          if (show_if.length == 2) {
            value = show_if[1];
          } else if (show_if.length == 3) {
            value = show_if[2];
            operator = !is_empty(show_if[1]) ? show_if[1] : operator;
            operator = operator == '=' ? '==' : operator;
          }
          if ($.inArray(operator, ['==', '!=', '>', '>=', '<', '<=']) > -1) {
            show = xbox.compare_values_by_operator(field_value, operator, value);
          } else if ($.inArray(operator, ['in', 'not in']) > -1) {
            if (!is_empty(value) && $.isArray(value)) {
              show = operator == 'in' ? $.inArray(field_value, value) > -1 : $.inArray(field_value, value) == -1;
            }
          }
        }

      }

      if (check_hide) {
        if ($.isArray(hide_if[0])) {

        } else {
          if (hide_if.length == 2) {
            value = hide_if[1];
          } else if (hide_if.length == 3) {
            value = hide_if[2];
            operator = !is_empty(hide_if[1]) ? hide_if[1] : operator;
            operator = operator == '=' ? '==' : operator;
          }
          if ($.inArray(operator, ['==', '!=', '>', '>=', '<', '<=']) > -1) {
            hide = xbox.compare_values_by_operator(field_value, operator, value);
          } else if ($.inArray(operator, ['in', 'not in']) > -1) {
            if (!is_empty(value) && $.isArray(value)) {
              hide = operator == 'in' ? $.inArray(field_value, value) > -1 : $.inArray(field_value, value) == -1;
            }
          }
        }
      }

      if (check_show) {
        if (check_hide) {
          if (show) {
            if (hide) {
              xbox_events.hide_row($row);
            } else {
              xbox_events.show_row($row);
            }
          } else {
            xbox_events.hide_row($row);
          }
        } else {
          if (show) {
            xbox_events.show_row($row);
          } else {
            xbox_events.hide_row($row);
          }
        }
      }

      if (check_hide) {
        if (hide) {
          xbox_events.hide_row($row);
        } else if (check_show) {
          if (show) {
            xbox_events.show_row($row);
          } else {
            xbox_events.hide_row($row);
          }
        } else {
          xbox_events.show_row($row);
        }
        // if( check_show ){
        // 	if( hide ){
        // 		xbox_events.hide_row($row);
        // 	} else {
        // 		if( show ){
        // 			xbox_events.show_row($row);
        // 		} else {
        // 			xbox_events.hide_row($row);
        // 		}
        // 	}
        // } else {
        // 	if( hide ){
        // 		xbox_events.hide_row($row);
        // 	} else {
        // 		xbox_events.show_row($row);
        // 	}
        // }
      }
    });
  };

  xbox_events.show_row = function ($row) {
    var data_show_hide = $row.data('show-hide');
    var delay = parseInt(data_show_hide.delay);
    if (data_show_hide.effect == 'slide') {
      $row.slideDown(delay, function () {
        if ($row.hasClass('xbox-row-mixed')) {
          $row.css('display', 'inline-block');
        }
      });
    } else if (data_show_hide.effect == 'fade') {
      $row.fadeIn(delay, function () {
        if ($row.hasClass('xbox-row-mixed')) {
          $row.css('display', 'inline-block');
        }
      });
    } else {
      $row.show();
      if ($row.hasClass('xbox-row-mixed')) {
        $row.css('display', 'inline-block');
      }
    }
  };
  xbox_events.hide_row = function ($row) {
    var data_show_hide = $row.data('show-hide');
    var delay = parseInt(data_show_hide.delay);
    if (data_show_hide.effect == 'slide') {
      $row.slideUp(delay, function () {
      });
    } else if (data_show_hide.effect == 'fade') {
      $row.fadeOut(delay, function () {
      });
    } else {
      $row.hide();
    }
  };

  function is_empty(value) {
    return (value === undefined || value === false || $.trim(value).length === 0);
  }

  //Debug
  function c(msg) {
    console.log(msg);
  }

  function cc(msg, msg2) {
    console.log(msg, msg2);
  }

  //Document Ready
  $(function () {
    xbox = window.XBOX;
    xbox_events.init();
  });

  return xbox_events;

})(window, document, jQuery);


//Events when you change some value of any field.
/*jQuery(document).ready(function($) {
	$('.xbox-type-colorpicker .xbox-element').on('xbox_changed_value', function( event, value ){
		console.log( 'colorpicker changed:' );
		console.log( value );
	});

	$('.xbox-code-editor').on('xbox_changed_value', function( event, value ){
		console.log( 'code_editor changed:' );
		console.log( value );
	});

	$('.xbox-type-file .xbox-element').on('xbox_changed_value', function( event, value ){
		console.log( 'file changed:' );
		console.log( value );
	});

	$('.xbox-type-image_selector .xbox-element').on('xbox_changed_value', function( event, value ){
		console.log( 'image_selector changed:' );
		console.log( value );
	});

	$('.xbox-type-number .xbox-element').on('xbox_changed_value', function( event, value ){
		console.log( 'number changed:' );
		console.log( value );
	});

	$('.xbox-type-oembed .xbox-element').on('xbox_changed_value', function( event, value ){
		console.log( 'oembed changed:' );
		console.log( value );
	});

	$('.xbox-type-radio .xbox-element').on('xbox_changed_value', function( event, value ){
		console.log( 'radio changed:' );
		console.log( value );
	});

	$('.xbox-type-checkbox .xbox-element').on('xbox_changed_value', function( event, value ){
		console.log( 'checkbox changed:' );
		console.log( value );
	});

	$('.xbox-type-switcher .xbox-element').on('xbox_changed_value', function( event, value ){
		console.log( 'switcher:' );
		console.log( value );
	});

	$('.xbox-type-select .xbox-element').on('xbox_changed_value', function( event, value ){
		console.log( 'select:' );
		console.log( value );
	});

	$('.xbox-type-text .xbox-element').on('xbox_changed_value', function( event, value ){
		console.log( 'Texto:' );
		console.log( value );
	});

	$('.xbox-type-textarea .xbox-element').on('xbox_changed_value', function( event, value ){
		console.log( 'textarea:' );
		console.log( value );
	});

	$('.xbox-type-wp_editor .wp-editor-area').on('xbox_changed_value', function( event, value ){
		console.log( 'wp_editor:' );
		console.log( value );
	});

	$xbox.on('xbox_on_init_wp_editor', function (e, wp_editor, args) {
    //After Init
    console.log('xbox_on_init_wp_editor', wp_editor);
    wp_editor.on('click', function (e) {
      console.log('Editor was clicked');
    });
    //Enable "Right to Left" button
    if (wp_editor.controlManager.buttons.rtl) {//Check if "Right to Left" exists
      wp_editor.controlManager.buttons.rtl.$el.trigger('click');
    }
  });

  $xbox.on('xbox_on_setup_wp_editor', function (e, wp_editor) {
    //Before Init
    console.log('xbox_on_setup_wp_editor', wp_editor);

    //Add your buttons
    wp_editor.settings.toolbar3 = 'fontselect | media, image';
  });

});*/


