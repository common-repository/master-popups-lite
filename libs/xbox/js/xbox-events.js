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
      var $input = $(this);
      var value = $input.val();
      xbox.update_prev_values($(this), value);

      $(this).trigger('xbox_changed_value', value);
      xbox_events.show_hide_row($(this), value, 'colorpicker');
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
      var validValue = value;
      var arr = ['auto', 'initial', 'inherit'];
      if ($.inArray(value, arr) < 0) {
        validValue = value.toString().replace(/[^0-9.\-]/g, '');
      }
      //Validate values
      if( value != validValue ){
        value = validValue;
        var $field = $(this).closest('.xbox-field');
        xbox.set_field_value($field, value, $field.find('input.xbox-unit-number').val());
      }
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
      var $input = $(this).find('input[type="hidden"]');
      var value = $input.val();
      xbox.update_prev_values($input, value);
      $(this).trigger('xbox_changed_value', value);
      xbox_events.show_hide_row($(this), value, 'select');
    });
  };

  xbox_events.on_change_text = function ($xbox) {
    $xbox.on('input', '.xbox-type-text .xbox-element', function () {
      var $input = $(this);
      var value = $input.val();
      xbox.update_prev_values($input, value);
      $input.trigger('xbox_changed_value', value);
      xbox_events.show_hide_row($input, value, 'text');

      var $helper = $input.next('.xbox-field-helper');
      if ($helper.length && $input.closest('.xbox-helper-maxlength').length && $input.attr('maxlength')) {
        $helper.text($input.val().length + '/' + $input.attr('maxlength'));
      }
    });
  };

  xbox_events.on_change_date = function ($xbox) {
    $xbox.on('change', '.xbox-type-date .xbox-element', function () {
      var $input = $(this);
      var value = $input.val();
      xbox.update_prev_values($input, value);
      $input.trigger('xbox_changed_value', value);
      xbox_events.show_hide_row($input, value, 'date');
    });
  };

  xbox_events.on_change_time = function ($xbox) {
    $xbox.on('change', '.xbox-type-time .xbox-element', function () {
      var $input = $(this);
      var value = $input.val();
      xbox.update_prev_values($input, value);
      $input.trigger('xbox_changed_value', value);
      xbox_events.show_hide_row($input, value, 'time');
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


