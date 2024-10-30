(function (document, window, $) {
  "use strict";
  var MPP = window.AdminMasterPopup;

  function Plugin(el, options) {
    var _ = this;
    _.$canvas_wrap = $(el);
    _.$canvas = _.$canvas_wrap.find('#mc');
    _.$canvas_viewport = _.$canvas_wrap.find('#mc-viewport');
    _.$canvas_device = _.$canvas_wrap.find('#mc-device');
    _.$axis_x = _.$canvas_wrap.find('#mc-x-rule');
    _.$axis_y = _.$canvas_wrap.find('#mc-y-rule');
    _.$frame = _.$canvas_wrap.find('.ampp-popup');
    _.$settings = _.$canvas.find('#mc-settings');
    _.$types = _.$canvas.find('#mc-types');
    _.defaults = {
      app: null,
      xbox: null,
      canvasResizable: '#mc-resizable-handler',
      canvasDeviceResizable: '#mc-device-resizable-handler',
    };
    _.options = $.extend(true, {}, _.defaults, options, _.$canvas_wrap.data('options'));
    _.$canvas_wrap.data('options', _.options);
    _.axis_x_left = 1500;//class-mc-editor.php build_rule(): for(-15 <-> 30)
    _.axis_y_top = 500;//class-mc-editor.php build_rule(): for(-5 <-> 10)

    _.init();
  }

  Plugin.prototype = {
    init: function () {
      var _ = this;
      _.build();
      _.set_initial_styles();
      _.set_resizable_canvas();
      _.events();

      $('#mc-settings input[type="radio"], #mc-settings input[type="checkbox"]').iCheck({
        checkboxClass: 'icheckbox_polaris',
        radioClass: 'iradio_polaris',
        increaseArea: '-18%'
      });
    },

    build: function () {
      var _ = this;
      //Info de las reglas
      _.$canvas.append('<div id="mc-x-rule-guide" class="mc-y-guide"><span>0</span></div>');
      _.$canvas.append('<div id="mc-y-rule-guide" class="mc-x-guide"><span>0</span></div>');

      //Guías
      _.$canvas_viewport.append('<div class="mc-x-guide mc-frame-x-guide mc-frame-top-guide"></div>');
      _.$canvas_viewport.append('<div class="mc-x-guide mc-frame-x-guide mc-frame-bottom-guide"></div>');
      _.$canvas_viewport.append('<div class="mc-y-guide mc-frame-y-guide mc-frame-left-guide"></div>');
      _.$canvas_viewport.append('<div class="mc-y-guide mc-frame-y-guide mc-frame-right-guide"></div>');

    },

    set_initial_styles: function () {
      var _ = this;
      if ($('body').hasClass('post-new-php')) {
        return;
      }
      var frame_info = _.get_frame_info();
      var canvas_device_height = _.$canvas_device.outerHeight();
      //$canvas-viewport-height: $canvas-device-height + ($canvas-resizable-height + 2px) + ($canvas-device-margin-vertical * 2);
      var canvas_viewport_height = canvas_device_height + ($(_.options.canvasResizable).outerHeight() + 2) + (frame_info.margin_top * 2)
      _.$canvas_viewport.css('height', canvas_viewport_height);
      //$canvas-height: $canvas-viewport-height + $axis-x-height;
      var canvas_height = canvas_viewport_height + _.$axis_x.outerHeight();
      _.$canvas.css('height', canvas_height);
    },

    set_resizable_canvas: function () {
      var _ = this;
      _.$canvas.resizable({
        minHeight: 280,
        maxHeight: 1000,
        handles: { 's': _.options.canvasResizable },
        resize: function (event, ui) {
          _.$canvas_viewport.css({
            'height': ui.size.height - _.$axis_x.outerHeight()
          });
        }
      });

      _.$canvas_device.resizable({
        minWidth: 320,
        minHeight: 320,
        handles: { 's': _.options.canvasDeviceResizable },
        resize: function (event, ui) {
          _.options.xbox.set_field_value($('.xbox-field-id-mpp_browser-height'), ui.size.height, 'px');
        }
      });
    },

    update_axis_position: function () {
      var _ = this;
      var margin_left = Math.round(_.$canvas_device.css('margin-left').replace('px', ''));
      var frame_info = _.get_frame_info();
      _.$axis_y.css({
        top: parseInt((-_.axis_y_top + _.$axis_x.outerHeight()) + frame_info.top - _.$canvas_viewport.scrollTop())
      });
      _.$axis_x.css({
        left: parseInt((-_.axis_x_left + _.$axis_y.outerWidth()) + frame_info.left - _.$canvas_viewport.scrollLeft())
      });
    },

    get_frame_info: function () {
      var _ = this;
      var margin_left = Math.round(_.$canvas_device.css('margin-left').replace('px', ''));
      var margin_top = Math.round(_.$canvas_device.css('margin-top').replace('px', ''));
      return {
        width: _.$frame.outerWidth(true),
        height: _.$frame.outerHeight(true),
        top: margin_top + _.$frame.position().top,
        left: margin_left + _.$frame.position().left,
        margin_top: margin_top,
        margin_left: margin_left,
      };
    },

    events: function () {
      var _ = this;
      _.canvas_mousemove_event();
      _.element_events();
      _.update_axis_position();
      _.add_and_remove_guides();
      _.on_click_icon_settings();
      _.open_close_panels();
      _.add_new_element();

      _.$canvas_viewport.scroll(function () {
        _.update_axis_position();
      });
      setInterval(function () {
        _.update_axis_position();
      }, 5000);

      $(window).resize(function (event) {
        if (event.target == this || $(event.target).attr('id') == 'mc-device' || $(event.target).attr('id') == 'mc') {
          _.update_axis_position();
        }
      }).trigger('resize');

      _.$frame.on('ampp_position_changed, ampp_size_changed', function (event, value) {
        _.update_axis_position();
      });

      _.$canvas.find('input[name="mc-show-guides"]').on('ifClicked', function (event) {
        if ($(this).is(':checked')) {
          _.$canvas.find('.mc-x-guide.mc-draggable-guide, .mc-y-guide.mc-draggable-guide').hide();
        } else {
          _.$canvas.find('.mc-x-guide.mc-draggable-guide, .mc-y-guide.mc-draggable-guide').show();
        }
      });
    },

    add_new_element: function () {
      var _ = this;
      _.$types.find('.xbox-add-group-item:not(.mc-working)').on('click', function (event) {
        var $btn = $(this);
        var type = $btn.data('item-type');
        var device = _.options.app.get_active_device();

        if (device === 'mobile' || ['custom_field_dropdown', 'iframe', 'countdown'].indexOf(type) !== - 1) {
          MPP.pro_version_confirm('Element not available');
          return;
        }

        $btn.addClass('mc-working');
        var $row = _.options.app.$dk_els_row;
        _.$types.find('.ampp-loader').show();
        if (device == 'mobile') {
          $row = _.options.app.$mb_els_row;
        }
        setTimeout(function () {
          $row.find('>.xbox-label .xbox-custom-add[data-item-type="' + type + '"]').trigger('click');
          _.$types.find('.ampp-loader').hide();
          $btn.removeClass('mc-working');

          //GDPR text-html
          if (type == 'custom_field_input_checkbox_gdpr') {
            _.$types.find('.xbox-add-group-item[data-item-type="text-html"]').trigger('click');
          }
        }, 100);
      });
    },

    open_close_panels: function () {
      var _ = this;
      _.$canvas.find('#mc-open-settings').on('click', function (event) {
        var width = _.$settings.outerWidth();
        if (_.$types.hasClass('mc-is-open')) {
          _.$canvas.find('.mc-open-types').first().trigger('click');
        }
        if (_.$settings.hasClass('mc-is-open')) {
          $(this).find('i').removeClass('xbox-icon-backward').addClass('xbox-icon-wrench');
          _.$settings.stop().animate({ "left": '-=' + width }, 300);
        } else {
          $(this).find('i').removeClass('xbox-icon-wrench').addClass('xbox-icon-backward');
          _.$settings.stop().animate({ "left": '+=' + width }, 300);
        }
        _.$settings.toggleClass('mc-is-open');
      });

      _.$canvas.find('.mc-open-types').on('click', function (event) {
        var width = _.$types.outerWidth();
        if (_.$settings.hasClass('mc-is-open')) {
          _.$canvas.find('#mc-open-settings').trigger('click');
        }
        if (_.$types.hasClass('mc-is-open')) {
          _.$canvas.find('.mc-open-types').find('i').removeClass('xbox-icon-backward').addClass('xbox-icon-plus');
          _.$types.animate({ "left": '-=' + width }, 300);
        } else {
          _.$canvas.find('.mc-open-types').find('i').removeClass('xbox-icon-plus').addClass('xbox-icon-backward');
          _.$types.animate({ "left": '+=' + width }, 300);
        }
        _.$types.toggleClass('mc-is-open');
      });
    },

    on_click_icon_settings: function () {
      var _ = this;
      _.$settings.on('click', '.mc-icon-setting:not(.mc-disabled)', function (event) {
        var $icon = $(this);
        var $element = _.$frame.find('.mc-selected');
        var device = _.options.app.get_active_device();
        var index = $element.data('index');
        var sizes = {
          element: {
            width: $element.outerWidth(),
            height: $element.outerHeight(),
          },
          frame: {
            width: _.$frame.outerWidth(),
            height: _.$frame.outerHeight(),
          },
        };
        var alignment_class = _.get_class_starts_with($icon, 'mc-alignment-');
        var value = '';
        var unit = '';
        var number = '';
        switch (alignment_class) {
          case 'mc-alignment-top':
            _.options.app.set_field_values([{ name: 'e-position-top', value: '0' }], index);
            break;

          case 'mc-alignment-middle':
            value = parseInt((sizes.frame.height - sizes.element.height) / 2);
            _.options.app.set_field_values([{ name: 'e-position-top', value: value }], index);
            break;

          case 'mc-alignment-bottom':
            value = sizes.frame.height - sizes.element.height;
            _.options.app.set_field_values([{ name: 'e-position-top', value: value }], index);
            break;

          case 'mc-alignment-left':
            _.options.app.set_field_values([{ name: 'e-position-left', value: '0' }], index);
            break;

          case 'mc-alignment-center':
            value = parseInt((sizes.frame.width - sizes.element.width) / 2);
            _.options.app.set_field_values([{ name: 'e-position-left', value: value }], index);
            break;

          case 'mc-alignment-right':
            value = sizes.frame.width - sizes.element.width;
            _.options.app.set_field_values([{ name: 'e-position-left', value: value }], index);
            break;
        }
        var size_class = _.get_class_starts_with($icon, 'mc-size-');
        switch (size_class) {
          case 'mc-size-full-width':
            $element.data('prev-width', $element[0].style.width);
            _.$settings.find('.mc-size-default-width').removeClass('mc-disabled');
            _.options.app.set_field_values([{
              name: 'e-size-width',
              value: sizes.frame.width,
              unit: 'px'
            }], index);
            break;
          case 'mc-size-default-width':
            value = $element.data('prev-width');
            if (value) {
              number = MPP.number_object(value);
              _.options.app.set_field_values([{
                name: 'e-size-width',
                value: number.value,
                unit: number.unit
              }], index);
            }
            break;
          case 'mc-size-full-height':
            $element.data('prev-height', $element[0].style.height);
            _.$settings.find('.mc-size-default-height').removeClass('mc-disabled');
            _.options.app.set_field_values([{
              name: 'e-size-height',
              value: sizes.frame.height,
              unit: 'px'
            }], index);
            break;
          case 'mc-size-default-height':
            value = $element.data('prev-height');
            if (value) {
              number = MPP.number_object(value);
              _.options.app.set_field_values([{
                name: 'e-size-height',
                value: number.value,
                unit: number.unit
              }], index);
            }
            break;
        }
        return false;
      });
    },

    add_and_remove_guides: function () {
      var _ = this;
      _.$canvas.find('#mc-x-rule-guide').on('click', function (event) {
        _.$canvas.append('<div class="mc-y-guide mc-draggable-guide"><i class="xbox-icon xbox-icon-times-circle"></i></div>');
        var $guide = _.$canvas.find('.mc-y-guide.mc-draggable-guide').last();
        $guide.css('left', $(this).position().left - 2).draggable({
          axis: 'x',
          containment: _.$canvas,
        });
      });
      _.$canvas.find('#mc-y-rule-guide').on('click', function (event) {
        _.$canvas.append('<div class="mc-x-guide mc-draggable-guide"><i class="xbox-icon xbox-icon-times-circle"></i></div>');
        var $guide = _.$canvas.find('.mc-x-guide.mc-draggable-guide').last();
        $guide.css('top', $(this).position().top - 2).draggable({
          axis: 'y',
          containment: _.$canvas,
        });
      });
      _.$canvas.on('click', '.mc-draggable-guide i.xbox-icon', function (event) {
        $(this).closest('.mc-draggable-guide').remove();
      });
    },

    canvas_mousemove_event: function () {
      var _ = this;
      _.$canvas.mousemove(function (event) {
        var position = _.get_target_position(event, this);
        var x = parseInt(-_.axis_x_left + position.x - _.$axis_x.position().left);
        var y = parseInt(-_.axis_y_top + position.y - _.$axis_y.position().top);
        _.$canvas.find('#mc-x-rule-guide').css('left', position.x).find('span').text(x);
        _.$canvas.find('#mc-y-rule-guide').css('top', position.y).find('span').text(y);
      });
    },

    element_events: function () {
      var _ = this;

      _.$canvas.find('.mc-element').each(function (index, el) {
        //Se desactivan al iniciar por el click obligatorio en el primer item: .options.app.$tab_device.on('click');
        _.init_resizable_element($(el));
        _.init_draggable_element($(el));
      });

      _.$canvas.on('click mousedown touchstart', '.mc-element', function (event) {
        var $element = $(this);
        event.stopPropagation();

        if ($element.data('type') != 'custom_field_input_checkbox') {
          event.preventDefault();
        }
        _.$canvas.find('.mc-element').removeClass('mc-selected');
        $element.addClass('mc-selected');
        _.$canvas.removeClass('mc-not-selected');

        MPP.focus_without_scrolling($element);//for keyboard events
      });

      _.$canvas.on('click mouseenter touchstart', '.mc-element', function (event) {
        var $element = $(this);
        if ($element.data('type') != 'custom_field_input_checkbox') {
          event.preventDefault();
        }
        if (!$element.data('ui-draggable')) {
          _.init_draggable_element($element);
        }
        if (!$element.data('ui-resizable')) {
          _.init_resizable_element($element);
        }
      });

      _.$canvas.on('click', '.mc-element .mc-controls > span', function (event) {
        if ($(this).hasClass('mc-duplicate-element')) {
          _.options.app.duplicate_element($(this).closest('.mc-element'));
        } else if ($(this).hasClass('mc-remove-element')) {
          _.options.app.remove_element($(this).closest('.mc-element'));
        } else if ($(this).hasClass('mc-copy-style')) {
          _.options.app.copy_style_element($(this).closest('.mc-element'));
        } else if ($(this).hasClass('mc-paste-style')) {
          _.options.app.paste_style_element($(this).closest('.mc-element'));
        }
      });

      //Destroy
      _.$canvas_viewport.on('click', function (event) {
        _.$canvas.find('.mc-element').removeClass('mc-selected');
        _.$canvas.addClass('mc-not-selected');

        var $target = $(event.target);
        if ($target.hasClass('mc-element') || $target.closest('.mc-element').length) {
          return;
        }
        _.destroy_draggable_elements();
        _.destroy_resizable_elements();
      });
      _.options.app.$tab_device.on('click', function (event) {
        _.destroy_draggable_elements();
        _.destroy_resizable_elements();
      });
    },

    destroy_draggable_elements: function () {
      var _ = this;
      _.$canvas.find('.mc-element').each(function (index, el) {
        if ($(el).data('ui-draggable')) {
          $(el).draggable('destroy');
        }
      });
    },

    destroy_resizable_elements: function () {
      var _ = this;
      _.$canvas.find('.mc-element').each(function (index, el) {
        if ($(el).data('ui-resizable')) {
          $(el).resizable('destroy');
        }
      });
    },

    init_resizable_element: function ($element) {
      var _ = this;
      $element.resizable({
        handles: 'all',
        create: function (event, ui) {
          _.set_position_to_element_controls($(event.target), $(event.target).position());
        },
        resize: function (event, ui) {
          _.set_position_to_element_controls(ui.element, ui.position);
        }
      });
    },

    init_draggable_element: function ($element) {
      var _ = this;
      $element.draggable({
        delay: 60,//100
        containment: _.$canvas_viewport.closest('#wpwrap'),
        create: function (event, ui) {
        },
        drag: function (event, ui) {
          _.set_position_to_element_controls(ui.helper, ui.position);
        },
        start: function (event, ui) {
          ui.helper.addClass('mc-selected');
        },
      });
    },

    set_position_to_element_controls: function ($element, position) {
      position = position || $element.position();
      $element.find('.mc-controls .mc-position-element-left').text(parseInt(position.left));
      $element.find('.mc-controls .mc-position-element-top').text(parseInt(position.top));
    },

    get_target_position: function (event, element) {
      var docElem = document.documentElement;
      var rect = element.getBoundingClientRect();
      var scrollTop = docElem.scrollTop ? docElem.scrollTop : document.body.scrollTop;
      var scrollLeft = docElem.scrollLeft ? docElem.scrollLeft : document.body.scrollLeft;
      var elementLeft = rect.left + scrollLeft;
      var elementTop = rect.top + scrollTop;
      var x = event.pageX - elementLeft;
      var y = event.pageY - elementTop;
      return { x: x, y: y };
    },

    get_class_starts_with: function ($elment, starts_with) {
      return $.grep($elment.attr('class').split(" "), function (v, i) {
        return v.indexOf(starts_with) === 0;
      }).join();
    }
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

  $.fn.maxCanvasEditor = function (options) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function () {
      var _data = $(this).data('mc-editor');

      if (!_data) {
        $(this).data('mc-editor', (_data = new Plugin(this, options)));
      }
      if (typeof options === "string") {
        if (_data[options]) {
          _data[options].apply(_data, args);
        }
      }
    });
  };

}(document, window, jQuery));