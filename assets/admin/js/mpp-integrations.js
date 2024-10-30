;(function (window, document, $) {
  var MPP;
  var xbox;
  var app = {
    debug: false,
  };

  //Document Ready
  $(function () {
    app.init();
  });

  app.init = function () {
    xbox = window.XBOX;
    MPP = window.AdminMasterPopup;
    app.$settings = $('#settings-master-popups');
    app.$tab_integration = app.$settings.find('.tab-content-service-integration');
    app.$services_list = app.$tab_integration.find('.xbox-field-id-services-list');
    app.$services_row = app.$tab_integration.find('.xbox-row-id-integrated-services');
    app.$services_group = app.$services_row.find('.xbox-group-wrap').first();
    app.$services_control = app.$services_row.find('.xbox-group-control').first();

    app.update_services_status();
    app.show_access_data_fields();

    app.$tab_integration.on('click', '.ampp-integrate-service', app.new_service_integration);
    app.$tab_integration.on('click', '.ampp-logout-account', app.logout_service_account);
    app.$tab_integration.on('click', '.ampp-check-account:not(.btn-disabled)', app.connect_service);
    app.$tab_integration.on('click', '.ampp-get-custom-fields:not(.btn-disabled)', app.get_custom_fields);
    app.$services_row.on('xbox_after_add_group_item', app.after_add_group_item);
    app.$services_row.on('xbox_after_remove_group_item', app.after_remove_group_item);

  };

  app.update_services_status = function () {
    var $items = app.$services_group.find('.xbox-group-item');
    $items.each(function (index, el) {
      var status = $(el).find('.xbox-field-id-service-status .xbox-element').val();
      app.update_status_info($(el).find('.xbox-field-id-service-status-info'), status);
    });
  };

  app.show_access_data_fields = function () {
    var $items = app.$services_group.find('.xbox-group-item');
    $items.each(function (index, el) {
      app.show_access_data_fields_to_service($(el));
    });
  };

  app.show_access_data_fields_to_service = function ($group_item) {
    var type = $group_item.data('type');
    if (!MPP_SERVICES[type]) {
      return;
    }
    var access_data = MPP_SERVICES[type].access_data;
    var help_url = MPP_SERVICES[type].help_url;
    var names_access_data = MPP_SERVICES[type].names_access_data;
    var fields = app.integration_fields($group_item);
    var $desc;
    if (access_data.api_key) {
      fields.$apikey.closest('.xbox-row').show();
      $desc = fields.$apikey.closest('.xbox-row').find('.xbox-field-description');
      if (help_url.api_key) {
        $desc.find('a').attr('href', help_url.api_key);
      } else {
        $desc.hide();
      }
      if (names_access_data !== undefined) {
        fields.$apikey.closest('.xbox-row').find('.xbox-element-label').text(names_access_data.api_key);
      }
    } else {
      fields.$apikey.closest('.xbox-row').hide();
    }
    if (access_data.token) {
      fields.$token.closest('.xbox-row').show();
      $desc = fields.$token.closest('.xbox-row').find('.xbox-field-description');
      if (help_url.token) {
        $desc.find('a').attr('href', help_url.token);
      } else {
        $desc.hide();
      }
      if (names_access_data !== undefined) {
        fields.$token.closest('.xbox-row').find('.xbox-element-label').text(names_access_data.token);
      }
    }
    if (access_data.url) {
      fields.$url.closest('.xbox-row').show();
      $desc = fields.$url.closest('.xbox-row').find('.xbox-field-description');
      if (help_url.url) {
        if (is_valid_url(help_url.url)) {
          $desc.find('a').attr('href', help_url.url);
        } else {
          $desc.find('a').remove();
          $desc.text(help_url.url);
        }
      } else {
        $desc.hide();
      }
    }
    if (access_data.email) {
      fields.$email.closest('.xbox-row').show();
      fields.$email.closest('.xbox-row').find('.xbox-field-description a').attr('href', help_url.email);
      if (names_access_data !== undefined) {
        fields.$email.closest('.xbox-row').find('.xbox-element-label').text(names_access_data.email);
      }
    }
    if (access_data.password) {
      fields.$password.closest('.xbox-row').show();
      fields.$password.closest('.xbox-row').find('.xbox-field-description a').attr('href', help_url.password);
      if (names_access_data !== undefined) {
        fields.$password.closest('.xbox-row').find('.xbox-element-label').text(names_access_data.password);
      }
    }
  };

  app.new_service_integration = function (event) {
    var service = $(this).data('item-type');
    if( MPP_SERVICES_PRO.indexOf(service) !== -1 ){
      MPP.pro_version_confirm('Service not available');
      return;
    }
    app.$services_row.find('>.xbox-label .xbox-custom-add[data-item-type="' + service + '"]').trigger('click');
    $(this).removeClass('ampp-integrate-service xbox-btn-teal');
    var $icon = $(this).find('i').alterClass('xbox-icon-arrow-down', 'xbox-icon-check');
    $(this).html(MPP_ADMIN_JS.text.service.integrated).prepend($icon);
  };

  app.after_add_group_item = function (event, args) {
    app.show_access_data_fields_to_service(args.$group_item);
  };

  app.after_remove_group_item = function (event, index, type) {
    app.remove_service_integration(index, type);
  };

  app.remove_service_integration = function (index, type) {
    var $service = app.$services_list.children('.ampp-service-item[data-item-type="' + type + '"]');
    $service.find('.xbox-btn').addClass('ampp-integrate-service xbox-btn-teal');
    var $icon = $service.find('.xbox-btn i').alterClass('xbox-icon-check', 'xbox-icon-arrow-down');
    $service.find('.xbox-btn').html(MPP_ADMIN_JS.text.service.integrate).prepend($icon);
  };

  app.update_status_info = function ($field, status) {
    var $el = $field.find('.ampp-service-status');
    var fields = app.integration_fields($el);
    if (status == 'on') {
      $el.alterClass('xbox-color-red', 'xbox-color-green').text(MPP_ADMIN_JS.text.service.status_on);
      fields.$status_info.find('.ampp-logout-account').fadeIn(250);
      fields.$apikey.find('.xbox-element').attr('readonly', '');
      fields.$token.find('.xbox-element').attr('readonly', '');
      fields.$url.find('.xbox-element').attr('readonly', '');
      fields.$email.find('.xbox-element').attr('readonly', '');
      fields.$password.find('.xbox-element').attr('readonly', '');
    } else {
      $el.alterClass('xbox-color-green', 'xbox-color-red').text(MPP_ADMIN_JS.text.service.status_off);
      fields.$status_info.find('.ampp-logout-account').fadeOut(250);
      fields.$apikey.find('.xbox-element').removeAttr('readonly');
      fields.$token.find('.xbox-element').removeAttr('readonly');
      fields.$url.find('.xbox-element').removeAttr('readonly');
      fields.$email.find('.xbox-element').removeAttr('readonly');
      fields.$password.find('.xbox-element').removeAttr('readonly');
    }
  };

  app.logout_service_account = function (event) {
    event.preventDefault();
    $.xboxConfirm({
      title: MPP_ADMIN_JS.text.service.disconnect_title,
      content: MPP_ADMIN_JS.text.service.disconnect_content,
      confirm_class: 'xbox-btn-blue',
      confirm_text: XBOX_JS.text.popup.accept_button,
      cancel_text: XBOX_JS.text.popup.cancel_button,
      onConfirm: function () {
        var fields = app.integration_fields($(event.target));
        xbox.set_field_value(fields.$status, 'off');
        app.update_status_info(fields.$status_info, 'off');
      }
    });
    return false;
  };

  app.connect_service = function (event) {
    var $btn = $(this);
    $btn.addClass('btn-disabled');
    var fields = app.integration_fields($btn);
    var $xbox_content = $btn.closest('.xbox-content-mixed');
    var data = {
      ajax_nonce: XBOX_JS.ajax_nonce,
      action: 'mpp_connect_service',
      service: fields.$group_item.data('type'),
      api_key: fields.$apikey.find('.xbox-element').val(),
      token: fields.$token.find('.xbox-element').val(),
      url: fields.$url.find('.xbox-element').val(),
      email: fields.$email.find('.xbox-element').val(),
      password: fields.$password.find('.xbox-element').val(),
    };

    $.ajax({
      type: 'post',
      dataType: 'json',
      url: XBOX_JS.ajax_url,
      data: data,
      beforeSend: function () {
        $xbox_content.find('.ampp-message').remove();
        $xbox_content.append("<i class='mpp-icon mpp-icon-spinner mpp-icon-spin ampp-loader'></i>");
      },
      success: function (response, textStatus) {
        c(response);
        cc('textStatus', textStatus);
        if (response) {
          if (response.success) {
            //c('Connected');
            xbox.set_field_value(fields.$status, 'on');
            app.update_status_info(fields.$status_info, 'on');
            $xbox_content.append(MPP.message('success', false, '', response.message));
          } else {
            //c('Not Connected');
            xbox.set_field_value(fields.$status, 'off');
            app.update_status_info(fields.$status_info, 'off');
            $xbox_content.append(MPP.message('error', false, '', response.message));
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        cc('Ajax Error, textStatus=', textStatus);
        cc('jqXHR', jqXHR);
        cc('jqXHR.responseText', jqXHR.responseText);
        cc('errorThrown', errorThrown);
        $xbox_content.append(MPP.message('error', false, '', jqXHR.statusText));
      },
      complete: function (jqXHR, textStatus) {
        $xbox_content.find('.ampp-loader').remove();
        $btn.removeClass('btn-disabled');
      }
    });
  };

  app.get_custom_fields = function (event) {
    var $btn = $(this);
    var fields = app.integration_fields($btn);
    var $xbox_content = $btn.closest('.xbox-content-mixed');
    var $textarea = fields.$custom_fields.find('textarea.xbox-element');

    if (fields.$status.find('.xbox-element').val() == 'off') {
      $xbox_content.find('.ampp-message').remove();
      $xbox_content.append(MPP.message('error', false, '', MPP_ADMIN_JS.text.service.please_connect));
      return false;
    }

    $btn.addClass('btn-disabled');
    var data = {
      ajax_nonce: XBOX_JS.ajax_nonce,
      action: 'mpp_get_custom_fields_service',
      service: fields.$group_item.data('type'),
      api_key: fields.$apikey.find('.xbox-element').val(),
      token: fields.$token.find('.xbox-element').val(),
      url: fields.$url.find('.xbox-element').val(),
      email: fields.$email.find('.xbox-element').val(),
      password: fields.$password.find('.xbox-element').val(),
      list_id: fields.$list_id.find('.xbox-element').val(),
    };

    $.ajax({
      type: 'post',
      dataType: 'json',
      url: XBOX_JS.ajax_url,
      data: data,
      beforeSend: function () {
        $xbox_content.find('.ampp-message').remove();
        $xbox_content.append("<i class='mpp-icon mpp-icon-spinner mpp-icon-spin ampp-loader'></i>");
      },
      success: function (response) {
        c(response);
        if (response) {
          if (response.success) {
            $xbox_content.append(MPP.message('success', false, '', response.message));
            if (response.custom_fields.length >= 1) {
              var value = '';
              $.each(response.custom_fields, function (index, val) {
                value += val + '\n';
              });
              $textarea.val(value.trim());
            } else {
              $textarea.val('');
            }
          } else {
            $xbox_content.append(MPP.message('error', false, '', response.message));
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        cc('Ajax Error, textStatus=', textStatus);
        cc('jqXHR', jqXHR);
        cc('jqXHR.responseText', jqXHR.responseText);
        cc('errorThrown', errorThrown);
        $xbox_content.append(MPP.message('error', false, '', jqXHR.statusText));
      },
      complete: function (jqXHR, textStatus) {
        $xbox_content.find('.ampp-loader').remove();
        $btn.removeClass('btn-disabled');
      }
    });
  };

  app.integration_fields = function ($target) {
    var $group_item;
    if ($target.hasClass('xbox-group-item')) {
      $group_item = $target;
    } else {
      $group_item = $target.closest('.xbox-group-item');
    }
    return {
      $group_item: $group_item,
      $status: $group_item.find('.xbox-field-id-service-status'),
      $status_info: $group_item.find('.xbox-field-id-service-status-info'),
      $apikey: $group_item.find('.xbox-field-id-service-api-key'),
      $token: $group_item.find('.xbox-field-id-service-token'),
      $url: $group_item.find('.xbox-field-id-service-url'),
      $email: $group_item.find('.xbox-field-id-service-email'),
      $password: $group_item.find('.xbox-field-id-service-password'),
      $custom_fields: $group_item.find('.xbox-field-id-services-custom-fields'),
      $list_id: $group_item.find('.xbox-field-id-services-list-id'),
    };
  };

  function is_valid_url(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
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
