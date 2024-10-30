/*!
 * Xbox Tabs
 * Version: 1.0
 * Author: Max López
 */

;(function (document, window, $){
  "use strict";

  function Plugin (el, options){
    this.el  = el;
    this.$el = $(el);

    this.options = $.extend({}, this._defaultOptions, options, this.$el.data());

    this.$nav    = this.$el.find('.xbox-tab-nav').first();
    this.$links  = this.$nav.find('a');
    this.$body = this.$el.find('.xbox-tab-body').first();
    this.$panels = this.$body.find('> .xbox-tab-content');

    this._checkType();

    if (this.options.type !== 'tabs'){
      this._setupAccordion();
    }

    this._setup();
    this._events();
    this._initialise();
  }

  Plugin.prototype._defaultOptions = {
    type        : 'responsive',//tabs, responsive, accordion
    breakpoint  : 768,
    speed       : 500,
    initial     : 0,
    collapsible : false,
    keepOpen    : false
  };

  Plugin.prototype._setup = function ( $item_active ){
    if( ! $item_active ){
      $item_active = this.$links.eq(0).parent();
      if( $item_active.hasClass('xbox-item-has-childs') ){
        $item_active = this.$links.eq(1).parent();
      }
    }
    var _url = $item_active.data('tab'); //store the first links url
    this.$panels.hide(); //hide all tab panels
    this.$body.find('> .xbox-tab-content[data-tab="'+_url+'"]').show();
    this._updateActive(_url);
  };

  Plugin.prototype._setupAccordion = function (){
    var self = this;

    this.$panels.each(function(i, el){ //for each tab panel
      //var _link = self.$links.eq(i).attr('href'), //store the links href
      //var _link = self.$nav.find('li').fil.data('tab'), //store the links href
      var _link = $(el).data('tab');
      var $item = self.$nav.find('li[data-tab="'+_link+'"]');
      var _text = $item.find('a').html(); //store the links text/title
      var _class = '';
      if( $item.length ){
        _class = $item.attr('class').replace('xbox-item', '');
        _class = _class.replace('active', '');
      }
      var data = $item.data('item') ? 'item="'+$item.data('item')+'"' : 'parent="'+$item.data('parent')+'"';

      self.$panels.eq(i).before('<h3 class="xbox-accordion-title '+_class+'" data-'+ data+'><a href="' + _link + '"><span>' + _text + '</span></a></h3>'); //add the accordion title
    });

    this.$links = this.$links.add( this.$panels.parent().find('> .xbox-accordion-title > a') ); //update the links variable after new items have been created
  };

  Plugin.prototype._events = function (){
    var self = this;

    this.$links.on('click', function (event) { //on link click
      event.preventDefault(); //prevent default action
      var link = this;

      if( $(link).parent().hasClass('xbox-item-has-childs') ){
        link = $(link).parent().next('.xbox-item-child').find('a');
        self.openCloseChildItems(this);
        self.openCloseChildItems(link);
      } else {
        self.openCloseChildItems(this);
      }
      self._change(link);
    });

    if (this.options.type === 'responsive'){
      $(window).resize(function(){
        self._checkType(); //check elements type i.e. tabs/accordion

        //Update active tab
        var $item_active = self.$nav.find('.active');
        self._removeClasses();
        self._setup( $item_active );
      });
    }

    this.$links.parent().on('click', '.xbox-toggle-icon', function(event) {
      event.preventDefault();
      var $item = $(this).parent();
      var $toggle = $(this);
      var data_item = $item.data('item');
      if( $item.hasClass('xbox-open') ){
        $item.removeClass('xbox-open');
        $toggle.find('i').removeClass('xbox-icon-chevron-up').addClass('xbox-icon-chevron-down');
        $item.siblings('.xbox-item-child').each(function(index, el) {
          if( $(el).data('parent') == data_item ){
            $(el).slideUp();
          }
        });
      } else {
        $item.addClass('xbox-open');
        $item.find('a').trigger('click');
        $toggle.find('i').removeClass('xbox-icon-chevron-down').addClass('xbox-icon-chevron-up');
        $item.siblings('.xbox-item-child').each(function(index, el) {
          if( $(el).data('parent') == data_item ){
            $(el).slideDown();
          }
        });
      }
    });
  };

  Plugin.prototype.openCloseChildItems = function (trigger){
    var $item = $(trigger).parent();
    var data_item = $item.data('item');
    if( $item.hasClass('xbox-accordion-title') ){
      return;
    }
    if( data_item ){
      var $toggle = $item.find('.xbox-toggle-icon');
      $item.siblings('.xbox-item-parent').removeClass('xbox-open').find('.xbox-toggle-icon i').removeClass('xbox-icon-chevron-up').addClass('xbox-icon-chevron-down');
      var has_childs = false;
      $item.siblings('.xbox-item-child').each(function(index, el) {
        if( $(el).data('parent') == data_item ){
          $(el).slideDown();
          has_childs = true;
          $toggle.find('i').removeClass('xbox-icon-chevron-down').addClass('xbox-icon-chevron-up');
        } else {
          $(el).slideUp();
          $toggle.find('i').removeClass('xbox-icon-chevron-up').addClass('xbox-icon-chevron-down');
        }
      });
      if( has_childs ){
        $item.addClass('xbox-open');
      }
    }
  };

  Plugin.prototype._change = function (trigger){
    var _trigger = $(trigger),
      _newPanel = _trigger.attr('href'); //store the items href

    if (!_trigger.parent().hasClass('active')) { //if the link is not already active
      if(this.$el.hasClass('is-tab')){
        this._tabs(_newPanel);
      } else {
        this._accordion(_newPanel); //run change function depending on type
      }
      if( $.isFunction(this.options.change) ){
        this.options.change.call(this.$el, $(_newPanel));
      }
      $(document).trigger('xbox-tabs.change', [this.$el, $(_newPanel)]);

    } else if (this.$el.hasClass('is-accordion') && _trigger.parent().hasClass('active')) {
      if (this.options.collapsible === true) {
        this._accordionCollapse(_newPanel);
      }
    }
  };

  Plugin.prototype._initialise = function (){
    this.$el.addClass('xbox-tabs xbox-tabs-initialized');
    if( $.isFunction(this.options.initialised) ){
      this.options.initialised.call(this.$el);
    }
    $(document).trigger('xbox-tabs.initialised', [this.$el]);

    //Fix first tab item with childs
    this.$links.eq(0).parent().find('.xbox-toggle-icon').trigger('click');
    this.$links.eq(0).parent().find('.xbox-toggle-icon').trigger('click');
    this.$links.eq(0).trigger('click');
  };

  Plugin.prototype._accordion = function (panel){
    if (!this.options.keepOpen) {
      this.$panels.stop(true, true).slideUp(this.options.speed);

      this._removeClasses();
    }

    this.$body.find('>.xbox-tab-content[data-tab="'+panel+'"]').stop(true, true).slideDown(this.options.speed);

    this._updateActive(panel);
  };

  Plugin.prototype._accordionCollapse = function (panel){
    this.$nav.find('a[href="' + panel + '"]').parent().removeClass('active');
    this.$body.find('>.xbox-accordion-title > a[href="' + panel + '"]').parent().removeClass('active');

    this.$body.find('>.xbox-tab-content[data-tab="'+panel+'"]').stop(true, true).slideUp(this.options.speed);
  };

  Plugin.prototype._tabs = function (panel){
    this.$panels.hide(); //hide current panel

    this._removeClasses();

    this._updateActive(panel);

    this.$body.find('>.xbox-tab-content[data-tab="'+panel+'"]').show();
  };

  Plugin.prototype._removeClasses = function (){
    this.$links.parent().removeClass('active');
  };

  Plugin.prototype._updateActive = function (panel){
    this.$nav.find('a[href="' + panel + '"]').parent().addClass('active');
    this.$body.find('>.xbox-accordion-title > a[href="' + panel + '"]').parent().addClass('active');
  };

  Plugin.prototype._checkType = function (){
    if (this.options.type === 'responsive'){
      if ($(window).outerWidth() > this.options.breakpoint) { //if the window is desktop/tablet
        this.$el.removeClass('is-accordion').addClass('is-tab'); //add is-tab class
      } else { //window is mobile size
        this.$el.removeClass('is-tab').addClass('is-accordion'); //add accordion class
      }
    } else if (this.options.type === 'tabs' || this.options.type === 'accordion'){
      (this.options.type === 'tabs') ? this.$el.addClass('is-tab') : this.$el.addClass('is-accordion');
    }
  };

  Plugin.prototype.open = function (index){
    //console.log('Plugin.prototype.open');
    var $trigger = this.$nav.find('li').eq(index).children('a');
    if ($trigger.length){
      this._change($trigger);
    }
  };



  $.fn.xboxTabs = function (options){
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function (){
      var _this = $(this),
        _data = _this.data('xbox-tabs');

      if (!_data){
        _this.data('xbox-tabs', (_data = new Plugin(this, options)));
      }

      if (typeof options === "string" ){
        options = options.replace(/^_/, "");

        if (_data[options]){
          _data[options].apply(_data, args);
        }
      }
    });
  };

}(document, window, jQuery));