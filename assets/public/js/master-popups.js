window.MasterPopups = (function ($, window, document, undefined) {
  var app = {
    callbacks: [],
    popups: [],
    queue_popups: [],
    opened_popups: [],
    working: 0,
    last_open_event: 'click'
  };


  //Document Ready
  $(function (event) {
    var popups_z_index = parseInt(MPP_PUBLIC_JS.popups_z_index, 10);

    app.debug = MPP_PUBLIC_JS.debug_mode === 'on';
    app.z_index = {
      overlay: popups_z_index - 1,
      popup: popups_z_index,
    };
    app.enable_enqueue_popups = MPP_PUBLIC_JS.enable_enqueue_popups;


    $.each(MPP_POPUP_OPTIONS, function (id) {
      app.popups.unshift(id);
    });
    $.each(app.popups, function (index, id) {
      var options = MPP_POPUP_OPTIONS[id];
      var display = false;
      var conversion = false;
      var has_cookie_not_show_popup = app.has_cookie_not_show_popup(id);


      //On Click
      var onClick = options.triggers.open.onClick;
      var selectors = [];
      selectors.push('.mpp-trigger-popup-' + id);
      selectors.push('a[href="mpp-trigger-popup-' + id + '"]');
      selectors.push('a[href="#mpp-trigger-popup-' + id + '"]');
      if (onClick.customClass) {
        $('.' + onClick.customClass).css('cursor', 'pointer');
        selectors.push('.' + onClick.customClass);
        selectors.push('a[href="' + onClick.customClass + '"]');
        selectors.push('a[href="#' + onClick.customClass + '"]');
      }
      selectors = selectors.join(',');
      var onClickEvent = onClick.event == 'hover' ? 'mouseover' : 'click';
      $(selectors).on(onClickEvent, function (event) {
        if (onClick.preventDefault) {
          event.preventDefault();
        }
        options.open.event = 'click';
        app.open_popup_by_id(id, options);
      });

      //Check conversion
      if (app.get_cookie_event('onConversion', options)) {
        conversion = true;
      }


      //Si hay cookies personalizadas o el popup ya a generado conversión entonces no hacer nada
      if (has_cookie_not_show_popup || conversion) {
        return;
      }

      //CookiePlus Addon support
      if (typeof CookiePlus !== 'undefined') {
        if (!CookiePlus.should_display_popup(id, options)) {
          return;
        }
      }

      //On Load
      display = false;
      var onLoad = options.triggers.open.onLoad;
      if (onLoad.enabled && !MPP_PUBLIC_JS.is_admin) {
        $(window).on('load', function (event) {
          display = true;
          setTimeout(function () {
            if (app.get_cookie_event('onLoad', options) || app.get_cookie_event('onConversion', options)) {
              display = false;
            }

            if (display) {
              options.open.event = 'onLoad';
              app.open_popup_by_id(id, options);
            }
          }, app.parse_number(onLoad.delay));
        });
      }

    });
  });

  //Close with ESC Key
  $(document).on('keydown', function (event) {
    if (event.which == 27) {
      $('.mpp-is-open').each(function (index, popup) {
        var Popup = $(popup).data('MasterPopup');
        if (Popup.options.triggers.close.onEscKeydown) {
          Popup.close(event);
        }
      });
    }
  });


  function MasterPopups(element, options) {
    var _ = this;
    _.$body = $('body');
    _.popup = element;
    _.$popup = $(_.popup);
    _.popup_id = 0;
    _.$container = _.$popup.closest('.mpp-container');
    _.$wrap = _.$popup.find('.mpp-wrap').first();
    _.$wrap_content = _.$wrap.find('.mpp-content').first();
    _.$desktop_content = _.$wrap.find('.mpp-content-desktop').first();
    _.$mobile_content = _.$wrap.find('.mpp-content-mobile').first();
    _.$wp_editor_content = _.$wrap.find('.mpp-content-wp-editor').first();
    _.$device_contents = _.$popup.find('.mpp-content-desktop');
    _.$elements = _.$popup.find('.mpp-element');
    _.$overlay = _.$container.find('.mpp-overlay');

    _.is_open = false;
    _.is_opening = false;
    _.metadata = {};

    _.defaults = {
      id: 0,
      position: 'middle-center',
      ratioSmallDevices: 1,

      wpEditor: {
        enabled: false,
        autoHeight: false,
        padding: '20px 36px',
      },

      sound: {
        enabled: false,
        delay: -10,
        src: '',
      },

      preloader: {
        show: true,
        duration: 1000,
      },

      open: {
        event: 'click',
        delay: 0,
        duration: 800,
        animation: 'mpp-zoomIn',
      },

      close: {
        delay: 0,
        duration: 700,
        animation: 'mpp-zoomOut',
      },

      overlay: {
        show: true,
        durationIn: 300,
        durationOut: 250,
      },

      desktop: {
        device: 'desktop',
        browserWidth: 1000,
        browserHeight: 580,
        width: 800,
        widthUnit: 'px',
        height: 400,
        heightUnit: 'px',
      },

      mobile: {
        device: 'mobile',
        browserWidth: 600,
        browserHeight: 580,
        width: 500,
        widthUnit: 'px',
        height: 300,
        heightUnit: 'px',
      },

      callbacks: {
        beforeOpen: function ($, popup_instance, popup_id, options) {
        },
        afterOpen: function ($, popup_instance, popup_id, options) {
        },
        beforeClose: function ($, popup_instance, popup_id, options) {
        },
        afterClose: function ($, popup_instance, popup_id, options) {
        },
        onSubmit: function ($, popup_instance, popup_id, options, success) {
        },
        resize: function ($, popup_instance, popup_id, options) {
        },
      },

      triggers: {
        open: {
          onLoad: {
            enabled: false,
            delay: 1000,
          },
        },
        close: {
          onClickOverlay: true,
          onEscKeydown: true,
        }
      },
      cookies: {
        onLoad: {
          enabled: false,
        },
        onConversion: {
          enabled: false,
        },
      },
      custom_cookies: {},
      custom_cookies_on_click: [],
      custom_cookie_on_close: '',
    };

    if (_.has_popup()) {
      _.metadata = _.$popup.data('popup') || {};
    }
    _.options = $.extend(true, {}, _.defaults, options, _.metadata);
    _.options.id = _.options.id || _.$popup.data('popup-id');
    _.popup_id = _.options.id;
    _.options.open_delay = app.parse_number(_.options.open.delay) + _.duration_preloader_and_overlay();

    _.set_position();

    //Set data attribute
    _.set_options_to_data(_.options);

    //Create some elements
    _.init();

    //Register all events
    _.events();

    //Finally open popup
    _.open();

    return this;
  }

  MasterPopups.prototype = {
    has_popup: function () {
      var _ = this;
      return _.$popup.length > 0;
    },

    set_position: function () {
      var _ = this;
      var positions = ['top-bar', 'bottom-bar', 'bottom-left', 'bottom-center', 'bottom-right'];
      _.options.position = positions.indexOf(_.options.position) !== -1 ? 'middle-center' : _.options.position;
    },

    set_options_to_data: function (options) {
      var _ = this;
      if (_.has_popup()) {
        _.$popup.data('popup', options);
      }
    },

    init: function () {
      var _ = this;

      _.init_elements();
      _.build_link_powered_by();

      //Preloader
      if (_.has_overlay() && _.options.preloader.show) {
        _.build_preloader(_.$overlay);
      }
    },

    init_elements: function () {
      var _ = this;
      _.$elements.each(function (index, element) {
        var actions = $(this).data('actions');
        if (actions.onclick && actions.onclick.action != 'default') {
          $(element).css('cursor', 'pointer');
        }
        if( $(element).data('type') === 'countdown' ){
          $countdown = $(element).find('.mpp-countdown');
          if( $countdown.length && typeof $.fn.MasterPopupsCountdown === 'function' ){
            $countdown.MasterPopupsCountdown();
          }
        }
      });
    },

    build_preloader: function ($target) {
      var _ = this;
      $target.append('<div class="mpp-preloader"></div>');
      if (_.is_support_css_property('animation')) {
        $target.find('.mpp-preloader').addClass('mpp-preloader-animation').html('<div class="mpp-preloader-spinner1"></div><div class="mpp-preloader-spinner2"></div>');
      } else {
        $target.find('.mpp-preloader').addClass('mpp-preloader-image');
      }
    },

    build_link_powered_by: function () {
      var _ = this;
      if (_.$popup.find('.cookieplus-wrap-link-powered-by').length) {
        _.$popup.find('.mpp-wrap-link-powered-by').remove();
      }
    },

    show_popup_content: function () {
      var _ = this;
      _.$popup.find('.mpp-content').css('opacity', '1');
    },
    hide_popup_content: function () {
      var _ = this;
      _.$popup.find('.mpp-content').css('opacity', '0');
    },

    events: function () {
      var _ = this;
      _.$popup.on('mpp_changed_device', _.on_changed_device);
      _.on_click_elements();
      _.close_popup_events();
      _.video_events();
      _.form_events();
      _.countdown_events();

      $(window).on("resize", function () {
        if (_.is_open) {
          _.set_dynamic_styles('onResize');
          _.call_function('resize', _.options.callbacks.resize);
        }
      });

      $(window).scroll(function () {
        if (_.is_open) {
        }
      });

      //Working in popup. To avoid automatic closing
      _.$popup.find('.mpp-input, .mpp-select, .mpp-textarea').on('focus', function (event) {
        app.working = _.popup_id;
      });
      _.$popup.on('hover', function (event) {
        app.working = _.popup_id;
      });
      $(document).on('click', function (event) {
        if ($(event.target).closest('.mpp-container').length === 0) {
          app.working = 0;
        }
      });
    },

    on_changed_device: function (event, _, current_device, old_device) {
      _.restore_video_poster_and_stop_videos(old_device);
    },

    countdown_events: function () {
      var _ = this;
      if( typeof $.fn.MasterPopupsCountdown !== 'function' ){
        return;
      }
      MasterPopupsCountdown.on('finish', function (countdownInstance, endDate) {
        $popup = countdownInstance.$el.closest('.mpp-box');
        if( $popup.length && $popup.find('.mpp-countdown-message').length ){
          $popup.find('.mpp-countdown-message').fadeIn();
        }
      });
    },

    on_click_elements: function () {
      var _ = this;
      _.$popup.on('click', '.mpp-element', function (event) {
        var actions = $(this).data('actions');
        if (actions.onclick) {
          switch (actions.onclick.action) {
            case 'close-popup':
              event.preventDefault();
              _.close(event);
              break;

            case 'open-popup':
            case 'open-popup-and-not-close':
              event.preventDefault();
              if (actions.onclick.action == 'open-popup') {
                _.close(event);
              }
              var popup_id = actions.onclick.popup_id;
              if (MPP_POPUP_OPTIONS[popup_id]) {
                MPP_POPUP_OPTIONS[popup_id].open.event = 'click';
                app.open_popup_by_id(popup_id);
              }
              break;

            case 'redirect-to-url':
              event.preventDefault();
              if (actions.onclick.url && actions.onclick.url != '#' && actions.onclick.url != 'http://') {
                window.open(actions.onclick.url, actions.onclick.target);
              }
              break;
          }

          if (actions.onclick.cookie_name) {
            app.set_custom_cookie(_.popup_id, actions.onclick.cookie_name);
          }
        }
      });
    },

    close_popup_events: function () {
      var _ = this;

      _.$popup.on('click', '.mpp-element-close-icon, .mpp-close-popup', function (event) {
        event.preventDefault();
        _.close(event);
      });

      if (_.has_overlay() && _.options.triggers.close.onClickOverlay) {
        _.$overlay.addClass('mpp-overlay-close-popup');
        _.$overlay.on('click', function (event) {
          _.close(event);
        });
      }
    },

    video_events: function () {
      var _ = this;
      var $elements = _.$popup.find('.mpp-element-video');
      $elements.on('click', '.mpp-video-poster .mpp-play-icon', function (event) {
        $(this).parent('.mpp-video-poster').css('display', 'none');
        var $wrap_video = $(this).closest('.mpp-element').find('.mpp-wrap-video');
        var $video;
        if ($wrap_video.data('video-type') == 'html5') {
          $video = $wrap_video.find('video').first();
          var player = videojs($video.attr('id'));
          player.play();
        } else {
          $video = $wrap_video.find('iframe').first();
          $video.attr('src', $video.data('src'));
        }
      });
    },

    form_events: function () {
      var _ = this;
      _.valid_characters_events();
      _.$popup.find('.mpp-element-field_submit').on('keypress', function (e) {
        if (e.which === 13) {
          $(this).trigger('click');
        }
      });
      _.$popup.find('.mpp-element-field_submit').on('click', function (event) {
        _.$popup.removeClass('mpp-form-sent-ok');
        var $btn = $(this);
        var $processing_form = _.build_processing_form();
        var $content = $processing_form.find('.mpp-processing-form-content');
        var $form = _.get_device_content($btn.data('device'));
        var fake_delay = 1800;

        $processing_form.fadeIn(200, function (e) {
          _.hide_popup_content();
          //Form Type
          if (_.$popup.data('form-type') == 'none') {
            setTimeout(function () {
              $content.html('Please define the "Form Type". Go your popup options and in "Form Type" choose Subscription Form or Contact Form.');
              _.remove_preloader_processing_form();
            }, fake_delay);
          }
          //Validate form
          else if (!_.validate_form(event, $form)) {
            setTimeout(function () {
              _.remove_processing_form();
            }, fake_delay);
          } else {
            _.process_form(event, $form, $processing_form);
          }
        });
      });

      _.$popup.find('.mpp-input, .mpp-select, .mpp-textarea').on('focus', function (event) {
        $(this).removeClass('mpp-error');
        $(this).closest('.mpp-element').removeClass('mpp-has-error').find('.mpp-error-warning').remove();
      });
      _.$popup.find('.mpp-element-custom_field_input_checkbox label, .mpp-element-custom_field_input_checkbox_gdpr label').on('click touchstart', function (event) {
        $(this).find('.mpp-checkbox').removeClass('mpp-error');
        $(this).closest('.mpp-element').removeClass('mpp-has-error').find('.mpp-error-warning').remove();
      });
      _.$popup.on('click', '.mpp-back-to-form', function (event) {
        _.remove_processing_form();
      });

    },

    valid_characters_events: function () {
      var _ = this;
      var valid_elements = '' +
        '.mpp-element-field_first_name,' +
        '.mpp-element-field_last_name,' +
        '.mpp-element-custom_field_input_text,' +
        '.mpp-element-field_phone';
      _.$popup.find('.mpp-input').on('keydown', function (e) {
        var $input = $(this);
        var valid_characters = $input.data('valid-characters');
        if (!$input.closest(valid_elements).length || valid_characters == 'all' || app.is_control_keypress(e)) {
          return;
        }
        if (valid_characters == 'not-numbers' && app.is_number_keypress(e)) {
          e.preventDefault();
        } else if (valid_characters == 'only-numbers' && !app.is_number_keypress(e)) {
          e.preventDefault();
        } else if (valid_characters == 'numbers-and-plus' && !app.is_number_keypress(e, '.')) {
          e.preventDefault();
        } else if (valid_characters == 'numbers-and-dash' && !app.is_number_keypress(e, '-')) {
          e.preventDefault();
        }
      });
      _.$popup.find('.mpp-input').on('keyup', function (e) {
        var $input = $(this);
        var valid_characters = $input.data('valid-characters');
        if (!$input.closest(valid_elements).length || valid_characters == 'all') {
          return;
        }
        switch (valid_characters) {
          case 'not-numbers':
            this.value = this.value.replace(/[\d]+/, '');
            break;
          case 'only-numbers':
            this.value = this.value.replace(/[^\d]+/, '');
            break;
          case 'numbers-and-plus':
            this.value = this.value.replace(/[^\d.]+/, '');
            break;
          case 'numbers-and-dash':
            this.value = this.value.replace(/[^\d-]+/, '');
            break;
        }
      });
    },

    get_last_open_event: function (event) {
      return event || app.last_open_event;
    },

    open: function (event) {
      var _ = this;

      event = event || _.options.open.event;
      app.last_open_event = event;

      if (_.is_open || _.is_opening) {
        return;
      }

      if (_.enqueue_this_popup(event) && app.enable_enqueue_popups == 'on') {
        return;
      }

      _.set_opening(true);

      setTimeout(function () {
        _.before_open_popup(event);

        setTimeout(function () {
          _.hide_preloader();

          setTimeout(function () {
            _.$popup.fadeIn(120);
          }, 80);//Evita que se muestre antes de tiempo

          //Animate all elements
          _.animate_elements();

          _.$wrap.animateCSS_MasterPopup(_.options.open.animation, {
            infinite: true,
            infiniteClass: '',
            duration: app.parse_number(_.options.open.duration),
          });
          setTimeout(function () {
            _.after_open_popup(event);
          }, app.parse_number(_.options.open.duration) + 100);

        }, _.duration_preloader_and_overlay(event));

      }, app.parse_number(_.options.open.delay));

      return false;
    },

    enqueue_this_popup: function (event) {
      var _ = this;
      if (event == 'onLoad') {
        if (_.exist_open_popups()) {
          var index = app.queue_popups.indexOf(_.options.id);
          if (index > 0) {
            app.queue_popups.splice(index, 1);//Remove popup by index
          }
          app.queue_popups.push(_.options.id);//Add popup
          return true;
        }
      }
      return false;
    },

    exist_open_popups: function () {
      var _ = this;
      return $('.mpp-popup').is('.mpp-is-opening, .mpp-is-open');
    },

    set_opening: function (status) {
      var _ = this;
      _.is_opening = status;
      if (status) {
        _.$popup.addClass('mpp-is-opening');
      } else {
        _.$popup.removeClass('mpp-is-opening');
      }
    },

    before_open_popup: function (event) {
      var _ = this;
      _.set_initial_styles();
      _.set_dynamic_styles('onOpen');
      _.open_overlay(event);
      _.lazy_load_content();
      _.call_function('beforeOpen',_.options.callbacks.beforeOpen);

      _.$popup.trigger('masterpopups.BeforeOpenPopup', [this, _.$popup, _.options]);
    },

    after_open_popup: function (event) {
      var _ = this;
      _.set_opening(false);
      _.is_open = true;
      _.$wrap.removeClass(_.options.open.animation + ' mpp-animated');
      _.$popup.addClass('mpp-is-open');
      _.show_hide_link_powered_by('show');
      _.update_impressions();

      _.call_function('afterOpen', _.options.callbacks.afterOpen);

      if (app.opened_popups.indexOf(_.popup_id) == -1) {
        app.opened_popups.push(_.popup_id);
      }

      _.$popup.trigger('masterpopups.AfterOpenPopup', [this, _.$popup, _.options]);
    },

    open_overlay: function (event) {
      var _ = this;
      if (!_.has_overlay()) {
        return;
      }
      _.$overlay.fadeIn(_.overlay_duration_in(event));
      if (_.options.preloader.show) {
        _.$overlay.find('.mpp-preloader').fadeIn(200);
      }
    },

    overlay_duration_in: function (event) {
      var _ = this;
      var duration = app.parse_number(_.options.overlay.durationIn);
      return duration;
    },

    hide_preloader: function () {
      var _ = this;
      if (_.has_overlay()) {
        _.$overlay.find('.mpp-preloader').fadeOut(250);
      }
    },

    show_hide_link_powered_by: function (action) {
      var _ = this;
      if (_.$popup.find('.mpp-wrap-link-powered-by').length) {
        if (action == 'show') {
          _.$popup.find('.mpp-wrap-link-powered-by').fadeIn(500);
        } else {
          _.$popup.find('.mpp-wrap-link-powered-by').fadeOut(100);
        }
      }
    },

    duration_preloader_and_overlay: function (event) {
      var _ = this;
      if (!_.has_overlay()) {
        return 0;
      }
      var preloader_duration = 0;
      if (_.options.preloader.show) {
        preloader_duration = app.parse_number(_.options.preloader.duration);
      }
      return preloader_duration + _.overlay_duration_in(event);
    },

    lazy_load_content: function (event) {
      var _ = this;
      _.load_iframe_url();
    },

    load_iframe_url: function (event) {
      var _ = this;
      var $elements = _.$popup.find('.mpp-element-iframe');
      $elements.each(function (index, el) {
        var iframe_url = $(el).find('.mpp-iframe-wrap').data('src');
        if (iframe_url) {
          $(el).find('.mpp-iframe-wrap > iframe').attr('src', iframe_url);
        }
      });
    },


    animate_elements: function () {
      var _ = this;
      _.$elements.each(function (index, element) {
        var animation = $(element).data('animation');
        if (animation.enable == 'on') {
          $(element).hide();
          setTimeout(function () {
            $(element).show();
          }, app.parse_number(animation.delay) + 50);
          $(element).animateCSS_MasterPopup(animation.effect, {
            delay: app.parse_number(animation.delay),
            duration: app.parse_number(animation.duration),
          });
        }
      });
    },

    set_initial_styles: function () {
      var _ = this;
      _.show_popup_content();
      _.update_z_index();

      if (_.options.wpEditor.enabled) {
        _.$popup.addClass('mpp-has-wp-editor');
        _.$popup.find('.mpp-content').css({
          'padding': _.options.wpEditor.padding
        });
      }
    },

    set_dynamic_styles: function (event) {
      var _ = this;
      _.display_content_for_device();
      _.resize(event);
      _.reposition_close_icon();
    },

    update_z_index: function () {
      var _ = this;
      _.$overlay.css('z-index', app.z_index.overlay);
      app.z_index.overlay++;
      _.$popup.css('z-index', app.z_index.popup);
      app.z_index.popup++;
    },

    display_content_for_device: function () {
      var _ = this;
      if (_.$desktop_content.css('display') == 'none') {
        _.$desktop_content.show();
        _.$mobile_content.hide();
      }
    },

    resize: function (event) {
      var _ = this;
      var op = _.get_device_options();
      var ws = _.window_size();
      var viewport_width = Math.max(280, ws.width - _.get_spacing() - _.get_side_spacing());
      var viewport_height = Math.max(280, ws.height - _.get_spacing());

      var ratio = Math.min(
        viewport_width / _.get_number_value(op.width + op.widthUnit, 'horizontal'),
        viewport_height / _.get_number_value(op.height + op.heightUnit, 'vertical')
      );

      ratio = ratio > 1 ? 1 : ratio;

      if (_.in_mobile_reference()) {
        ratio = ratio * parseFloat(_.options.ratioSmallDevices);
      }
      _.$popup.css('height', _.value_by_ratio(ratio, op.height + op.heightUnit));
      _.$popup.css('width', _.value_by_ratio(ratio, op.width + op.widthUnit));

      _.$device_contents.css({
        'width': _.value_by_ratio(ratio, op.width + 'px'),
        'height': _.value_by_ratio(ratio, op.height + 'px'),
      });

      if (_.options.wpEditor.enabled) {
        _.resize_for_wp_editor();
      } else {
        _.resize_elements(event, ratio);
      }
    },

    resize_elements: function (event, ratio) {
      var _ = this;
      _.$elements.each(function (index, element) {
        var type = $(element).data('type');
        var position = $(element).data('position');
        var size = $(element).data('size');
        var top = position.top;
        var left = position.left;

        $(element).css({
          'top': _.value_by_ratio(ratio, top),
          'left': _.value_by_ratio(ratio, left),
          'width': _.value_by_ratio(ratio, size.width),
          'height': _.value_by_ratio(ratio, size.height),
        });

        if (type == 'shortcode') {
          return;
        }

        var $content = $(element).find('.mpp-element-content');
        var font = $content.data('font');
        var padding = $content.data('padding');
        var border = $content.data('border');

        var $target = $content;
        if ($.inArray(type, _.form_elements()) > -1) {
          $target = $content.find('input');
          if (type == 'field_message') {
            $target = $content.find('textarea');
          } else if (type == 'custom_field_dropdown') {
            $target = $content.find('select');
          }
        }

        var styles = {
          'font-size': _.value_by_ratio(ratio, font['font-size']),
          'padding-top': _.value_by_ratio(ratio, padding.top),
          'padding-right': _.value_by_ratio(ratio, padding.right),
          'padding-bottom': _.value_by_ratio(ratio, padding.bottom),
          'padding-left': _.value_by_ratio(ratio, padding.left),
          'border-top-width': _.value_by_ratio(ratio, border['top-width']),
          'border-right-width': _.value_by_ratio(ratio, border['right-width']),
          'border-bottom-width': _.value_by_ratio(ratio, border['bottom-width']),
          'border-left-width': _.value_by_ratio(ratio, border['left-width']),
          'border-radius': _.value_by_ratio(ratio, border.radius),
        };
        $.each(styles, function (property, value) {
          $target._css(property, value, 'important');
        });

        if (type == 'custom_field_dropdown') {
          var n = app.number_data(font['font-size']);
          var font_size = (app.parse_number(n.value) * 0.8) + n.unit;
          $(element).find('.mpp-icon-dropdown').css({
            'font-size': _.value_by_ratio(ratio, font_size),
          });
        }

        if (type == 'video') {
          if (size['full-screen'] == 'on') {
            var ws = _.window_size();
            $(element)._css('width', ws.width + 'px', 'important');
            $(element)._css('height', ws.height + 'px', 'important');
            $(element)._css('top', '50%', 'important');
            $(element)._css('left', '50%', 'important');
            $(element)._css('transform', 'translate(-50%, -50%) scale(1)', 'important');
          }
        }

      });
    },

    resize_for_wp_editor: function () {
      var _ = this;
      var op = _.get_device_options();
      var ws = _.window_size();

      if (_.options.wpEditor.autoHeight) {
        _.$popup.css({
          'height': 'auto',
        });
      } else {
        _.$popup.css({
          'height': op.height + op.heightUnit,
        });
      }

      var ps = _.popup_size();
      var verticalSpacing = 0;//Espacio superior
      var middleCenterIsFixed = true;
      if (_.options.position == 'middle-center') {
        verticalSpacing = 40;
      }
      if (_.options.position != 'middle-center' || (_.options.position == 'middle-center' && middleCenterIsFixed)) {
        if (ps.height + 1 > ws.height) {
          _.$popup.css('height', ws.height - verticalSpacing);
          ps = _.popup_size();
        }
      }

      var offsetTop = Math.max(0, ((ws.height - ps.height) / 2));
      var offsetLeft = Math.max(0, ((ws.width - ps.width) / 2));

      switch (_.options.position) {
        case 'top-left':
        case 'top-center':
        case 'top-right':
          if (_.options.position == 'top-center') {
            _.$popup.css('left', offsetLeft + ws.scrollLeft);
          }
          break;

        case 'middle-center':
          if (middleCenterIsFixed) {
            _.$popup.css({
              'top': offsetTop,
              'left': offsetLeft + ws.scrollLeft,
            });
          } else {
            if (ps.height + 1 > ws.height) {
              offsetTop += 30;
            }
            _.$popup.css({
              'position': 'absolute',
              'top': offsetTop + ws.scrollTop,
              'left': offsetLeft + ws.scrollLeft,
            });
          }
          break;

        case 'middle-left':
        case 'middle-right':
          _.$popup.css('top', offsetTop);
          break;
      }
    },

    reposition_close_icon: function () {//for wp-editor
      var _ = this;
      var $close_icon = _.$popup.find('.mpp-close-icon');
      if (!$close_icon.length) {
        return;
      }
      var ps = _.popup_size();
      $close_icon.css({
        'left': ps.width - $close_icon.width() - 10,
        'top': 10,
      });
    },


    close: function (event, show_sticky) {
      var _ = this;

      if (!_.is_open) {
        return;
      }

      _.before_close_popup(show_sticky);

      //Animate close
      _.$wrap.animateCSS_MasterPopup(_.options.close.animation, {
        infinite: true,
        infiniteClass: '',
        duration: _.options.close.duration,
      });

      setTimeout(function () {
        _.after_close_popup(show_sticky);
      }, app.parse_number(_.options.close.duration));
    },

    before_close_popup: function (show_sticky) {
      var _ = this;
      _.show_hide_link_powered_by('hide');
      _.call_function('beforeClose', _.options.callbacks.beforeClose);

      _.$popup.trigger('masterpopups.BeforeClosePopup', [this, _.$popup, _.options]);
    },

    after_close_popup: function (show_sticky) {
      var _ = this;
      _.close_overlay();
      _.$popup.hide();
      _.$wrap.removeClass(_.options.close.animation + ' mpp-animated');
      _.$popup.removeClass('mpp-is-open');
      _.is_open = false;
      _.restore_video_poster_and_stop_videos();
      _.restore_iframe_url();
      _.remove_processing_form();


      //Set cookies
      _.set_cookies_after_close();

      if (app.enable_enqueue_popups == 'on') {
        _.open_enqueue_popups();
      }

      _.call_function('afterClose', _.options.callbacks.afterClose);
      _.$popup.trigger('masterpopups.AfterClosePopup', [this, _.$popup, _.options]);
    },

    close_overlay: function () {
      var _ = this;
      if (!_.has_overlay()) {
        return;
      }
      _.$overlay.fadeOut(app.parse_number(_.options.overlay.durationOut));
    },

    restore_iframe_url: function (event) {
      var _ = this;
      var $elements = _.$popup.find('.mpp-element-iframe');
      $elements.each(function (index, el) {
        var $iframe = $(el).find('.mpp-iframe-wrap > iframe');
        $iframe.attr('src', 'about:blank');
      });
    },

    restore_video_poster_and_stop_videos: function (device) {
      var _ = this;
      var $elements = _.$popup.find('.mpp-element-video');
      if (device) {
        $elements = _.get_device_content(device).find('.mpp-element-video');
      }
      $elements.each(function (index, element) {
        $(element).find('.mpp-video-poster').css('display', 'block');
        var $wrap_video = $(element).find('.mpp-wrap-video');
        var $video;
        if ($wrap_video.data('video-type') == 'html5') {
          $video = $wrap_video.find('video').first();
          var player = videojs($video.attr('id'));
          player.pause();
          player.currentTime(0);
        } else {
          $video = $wrap_video.find('iframe').first();
          $video.attr('src', 'about:blank');
        }
      });
    },

    set_cookies_after_close: function () {
      var _ = this;
      var cookie = _.options.cookies[_.get_last_open_event()];
      if (cookie && cookie.enabled) {
        app.cookie.set(cookie.name, true, cookie.duration == 'days' ? cookie.days : 0);
      }
      //Custom cookie after close popup
      if (_.options.custom_cookie_on_close) {
        app.set_custom_cookie(_.popup_id, _.options.custom_cookie_on_close);
      }
    },

    open_enqueue_popups: function () {
      if (app.queue_popups.length > 0) {
        app.open_popup_by_id(app.queue_popups[0]);
        app.queue_popups.shift();//Delete first
      }
    },

    update_impressions: function (restore) {
      var _ = this;
      restore = restore || false;
      var data = {};
      data.action = 'mpp_update_impressions';
      data.popup_id = _.options.id;
      data.restore = restore;
      setTimeout(function () {
        _.ajax({
          data: data,
          success: function (response) {
          },
        }, 'update_impressions');
      }, 7000);
    },

    update_submits: function () {
      var _ = this;
      var data = {};
      data.action = 'mpp_update_submits';
      data.popup_id = _.options.id;
      _.ajax({
        data: data,
        success: function (response) {
        },
      }, 'update_submits');
    },

    build_processing_form: function () {
      var _ = this;
      var html =
        '<div class="mpp-processing-form">' +
        '<div class="mpp-processing-form-content">' +
        '</div>' +
        '<div class="mpp-processing-form-footer">' +
        '<span class="mpp-back-to-form">' + MPP_PUBLIC_JS.strings.back_to_form + '</span><span class="mpp-close-popup">' + MPP_PUBLIC_JS.strings.close_popup + '</span>' +
        '</div>' +
        '</div>';
      _.$wrap.append(html);
      var $processing_form = _.$wrap.find('.mpp-processing-form');
      _.build_preloader($processing_form);
      _.$wrap.find('.mpp-preloader').fadeIn(200);
      return $processing_form;
    },

    remove_processing_form: function () {
      var _ = this;
      _.show_popup_content();
      _.$wrap.find('.mpp-processing-form').fadeOut(300, function (e) {
        $(this).remove();
      });
    },

    remove_preloader_processing_form: function () {
      var _ = this;
      var $processing_form = _.$wrap.find('.mpp-processing-form');
      $processing_form.find('.mpp-preloader').remove();
      $processing_form.find('.mpp-processing-form-footer').fadeIn(200);
    },

    process_form: function (event, $form, $processing_form) {
      var _ = this;
      var $form_elements = $form.find('.mpp-form-element:not(.mpp-element-field_submit)');
      var $content = $processing_form.find('.mpp-processing-form-content');

      var data = $form_elements.find('input[name],select[name],textarea[name]').serializeMyObject();
      data.action = 'mpp_' + _.$popup.data('form-type');
      data.popup_id = _.options.id;
      data.current_device = $form_elements.eq(0).data('device');
      data.popup_elements = [];
      $form_elements.each(function (index, el) {
        data.popup_elements.push($(el).data('index'));
      });

      _.ajax({
        data: data,
        beforeSend: function () {
        },
        success: function (response) {
          if (!response) {
            return;
          }

          if (response.error) {
            $content.html(response.message);
          } else {
            if (response.success) {
              var cookie = _.options.cookies.onConversion;
              if (cookie.enabled) {
                app.cookie.set(cookie.name, true, cookie.duration == 'days' ? cookie.days : 0);
              }

              if (response.actions.close_popup) {
                setTimeout(function () {
                  _.close(event, false);
                  app.open_popup_by_id(response.actions.open_popup_id);
                }, app.parse_number(response.actions.close_popup_delay));
              }
              if (response.actions.download_file) {
                setTimeout(function () {
                  download(response.actions.file);
                }, 1000);
              }
              if (response.actions.redirect) {
                setTimeout(function () {
                  if (_.$body.hasClass('wp-admin')) {
                    alert('MasterPopups say: Redirection is disabled in Admin');
                  } else {
                    window.location = response.actions.redirect_to;
                  }
                }, 1500);
              }
              if (response.actions.advanced_redirection) {
                setTimeout(function () {
                  if (_.$body.hasClass('wp-admin')) {
                    alert('MasterPopups say: Redirection is disabled in Admin');
                  } else {
                    window.location = response.actions.advanced_redirection;
                  }
                }, 1500);
              }
              _.update_submits();
              _.$popup.addClass('mpp-form-sent-ok');
              $content.html(response.actions.message);
              _.call_function('submit', _.options.callbacks.onSubmit, true);
            } else {
              var message = response.actions.message;
              if (response.actions.error) {
                message += '<div style="padding-top: 8px;"><strong>ERROR: </strong><em>' + response.actions.error + '</em></div>';
              }
              $content.html(message);
              _.call_function('submit', _.options.callbacks.onSubmit, false);
            }
          }
        },
        complete: function (jqXHR, textStatus) {
          _.remove_preloader_processing_form();
        },
      }, 'process_form');
    },

    validate_form: function (event, $form) {
      var _ = this;
      var is_valid_value = true;
      var is_valid_form = true;
      var $target, value, type, message;
      var minlength = 1;

      $form.find('.mpp-form-element').each(function (index, el) {
        if ($(el).data('required') == 'off') {
          return true;
        }
        type = $(el).data('type');
        if (type == 'custom_field_input_checkbox' || type == 'custom_field_input_checkbox_gdpr') {
          $target = $(el).find('input.mpp-checkbox');
        } else if (type == 'custom_field_dropdown') {
          $target = $(el).find('select.mpp-select');
        } else if (type == 'field_message') {
          $target = $(el).find('textarea.mpp-textarea');
        } else {
          $target = $(el).find('input.mpp-input');
        }

        //Remove all errors
        $(el).removeClass('mpp-has-error').find('.mpp-error-warning').remove();
        $target.removeClass('mpp-error');

        //validate
        if (type == 'custom_field_input_checkbox' || type == 'custom_field_input_checkbox_gdpr') {
          if (!$target.is(':checked')) {
            is_valid_value = false;
            is_valid_form = false;
            message = MPP_PUBLIC_JS.strings.validation.checkbox;
          } else {
            is_valid_value = true;
          }
        } else if (type == 'field_email') {
          value = $target.val();
          if (!_.validator.is_email(value)) {
            is_valid_value = false;
            is_valid_form = false;
            message = MPP_PUBLIC_JS.strings.validation.email;
          } else {
            is_valid_value = true;
          }
        } else if (type == 'custom_field_dropdown') {
          if (!_.validator.min_length($target.val(), 1)) {
            is_valid_value = false;
            is_valid_form = false;
            message = MPP_PUBLIC_JS.strings.validation.dropdown;
          } else {
            is_valid_value = true;
          }
        } else {
          var $input = $(el).find('.mpp-input');
          if ($input.length && $input.data('min-characters')) {
            minlength = parseInt($input.data('min-characters'));
          }
          minlength = minlength >= 1 ? minlength : 1;
          if (!_.validator.min_length($target.val(), minlength)) {
            is_valid_value = false;
            is_valid_form = false;
            message = MPP_PUBLIC_JS.strings.validation.general + ' (Min length: ' + minlength + ')';
          } else {
            is_valid_value = true;
          }
        }

        if (!is_valid_value) {
          $target.addClass('mpp-error');
          $(el).addClass('mpp-has-error').append('<span class="mpp-error-warning" title="' + message + '"></span>');
        }
      });
      return is_valid_form;
    },


    call_function: function (event, callback, extra_arg) {
      var _ = this;
      if ($.isFunction(callback)) {
        callback.call(_, jQuery, _, _.options.id, _.options, extra_arg);
      }
      app.call_events(event, jQuery, _, _.options.id, _.options, extra_arg );
    },

    viewport: function () {
      var e = window, a = 'inner';
      if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
      }
      return { width: e[a + 'Width'], height: e[a + 'Height'] };
    },

    window_size: function () {
      var _ = this;
      var size = {
        height: $(window).height(),
        dWidth: $(document).width(),
        dHeight: $(document).height(),
        scrollTop: $(window).scrollTop(),
        scrollLeft: $(window).scrollLeft(),
        viewport: {
          width: _.viewport().width,
          height: _.viewport().height,
        },
      };
      size.width = $(window).width();
      return size;
    },

    popup_size: function () {
      var _ = this;
      return {
        width: _.$popup.width(),
        height: _.$popup.height(),
        innerWidth: _.$popup.innerWidth(),
        innerHeight: _.$popup.innerHeight(),
        outerWidth: _.$popup.outerWidth(true),
        outerHeight: _.$popup.outerHeight(true),
      };
    },

    get_device_options: function () {
      var _ = this;
      return _.options.desktop;
    },

    get_active_device: function () {
      var _ = this;
      return 'desktop';
    },

    get_device_content: function (device) {
      var _ = this;
      return _.$desktop_content;
    },

    in_mobile_reference: function () {
      var _ = this;
      return this.window_size().width <= _.options.mobile.browserWidth;
    },

    get_spacing: function () {
      var _ = this;
      var op = _.get_device_options();
      if ((op.width == 100 && op.widthUnit == '%')) {
        return 0;
      }
      if (_.window_size().width <= _.options.mobile.browserWidth) {
        return 10;
      }
      return 20;
    },

    get_side_spacing: function () {
      var _ = this;
      if (_.options.position.indexOf('left') > -1 || _.options.position.indexOf('right') > -1) {
        return (12 / 100) * _.window_size().width;
      }
      return 0;
    },

    is_support_css_property: function (propertyName) {
      var elm = document.createElement('div');
      propertyName = propertyName.toLowerCase();
      if (elm.style[propertyName] !== undefined) {
        return true;
      }
      var propertyNameCapital = propertyName.charAt(0).toUpperCase() + propertyName.substr(1),
        domPrefixes = 'Webkit Moz ms O'.split(' ');

      for (var i = 0; i < domPrefixes.length; i++) {
        if (elm.style[domPrefixes[i] + propertyNameCapital] !== undefined) {
          return true;
        }
      }
      return false;
    },

    form_elements: function () {
      return ['field_first_name', 'field_last_name', 'field_email', 'field_phone', 'field_message', 'custom_field_input_text', 'custom_field_dropdown'];
    },

    has_overlay: function () {
      var _ = this;
      return _.options.overlay.show && _.$overlay.length == 1;
    },

    get_number_value: function (value, orientation) {
      var _ = this;
      var ws = _.window_size();
      var n = 1;
      orientation = orientation || 'horizontal';
      if (_.is_numeric(value)) {
        var object = app.number_data(value);
        n = object.value;
        if (object.unit == '%') {
          if (orientation == 'horizontal') {
            n = (object.value / 100) * ws.width;
          } else if (orientation == 'vertical') {
            n = (object.value / 100) * ws.height;
          }
        }
      }
      return app.parse_number(n);
    },

    value_by_ratio: function (ratio, value) {
      var _ = this;
      if (_.is_auto(value)) {
        return value;
      }
      if (_.is_numeric(value)) {
        var object = app.number_data(value);
        return (ratio * parseFloat(object.value)) + object.unit;
      }
      return '';
    },

    is_number: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },

    is_numeric: function (n) {
      return !isNaN(parseInt(n));
    },

    is_auto: function (value) {
      return $.inArray(value, ['auto', 'initial', 'inherit', 'normal']) > -1;
    },

    number_full_width: function () {
      var _ = this;
      return _.get_number_value('100%', 'horizontal');
    },

    number_full_height: function () {
      var _ = this;
      return _.get_number_value('100%', 'vertical');
    },

    validator: {
      is_email: function (email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
      },
      min_length: function (value, length) {
        return $.trim(value).length >= length;
      }
    },

    css: {
      number: function (value, unit) {
        var _ = this;
        unit = unit || '';
        var arr = ['auto', 'initial', 'inherit', 'normal'];
        if ($.inArray(value, arr) > -1) {
          return value;
        }
        value = value.toString().replace(/[^0-9.\-]/g, '');
        if (_.is_number(value)) {
          return value + unit;
        }
        return 1;
      },
      is_number: function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      },
    },

    ajax: function (options, event) {
      var defaults = {
        type: 'post',
        data: {
          ajax_nonce: MPP_PUBLIC_JS.ajax_nonce,
        },
        dataType: 'json',
        beforeSend: function () {
        },
        success: function (response) {
        },
        complete: function (jqXHR, textStatus) {
        },
      };
      options = $.extend(true, {}, defaults, options);

      //Debug
      clog('==================== AJAX PROCESS ====================');
      clog('options.data:');
      clog(options.data);

      $.ajax({
        url: MPP_PUBLIC_JS.ajax_url,
        type: options.type,
        dataType: options.dataType,
        data: options.data,
        beforeSend: options.beforeSend,
        success: function (response) {
          clog('====== AJAX Event: ' + event + ' ========');
          clog('ajax success, response:');
          clog(response);
          if ($.isFunction(options.success)) {
            options.success.call(this, response);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          clog('ajax error, jqXHR');
          clog(jqXHR);
          clog('ajax error, errorThrown');
          clog(errorThrown);
        },
        complete: function (jqXHR, textStatus) {
          if ($.isFunction(options.complete)) {
            options.complete.call(this, jqXHR, textStatus);
          }
        }
      });
    },

    queryStringToJson: function (url) {
      if (url === '') return '';
      url = url || location.search;
      if (url.indexOf('?') === 0) {
        url = url.slice(1);
      }
      var pairs = url.split('&');
      var result = {};
      for (var idx in pairs) {
        var pair = pairs[idx].split('=');
        if (!!pair[0]) {
          result[pair[0]] = decodeURIComponent(pair[1] || '');
        }
      }
      return result;
    }
  };

  app.set_custom_cookie = function (popup_id, cookie_name) {
    var cookie = MPP_POPUP_OPTIONS[popup_id].custom_cookies[cookie_name];
    if (cookie && cookie.enable == 'on') {
      app.cookie.set(cookie.name, true, cookie.duration == 'days' ? cookie.days : 0);
    }
  };

  app.get_cookie_event = function (event, options) {
    if (options.cookies && options.cookies[event]) {
      var cookie = options.cookies[event];
      if (cookie.enabled && app.cookie.get(cookie.name) !== null) {
        return app.cookie.get(cookie.name);
      }
    }
    return null;
  },

    app.get_custom_cookies = function (popup_id) {
      var custom_cookies_on_click = MPP_POPUP_OPTIONS[popup_id].custom_cookies_on_click;
      var custom_cookies = {};
      if (custom_cookies_on_click.length > 0) {
        custom_cookies_on_click.forEach(function (cookie_name, index, arr) {
          var cookie = MPP_POPUP_OPTIONS[popup_id].custom_cookies[cookie_name];
          if (cookie && cookie.enable == 'on') {
            custom_cookies[cookie_name] = cookie;
          }
        });
      }
      return custom_cookies;
    };

  app.has_cookie_not_show_popup = function (popup_id) {
    var has_cookie_not_show_popup = false;
    var custom_cookies = app.get_custom_cookies(popup_id);
    $.each(custom_cookies, function (cookie_name, cookie) {
      if (app.cookie.get(cookie.name) !== null && cookie.behavior && cookie.behavior.indexOf('not_show_popup') > -1) {
        has_cookie_not_show_popup = true;
      }
    });
    return has_cookie_not_show_popup;
  };


  app.is_empty = function (value) {
    if (value === undefined || value === null) {
      return true;
    } else if (typeof value == 'object' && value instanceof $) {
      return value.length === 0;
    } else {
      return (value === false || $.trim(value).length === 0);
    }
  };

  app.parse_number = function (n) {
    n = parseFloat(n);
    if (isFinite(n)) {
      return n;
    }
    return 1;
  };

  app.in_scroll_top = function (value, compare) {
    compare = compare || '>=';
    var object = app.number_data(value);
    var n = app.parse_number(object.value);
    if( compare === '>=' ){
      if (object.unit == '%') {
        return $(window).scrollTop() >= ($(document).height() - $(window).height()) * (n / 100);
      }
      return $(window).scrollTop() >= n;
    } else {
      if (object.unit == '%') {
        return $(window).scrollTop() <= ($(document).height() - $(window).height()) * (n / 100);
      }
      return $(window).scrollTop() <= n;
    }
  };

  app.in_scroll_element = function ($element, position) {
    position = position || 'top';
    var element_offset = $element.offset().top;
    var element_height = $element.outerHeight();
    var window_offset = $(window).scrollTop();
    var window_height = $(window).height();

    if (position == 'top') {
      var activation_top = element_offset - (window_height * 0.5);
      if (window_offset > activation_top) {
        return true;
      }
      return false;
    } else if (position == 'bottom') {
      var max_scroll = $('body').height() - window_height;
      var activation_bottom = element_offset + element_height - (window_height * 0.6);
      if (activation_bottom > max_scroll) {
        activation_bottom = activation_bottom - (window_height * 0.4) - 100;
      }
      if (window_offset > activation_bottom) {
        return true;
      }
      return false;
    }
    return false;
  };

  app.number_data = function (value) {
    var number = {
      value: value,
      unit: undefined,
    };
    if (!value) {
      return number;
    }
    value = value.toString();
    if ($.inArray(value, ['auto', 'initial', 'inherit', 'normal']) > -1) {
      number.value = value;
      number.unit = undefined;
    } else if (value.indexOf('px') > -1) {
      number.value = value.replace('px', '');
      number.unit = 'px';
    } else if (value.indexOf('%') > -1) {
      number.value = value.replace('%', '');
      number.unit = '%';
    } else if (value.indexOf('em') > -1) {
      number.value = value.replace('em', '');
      number.unit = 'em';
    }
    return number;
  };

  app.cookie = {
    set: function (name, value, days) {
      var expires = "";
      if (days) {
        days = parseInt(days, 10);
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
      }
      document.cookie = name + "=" + value + expires + "; path=/";
    },
    get: function (name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }
      return null;
    },
    remove: function (name) {
      this.set(name, "", -1);
    }
  };
  app.reverse_object = function (object) {
    var newObject = {};
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    for (var i = keys.length - 1; i >= 0; i--) {
      var value = object[keys[i]];
      newObject[keys[i]] = value;
    }
    return newObject;
  };

  app.is_control_keypress = function (e) {
    // Allow: backspace=8, delete=46, tab=9, escape=27, enter=13
    if ($.inArray(e.keyCode, [8, 46, 9, 27, 13]) !== -1 ||
      // Allow: Ctrl/cmd+A
      (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: Ctrl/cmd+C
      (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: Ctrl/cmd+V
      (e.keyCode == 86 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: Ctrl/cmd+X
      (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return true;
    }
    return false;
  }
  app.is_number_keypress = function (e, simbol) {
    //https://stackoverflow.com/questions/469357/html-text-input-allows-only-numeric-input
    //Allow .
    if (simbol && simbol == '.' && $.inArray(e.keyCode, [110, 190]) !== -1) {
      return true;
    }
    //Allow -
    if (simbol && simbol == '-' && $.inArray(e.keyCode, [189, 109]) !== -1) {
      return true;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      return false;
    }
    return true;
  }

  app.open_popup_by_id = function (popup_id, options) {
    var $popup;
    if (options && typeof options === 'object' ) {
      $popup = $('.mpp-popup-' + popup_id).MasterPopups(options);
    } else if (!app.is_empty(MPP_POPUP_OPTIONS[popup_id])) {
      $popup = $('.mpp-popup-' + popup_id).MasterPopups(MPP_POPUP_OPTIONS[popup_id]);
    }
    return $popup;
  };

  app.open = function (popup_id, options) {
      return app.open_popup_by_id(popup_id, options);
  };

  app.close = function (popup_id) {
    var $popup;
    if( popup_id instanceof jQuery ){
      $popup = popup_id;
    } else {
      $popup = $('.mpp-container-'+popup_id+'> .mpp-box');
    }
    if ( $popup.data('MasterPopup') ) {
      $popup.data('MasterPopup').close();
    }
  };

  app.on = function (event_name, callback) {
    app.callbacks.push({
      name: event_name,
      callback: callback,
    });
  }

  app.call_events = function(event_name, $, popup_instance, popup_id, options, success ){
    if( app.callbacks ){
      app.callbacks.map(function(obj){
        if( obj.name === event_name && typeof obj.callback === 'function' ){
          obj.callback.call(this, $, popup_instance, popup_id, options, success);
        }
      });
    }
  }

  $.fn.MasterPopups = function (options) {
    if (typeof options === "string") {
      console.log('Options is string');
    } else {
      return this.each(function () {
        var popup_id = $(this).data('popup-id');
        if (options === undefined && popup_id) {
          options = MPP_POPUP_OPTIONS[popup_id];
        }
        if ($(this).data('MasterPopup')) {
          var open_event = 'click';
          if ($(this).data('popup')) {
            open_event = options.open.event || 'click';
          }
          return $(this).data('MasterPopup').open(open_event);
        }
        $(this).data('MasterPopup', new MasterPopups(this, options));
      });
    }
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

})(jQuery, window, document);


//https://stackoverflow.com/questions/2655925/how-to-apply-important-using-css
(function ($) {
  if ($.fn._css) {
    return;
  }

  // Escape regex chars with \
  var escape = function (text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  // For those who need them (< IE 9), add support for CSS functions
  var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
  if (!isStyleFuncSupported) {
    CSSStyleDeclaration.prototype.getPropertyValue = function (a) {
      return this.getAttribute(a);
    };
    CSSStyleDeclaration.prototype.setProperty = function (styleName, value, priority) {
      this.setAttribute(styleName, value);
      var priority = typeof priority != 'undefined' ? priority : '';
      if (priority != '') {
        // Add priority manually
        var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
          '(\\s*;)?', 'gmi');
        this.cssText =
          this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
      }
    };
    CSSStyleDeclaration.prototype.removeProperty = function (a) {
      return this.removeAttribute(a);
    };
    CSSStyleDeclaration.prototype.getPropertyPriority = function (styleName) {
      var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
        'gmi');
      return rule.test(this.cssText) ? 'important' : '';
    }
  }

  // The style function
  $.fn._css = function (styleName, value, priority) {
    // DOM node
    var self = this;
    var node = self.get(0);
    // Ensure we have a DOM node
    if (typeof node == 'undefined') {
      return self;
    }
    var addCSS = function(htmlNode){
      // CSSStyleDeclaration
      var style = htmlNode.style;
      // Getter/Setter
      if (typeof styleName != 'undefined') {
        if (typeof value != 'undefined') {
          // Set style property
          priority = typeof priority != 'undefined' ? priority : '';
          style.setProperty(styleName, value, priority);
          return self;
        } else {
          // Get style property
          return style.getPropertyValue(styleName);
        }
      } else {
        // Get CSSStyleDeclaration
        return style;
      }
    }
    var output = self;
    $.each(this, function(key, htmlNode){
      output = addCSS(htmlNode);
    });
    return output;
  };
})(jQuery);


/*!
 * jQuery serializeMyObject - v0.2 - 1/20/2010
 * http://benalman.com/projects/jquery-misc-plugins/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Whereas .serializeArray() serializes a form into an array, .serializeMyObject()
// serializes a form into an (arguably more useful) object.

(function ($, undefined) {
  '$:nomunge'; // Used by YUI compressor.

  $.fn.serializeMyObject = function () {
    var obj = {};

    $.each(this.serializeArray(), function (i, o) {
      var n = o.name,
        v = o.value;

      obj[n] = obj[n] === undefined ? v
        : $.isArray(obj[n]) ? obj[n].concat(v)
          : [obj[n], v];
    });

    return obj;
  };

})(jQuery);