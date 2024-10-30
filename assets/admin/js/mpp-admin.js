window.AdminMasterPopup = (function (window, document, $) {
  var xbox;
  var app = {
    debug: true,
  };

  //Document Ready
  $(function () {
    xbox = window.XBOX;
    app.init();
  });


  app.init = function () {
    app.$post_body_audience = $('body.post-type-mpp_audience #post-body');
    app.$post_body_popup_editor = $('body.post-type-master-popups #post-body');

    $('body.wp-admin').on('click', '.ampp-close-message', app.close_info_message);

    app.manage_popup_templates();

    $('.mpp-datatable').DataTable({
      "dom": "lfrtipB",
      "buttons": [{
        extend: 'csv',
        text: 'Export CSV',
        className: 'xbox-btn xbox-btn-teal'
      }],
      'lengthMenu': [[50, 100, 200, 500, -1], [50, 100, 200, 500, "All"]],
      'pageLength': 50,
      "oLanguage": {
        "sLengthMenu": "Display _MENU_ subscribers",
        "sZeroRecords": "No subscribers found",
        "sInfo": "Showing _START_ to _END_ of _TOTAL_ subscribers",
        "sInfoFiltered": " - filtering from _MAX_ subscribers",
        "sInfoEmpty": "No subscribers to show",
      }
    });
  };

  app.close_info_message = function (event) {
    var selector = $(this).hasClass('ampp-close-row') ? '.xbox-row' : '.ampp-message';
    $(this).closest(selector).fadeOut(50, function(){
      $(this).remove();
    });
  };

  app.message = function (type, icon, header, content, $target) {
    if( $target !== undefined ){
      $target.closest('.xbox-content').find('.ampp-close-message').trigger('click');
    }
    var message_class = 'ampp-message ampp-message-' + type;
    if (icon === true) {
      message_class += ' ampp-icon-message';
    }
    var message = '<div class="' + message_class + '">';
    message += '<i class="xbox-icon xbox-icon-remove ampp-close-message"></i>';
    if (header) {
      message += '<header>' + header + '</header>';
    }
    message += '<p>' + content + '</p>';
    message += '</div>';
    return message;
  };

  app.pro_version_message = function (event) {
    var $target = $(event.target);
    var $xbox_content = $target.closest('.xbox-content');
    $xbox_content.append(app.message('info', false, '', MPP_ADMIN_JS.text.proversion, $target));
  }

  app.pro_version_confirm = function(title){
    $.xboxConfirm({
      title: title,
      content: MPP_ADMIN_JS.text.proversion,
      confirm_class: 'xbox-btn-blue',
      confirm_text: XBOX_JS.text.popup.accept_button,
      hide_cancel: true,
      onConfirm: function () {
      }
    });
  }

  app.manage_popup_templates = function () {
    var $control = app.$post_body_popup_editor.find('.ampp-control-popup-templates');
    var $wrap = app.$post_body_popup_editor.find('.ampp-wrap-popup-templates');
    var $categories = app.$post_body_popup_editor.find('.ampp-categories-popup-templates');
    var $tags = app.$post_body_popup_editor.find('.ampp-tags-popup-templates');

    $control.on('click', 'ul li', function (event) {
      var $btn = $(this);
      $btn.addClass('ampp-active').siblings().removeClass('ampp-active');
      var filter_category = $categories.find('.ampp-active').data('filter');
      var filter_tag = $tags.find('.ampp-active').data('filter');

      var $items = $wrap.find('.ampp-item-popup-template').filter(function (index) {
        var data_category = $(this).data('category');
        var data_tags = $(this).data('tags');
        return data_category.indexOf(filter_category) > -1 && data_tags.indexOf(filter_tag) > -1;
      });

      $wrap.fadeTo(150, 0.15);
      $wrap.find('.ampp-item-popup-template').fadeOut(400).removeClass('ampp-scale-1');
      setTimeout(function () {
        $items.fadeIn(350).addClass('ampp-scale-1');
        $wrap.fadeTo(300, 1);
      }, 300);
    });

    $wrap.on('click', '.ampp-item-popup-template', function (event) {
      $(this).addClass('ampp-active').siblings().removeClass('ampp-active');
      var json_url = $(this).data('url');
      $('input[name="mpp_xbox-import-field"]').eq(0).val(json_url);
      if ($('input[name="xbox-import-url"]').length) {
        $('input[name="xbox-import-url"]').eq(0).val(json_url);
      }
    });
    $('.ampp-item-popup-template').each(function(index, el){
      var add_corner_pro = [5,6,7,12,13,22,23,24,26,27,33,34,36,38,40,42,45,46];
      if( add_corner_pro.indexOf(index+1) !== -1 ){
        $(el).addClass('ampp-only-pro-version');
      }
    });
  };

  app.set_focus_end = function ($el) {
    var value = $el.val();
    $el.focus();
    $el.val('');
    $el.val(value);
  };

  app.scroll_to = function ($this, delay, offset, callback) {
    offset = offset || 300;
    delay = delay || 650;
    $('html,body').animate({ scrollTop: Math.abs($this.offset().top - offset) }, delay, callback);
    return false;
  };

  app.focus_without_scrolling = function (elem) {
    var x = window.scrollX, y = window.scrollY;
    elem.focus();
    window.scrollTo(x, y);
  };

  app.get_unit = function ($target) {
    return $target.closest('.xbox-field').find('input.xbox-unit-number').val();
  };

  app.number_object = function (value) {
    var number = {
      value: value,
      unit: undefined,
    };
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

  app.is_number = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  app.css = {
    number: function (value, unit) {
      unit = unit || '';
      var arr = ['auto', 'initial', 'inherit', 'normal'];
      if ($.inArray(value, arr) > -1) {
        return value;
      }
      value = value.toString().replace(/[^0-9.\-]/g, '');
      if (this.is_number(value)) {
        return value + unit;
      }
      return 1;
    },
    is_number: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
  };

  app.ajax = function (options) {
    var defaults = {
      type: 'post',
      data: {
        ajax_nonce: XBOX_JS.ajax_nonce,
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
    $.ajax({
      url: XBOX_JS.ajax_url,
      type: options.type,
      dataType: options.dataType,
      data: options.data,
      beforeSend: options.beforeSend,
      success: function (response) {
        cc('Ajax Success', response);
        if ($.isFunction(options.success)) {
          options.success.call(this, response);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        cc('Ajax Error, textStatus=', textStatus);
        cc('jqXHR', jqXHR);
        cc('jqXHR.responseText', jqXHR.responseText);
        cc('errorThrown', errorThrown);
      },
      complete: function (jqXHR, textStatus) {
        if ($.isFunction(options.complete)) {
          options.complete.call(this, jqXHR, textStatus);
        }
      }
    });
  };

  app.ajax_example = function () {
    $.ajax({
      type: 'post',
      dataType: 'json',
      url: XBOX_JS.ajax_url,
      data: {
        action: 'mpp_action',
        data: data,
        ajax_nonce: XBOX_JS.ajax_nonce
      },
      beforeSend: function () {
      },
      success: function (response) {
        if (response) {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
      },
      complete: function (jqXHR, textStatus) {
      }
    });
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

  //Funciones privadas
  function get_class_starts_with($elment, starts_with) {
    return $.grep($elment.attr('class').split(" "), function (v, i) {
      return v.indexOf(starts_with) === 0;
    }).join();
  }

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

//Insert text into textarea with jQuery
jQuery.fn.extend({
  insertTextInCursor: function (myValue) {
    return this.each(function (i) {
      if (document.selection) {
        //For browsers like Internet Explorer
        this.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
      }
      else if (this.selectionStart || this.selectionStart == '0') {
        //For browsers like Firefox and Webkit based
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
        this.focus();
        this.selectionStart = startPos + myValue.length;
        this.selectionEnd = startPos + myValue.length;
        this.scrollTop = scrollTop;
      } else {
        this.value += myValue;
        this.focus();
      }
    });
  }
});

jQuery.fn.getValidationMessages = function (fields) {
  var message = "";
  var name = "";
  fields = fields || 'input, textarea';
  this.each(function () {
    $(this).find(fields).each(function (index, el) {
      if (el.checkValidity() === false) {
        name = $("label[for=" + el.id + "]").html() || el.placeholder || el.name || el.id;
        message = message + name + ": " + (this.validationMessage || 'Invalid value.') + "\n";
      }
    });

  });
  return message;
};
