/*!
 * jquery.spinner v0.2.1 (https://vsn4ik.github.io/jquery.spinner/)
 * Copyright 2013-2016 xixilive
 * Licensed under the MIT license
 */
"use strict";!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){var b,c,d=function(b,c){return this.$el=b,this.options=a.extend({},d.rules.defaults,d.rules[c.rule]||{},c),this.min=Number(this.options.min)||0,this.max=Number(this.options.max)||0,this.$el.on({"focus.spinnerNum":a.proxy(function(b){b.preventDefault(),a(document).trigger("mouseup.spinnerNum"),this.oldValue=this.value()},this),"change.spinnerNum":a.proxy(function(a){a.preventDefault(),this.value(this.$el.val())},this),"keydown.spinnerNum":a.proxy(function(a){var b={38:"up",40:"down"}[a.which];b&&(a.preventDefault(),this.spin(b))},this)}),this.oldValue=this.value(),this.value(this.$el.val()),this};d.rules={defaults:{min:null,max:null,step:1,precision:0},currency:{min:0,max:null,step:.01,precision:2},quantity:{min:1,max:999,step:1,precision:0},percent:{min:1,max:100,step:1,precision:0},month:{min:1,max:12,step:1,precision:0},day:{min:1,max:31,step:1,precision:0},hour:{min:0,max:23,step:1,precision:0},minute:{min:1,max:59,step:1,precision:0},second:{min:1,max:59,step:1,precision:0}},d.prototype={spin:function(b){if(!this.$el.prop("disabled")){this.oldValue=this.value();var c=a.isFunction(this.options.step)?this.options.step.call(this,b):this.options.step,d="up"===b?1:-1;this.value(this.oldValue+Number(c)*d)}},value:function(d){if(null===d||void 0===d)return this.numeric(this.$el.val());d=this.numeric(d);var e=this.validate(d);0!==e&&(d=e===-1?this.min:this.max),this.$el.val(d.toFixed(this.options.precision)),this.oldValue!==this.value()&&(this.$el.trigger("changing.spinnerNum",[this.value(),this.oldValue]),clearTimeout(b),b=setTimeout(a.proxy(function(){this.$el.trigger("changed.spinnerNum",[this.value(),this.oldValue])},this),c.delay))},numeric:function(a){return a=this.options.precision>0?parseFloat(a,10):parseInt(a,10),isFinite(a)?a:a||this.options.min||0},validate:function(a){return null!==this.options.min&&a<this.min?-1:null!==this.options.max&&a>this.max?1:0}},c=function(b,c){this.$el=a(b),this.$spinning=this.$el.find('[data-spin="spinnerNum"]'),0===this.$spinning.length&&(this.$spinning=this.$el.find(':input[type="text"]')),c=a.extend({},c,this.$spinning.data()),this.spinning=new d(this.$spinning,c),this.$el.on("click.spinnerNum",'[data-spin="up"], [data-spin="down"]',a.proxy(this,"spin")).on("mousedown.spinnerNum",'[data-spin="up"], [data-spin="down"]',a.proxy(this,"spin")),a(document).on("mouseup.spinnerNum",a.proxy(function(){clearTimeout(this.spinTimeout),clearInterval(this.spinInterval)},this)),c.delay&&this.delay(c.delay),c.changed&&this.changed(c.changed),c.changing&&this.changing(c.changing)},c.delay=500,c.prototype={constructor:c,spin:function(b){var c=a(b.currentTarget).data("spin");switch(b.type){case"click":b.preventDefault(),this.spinning.spin(c);break;case"mousedown":1===b.which&&(this.spinTimeout=setTimeout(a.proxy(this,"beginSpin",c),300))}},delay:function(a){var b=Number(a);b>=0&&(this.constructor.delay=b+100)},value:function(){return this.spinning.value()},changed:function(a){this.bindHandler("changed.spinnerNum",a)},changing:function(a){this.bindHandler("changing.spinnerNum",a)},bindHandler:function(b,c){a.isFunction(c)?this.$spinning.on(b,c):this.$spinning.off(b)},beginSpin:function(b){this.spinInterval=setInterval(a.proxy(this.spinning,"spin",b),100)}};var e=a.fn.spinnerNum;return a.fn.spinnerNum=function(b,d){return this.each(function(){var e=a.data(this,"spinnerNum");e||(e=new c(this,b),a.data(this,"spinnerNum",e)),"delay"===b||"changed"===b||"changing"===b?e[b](d):"step"===b&&d?e.spinning.step=d:"spin"===b&&d&&e.spinning.spin(d)})},a.fn.spinnerNum.Constructor=c,a.fn.spinnerNum.noConflict=function(){return a.fn.spinnerNum=e,this},a(function(){a('[data-trigger="spinnerNum"]').spinnerNum()}),a.fn.spinnerNum});;
/*! tinyColorPicker - v1.1.1 2016-07-15 */

!function(a,b){"object"==typeof exports?module.exports=b(a):"function"==typeof define&&define.amd?define("colors",[],function(){return b(a)}):a.Colors=b(a)}(this,function(a,b){"use strict";function c(a,c,d,f,g){if("string"==typeof c){var c=v.txt2color(c);d=c.type,p[d]=c[d],g=g!==b?g:c.alpha}else if(c)for(var h in c)a[d][h]=k(c[h]/l[d][h][1],0,1);return g!==b&&(a.alpha=k(+g,0,1)),e(d,f?a:b)}function d(a,b,c){var d=o.options.grey,e={};return e.RGB={r:a.r,g:a.g,b:a.b},e.rgb={r:b.r,g:b.g,b:b.b},e.alpha=c,e.equivalentGrey=n(d.r*a.r+d.g*a.g+d.b*a.b),e.rgbaMixBlack=i(b,{r:0,g:0,b:0},c,1),e.rgbaMixWhite=i(b,{r:1,g:1,b:1},c,1),e.rgbaMixBlack.luminance=h(e.rgbaMixBlack,!0),e.rgbaMixWhite.luminance=h(e.rgbaMixWhite,!0),o.options.customBG&&(e.rgbaMixCustom=i(b,o.options.customBG,c,1),e.rgbaMixCustom.luminance=h(e.rgbaMixCustom,!0),o.options.customBG.luminance=h(o.options.customBG,!0)),e}function e(a,b){var c,e,k,q=b||p,r=v,s=o.options,t=l,u=q.RND,w="",x="",y={hsl:"hsv",rgb:a},z=u.rgb;if("alpha"!==a){for(var A in t)if(!t[A][A]){a!==A&&(x=y[A]||"rgb",q[A]=r[x+"2"+A](q[x])),u[A]||(u[A]={}),c=q[A];for(w in c)u[A][w]=n(c[w]*t[A][w][1])}z=u.rgb,q.HEX=r.RGB2HEX(z),q.equivalentGrey=s.grey.r*q.rgb.r+s.grey.g*q.rgb.g+s.grey.b*q.rgb.b,q.webSave=e=f(z,51),q.webSmart=k=f(z,17),q.saveColor=z.r===e.r&&z.g===e.g&&z.b===e.b?"web save":z.r===k.r&&z.g===k.g&&z.b===k.b?"web smart":"",q.hueRGB=v.hue2RGB(q.hsv.h),b&&(q.background=d(z,q.rgb,q.alpha))}var B,C,D,E=q.rgb,F=q.alpha,G="luminance",H=q.background;return B=i(E,{r:0,g:0,b:0},F,1),B[G]=h(B,!0),q.rgbaMixBlack=B,C=i(E,{r:1,g:1,b:1},F,1),C[G]=h(C,!0),q.rgbaMixWhite=C,s.customBG&&(D=i(E,H.rgbaMixCustom,F,1),D[G]=h(D,!0),D.WCAG2Ratio=j(D[G],H.rgbaMixCustom[G]),q.rgbaMixBGMixCustom=D,D.luminanceDelta=m.abs(D[G]-H.rgbaMixCustom[G]),D.hueDelta=g(H.rgbaMixCustom,D,!0)),q.RGBLuminance=h(z),q.HUELuminance=h(q.hueRGB),s.convertCallback&&s.convertCallback(q,a),q}function f(a,b){var c={},d=0,e=b/2;for(var f in a)d=a[f]%b,c[f]=a[f]+(d>e?b-d:-d);return c}function g(a,b,c){return(m.max(a.r-b.r,b.r-a.r)+m.max(a.g-b.g,b.g-a.g)+m.max(a.b-b.b,b.b-a.b))*(c?255:1)/765}function h(a,b){for(var c=b?1:255,d=[a.r/c,a.g/c,a.b/c],e=o.options.luminance,f=d.length;f--;)d[f]=d[f]<=.03928?d[f]/12.92:m.pow((d[f]+.055)/1.055,2.4);return e.r*d[0]+e.g*d[1]+e.b*d[2]}function i(a,c,d,e){var f={},g=d!==b?d:1,h=e!==b?e:1,i=g+h*(1-g);for(var j in a)f[j]=(a[j]*g+c[j]*h*(1-g))/i;return f.a=i,f}function j(a,b){var c=1;return c=a>=b?(a+.05)/(b+.05):(b+.05)/(a+.05),n(100*c)/100}function k(a,b,c){return a>c?c:b>a?b:a}var l={rgb:{r:[0,255],g:[0,255],b:[0,255]},hsv:{h:[0,360],s:[0,100],v:[0,100]},hsl:{h:[0,360],s:[0,100],l:[0,100]},alpha:{alpha:[0,1]},HEX:{HEX:[0,16777215]}},m=a.Math,n=m.round,o={},p={},q={r:.298954,g:.586434,b:.114612},r={r:.2126,g:.7152,b:.0722},s=function(a){this.colors={RND:{}},this.options={color:"rgba(0,0,0,0)",grey:q,luminance:r,valueRanges:l},t(this,a||{})},t=function(a,d){var e,f=a.options;u(a);for(var g in d)d[g]!==b&&(f[g]=d[g]);e=f.customBG,f.customBG="string"==typeof e?v.txt2color(e).rgb:e,p=c(a.colors,f.color,b,!0)},u=function(a){o!==a&&(o=a,p=a.colors)};s.prototype.setColor=function(a,d,f){return u(this),a?c(this.colors,a,d,b,f):(f!==b&&(this.colors.alpha=k(f,0,1)),e(d))},s.prototype.setCustomBackground=function(a){return u(this),this.options.customBG="string"==typeof a?v.txt2color(a).rgb:a,c(this.colors,b,"rgb")},s.prototype.saveAsBackground=function(){return u(this),c(this.colors,b,"rgb",!0)},s.prototype.toString=function(a,b){return v.color2text((a||"rgb").toLowerCase(),this.colors,b)};var v={txt2color:function(a){var b={},c=a.replace(/(?:#|\)|%)/g,"").split("("),d=(c[1]||"").split(/,\s*/),e=c[1]?c[0].substr(0,3):"rgb",f="";if(b.type=e,b[e]={},c[1])for(var g=3;g--;)f=e[g]||e.charAt(g),b[e][f]=+d[g]/l[e][f][1];else b.rgb=v.HEX2rgb(c[0]);return b.alpha=d[3]?+d[3]:1,b},color2text:function(a,b,c){var d=c!==!1&&n(100*b.alpha)/100,e="number"==typeof d&&c!==!1&&(c||1!==d),f=b.RND.rgb,g=b.RND.hsl,h="hex"===a&&e,i="hex"===a&&!h,j="rgb"===a||h,k=j?f.r+", "+f.g+", "+f.b:i?"#"+b.HEX:g.h+", "+g.s+"%, "+g.l+"%";return i?k:(h?"rgb":a)+(e?"a":"")+"("+k+(e?", "+d:"")+")"},RGB2HEX:function(a){return((a.r<16?"0":"")+a.r.toString(16)+(a.g<16?"0":"")+a.g.toString(16)+(a.b<16?"0":"")+a.b.toString(16)).toUpperCase()},HEX2rgb:function(a){return a=a.split(""),{r:+("0x"+a[0]+a[a[3]?1:0])/255,g:+("0x"+a[a[3]?2:1]+(a[3]||a[1]))/255,b:+("0x"+(a[4]||a[2])+(a[5]||a[2]))/255}},hue2RGB:function(a){var b=6*a,c=~~b%6,d=6===b?0:b-c;return{r:n(255*[1,1-d,0,0,d,1][c]),g:n(255*[d,1,1,1-d,0,0][c]),b:n(255*[0,0,d,1,1,1-d][c])}},rgb2hsv:function(a){var b,c,d,e=a.r,f=a.g,g=a.b,h=0;return g>f&&(f=g+(g=f,0),h=-1),c=g,f>e&&(e=f+(f=e,0),h=-2/6-h,c=m.min(f,g)),b=e-c,d=e?b/e:0,{h:1e-15>d?p&&p.hsl&&p.hsl.h||0:b?m.abs(h+(f-g)/(6*b)):0,s:e?b/e:p&&p.hsv&&p.hsv.s||0,v:e}},hsv2rgb:function(a){var b=6*a.h,c=a.s,d=a.v,e=~~b,f=b-e,g=d*(1-c),h=d*(1-f*c),i=d*(1-(1-f)*c),j=e%6;return{r:[d,h,g,g,i,d][j],g:[i,d,d,h,g,g][j],b:[g,g,i,d,d,h][j]}},hsv2hsl:function(a){var b=(2-a.s)*a.v,c=a.s*a.v;return c=a.s?1>b?b?c/b:0:c/(2-b):0,{h:a.h,s:a.v||c?c:p&&p.hsl&&p.hsl.s||0,l:b/2}},rgb2hsl:function(a,b){var c=v.rgb2hsv(a);return v.hsv2hsl(b?c:p.hsv=c)},hsl2rgb:function(a){var b=6*a.h,c=a.s,d=a.l,e=.5>d?d*(1+c):d+c-c*d,f=d+d-e,g=e?(e-f)/e:0,h=~~b,i=b-h,j=e*g*i,k=f+j,l=e-j,m=h%6;return{r:[e,l,f,f,k,e][m],g:[k,e,e,l,f,f][m],b:[f,f,k,e,e,l][m]}}};return s}),function(a,b){"object"==typeof exports?module.exports=b(a,require("jquery"),require("colors")):"function"==typeof define&&define.amd?define(["jquery","colors"],function(c,d){return b(a,c,d)}):b(a,a.jQuery,a.Colors)}(this,function(a,b,c,d){"use strict";function e(a){return a.value||a.getAttribute("value")||b(a).css("background-color")||"#FFF"}function f(a){return a=a.originalEvent&&a.originalEvent.touches?a.originalEvent.touches[0]:a,a.originalEvent?a.originalEvent:a}function g(a){return b(a.find(r.doRender)[0]||a[0])}function h(c){var d=b(this),f=d.offset(),h=b(a),k=r.gap;c?(s=g(d),s._colorMode=s.data("colorMode"),p.$trigger=d,(t||i()).css(r.positionCallback.call(p,d)||{left:(t._left=f.left)-((t._left+=t._width-(h.scrollLeft()+h.width()))+k>0?t._left+k:0),top:(t._top=f.top+d.outerHeight())-((t._top+=t._height-(h.scrollTop()+h.height()))+k>0?t._top+k:0)}).show(r.animationSpeed,function(){c!==!0&&(y.toggle(!!r.opacity)._width=y.width(),v._width=v.width(),v._height=v.height(),u._height=u.height(),q.setColor(e(s[0])),n(!0))}).off(".tcp").on(D,".cp-xy-slider,.cp-z-slider,.cp-alpha",j)):p.$trigger&&b(t).hide(r.animationSpeed,function(){n(!1),p.$trigger=null}).off(".tcp")}function i(){return b("head").append('<style type="text/css" id="tinyColorPickerStyles">'+(r.css||I)+(r.cssAddon||"")+"</style>"),b(H).css({margin:r.margin}).appendTo("body").show(0,function(){p.$UI=t=b(this),F=r.GPU&&t.css("perspective")!==d,u=b(".cp-z-slider",this),v=b(".cp-xy-slider",this),w=b(".cp-xy-cursor",this),x=b(".cp-z-cursor",this),y=b(".cp-alpha",this),z=b(".cp-alpha-cursor",this),r.buildCallback.call(p,t),t.prepend("<div>").children().eq(0).css("width",t.children().eq(0).width()),t._width=this.offsetWidth,t._height=this.offsetHeight}).hide()}function j(a){var c=this.className.replace(/cp-(.*?)(?:\s*|$)/,"$1").replace("-","_");(a.button||a.which)>1||(a.preventDefault&&a.preventDefault(),a.returnValue=!1,s._offset=b(this).offset(),(c="xy_slider"===c?k:"z_slider"===c?l:m)(a),n(),A.on(E,function(){A.off(".tcp")}).on(C,function(a){c(a),n()}))}function k(a){var b=f(a),c=b.pageX-s._offset.left,d=b.pageY-s._offset.top;q.setColor({s:c/v._width*100,v:100-d/v._height*100},"hsv")}function l(a){var b=f(a).pageY-s._offset.top;q.setColor({h:360-b/u._height*360},"hsv")}function m(a){var b=f(a).pageX-s._offset.left,c=b/y._width;q.setColor({},"rgb",c)}function n(a){var b=q.colors,c=b.hueRGB,e=(b.RND.rgb,b.RND.hsl,r.dark),f=r.light,g=q.toString(s._colorMode,r.forceAlpha),h=b.HUELuminance>.22?e:f,i=b.rgbaMixBlack.luminance>.22?e:f,j=(1-b.hsv.h)*u._height,k=b.hsv.s*v._width,l=(1-b.hsv.v)*v._height,m=b.alpha*y._width,n=F?"translate3d":"",p=s[0].value,t=s[0].hasAttribute("value")&&""===p&&a!==d;v._css={backgroundColor:"rgb("+c.r+","+c.g+","+c.b+")"},w._css={transform:n+"("+k+"px, "+l+"px, 0)",left:F?"":k,top:F?"":l,borderColor:b.RGBLuminance>.22?e:f},x._css={transform:n+"(0, "+j+"px, 0)",top:F?"":j,borderColor:"transparent "+h},y._css={backgroundColor:"#"+b.HEX},z._css={transform:n+"("+m+"px, 0, 0)",left:F?"":m,borderColor:i+" transparent"},s._css={backgroundColor:t?"":g,color:t?"":b.rgbaMixBGMixCustom.luminance>.22?e:f},s.text=t?"":p!==g?g:"",a!==d?o(a):G(o)}function o(a){v.css(v._css),w.css(w._css),x.css(x._css),y.css(y._css),z.css(z._css),r.doRender&&s.css(s._css),s.text&&s.val(s.text),r.renderCallback.call(p,s,"boolean"==typeof a?a:d)}var p,q,r,s,t,u,v,w,x,y,z,A=b(document),B=b(),C="touchmove.tcp mousemove.tcp pointermove.tcp",D="touchstart.tcp mousedown.tcp pointerdown.tcp",E="touchend.tcp mouseup.tcp pointerup.tcp",F=!1,G=a.requestAnimationFrame||a.webkitRequestAnimationFrame||function(a){a()},H='<div class="cp-color-picker"><div class="cp-z-slider"><div class="cp-z-cursor"></div></div><div class="cp-xy-slider"><div class="cp-white"></div><div class="cp-xy-cursor"></div></div><div class="cp-alpha"><div class="cp-alpha-cursor"></div></div></div>',I=".cp-color-picker{position:absolute;overflow:hidden;padding:6px 6px 0;background-color:#444;color:#bbb;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;cursor:default;border-radius:5px}.cp-color-picker>div{position:relative;overflow:hidden}.cp-xy-slider{float:left;height:128px;width:128px;margin-bottom:6px;background:linear-gradient(to right,#FFF,rgba(255,255,255,0))}.cp-white{height:100%;width:100%;background:linear-gradient(rgba(0,0,0,0),#000)}.cp-xy-cursor{position:absolute;top:0;width:10px;height:10px;margin:-5px;border:1px solid #fff;border-radius:100%;box-sizing:border-box}.cp-z-slider{float:right;margin-left:6px;height:128px;width:20px;background:linear-gradient(red 0,#f0f 17%,#00f 33%,#0ff 50%,#0f0 67%,#ff0 83%,red 100%)}.cp-z-cursor{position:absolute;margin-top:-4px;width:100%;border:4px solid #fff;border-color:transparent #fff;box-sizing:border-box}.cp-alpha{clear:both;width:100%;height:16px;margin:6px 0;background:linear-gradient(to right,#444,rgba(0,0,0,0))}.cp-alpha-cursor{position:absolute;margin-left:-4px;height:100%;border:4px solid #fff;border-color:#fff transparent;box-sizing:border-box}",J=function(a){q=this.color=new c(a),r=q.options,p=this};J.prototype={render:n,toggle:h},b.fn.colorPicker=function(c){var d=this,f=function(){};return c=b.extend({animationSpeed:150,GPU:!0,doRender:!0,customBG:"#FFF",opacity:!0,renderCallback:f,buildCallback:f,positionCallback:f,body:document.body,scrollResize:!0,gap:4,dark:"#222",light:"#DDD"},c),!p&&c.scrollResize&&b(a).on("resize.tcp scroll.tcp",function(){p.$trigger&&p.toggle.call(p.$trigger[0],!0)}),B=B.add(this),this.colorPicker=p||new J(c),this.options=c,b(c.body).off(".tcp").on(D,function(a){-1===B.add(t).add(b(t).find(a.target)).index(a.target)&&h()}),this.on("focusin.tcp click.tcp",function(a){p.color.options=b.extend(p.color.options,r=d.options),h.call(this,a)}).on("change.tcp",function(){q.setColor(this.value||"#FFF"),d.colorPicker.render(!0)}).each(function(){var a=e(this),d=a.split("("),f=g(b(this));f.data("colorMode",d[1]?d[0].substr(0,3):"HEX").attr("readonly",r.preventFocus),c.doRender&&f.css({"background-color":a,color:function(){return q.setColor(a).rgbaMixBGMixCustom.luminance>.22?c.dark:c.light}})})},b.fn.colorPicker.destroy=function(){b("*").off(".tcp"),p.toggle(!1),B=b()}});
//# sourceMappingURL=jqColorPicker.js.map;
/*!
 * # Semantic UI 2.2.4 - Dropdown
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
!function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.dropdownXbox=function(a){var o,s=e(this),r=e(n),l=s.selector||"",c="ontouchstart"in n.documentElement,u=(new Date).getTime(),d=[],v=arguments[0],f="string"==typeof v,m=[].slice.call(arguments,1);return s.each(function(h){var g,p,b,w,x,C,S,y,A=e.isPlainObject(a)?e.extend(!0,{},e.fn.dropdownXbox.settings,a):e.extend({},e.fn.dropdownXbox.settings),T=A.className,k=A.message,L=A.fields,I=A.keys,D=A.metadata,q=A.namespace,R=A.regExp,O=A.selector,V=A.error,E=A.templates,M="."+q,F="module-"+q,z=e(this),P=e(A.context),H=z.find(O.text),j=z.find(O.search),N=z.find(O.sizer),U=z.find(O.input),K=z.find(O.icon),W=z.prev().find(O.text).length>0?z.prev().find(O.text):z.prev(),B=z.children(O.menu),$=B.find(O.item),Q=!1,X=!1,Y=!1,G=this,J=z.data(F);y={initialize:function(){y.debug("Initializing dropdown",A),y.is.alreadySetup()?y.setup.reference():(y.setup.layout(),A.values&&y.change.values(A.values),y.refreshData(),y.save.defaults(),y.restore.selected(),y.create.id(),y.bind.events(),y.observeChanges(),y.instantiate())},instantiate:function(){y.verbose("Storing instance of dropdown",y),J=y,z.data(F,y)},destroy:function(){y.verbose("Destroying previous dropdown",z),y.remove.tabbable(),z.off(M).removeData(F),B.off(M),r.off(w),y.disconnect.menuObserver(),y.disconnect.selectObserver()},observeChanges:function(){"MutationObserver"in t&&(C=new MutationObserver(y.event.select.mutation),S=new MutationObserver(y.event.menu.mutation),y.debug("Setting up mutation observer",C,S),y.observe.select(),y.observe.menu())},disconnect:{menuObserver:function(){S&&S.disconnect()},selectObserver:function(){C&&C.disconnect()}},observe:{select:function(){y.has.input()&&C.observe(z[0],{childList:!0,subtree:!0})},menu:function(){y.has.menu()&&S.observe(B[0],{childList:!0,subtree:!0})}},create:{id:function(){x=(Math.random().toString(16)+"000000000").substr(2,8),w="."+x,y.verbose("Creating unique id for element",x)},userChoice:function(t){var n,a,o;return!!(t=t||y.get.userValues())&&(t=e.isArray(t)?t:[t],e.each(t,function(t,s){!1===y.get.item(s)&&(o=A.templates.addition(y.add.variables(k.addResult,s)),a=e("<div />").html(o).attr("data-"+D.value,s).attr("data-"+D.text,s).addClass(T.addition).addClass(T.item),A.hideAdditions&&a.addClass(T.hidden),n=n===i?a:n.add(a),y.verbose("Creating user choices for value",s,a))}),n)},userLabels:function(t){var n=y.get.userValues();n&&(y.debug("Adding user labels",n),e.each(n,function(e,t){y.verbose("Adding custom user value"),y.add.label(t,t)}))},menu:function(){B=e("<div />").addClass(T.menu).appendTo(z)},sizer:function(){N=e("<span />").addClass(T.sizer).insertAfter(j)}},search:function(e){e=e!==i?e:y.get.query(),y.verbose("Searching for query",e),y.has.minCharacters(e)?y.filter(e):y.hide()},select:{firstUnfiltered:function(){y.verbose("Selecting first non-filtered element"),y.remove.selectedItem(),$.not(O.unselectable).not(O.addition+O.hidden).eq(0).addClass(T.selected)},nextAvailable:function(e){var t=(e=e.eq(0)).nextAll(O.item).not(O.unselectable).eq(0),n=e.prevAll(O.item).not(O.unselectable).eq(0);t.length>0?(y.verbose("Moving selection to",t),t.addClass(T.selected)):(y.verbose("Moving selection to",n),n.addClass(T.selected))}},setup:{api:function(){var e={debug:A.debug,urlData:{value:y.get.value(),query:y.get.query()},on:!1};y.verbose("First request, initializing API"),z.api(e)},layout:function(){z.is("select")&&(y.setup.select(),y.setup.returnedObject()),y.has.menu()||y.create.menu(),y.is.search()&&!y.has.search()&&(y.verbose("Adding search input"),j=e("<input />").addClass(T.search).prop("autocomplete","off").insertBefore(H)),y.is.multiple()&&y.is.searchSelection()&&!y.has.sizer()&&y.create.sizer(),A.allowTab&&y.set.tabbable()},select:function(){var t=y.get.selectValues();y.debug("Dropdown initialized on a select",t),z.is("select")&&(U=z),U.parent(O.dropdownXbox).length>0?(y.debug("UI dropdown already exists. Creating dropdown menu only"),z=U.closest(O.dropdownXbox),y.has.menu()||y.create.menu(),B=z.children(O.menu),y.setup.menu(t)):(y.debug("Creating entire dropdown from select"),z=e("<div />").attr("class",U.attr("class")).addClass(T.selection).addClass(T.dropdownXbox).html(E.dropdownXbox(t)).insertBefore(U),U.hasClass(T.multiple)&&!1===U.prop("multiple")&&(y.error(V.missingMultiple),U.prop("multiple",!0)),U.is("[multiple]")&&y.set.multiple(),U.prop("disabled")&&(y.debug("Disabling dropdown"),z.addClass(T.disabled)),U.removeAttr("class").detach().prependTo(z)),y.refresh()},menu:function(e){B.html(E.menu(e,L)),$=B.find(O.item)},reference:function(){y.debug("Dropdown behavior was called on select, replacing with closest dropdown"),z=z.parent(O.dropdownXbox),J=z.data(F),G=z.get(0),y.refresh(),y.setup.returnedObject()},returnedObject:function(){var e=s.slice(0,h),t=s.slice(h+1);s=e.add(z).add(t)}},refresh:function(){y.refreshSelectors(),y.refreshData()},refreshItems:function(){$=B.find(O.item)},refreshSelectors:function(){y.verbose("Refreshing selector cache"),H=z.find(O.text),j=z.find(O.search),U=z.find(O.input),K=z.find(O.icon),W=z.prev().find(O.text).length>0?z.prev().find(O.text):z.prev(),B=z.children(O.menu),$=B.find(O.item)},refreshData:function(){y.verbose("Refreshing cached metadata"),$.removeData(D.text).removeData(D.value)},clearData:function(){y.verbose("Clearing metadata"),$.removeData(D.text).removeData(D.value),z.removeData(D.defaultText).removeData(D.defaultValue).removeData(D.placeholderText)},toggle:function(){y.verbose("Toggling menu visibility"),y.is.active()?y.hide():y.show()},show:function(t){if(t=e.isFunction(t)?t:function(){},!y.can.show()&&y.is.remote()&&(y.debug("No API results retrieved, searching before show"),y.queryRemote(y.get.query(),y.show)),y.can.show()&&!y.is.active()){if(y.debug("Showing dropdown"),!y.has.message()||y.has.maxSelections()||y.has.allResultsFiltered()||y.remove.message(),y.is.allFiltered())return!0;!1!==A.onShow.call(G)&&y.animate.show(function(){y.can.click()&&y.bind.intent(),y.has.menuSearch()&&y.focusSearch(),y.set.visible(),t.call(G)})}},hide:function(t){t=e.isFunction(t)?t:function(){},y.is.active()&&!y.is.animatingOutward()&&(y.debug("Hiding dropdown"),!1!==A.onHide.call(G)&&y.animate.hide(function(){y.remove.visible(),t.call(G)}))},hideOthers:function(){y.verbose("Finding other dropdowns to hide"),s.not(z).has(O.menu+"."+T.visible).dropdownXbox("hide")},hideMenu:function(){y.verbose("Hiding menu  instantaneously"),y.remove.active(),y.remove.visible(),B.transition("hide")},hideSubMenus:function(){var e=B.children(O.item).find(O.menu);y.verbose("Hiding sub menus",e),e.transition("hide")},bind:{events:function(){c&&y.bind.touchEvents(),y.bind.keyboardEvents(),y.bind.inputEvents(),y.bind.mouseEvents()},touchEvents:function(){y.debug("Touch device detected binding additional touch events"),y.is.searchSelection()||y.is.single()&&z.on("touchstart"+M,y.event.test.toggle),B.on("touchstart"+M,O.item,y.event.item.mouseenter)},keyboardEvents:function(){y.verbose("Binding keyboard events"),z.on("keydown"+M,y.event.keydown),y.has.search()&&z.on(y.get.inputEvent()+M,O.search,y.event.input),y.is.multiple()&&r.on("keydown"+w,y.event.document.keydown)},inputEvents:function(){y.verbose("Binding input change events"),z.on("change"+M,O.input,y.event.change)},mouseEvents:function(){y.verbose("Binding mouse events"),y.is.multiple()&&z.on("click"+M,O.label,y.event.label.click).on("click"+M,O.remove,y.event.remove.click),y.is.searchSelection()?(z.on("mousedown"+M,y.event.mousedown).on("mouseup"+M,y.event.mouseup).on("mousedown"+M,O.menu,y.event.menu.mousedown).on("mouseup"+M,O.menu,y.event.menu.mouseup).on("click"+M,O.icon,y.event.icon.click).on("focus"+M,O.search,y.event.search.focus).on("click"+M,O.search,y.event.search.focus).on("blur"+M,O.search,y.event.search.blur).on("click"+M,O.text,y.event.text.focus),y.is.multiple()&&z.on("click"+M,y.event.click)):("click"==A.on?z.on("click"+M,O.icon,y.event.icon.click).on("click"+M,y.event.test.toggle):"hover"==A.on?z.on("mouseenter"+M,y.delay.show).on("mouseleave"+M,y.delay.hide):z.on(A.on+M,y.toggle),z.on("mousedown"+M,y.event.mousedown).on("mouseup"+M,y.event.mouseup).on("focus"+M,y.event.focus),y.has.menuSearch()?z.on("blur"+M,O.search,y.event.search.blur):z.on("blur"+M,y.event.blur)),B.on("mouseenter"+M,O.item,y.event.item.mouseenter).on("mouseleave"+M,O.item,y.event.item.mouseleave).on("click"+M,O.item,y.event.item.click)},intent:function(){y.verbose("Binding hide intent event to document"),c&&r.on("touchstart"+w,y.event.test.touch).on("touchmove"+w,y.event.test.touch),r.on("click"+w,y.event.test.hide)}},unbind:{intent:function(){y.verbose("Removing hide intent event from document"),c&&r.off("touchstart"+w).off("touchmove"+w),r.off("click"+w)}},filter:function(e){var t=e!==i?e:y.get.query(),n=function(){y.is.multiple()&&y.filterActive(),(e||!e&&0==y.get.activeItem().length)&&y.select.firstUnfiltered(),y.has.allResultsFiltered()?A.onNoResults.call(G,t)?A.allowAdditions?A.hideAdditions&&(y.verbose("User addition with no menu, setting empty style"),y.set.empty(),y.hideMenu()):(y.verbose("All items filtered, showing message",t),y.add.message(k.noResults)):(y.verbose("All items filtered, hiding dropdown",t),y.hideMenu()):(y.remove.empty(),y.remove.message()),A.allowAdditions&&y.add.userSuggestion(e),y.is.searchSelection()&&y.can.show()&&y.is.focusedOnSearch()&&y.show()};A.useLabels&&y.has.maxSelections()||(A.apiSettings?y.can.useAPI()?y.queryRemote(t,function(){A.filterRemoteData&&y.filterItems(t),n()}):y.error(V.noAPI):(y.filterItems(t),n()))},queryRemote:function(t,n){var i={errorDuration:!1,cache:"local",throttle:A.throttle,urlData:{query:t},onError:function(){y.add.message(k.serverError),n()},onFailure:function(){y.add.message(k.serverError),n()},onSuccess:function(e){y.remove.message(),y.setup.menu({values:e[L.remoteValues]}),n()}};z.api("get request")||y.setup.api(),i=e.extend(!0,{},i,A.apiSettings),z.api("setting",i).api("query")},filterItems:function(t){var n=t!==i?t:y.get.query(),a=null,o=y.escape.string(n),s=new RegExp("^"+o,"igm");y.has.query()&&(a=[],y.verbose("Searching for matching values",n),$.each(function(){var t,i,o=e(this);if("both"==A.match||"text"==A.match){if(-1!==(t=String(y.get.choiceText(o,!1))).search(s))return a.push(this),!0;if("exact"===A.fullTextSearch&&y.exactSearch(n,t))return a.push(this),!0;if(!0===A.fullTextSearch&&y.fuzzySearch(n,t))return a.push(this),!0}if("both"==A.match||"value"==A.match){if(-1!==(i=String(y.get.choiceValue(o,t))).search(s))return a.push(this),!0;if("exact"===A.fullTextSearch&&y.exactSearch(n,i))return a.push(this),!0;if(!0===A.fullTextSearch&&y.fuzzySearch(n,i))return a.push(this),!0}})),y.debug("Showing only matched items",n),y.remove.filteredItem(),a&&$.not(a).addClass(T.filtered)},fuzzySearch:function(e,t){var n=t.length,i=e.length;if(e=e.toLowerCase(),t=t.toLowerCase(),i>n)return!1;if(i===n)return e===t;e:for(var a=0,o=0;a<i;a++){for(var s=e.charCodeAt(a);o<n;)if(t.charCodeAt(o++)===s)continue e;return!1}return!0},exactSearch:function(e,t){return e=e.toLowerCase(),(t=t.toLowerCase()).indexOf(e)>-1},filterActive:function(){A.useLabels&&$.filter("."+T.active).addClass(T.filtered)},focusSearch:function(e){y.has.search()&&!y.is.focusedOnSearch()&&(e?(z.off("focus"+M,O.search),j.focus(),z.on("focus"+M,O.search,y.event.search.focus)):j.focus())},forceSelection:function(){var e=$.not(T.filtered).filter("."+T.selected).eq(0),t=$.not(T.filtered).filter("."+T.active).eq(0),n=e.length>0?e:t;if(n.length>0&&!y.is.multiple())return y.debug("Forcing partial selection to selected item",n),void y.event.item.click.call(n,{},!0);A.allowAdditions?(y.set.selected(y.get.query()),y.remove.searchTerm()):y.remove.searchTerm()},change:{values:function(t){A.allowAdditions||y.clear(),y.debug("Creating dropdown with specified values",t),y.setup.menu({values:t}),e.each(t,function(e,t){if(1==t.selected)return y.debug("Setting initial selection to",t.value),y.set.selected(t.value),!0})}},event:{change:function(){Y||(y.debug("Input changed, updating selection"),y.set.selected())},focus:function(){A.showOnFocus&&!Q&&y.is.hidden()&&!p&&y.show()},blur:function(e){p=n.activeElement===this,Q||p||(y.remove.activeLabel(),y.hide())},mousedown:function(){y.is.searchSelection()?b=!0:Q=!0},mouseup:function(){y.is.searchSelection()?b=!1:Q=!1},click:function(t){e(t.target).is(z)&&(y.is.focusedOnSearch()?y.show():y.focusSearch())},search:{focus:function(){Q=!0,y.is.multiple()&&y.remove.activeLabel(),A.showOnFocus&&y.search()},blur:function(e){p=n.activeElement===this,y.is.searchSelection()&&!b&&(X||p||(A.forceSelection&&y.forceSelection(),y.hide())),b=!1}},icon:{click:function(e){y.toggle()}},text:{focus:function(e){Q=!0,y.focusSearch()}},input:function(e){(y.is.multiple()||y.is.searchSelection())&&y.set.filtered(),clearTimeout(y.timer),y.timer=setTimeout(y.search,A.delay.search)},label:{click:function(t){var n=e(this),i=z.find(O.label),a=i.filter("."+T.active),o=n.nextAll("."+T.active),s=n.prevAll("."+T.active),r=o.length>0?n.nextUntil(o).add(a).add(n):n.prevUntil(s).add(a).add(n);t.shiftKey?(a.removeClass(T.active),r.addClass(T.active)):t.ctrlKey?n.toggleClass(T.active):(a.removeClass(T.active),n.addClass(T.active)),A.onLabelSelect.apply(this,i.filter("."+T.active))}},remove:{click:function(){var t=e(this).parent();t.hasClass(T.active)?y.remove.activeLabels():y.remove.activeLabels(t)}},test:{toggle:function(e){var t=y.is.multiple()?y.show:y.toggle;y.is.bubbledLabelClick(e)||y.is.bubbledIconClick(e)||y.determine.eventOnElement(e,t)&&e.preventDefault()},touch:function(e){y.determine.eventOnElement(e,function(){"touchstart"==e.type?y.timer=setTimeout(function(){y.hide()},A.delay.touch):"touchmove"==e.type&&clearTimeout(y.timer)}),e.stopPropagation()},hide:function(e){y.determine.eventInModule(e,y.hide)}},select:{mutation:function(t){y.debug("<select> modified, recreating menu");var n=!1;e.each(t,function(t,i){if(e(i.target).is("select")||e(i.addedNodes).is("select"))return n=!0,!0}),n&&(y.disconnect.selectObserver(),y.refresh(),y.setup.select(),y.set.selected(),y.observe.select())}},menu:{mutation:function(t){var n=t[0],i=n.addedNodes?e(n.addedNodes[0]):e(!1),a=n.removedNodes?e(n.removedNodes[0]):e(!1),o=i.add(a),s=o.is(O.addition)||o.closest(O.addition).length>0,r=o.is(O.message)||o.closest(O.message).length>0;s||r?(y.debug("Updating item selector cache"),y.refreshItems()):(y.debug("Menu modified, updating selector cache"),y.refresh())},mousedown:function(){X=!0},mouseup:function(){X=!1}},item:{mouseenter:function(t){var n=e(t.target),i=e(this),a=i.children(O.menu),o=i.siblings(O.item).children(O.menu),s=a.length>0;!(a.find(n).length>0)&&s&&(clearTimeout(y.itemTimer),y.itemTimer=setTimeout(function(){y.verbose("Showing sub-menu",a),e.each(o,function(){y.animate.hide(!1,e(this))}),y.animate.show(!1,a)},A.delay.show),t.preventDefault())},mouseleave:function(t){var n=e(this).children(O.menu);n.length>0&&(clearTimeout(y.itemTimer),y.itemTimer=setTimeout(function(){y.verbose("Hiding sub-menu",n),y.animate.hide(!1,n)},A.delay.hide))},click:function(t,i){var a=e(this),o=e(t?t.target:""),s=a.find(O.menu),r=y.get.choiceText(a),l=y.get.choiceValue(a,r),c=s.length>0,u=s.find(o).length>0;y.has.menuSearch()&&e(n.activeElement).blur(),u||c&&!A.allowCategorySelection||(y.is.searchSelection()&&(A.allowAdditions&&y.remove.userAddition(),y.remove.searchTerm(),y.is.focusedOnSearch()||1==i||y.focusSearch(!0)),A.useLabels||(y.remove.filteredItem(),y.set.scrollPosition(a)),y.determine.selectAction.call(this,r,l))}},document:{keydown:function(e){var t=e.which;if(y.is.inObject(t,I)){var n=z.find(O.label),i=n.filter("."+T.active),a=(i.data(D.value),n.index(i)),o=n.length,s=i.length>0,r=i.length>1,l=0===a,c=a+1==o,u=y.is.searchSelection(),d=y.is.focusedOnSearch(),v=y.is.focused(),f=d&&0===y.get.caretPosition();if(u&&!s&&!d)return;t==I.leftArrow?!v&&!f||s?s&&(e.shiftKey?y.verbose("Adding previous label to selection"):(y.verbose("Selecting previous label"),n.removeClass(T.active)),l&&!r?i.addClass(T.active):i.prev(O.siblingLabel).addClass(T.active).end(),e.preventDefault()):(y.verbose("Selecting previous label"),n.last().addClass(T.active)):t==I.rightArrow?(v&&!s&&n.first().addClass(T.active),s&&(e.shiftKey?y.verbose("Adding next label to selection"):(y.verbose("Selecting next label"),n.removeClass(T.active)),c?u?d?n.removeClass(T.active):y.focusSearch():r?i.next(O.siblingLabel).addClass(T.active):i.addClass(T.active):i.next(O.siblingLabel).addClass(T.active),e.preventDefault())):t==I.deleteKey||t==I.backspace?s?(y.verbose("Removing active labels"),c&&u&&!d&&y.focusSearch(),i.last().next(O.siblingLabel).addClass(T.active),y.remove.activeLabels(i),e.preventDefault()):f&&!s&&t==I.backspace&&(y.verbose("Removing last label on input backspace"),i=n.last().addClass(T.active),y.remove.activeLabels(i)):i.removeClass(T.active)}}},keydown:function(e){var t=e.which;if(y.is.inObject(t,I)){var n,i=$.not(O.unselectable).filter("."+T.selected).eq(0),a=B.children("."+T.active).eq(0),o=i.length>0?i:a,s=o.length>0?o.siblings(":not(."+T.filtered+")").addBack():B.children(":not(."+T.filtered+")"),r=o.children(O.menu),l=o.closest(O.menu),c=l.hasClass(T.visible)||l.hasClass(T.animating)||l.parent(O.menu).length>0,u=r.length>0,d=o.length>0,v=o.not(O.unselectable).length>0,f=t==I.delimiter&&A.allowAdditions&&y.is.multiple();if(A.allowAdditions&&A.hideAdditions&&(t==I.enter||f)&&v&&(y.verbose("Selecting item from keyboard shortcut",o),y.event.item.click.call(o,e),y.is.searchSelection()&&y.remove.searchTerm()),y.is.visible()){if((t==I.enter||f)&&(t==I.enter&&d&&u&&!A.allowCategorySelection?(y.verbose("Pressed enter on unselectable category, opening sub menu"),t=I.rightArrow):v&&(y.verbose("Selecting item from keyboard shortcut",o),y.event.item.click.call(o,e),y.is.searchSelection()&&y.remove.searchTerm()),e.preventDefault()),d&&(t==I.leftArrow&&l[0]!==B[0]&&(y.verbose("Left key pressed, closing sub-menu"),y.animate.hide(!1,l),o.removeClass(T.selected),l.closest(O.item).addClass(T.selected),e.preventDefault()),t==I.rightArrow&&u&&(y.verbose("Right key pressed, opening sub-menu"),y.animate.show(!1,r),o.removeClass(T.selected),r.find(O.item).eq(0).addClass(T.selected),e.preventDefault())),t==I.upArrow){if(n=d&&c?o.prevAll(O.item+":not("+O.unselectable+")").eq(0):$.eq(0),s.index(n)<0)return y.verbose("Up key pressed but reached top of current menu"),void e.preventDefault();y.verbose("Up key pressed, changing active item"),o.removeClass(T.selected),n.addClass(T.selected),y.set.scrollPosition(n),A.selectOnKeydown&&y.is.single()&&y.set.selectedItem(n),e.preventDefault()}if(t==I.downArrow){if(0===(n=d&&c?n=o.nextAll(O.item+":not("+O.unselectable+")").eq(0):$.eq(0)).length)return y.verbose("Down key pressed but reached bottom of current menu"),void e.preventDefault();y.verbose("Down key pressed, changing active item"),$.removeClass(T.selected),n.addClass(T.selected),y.set.scrollPosition(n),A.selectOnKeydown&&y.is.single()&&y.set.selectedItem(n),e.preventDefault()}t==I.pageUp&&(y.scrollPage("up"),e.preventDefault()),t==I.pageDown&&(y.scrollPage("down"),e.preventDefault()),t==I.escape&&(y.verbose("Escape key pressed, closing dropdown"),y.hide())}else f&&e.preventDefault(),t!=I.downArrow||y.is.visible()||(y.verbose("Down key pressed, showing dropdown"),y.show(),e.preventDefault())}else y.has.search()||y.set.selectedLetter(String.fromCharCode(t))}},trigger:{change:function(){var e=n.createEvent("HTMLEvents"),t=U[0];t&&(y.verbose("Triggering native change event"),e.initEvent("change",!0,!1),t.dispatchEvent(e))}},determine:{selectAction:function(t,n){y.verbose("Determining action",A.action),e.isFunction(y.action[A.action])?(y.verbose("Triggering preset action",A.action,t,n),y.action[A.action].call(G,t,n,this)):e.isFunction(A.action)?(y.verbose("Triggering user action",A.action,t,n),A.action.call(G,t,n,this)):y.error(V.action,A.action)},eventInModule:function(t,i){var a=e(t.target),o=a.closest(n.documentElement).length>0,s=a.closest(z).length>0;return i=e.isFunction(i)?i:function(){},o&&!s?(y.verbose("Triggering event",i),i(),!0):(y.verbose("Event occurred in dropdown, canceling callback"),!1)},eventOnElement:function(t,i){var a=e(t.target),o=a.closest(O.siblingLabel),s=n.body.contains(t.target),r=0===z.find(o).length,l=0===a.closest(B).length;return i=e.isFunction(i)?i:function(){},s&&r&&l?(y.verbose("Triggering event",i),i(),!0):(y.verbose("Event occurred in dropdown menu, canceling callback"),!1)}},action:{nothing:function(){},activate:function(t,n,a){if(n=n!==i?n:t,y.can.activate(e(a))){if(y.set.selected(n,e(a)),y.is.multiple()&&!y.is.allFiltered())return;y.hideAndClear()}},select:function(t,n,a){if(n=n!==i?n:t,y.can.activate(e(a))){if(y.set.value(n,t,e(a)),y.is.multiple()&&!y.is.allFiltered())return;y.hideAndClear()}},combo:function(t,n,a){n=n!==i?n:t,y.set.selected(n,e(a)),y.hideAndClear()},hide:function(e,t,n){y.set.value(t,e),y.hideAndClear()}},get:{id:function(){return x},defaultText:function(){return z.data(D.defaultText)},defaultValue:function(){return z.data(D.defaultValue)},placeholderText:function(){return"auto"!=A.placeholder&&"string"==typeof A.placeholder?A.placeholder:z.data(D.placeholderText)||""},text:function(){return H.text()},query:function(){return e.trim(j.val())},searchWidth:function(e){return e=e!==i?e:j.val(),N.text(e),Math.ceil(N.width()+1)},selectionCount:function(){var t=y.get.values();return y.is.multiple()?e.isArray(t)?t.length:0:""!==y.get.value()?1:0},transition:function(e){return"auto"==A.transition?y.is.upward(e)?"slide up":"slide down":A.transition},userValues:function(){var t=y.get.values();return!!t&&(t=e.isArray(t)?t:[t],e.grep(t,function(e){return!1===y.get.item(e)}))},uniqueArray:function(t){return e.grep(t,function(n,i){return e.inArray(n,t)===i})},caretPosition:function(){var e,t,i=j.get(0);return"selectionStart"in i?i.selectionStart:n.selection?(i.focus(),t=(e=n.selection.createRange()).text.length,e.moveStart("character",-i.value.length),e.text.length-t):void 0},value:function(){var t=U.length>0?U.val():z.data(D.value),n=e.isArray(t)&&1===t.length&&""===t[0];return t===i||n?"":t},values:function(){var e=y.get.value();return""===e?"":!y.has.selectInput()&&y.is.multiple()?"string"==typeof e?e.split(A.delimiter):"":e},remoteValues:function(){var t=y.get.values(),n=!1;return t&&("string"==typeof t&&(t=[t]),e.each(t,function(e,t){var i=y.read.remoteData(t);y.verbose("Restoring value from session data",i,t),i&&(n||(n={}),n[t]=i)})),n},choiceText:function(t,n){if(n=n!==i?n:A.preserveHTML,t)return t.find(O.menu).length>0&&(y.verbose("Retrieving text of element with sub-menu"),(t=t.clone()).find(O.menu).remove(),t.find(O.menuIcon).remove()),t.data(D.text)!==i?t.data(D.text):n?e.trim(t.html()):e.trim(t.text())},choiceValue:function(t,n){return n=n||y.get.choiceText(t),!!t&&(t.data(D.value)!==i?String(t.data(D.value)):"string"==typeof n?e.trim(n.toLowerCase()):String(n))},inputEvent:function(){var e=j[0];return!!e&&(e.oninput!==i?"input":e.onpropertychange!==i?"propertychange":"keyup")},selectValues:function(){var t={values:[]};return z.find("option").each(function(){var n=e(this),a=n.html(),o=n.attr("disabled"),s=n.attr("value")!==i?n.attr("value"):a;"auto"===A.placeholder&&""===s?t.placeholder=a:t.values.push({name:a,value:s,disabled:o})}),A.placeholder&&"auto"!==A.placeholder&&(y.debug("Setting placeholder value to",A.placeholder),t.placeholder=A.placeholder),A.sortSelect?(t.values.sort(function(e,t){return e.name>t.name?1:-1}),y.debug("Retrieved and sorted values from select",t)):y.debug("Retrieved values from select",t),t},activeItem:function(){return $.filter("."+T.active)},selectedItem:function(){var e=$.not(O.unselectable).filter("."+T.selected);return e.length>0?e:$.eq(0)},itemWithAdditions:function(e){var t=y.get.item(e),n=y.create.userChoice(e);return n&&n.length>0&&(t=t.length>0?t.add(n):n),t},item:function(t,n){var a,o,s=!1;return t=t!==i?t:y.get.values()!==i?y.get.values():y.get.text(),a=o?t.length>0:t!==i&&null!==t,o=y.is.multiple()&&e.isArray(t),n=""===t||0===t||(n||!1),a&&$.each(function(){var a=e(this),r=y.get.choiceText(a),l=y.get.choiceValue(a,r);if(null!==l&&l!==i)if(o)-1===e.inArray(String(l),t)&&-1===e.inArray(r,t)||(s=s?s.add(a):a);else if(n){if(y.verbose("Ambiguous dropdown value using strict type check",a,t),l===t||r===t)return s=a,!0}else if(String(l)==String(t)||r==t)return y.verbose("Found select item by value",l,t),s=a,!0}),s}},check:{maxSelections:function(e){return!A.maxSelections||((e=e!==i?e:y.get.selectionCount())>=A.maxSelections?(y.debug("Maximum selection count reached"),A.useLabels&&($.addClass(T.filtered),y.add.message(k.maxSelections)),!0):(y.verbose("No longer at maximum selection count"),y.remove.message(),y.remove.filteredItem(),y.is.searchSelection()&&y.filterItems(),!1))}},restore:{defaults:function(){y.clear(),y.restore.defaultText(),y.restore.defaultValue()},defaultText:function(){var e=y.get.defaultText();e===y.get.placeholderText?(y.debug("Restoring default placeholder text",e),y.set.placeholderText(e)):(y.debug("Restoring default text",e),y.set.text(e))},placeholderText:function(){y.set.placeholderText()},defaultValue:function(){var e=y.get.defaultValue();e!==i&&(y.debug("Restoring default value",e),""!==e?(y.set.value(e),y.set.selected()):(y.remove.activeItem(),y.remove.selectedItem()))},labels:function(){A.allowAdditions&&(A.useLabels||(y.error(V.labels),A.useLabels=!0),y.debug("Restoring selected values"),y.create.userLabels()),y.check.maxSelections()},selected:function(){y.restore.values(),y.is.multiple()?(y.debug("Restoring previously selected values and labels"),y.restore.labels()):y.debug("Restoring previously selected values")},values:function(){y.set.initialLoad(),A.apiSettings&&A.saveRemoteData&&y.get.remoteValues()?y.restore.remoteValues():y.set.selected(),y.remove.initialLoad()},remoteValues:function(){var t=y.get.remoteValues();y.debug("Recreating selected from session data",t),t&&(y.is.single()?e.each(t,function(e,t){y.set.text(t)}):e.each(t,function(e,t){y.add.label(e,t)}))}},read:{remoteData:function(e){var n;if(t.Storage!==i)return(n=sessionStorage.getItem(e))!==i&&n;y.error(V.noStorage)}},save:{defaults:function(){y.save.defaultText(),y.save.placeholderText(),y.save.defaultValue()},defaultValue:function(){var e=y.get.value();y.verbose("Saving default value as",e),z.data(D.defaultValue,e)},defaultText:function(){var e=y.get.text();y.verbose("Saving default text as",e),z.data(D.defaultText,e)},placeholderText:function(){var e;!1!==A.placeholder&&H.hasClass(T.placeholder)&&(e=y.get.text(),y.verbose("Saving placeholder text as",e),z.data(D.placeholderText,e))},remoteData:function(e,n){t.Storage!==i?(y.verbose("Saving remote data to session storage",n,e),sessionStorage.setItem(n,e)):y.error(V.noStorage)}},clear:function(){y.is.multiple()&&A.useLabels?y.remove.labels():(y.remove.activeItem(),y.remove.selectedItem()),y.set.placeholderText(),y.clearValue()},clearValue:function(){y.set.value("")},scrollPage:function(e,t){var n,i,a=t||y.get.selectedItem(),o=a.closest(O.menu),s=o.outerHeight(),r=o.scrollTop(),l=$.eq(0).outerHeight(),c=Math.floor(s/l),u=(o.prop("scrollHeight"),"up"==e?r-l*c:r+l*c),d=$.not(O.unselectable);i="up"==e?d.index(a)-c:d.index(a)+c,(n=("up"==e?i>=0:i<d.length)?d.eq(i):"up"==e?d.first():d.last()).length>0&&(y.debug("Scrolling page",e,n),a.removeClass(T.selected),n.addClass(T.selected),A.selectOnKeydown&&y.is.single()&&y.set.selectedItem(n),o.scrollTop(u))},set:{filtered:function(){var e=y.is.multiple(),t=y.is.searchSelection(),n=e&&t,i=t?y.get.query():"",a="string"==typeof i&&i.length>0,o=y.get.searchWidth(),s=""!==i;e&&a&&(y.verbose("Adjusting input width",o,A.glyphWidth),j.css("width",o)),a||n&&s?(y.verbose("Hiding placeholder text"),H.addClass(T.filtered)):(!e||n&&!s)&&(y.verbose("Showing placeholder text"),H.removeClass(T.filtered))},empty:function(){z.addClass(T.empty)},loading:function(){z.addClass(T.loading)},placeholderText:function(e){e=e||y.get.placeholderText(),y.debug("Setting placeholder text",e),y.set.text(e),H.addClass(T.placeholder)},tabbable:function(){y.is.searchSelection()?(y.debug("Added tabindex to searchable dropdown"),j.val("").attr("tabindex",0),B.attr("tabindex",-1)):(y.debug("Added tabindex to dropdown"),z.attr("tabindex")===i&&(z.attr("tabindex",0),B.attr("tabindex",-1)))},initialLoad:function(){y.verbose("Setting initial load"),g=!0},activeItem:function(e){A.allowAdditions&&e.filter(O.addition).length>0?e.addClass(T.filtered):e.addClass(T.active)},partialSearch:function(e){var t=y.get.query().length;j.val(e.substr(0,t))},scrollPosition:function(e,t){var n,a,o,s,r,l;n=(e=e||y.get.selectedItem()).closest(O.menu),a=e&&e.length>0,t=t!==i&&t,e&&n.length>0&&a&&(e.position().top,n.addClass(T.loading),o=(s=n.scrollTop())-n.offset().top+e.offset().top,t||(l=s+n.height()<o+5,r=o-5<s),y.debug("Scrolling to active item",o),(t||r||l)&&n.scrollTop(o),n.removeClass(T.loading))},text:function(e){"select"!==A.action&&("combo"==A.action?(y.debug("Changing combo button text",e,W),A.preserveHTML?W.html(e):W.text(e)):(e!==y.get.placeholderText()&&H.removeClass(T.placeholder),y.debug("Changing text",e,H),H.removeClass(T.filtered),A.preserveHTML?H.html(e):H.text(e)))},selectedItem:function(e){var t=y.get.choiceValue(e),n=y.get.choiceText(e,!1),i=y.get.choiceText(e,!0);y.debug("Setting user selection to item",e),y.remove.activeItem(),y.set.partialSearch(n),y.set.activeItem(e),y.set.selected(t,e),y.set.text(i)},selectedLetter:function(t){var n,i=$.filter("."+T.selected),a=!1;i.length>0&&y.has.firstLetter(i,t)&&(n=i.nextAll($).eq(0),y.has.firstLetter(n,t)&&(a=n)),a||$.each(function(){if(y.has.firstLetter(e(this),t))return a=e(this),!1}),a&&(y.verbose("Scrolling to next value with letter",t),y.set.scrollPosition(a),i.removeClass(T.selected),a.addClass(T.selected),A.selectOnKeydown&&y.is.single()&&y.set.selectedItem(a))},direction:function(e){"auto"==A.direction?(y.remove.upward(),y.can.openDownward(e)?y.remove.upward(e):y.set.upward(e),y.is.leftward(e)||y.can.openRightward(e)||y.set.leftward(e)):"upward"==A.direction&&y.set.upward(e)},upward:function(e){(e||z).addClass(T.upward)},leftward:function(e){(e||B).addClass(T.leftward)},value:function(e,t,n){var a=y.escape.value(e),o=U.length>0,s=y.get.values(),r=e!==i?String(e):e;if(o){if(!A.allowReselection&&r==s&&(y.verbose("Skipping value update already same value",e,s),!y.is.initialLoad()))return;y.is.single()&&y.has.selectInput()&&y.can.extendSelect()&&(y.debug("Adding user option",e),y.add.optionValue(e)),y.debug("Updating input value",a,s),Y=!0,U.val(a),!1===A.fireOnInit&&y.is.initialLoad()?y.debug("Input native change event ignored on initial load"):y.trigger.change(),Y=!1}else y.verbose("Storing value in metadata",a,U),a!==s&&z.data(D.value,r);!1===A.fireOnInit&&y.is.initialLoad()?y.verbose("No callback on initial load",A.onChange):A.onChange.call(G,e,t,n)},active:function(){z.addClass(T.active)},multiple:function(){z.addClass(T.multiple)},visible:function(){z.addClass(T.visible)},exactly:function(e,t){y.debug("Setting selected to exact values"),y.clear(),y.set.selected(e,t)},selected:function(t,n){var i=y.is.multiple();(n=A.allowAdditions?n||y.get.itemWithAdditions(t):n||y.get.item(t))&&(y.debug("Setting selected menu item to",n),y.is.multiple()&&y.remove.searchWidth(),y.is.single()?(y.remove.activeItem(),y.remove.selectedItem()):A.useLabels&&y.remove.selectedItem(),n.each(function(){var t=e(this),a=y.get.choiceText(t),o=y.get.choiceValue(t,a),s=t.hasClass(T.filtered),r=t.hasClass(T.active),l=t.hasClass(T.addition),c=i&&1==n.length;i?!r||l?(A.apiSettings&&A.saveRemoteData&&y.save.remoteData(a,o),A.useLabels?(y.add.label(o,a,c),y.add.value(o,a,t),y.set.activeItem(t),y.filterActive(),y.select.nextAvailable(n)):(y.add.value(o,a,t),y.set.text(y.add.variables(k.count)),y.set.activeItem(t))):s||(y.debug("Selected active value, removing label"),y.remove.selected(o)):(A.apiSettings&&A.saveRemoteData&&y.save.remoteData(a,o),y.set.text(a),y.set.value(o,a,t),t.addClass(T.active).addClass(T.selected))}))}},add:{label:function(t,n,i){var a,o=y.is.searchSelection()?j:H,s=y.escape.value(t);A.ignoreCase&&(s=s.toLowerCase()),a=e("<a />").addClass(T.label).attr("data-"+D.value,s).html(E.label(s,n)),a=A.onLabelCreate.call(a,s,n),y.has.label(t)?y.debug("User selection already exists, skipping",s):(A.label.variation&&a.addClass(A.label.variation),!0===i?(y.debug("Animating in label",a),a.addClass(T.hidden).insertBefore(o).transition(A.label.transition,A.label.duration)):(y.debug("Adding selection label",a),a.insertBefore(o)))},message:function(t){var n=B.children(O.message),i=A.templates.message(y.add.variables(t));n.length>0?n.html(i):n=e("<div/>").html(i).addClass(T.message).appendTo(B)},optionValue:function(t){var n=y.escape.value(t);U.find('option[value="'+y.escape.string(n)+'"]').length>0||(y.disconnect.selectObserver(),y.is.single()&&(y.verbose("Removing previous user addition"),U.find("option."+T.addition).remove()),e("<option/>").prop("value",n).addClass(T.addition).html(t).appendTo(U),y.verbose("Adding user addition as an <option>",t),y.observe.select())},userSuggestion:function(e){var t,n=B.children(O.addition),i=y.get.item(e),a=i&&i.not(O.addition).length,o=n.length>0;A.useLabels&&y.has.maxSelections()||(""===e||a?n.remove():(o?(n.data(D.value,e).data(D.text,e).attr("data-"+D.value,e).attr("data-"+D.text,e).removeClass(T.filtered),A.hideAdditions||(t=A.templates.addition(y.add.variables(k.addResult,e)),n.html(t)),y.verbose("Replacing user suggestion with new value",n)):((n=y.create.userChoice(e)).prependTo(B),y.verbose("Adding item choice to menu corresponding with user choice addition",n)),A.hideAdditions&&!y.is.allFiltered()||n.addClass(T.selected).siblings().removeClass(T.selected),y.refreshItems()))},variables:function(e,t){var n,i,a=-1!==e.search("{count}"),o=-1!==e.search("{maxCount}"),s=-1!==e.search("{term}");return y.verbose("Adding templated variables to message",e),a&&(n=y.get.selectionCount(),e=e.replace("{count}",n)),o&&(n=y.get.selectionCount(),e=e.replace("{maxCount}",A.maxSelections)),s&&(i=t||y.get.query(),e=e.replace("{term}",i)),e},value:function(t,n,i){var a,o=y.get.values();y.has.value(t)?y.debug("Value already selected"):""!==t?(e.isArray(o)?(a=o.concat([t]),a=y.get.uniqueArray(a)):a=[t],y.has.selectInput()?y.can.extendSelect()&&(y.debug("Adding value to select",t,a,U),y.add.optionValue(t)):(a=a.join(A.delimiter),y.debug("Setting hidden input to delimited value",a,U)),!1===A.fireOnInit&&y.is.initialLoad()?y.verbose("Skipping onadd callback on initial load",A.onAdd):A.onAdd.call(G,t,n,i),y.set.value(a,t,n,i),y.check.maxSelections()):y.debug("Cannot select blank values from multiselect")}},remove:{active:function(){z.removeClass(T.active)},activeLabel:function(){z.find(O.label).removeClass(T.active)},empty:function(){z.removeClass(T.empty)},loading:function(){z.removeClass(T.loading)},initialLoad:function(){g=!1},upward:function(e){(e||z).removeClass(T.upward)},leftward:function(e){(e||B).removeClass(T.leftward)},visible:function(){z.removeClass(T.visible)},activeItem:function(){$.removeClass(T.active)},filteredItem:function(){A.useLabels&&y.has.maxSelections()||(A.useLabels&&y.is.multiple()?$.not("."+T.active).removeClass(T.filtered):$.removeClass(T.filtered),y.remove.empty())},optionValue:function(e){var t=y.escape.value(e),n=U.find('option[value="'+y.escape.string(t)+'"]');n.length>0&&n.hasClass(T.addition)&&(C&&(C.disconnect(),y.verbose("Temporarily disconnecting mutation observer")),n.remove(),y.verbose("Removing user addition as an <option>",t),C&&C.observe(U[0],{childList:!0,subtree:!0}))},message:function(){B.children(O.message).remove()},searchWidth:function(){j.css("width","")},searchTerm:function(){y.verbose("Cleared search term"),j.val(""),y.set.filtered()},userAddition:function(){$.filter(O.addition).remove()},selected:function(t,n){if(!(n=A.allowAdditions?n||y.get.itemWithAdditions(t):n||y.get.item(t)))return!1;n.each(function(){var t=e(this),n=y.get.choiceText(t),i=y.get.choiceValue(t,n);y.is.multiple()?A.useLabels?(y.remove.value(i,n,t),y.remove.label(i)):(y.remove.value(i,n,t),0===y.get.selectionCount()?y.set.placeholderText():y.set.text(y.add.variables(k.count))):y.remove.value(i,n,t),t.removeClass(T.filtered).removeClass(T.active),A.useLabels&&t.removeClass(T.selected)})},selectedItem:function(){$.removeClass(T.selected)},value:function(e,t,n){var i,a=y.get.values();y.has.selectInput()?(y.verbose("Input is <select> removing selected option",e),i=y.remove.arrayValue(e,a),y.remove.optionValue(e)):(y.verbose("Removing from delimited values",e),i=(i=y.remove.arrayValue(e,a)).join(A.delimiter)),!1===A.fireOnInit&&y.is.initialLoad()?y.verbose("No callback on initial load",A.onRemove):A.onRemove.call(G,e,t,n),y.set.value(i,t,n),y.check.maxSelections()},arrayValue:function(t,n){return e.isArray(n)||(n=[n]),n=e.grep(n,function(e){return t!=e}),y.verbose("Removed value from delimited string",t,n),n},label:function(e,t){var n=z.find(O.label).filter("[data-"+D.value+'="'+y.escape.string(e)+'"]');y.verbose("Removing label",n),n.remove()},activeLabels:function(e){e=e||z.find(O.label).filter("."+T.active),y.verbose("Removing active label selections",e),y.remove.labels(e)},labels:function(t){t=t||z.find(O.label),y.verbose("Removing labels",t),t.each(function(){var t=e(this),n=t.data(D.value),a=n!==i?String(n):n,o=y.is.userValue(a);!1!==A.onLabelRemove.call(t,n)?(y.remove.message(),o?(y.remove.value(a),y.remove.label(a)):y.remove.selected(a)):y.debug("Label remove callback cancelled removal")})},tabbable:function(){y.is.searchSelection()?(y.debug("Searchable dropdown initialized"),j.removeAttr("tabindex"),B.removeAttr("tabindex")):(y.debug("Simple selection dropdown initialized"),z.removeAttr("tabindex"),B.removeAttr("tabindex"))}},has:{menuSearch:function(){return y.has.search()&&j.closest(B).length>0},search:function(){return j.length>0},sizer:function(){return N.length>0},selectInput:function(){return U.is("select")},minCharacters:function(e){return!A.minCharacters||(e=e!==i?String(e):String(y.get.query())).length>=A.minCharacters},firstLetter:function(e,t){var n;return!(!e||0===e.length||"string"!=typeof t)&&(n=y.get.choiceText(e,!1),(t=t.toLowerCase())==String(n).charAt(0).toLowerCase())},input:function(){return U.length>0},items:function(){return $.length>0},menu:function(){return B.length>0},message:function(){return 0!==B.children(O.message).length},label:function(e){var t=y.escape.value(e),n=z.find(O.label);return A.ignoreCase&&(t=t.toLowerCase()),n.filter("[data-"+D.value+'="'+y.escape.string(t)+'"]').length>0},maxSelections:function(){return A.maxSelections&&y.get.selectionCount()>=A.maxSelections},allResultsFiltered:function(){var e=$.not(O.addition);return e.filter(O.unselectable).length===e.length},userSuggestion:function(){return B.children(O.addition).length>0},query:function(){return""!==y.get.query()},value:function(e){return A.ignoreCase?y.has.valueIgnoringCase(e):y.has.valueMatchingCase(e)},valueMatchingCase:function(t){var n=y.get.values();return!!(e.isArray(n)?n&&-1!==e.inArray(t,n):n==t)},valueIgnoringCase:function(t){var n=y.get.values(),i=!1;return e.isArray(n)||(n=[n]),e.each(n,function(e,n){if(String(t).toLowerCase()==String(n).toLowerCase())return i=!0,!1}),i}},is:{active:function(){return z.hasClass(T.active)},animatingInward:function(){return B.transition("is inward")},animatingOutward:function(){return B.transition("is outward")},bubbledLabelClick:function(t){return e(t.target).is("select, input")&&z.closest("label").length>0},bubbledIconClick:function(t){return e(t.target).closest(K).length>0},alreadySetup:function(){return z.is("select")&&z.parent(O.dropdownXbox).data(F)!==i&&0===z.prev().length},animating:function(e){return e?e.transition&&e.transition("is animating"):B.transition&&B.transition("is animating")},leftward:function(e){return(e||B).hasClass(T.leftward)},disabled:function(){return z.hasClass(T.disabled)},focused:function(){return n.activeElement===z[0]},focusedOnSearch:function(){return n.activeElement===j[0]},allFiltered:function(){return(y.is.multiple()||y.has.search())&&!(0==A.hideAdditions&&y.has.userSuggestion())&&!y.has.message()&&y.has.allResultsFiltered()},hidden:function(e){return!y.is.visible(e)},initialLoad:function(){return g},inObject:function(t,n){var i=!1;return e.each(n,function(e,n){if(n==t)return i=!0,!0}),i},multiple:function(){return z.hasClass(T.multiple)},remote:function(){return A.apiSettings&&y.can.useAPI()},single:function(){return!y.is.multiple()},selectMutation:function(t){var n=!1;return e.each(t,function(t,i){if(i.target&&e(i.target).is("select"))return n=!0,!0}),n},search:function(){return z.hasClass(T.search)},searchSelection:function(){return y.has.search()&&1===j.parent(O.dropdownXbox).length},selection:function(){return z.hasClass(T.selection)},userValue:function(t){return-1!==e.inArray(t,y.get.userValues())},upward:function(e){return(e||z).hasClass(T.upward)},visible:function(e){return e?e.hasClass(T.visible):B.hasClass(T.visible)},verticallyScrollableContext:function(){var e=P.get(0)!==t&&P.css("overflow-y");return"auto"==e||"scroll"==e},horizontallyScrollableContext:function(){var e=P.get(0)!==t&&P.css("overflow-X");return"auto"==e||"scroll"==e}},can:{activate:function(e){return!!A.useLabels||(!y.has.maxSelections()||!(!y.has.maxSelections()||!e.hasClass(T.active)))},openDownward:function(e){var n,i,a=e||B,o=!0;return a.addClass(T.loading),i={context:{offset:P.get(0)===t?{top:0,left:0}:P.offset(),scrollTop:P.scrollTop(),height:P.outerHeight()},menu:{offset:a.offset(),height:a.outerHeight()}},y.is.verticallyScrollableContext()&&(i.menu.offset.top+=i.context.scrollTop),(n={above:i.context.scrollTop<=i.menu.offset.top-i.context.offset.top-i.menu.height,below:i.context.scrollTop+i.context.height>=i.menu.offset.top-i.context.offset.top+i.menu.height}).below?(y.verbose("Dropdown can fit in context downward",n),o=!0):n.below||n.above?(y.verbose("Dropdown cannot fit below, opening upward",n),o=!1):(y.verbose("Dropdown cannot fit in either direction, favoring downward",n),o=!0),a.removeClass(T.loading),o},openRightward:function(e){var n,i,a=e||B,o=!0;return a.addClass(T.loading),i={context:{offset:P.get(0)===t?{top:0,left:0}:P.offset(),scrollLeft:P.scrollLeft(),width:P.outerWidth()},menu:{offset:a.offset(),width:a.outerWidth()}},y.is.horizontallyScrollableContext()&&(i.menu.offset.left+=i.context.scrollLeft),(n=i.menu.offset.left-i.context.offset.left+i.menu.width>=i.context.scrollLeft+i.context.width)&&(y.verbose("Dropdown cannot fit in context rightward",n),o=!1),a.removeClass(T.loading),o},click:function(){return c||"click"==A.on},extendSelect:function(){return A.allowAdditions||A.apiSettings},show:function(){return!y.is.disabled()&&(y.has.items()||y.has.message())},useAPI:function(){return e.fn.api!==i}},animate:{show:function(t,n){var a,o=n||B,s=n?function(){}:function(){y.hideSubMenus(),y.hideOthers(),y.set.active()};t=e.isFunction(t)?t:function(){},y.verbose("Doing menu show animation",o),y.set.direction(n),a=y.get.transition(n),y.is.selection()&&y.set.scrollPosition(y.get.selectedItem(),!0),(y.is.hidden(o)||y.is.animating(o))&&("none"==a?(s(),o.transition("show"),t.call(G)):e.fn.transition!==i&&z.transition("is supported")?o.transition({animation:a+" in",debug:A.debug,verbose:A.verbose,duration:A.duration,queue:!0,onStart:s,onComplete:function(){t.call(G)}}):y.error(V.noTransition,a))},hide:function(t,n){var a=n||B,o=(n?A.duration:A.duration,n?function(){}:function(){y.can.click()&&y.unbind.intent(),y.remove.active()}),s=y.get.transition(n);t=e.isFunction(t)?t:function(){},(y.is.visible(a)||y.is.animating(a))&&(y.verbose("Doing menu hide animation",a),"none"==s?(o(),a.transition("hide"),t.call(G)):e.fn.transition!==i&&z.transition("is supported")?a.transition({animation:s+" out",duration:A.duration,debug:A.debug,verbose:A.verbose,queue:!1,onStart:o,onComplete:function(){t.call(G)}}):y.error(V.transition))}},hideAndClear:function(){y.remove.searchTerm(),y.has.maxSelections()||(y.has.search()?y.hide(function(){y.remove.filteredItem()}):y.hide())},delay:{show:function(){y.verbose("Delaying show event to ensure user intent"),clearTimeout(y.timer),y.timer=setTimeout(y.show,A.delay.show)},hide:function(){y.verbose("Delaying hide event to ensure user intent"),clearTimeout(y.timer),y.timer=setTimeout(y.hide,A.delay.hide)}},escape:{value:function(t){var n=e.isArray(t),i="string"==typeof t,a=!i&&!n,o=i&&-1!==t.search(R.quote),s=[];return a||!o?t:(y.debug("Encoding quote values for use in select",t),n?(e.each(t,function(e,t){s.push(t.replace(R.quote,"&quot;"))}),s):t.replace(R.quote,"&quot;"))},string:function(e){return(e=String(e)).replace(R.escape,"\\$&")}},setting:function(t,n){if(y.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,A,t);else{if(n===i)return A[t];e.isPlainObject(A[t])?e.extend(!0,A[t],n):A[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,y,t);else{if(n===i)return y[t];y[t]=n}},debug:function(){!A.silent&&A.debug&&(A.performance?y.performance.log(arguments):(y.debug=Function.prototype.bind.call(console.info,console,A.name+":"),y.debug.apply(console,arguments)))},verbose:function(){!A.silent&&A.verbose&&A.debug&&(A.performance?y.performance.log(arguments):(y.verbose=Function.prototype.bind.call(console.info,console,A.name+":"),y.verbose.apply(console,arguments)))},error:function(){A.silent||(y.error=Function.prototype.bind.call(console.error,console,A.name+":"),y.error.apply(console,arguments))},performance:{log:function(e){var t,n;A.performance&&(n=(t=(new Date).getTime())-(u||t),u=t,d.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:G,"Execution Time":n})),clearTimeout(y.performance.timer),y.performance.timer=setTimeout(y.performance.display,500)},display:function(){var t=A.name+":",n=0;u=!1,clearTimeout(y.performance.timer),e.each(d,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",l&&(t+=" '"+l+"'"),(console.group!==i||console.table!==i)&&d.length>0&&(console.groupCollapsed(t),console.table?console.table(d):e.each(d,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),d=[]}},invoke:function(t,n,a){var s,r,l,c=J;return n=n||m,a=G||a,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),s=t.length-1,e.each(t,function(n,a){var o=n!=s?a+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[o])&&n!=s)c=c[o];else{if(c[o]!==i)return r=c[o],!1;if(!e.isPlainObject(c[a])||n==s)return c[a]!==i?(r=c[a],!1):(y.error(V.method,t),!1);c=c[a]}})),e.isFunction(r)?l=r.apply(a,n):r!==i&&(l=r),e.isArray(o)?o.push(l):o!==i?o=[o,l]:l!==i&&(o=l),r}},f?(J===i&&y.initialize(),y.invoke(v)):(J!==i&&J.invoke("destroy"),y.initialize())}),o!==i?o:s},e.fn.dropdownXbox.settings={silent:!1,debug:!1,verbose:!1,performance:!0,on:"click",action:"activate",values:!1,apiSettings:!1,selectOnKeydown:!0,minCharacters:0,filterRemoteData:!1,saveRemoteData:!0,throttle:200,context:t,direction:"auto",keepOnScreen:!0,match:"both",fullTextSearch:!1,placeholder:"auto",preserveHTML:!0,sortSelect:!1,forceSelection:!0,allowAdditions:!1,ignoreCase:!1,hideAdditions:!0,maxSelections:!1,useLabels:!0,delimiter:",",showOnFocus:!0,allowReselection:!1,allowTab:!0,allowCategorySelection:!1,fireOnInit:!1,transition:"auto",duration:200,glyphWidth:1.037,label:{transition:"scale",duration:200,variation:!1},delay:{hide:300,show:200,search:20,touch:50},onChange:function(e,t,n){},onAdd:function(e,t,n){},onRemove:function(e,t,n){},onLabelSelect:function(e){},onLabelCreate:function(t,n){return e(this)},onLabelRemove:function(e){return!0},onNoResults:function(e){return!0},onShow:function(){},onHide:function(){},name:"Dropdown",namespace:"dropdown",message:{addResult:"Add <b>{term}</b>",count:"{count} selected",maxSelections:"Max {maxCount} selections",noResults:"No results found.",serverError:"There was an error contacting the server"},error:{action:"You called a dropdown action that was not defined",alreadySetup:"Once a select has been initialized behaviors must be called on the created ui dropdown",labels:"Allowing user additions currently requires the use of labels.",missingMultiple:"<select> requires multiple property to be set to correctly preserve multiple values",method:"The method you called is not defined.",noAPI:"The API module is required to load resources remotely",noStorage:"Saving remote data requires session storage",noTransition:"This module requires ui transitions <https://github.com/Semantic-Org/UI-Transition>"},regExp:{escape:/[-[\]{}()*+?.,\\^$|#\s]/g,quote:/"/g},metadata:{defaultText:"defaultText",defaultValue:"defaultValue",placeholderText:"placeholder",text:"text",value:"value"},fields:{remoteValues:"results",values:"values",disabled:"disabled",name:"name",value:"value",text:"text"},keys:{backspace:8,delimiter:188,deleteKey:46,enter:13,escape:27,pageUp:33,pageDown:34,leftArrow:37,upArrow:38,rightArrow:39,downArrow:40},selector:{addition:".addition",dropdown:".ui.dropdown",hidden:".hidden",icon:"> .dropdown.icon",input:'> input[type="hidden"], > select',item:".item",label:"> .label",remove:"> .label > .delete.icon",siblingLabel:".label",menu:".menu",message:".message",menuIcon:".dropdown.icon",search:"input.search, .menu > .search > input, .menu input.search",sizer:"> input.sizer",text:"> .text:not(.icon)",unselectable:".disabled, .filtered"},className:{active:"active",addition:"addition",animating:"animating",disabled:"disabled",empty:"empty",dropdown:"ui dropdown",filtered:"filtered",hidden:"hidden transition",item:"item",label:"ui label",loading:"loading",menu:"menu",message:"message",multiple:"multiple",placeholder:"default",sizer:"sizer",search:"search",selected:"selected",selection:"selection",upward:"upward",leftward:"left",visible:"visible"}},e.fn.dropdownXbox.settings.templates={dropdownXbox:function(t){var n=t.placeholder||!1,i=(t.values,"");return i+='<i class="dropdown icon"></i>',t.placeholder?i+='<div class="default text">'+n+"</div>":i+='<div class="text"></div>',i+='<div class="menu">',e.each(t.values,function(e,t){i+=t.disabled?'<div class="disabled item" data-value="'+t.value+'">'+t.name+"</div>":'<div class="item" data-value="'+t.value+'">'+t.name+"</div>"}),i+="</div>"},menu:function(t,n){var i=t[n.values]||{},a="";return e.each(i,function(e,t){var i=t[n.text]?'data-text="'+t[n.text]+'"':"",o=t[n.disabled]?"disabled ":"";a+='<div class="'+o+'item" data-value="'+t[n.value]+'"'+i+">",a+=t[n.name],a+="</div>"}),a},label:function(e,t){return t+'<i class="delete icon"></i>'},message:function(e){return e},addition:function(e){return e}}}(jQuery,window,document);;
/*!
 * # Semantic UI 2.2.4 - Transition
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
!function(n,e,i,t){"use strict";e="undefined"!=typeof e&&e.Math==Math?e:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),n.fn.transition=function(){var a,o=n(this),r=o.selector||"",s=(new Date).getTime(),l=[],u=arguments,c=u[0],d=[].slice.call(arguments,1),m="string"==typeof c;e.requestAnimationFrame||e.mozRequestAnimationFrame||e.webkitRequestAnimationFrame||e.msRequestAnimationFrame||function(n){setTimeout(n,0)};return o.each(function(e){var f,p,g,v,b,y,h,w,C,A=n(this),S=this;C={initialize:function(){f=C.get.settings.apply(S,u),v=f.className,g=f.error,b=f.metadata,w="."+f.namespace,h="module-"+f.namespace,p=A.data(h)||C,y=C.get.animationEndEvent(),m&&(m=C.invoke(c)),m===!1&&(C.verbose("Converted arguments into settings object",f),f.interval?C.delay(f.animate):C.animate(),C.instantiate())},instantiate:function(){C.verbose("Storing instance of module",C),p=C,A.data(h,p)},destroy:function(){C.verbose("Destroying previous module for",S),A.removeData(h)},refresh:function(){C.verbose("Refreshing display type on next animation"),delete C.displayType},forceRepaint:function(){C.verbose("Forcing element repaint");var n=A.parent(),e=A.next();0===e.length?A.detach().appendTo(n):A.detach().insertBefore(e)},repaint:function(){C.verbose("Repainting element");S.offsetWidth},delay:function(n){var i,a,r=C.get.animationDirection();r||(r=C.can.transition()?C.get.direction():"static"),n=n!==t?n:f.interval,i="auto"==f.reverse&&r==v.outward,a=i||1==f.reverse?(o.length-e)*f.interval:e*f.interval,C.debug("Delaying animation by",a),setTimeout(C.animate,a)},animate:function(n){if(f=n||f,!C.is.supported())return C.error(g.support),!1;if(C.debug("Preparing animation",f.animation),C.is.animating()){if(f.queue)return!f.allowRepeats&&C.has.direction()&&C.is.occurring()&&C.queuing!==!0?C.debug("Animation is currently occurring, preventing queueing same animation",f.animation):C.queue(f.animation),!1;if(!f.allowRepeats&&C.is.occurring())return C.debug("Animation is already occurring, will not execute repeated animation",f.animation),!1;C.debug("New animation started, completing previous early",f.animation),p.complete()}C.can.animate()?C.set.animating(f.animation):C.error(g.noAnimation,f.animation,S)},reset:function(){C.debug("Resetting animation to beginning conditions"),C.remove.animationCallbacks(),C.restore.conditions(),C.remove.animating()},queue:function(n){C.debug("Queueing animation of",n),C.queuing=!0,A.one(y+".queue"+w,function(){C.queuing=!1,C.repaint(),C.animate.apply(this,f)})},complete:function(n){C.debug("Animation complete",f.animation),C.remove.completeCallback(),C.remove.failSafe(),C.is.looping()||(C.is.outward()?(C.verbose("Animation is outward, hiding element"),C.restore.conditions(),C.hide()):C.is.inward()?(C.verbose("Animation is outward, showing element"),C.restore.conditions(),C.show()):(C.verbose("Static animation completed"),C.restore.conditions(),f.onComplete.call(S)))},force:{visible:function(){var n=A.attr("style"),e=C.get.userStyle(),i=C.get.displayType(),a=e+"display: "+i+" !important;",o=A.css("display"),r=n===t||""===n;o!==i?(C.verbose("Overriding default display to show element",i),A.attr("style",a)):r&&A.removeAttr("style")},hidden:function(){var n=A.attr("style"),e=A.css("display"),i=n===t||""===n;"none"===e||C.is.hidden()?i&&A.removeAttr("style"):(C.verbose("Overriding default display to hide element"),A.css("display","none"))}},has:{direction:function(e){var i=!1;return e=e||f.animation,"string"==typeof e&&(e=e.split(" "),n.each(e,function(n,e){e!==v.inward&&e!==v.outward||(i=!0)})),i},inlineDisplay:function(){var e=A.attr("style")||"";return n.isArray(e.match(/display.*?;/,""))}},set:{animating:function(n){var e;C.remove.completeCallback(),n=n||f.animation,e=C.get.animationClass(n),C.save.animation(e),C.force.visible(),C.remove.hidden(),C.remove.direction(),C.start.animation(e)},duration:function(n,e){e=e||f.duration,e="number"==typeof e?e+"ms":e,(e||0===e)&&(C.verbose("Setting animation duration",e),A.css({"animation-duration":e}))},direction:function(n){n=n||C.get.direction(),n==v.inward?C.set.inward():C.set.outward()},looping:function(){C.debug("Transition set to loop"),A.addClass(v.looping)},hidden:function(){A.addClass(v.transition).addClass(v.hidden)},inward:function(){C.debug("Setting direction to inward"),A.removeClass(v.outward).addClass(v.inward)},outward:function(){C.debug("Setting direction to outward"),A.removeClass(v.inward).addClass(v.outward)},visible:function(){A.addClass(v.transition).addClass(v.visible)}},start:{animation:function(n){n=n||C.get.animationClass(),C.debug("Starting tween",n),A.addClass(n).one(y+".complete"+w,C.complete),f.useFailSafe&&C.add.failSafe(),C.set.duration(f.duration),f.onStart.call(S)}},save:{animation:function(n){C.cache||(C.cache={}),C.cache.animation=n},displayType:function(n){"none"!==n&&A.data(b.displayType,n)},transitionExists:function(e,i){n.fn.transition.exists[e]=i,C.verbose("Saving existence of transition",e,i)}},restore:{conditions:function(){var n=C.get.currentAnimation();n&&(A.removeClass(n),C.verbose("Removing animation class",C.cache)),C.remove.duration()}},add:{failSafe:function(){var n=C.get.duration();C.timer=setTimeout(function(){A.triggerHandler(y)},n+f.failSafeDelay),C.verbose("Adding fail safe timer",C.timer)}},remove:{animating:function(){A.removeClass(v.animating)},animationCallbacks:function(){C.remove.queueCallback(),C.remove.completeCallback()},queueCallback:function(){A.off(".queue"+w)},completeCallback:function(){A.off(".complete"+w)},display:function(){A.css("display","")},direction:function(){A.removeClass(v.inward).removeClass(v.outward)},duration:function(){A.css("animation-duration","")},failSafe:function(){C.verbose("Removing fail safe timer",C.timer),C.timer&&clearTimeout(C.timer)},hidden:function(){A.removeClass(v.hidden)},visible:function(){A.removeClass(v.visible)},looping:function(){C.debug("Transitions are no longer looping"),C.is.looping()&&(C.reset(),A.removeClass(v.looping))},transition:function(){A.removeClass(v.visible).removeClass(v.hidden)}},get:{settings:function(e,i,t){return"object"==typeof e?n.extend(!0,{},n.fn.transition.settings,e):"function"==typeof t?n.extend({},n.fn.transition.settings,{animation:e,onComplete:t,duration:i}):"string"==typeof i||"number"==typeof i?n.extend({},n.fn.transition.settings,{animation:e,duration:i}):"object"==typeof i?n.extend({},n.fn.transition.settings,i,{animation:e}):"function"==typeof i?n.extend({},n.fn.transition.settings,{animation:e,onComplete:i}):n.extend({},n.fn.transition.settings,{animation:e})},animationClass:function(n){var e=n||f.animation,i=C.can.transition()&&!C.has.direction()?C.get.direction()+" ":"";return v.animating+" "+v.transition+" "+i+e},currentAnimation:function(){return!(!C.cache||C.cache.animation===t)&&C.cache.animation},currentDirection:function(){return C.is.inward()?v.inward:v.outward},direction:function(){return C.is.hidden()||!C.is.visible()?v.inward:v.outward},animationDirection:function(e){var i;return e=e||f.animation,"string"==typeof e&&(e=e.split(" "),n.each(e,function(n,e){e===v.inward?i=v.inward:e===v.outward&&(i=v.outward)})),!!i&&i},duration:function(n){return n=n||f.duration,n===!1&&(n=A.css("animation-duration")||0),"string"==typeof n?n.indexOf("ms")>-1?parseFloat(n):1e3*parseFloat(n):n},displayType:function(){return f.displayType?f.displayType:(A.data(b.displayType)===t&&C.can.transition(!0),A.data(b.displayType))},userStyle:function(n){return n=n||A.attr("style")||"",n.replace(/display.*?;/,"")},transitionExists:function(e){return n.fn.transition.exists[e]},animationStartEvent:function(){var n,e=i.createElement("div"),a={animation:"animationstart",OAnimation:"oAnimationStart",MozAnimation:"mozAnimationStart",WebkitAnimation:"webkitAnimationStart"};for(n in a)if(e.style[n]!==t)return a[n];return!1},animationEndEvent:function(){var n,e=i.createElement("div"),a={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"mozAnimationEnd",WebkitAnimation:"webkitAnimationEnd"};for(n in a)if(e.style[n]!==t)return a[n];return!1}},can:{transition:function(e){var i,a,o,r,s,l,u,c=f.animation,d=C.get.transitionExists(c);if(d===t||e){if(C.verbose("Determining whether animation exists"),i=A.attr("class"),a=A.prop("tagName"),o=n("<"+a+" />").addClass(i).insertAfter(A),r=o.addClass(c).removeClass(v.inward).removeClass(v.outward).addClass(v.animating).addClass(v.transition).css("animationName"),s=o.addClass(v.inward).css("animationName"),u=o.attr("class",i).removeAttr("style").removeClass(v.hidden).removeClass(v.visible).show().css("display"),C.verbose("Determining final display state",u),C.save.displayType(u),o.remove(),r!=s)C.debug("Direction exists for animation",c),l=!0;else{if("none"==r||!r)return void C.debug("No animation defined in css",c);C.debug("Static animation found",c,u),l=!1}C.save.transitionExists(c,l)}return d!==t?d:l},animate:function(){return C.can.transition()!==t}},is:{animating:function(){return A.hasClass(v.animating)},inward:function(){return A.hasClass(v.inward)},outward:function(){return A.hasClass(v.outward)},looping:function(){return A.hasClass(v.looping)},occurring:function(n){return n=n||f.animation,n="."+n.replace(" ","."),A.filter(n).length>0},visible:function(){return A.is(":visible")},hidden:function(){return"hidden"===A.css("visibility")},supported:function(){return y!==!1}},hide:function(){C.verbose("Hiding element"),C.is.animating()&&C.reset(),S.blur(),C.remove.display(),C.remove.visible(),C.set.hidden(),C.force.hidden(),f.onHide.call(S),f.onComplete.call(S)},show:function(n){C.verbose("Showing element",n),C.remove.hidden(),C.set.visible(),C.force.visible(),f.onShow.call(S),f.onComplete.call(S)},toggle:function(){C.is.visible()?C.hide():C.show()},stop:function(){C.debug("Stopping current animation"),A.triggerHandler(y)},stopAll:function(){C.debug("Stopping all animation"),C.remove.queueCallback(),A.triggerHandler(y)},clear:{queue:function(){C.debug("Clearing animation queue"),C.remove.queueCallback()}},enable:function(){C.verbose("Starting animation"),A.removeClass(v.disabled)},disable:function(){C.debug("Stopping animation"),A.addClass(v.disabled)},setting:function(e,i){if(C.debug("Changing setting",e,i),n.isPlainObject(e))n.extend(!0,f,e);else{if(i===t)return f[e];n.isPlainObject(f[e])?n.extend(!0,f[e],i):f[e]=i}},internal:function(e,i){if(n.isPlainObject(e))n.extend(!0,C,e);else{if(i===t)return C[e];C[e]=i}},debug:function(){!f.silent&&f.debug&&(f.performance?C.performance.log(arguments):(C.debug=Function.prototype.bind.call(console.info,console,f.name+":"),C.debug.apply(console,arguments)))},verbose:function(){!f.silent&&f.verbose&&f.debug&&(f.performance?C.performance.log(arguments):(C.verbose=Function.prototype.bind.call(console.info,console,f.name+":"),C.verbose.apply(console,arguments)))},error:function(){f.silent||(C.error=Function.prototype.bind.call(console.error,console,f.name+":"),C.error.apply(console,arguments))},performance:{log:function(n){var e,i,t;f.performance&&(e=(new Date).getTime(),t=s||e,i=e-t,s=e,l.push({Name:n[0],Arguments:[].slice.call(n,1)||"",Element:S,"Execution Time":i})),clearTimeout(C.performance.timer),C.performance.timer=setTimeout(C.performance.display,500)},display:function(){var e=f.name+":",i=0;s=!1,clearTimeout(C.performance.timer),n.each(l,function(n,e){i+=e["Execution Time"]}),e+=" "+i+"ms",r&&(e+=" '"+r+"'"),o.length>1&&(e+=" ("+o.length+")"),(console.group!==t||console.table!==t)&&l.length>0&&(console.groupCollapsed(e),console.table?console.table(l):n.each(l,function(n,e){console.log(e.Name+": "+e["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(e,i,o){var r,s,l,u=p;return i=i||d,o=S||o,"string"==typeof e&&u!==t&&(e=e.split(/[\. ]/),r=e.length-1,n.each(e,function(i,a){var o=i!=r?a+e[i+1].charAt(0).toUpperCase()+e[i+1].slice(1):e;if(n.isPlainObject(u[o])&&i!=r)u=u[o];else{if(u[o]!==t)return s=u[o],!1;if(!n.isPlainObject(u[a])||i==r)return u[a]!==t&&(s=u[a],!1);u=u[a]}})),n.isFunction(s)?l=s.apply(o,i):s!==t&&(l=s),n.isArray(a)?a.push(l):a!==t?a=[a,l]:l!==t&&(a=l),s!==t&&s}},C.initialize()}),a!==t?a:this},n.fn.transition.exists={},n.fn.transition.settings={name:"Transition",silent:!1,debug:!1,verbose:!1,performance:!0,namespace:"transition",interval:0,reverse:"auto",onStart:function(){},onComplete:function(){},onShow:function(){},onHide:function(){},useFailSafe:!0,failSafeDelay:100,allowRepeats:!1,displayType:!1,animation:"fade",duration:!1,queue:!0,metadata:{displayType:"display"},className:{animating:"animating",disabled:"disabled",hidden:"hidden",inward:"in",loading:"loading",looping:"looping",outward:"out",transition:"transition",visible:"visible"},error:{noAnimation:"Element is no longer attached to DOM. Unable to animate.  Use silent setting to surpress this warning in production.",repeated:"That animation is already occurring, cancelling repeated animation",method:"The method you called is not defined",support:"This browser does not support CSS animations"}}}(jQuery,window,document);;
/*!
Tipso
*/

!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof exports?module.exports=t(require("jquery")):t(jQuery)}(function(t){function o(o,e){this.element=o,this.$element=t(this.element),this.doc=t(document),this.win=t(window),this.settings=t.extend({},n,e),"object"==typeof this.$element.data("tipso")&&t.extend(this.settings,this.$element.data("tipso"));for(var r=Object.keys(this.$element.data()),s={},d=0;d<r.length;d++){var l=r[d].replace(i,"");if(""!==l){l=l.charAt(0).toLowerCase()+l.slice(1),s[l]=this.$element.data(r[d]);for(var p in this.settings)p.toLowerCase()==l&&(this.settings[p]=s[l])}}this._defaults=n,this._name=i,this._title=this.$element.attr("title"),this.mode="hide",this.ieFade=!a,this.settings.preferedPosition=this.settings.position,this.init()}function e(o){var e=o.clone();e.css("visibility","hidden"),t("body").append(e);var r=e.outerHeight(),s=e.outerWidth();return e.remove(),{width:s,height:r}}function r(t){t.removeClass("top_right_corner bottom_right_corner top_left_corner bottom_left_corner"),t.find(".tipso_title").removeClass("top_right_corner bottom_right_corner top_left_corner bottom_left_corner")}function s(o){var i,n,a,d=o.tooltip(),l=o.$element,p=o,f=t(window),g=10,c=p.settings.background,h=p.titleContent();switch(void 0!==h&&""!==h&&(c=p.settings.titleBackground),l.parent().outerWidth()>f.outerWidth()&&(f=l.parent()),p.settings.position){case"top-right":n=l.offset().left+l.outerWidth(),i=l.offset().top-e(d).height-g,d.find(".tipso_arrow").css({marginLeft:-p.settings.arrowWidth,marginTop:""}),i<f.scrollTop()?(i=l.offset().top+l.outerHeight()+g,d.find(".tipso_arrow").css({"border-bottom-color":c,"border-top-color":"transparent","border-left-color":"transparent","border-right-color":"transparent"}),r(d),d.addClass("bottom_right_corner"),d.find(".tipso_title").addClass("bottom_right_corner"),d.find(".tipso_arrow").css({"border-left-color":c}),d.removeClass("top-right top bottom left right"),d.addClass("bottom")):(d.find(".tipso_arrow").css({"border-top-color":p.settings.background,"border-bottom-color":"transparent ","border-left-color":"transparent","border-right-color":"transparent"}),r(d),d.addClass("top_right_corner"),d.find(".tipso_arrow").css({"border-left-color":p.settings.background}),d.removeClass("top bottom left right"),d.addClass("top"));break;case"top-left":n=l.offset().left-e(d).width,i=l.offset().top-e(d).height-g,d.find(".tipso_arrow").css({marginLeft:-p.settings.arrowWidth,marginTop:""}),i<f.scrollTop()?(i=l.offset().top+l.outerHeight()+g,d.find(".tipso_arrow").css({"border-bottom-color":c,"border-top-color":"transparent","border-left-color":"transparent","border-right-color":"transparent"}),r(d),d.addClass("bottom_left_corner"),d.find(".tipso_title").addClass("bottom_left_corner"),d.find(".tipso_arrow").css({"border-right-color":c}),d.removeClass("top-right top bottom left right"),d.addClass("bottom")):(d.find(".tipso_arrow").css({"border-top-color":p.settings.background,"border-bottom-color":"transparent ","border-left-color":"transparent","border-right-color":"transparent"}),r(d),d.addClass("top_left_corner"),d.find(".tipso_arrow").css({"border-right-color":p.settings.background}),d.removeClass("top bottom left right"),d.addClass("top"));break;case"bottom-right":n=l.offset().left+l.outerWidth(),i=l.offset().top+l.outerHeight()+g,d.find(".tipso_arrow").css({marginLeft:-p.settings.arrowWidth,marginTop:""}),i+e(d).height>f.scrollTop()+f.outerHeight()?(i=l.offset().top-e(d).height-g,d.find(".tipso_arrow").css({"border-bottom-color":"transparent","border-top-color":p.settings.background,"border-left-color":"transparent","border-right-color":"transparent"}),r(d),d.addClass("top_right_corner"),d.find(".tipso_title").addClass("top_left_corner"),d.find(".tipso_arrow").css({"border-left-color":p.settings.background}),d.removeClass("top-right top bottom left right"),d.addClass("top")):(d.find(".tipso_arrow").css({"border-top-color":"transparent","border-bottom-color":c,"border-left-color":"transparent","border-right-color":"transparent"}),r(d),d.addClass("bottom_right_corner"),d.find(".tipso_title").addClass("bottom_right_corner"),d.find(".tipso_arrow").css({"border-left-color":c}),d.removeClass("top bottom left right"),d.addClass("bottom"));break;case"bottom-left":n=l.offset().left-e(d).width,i=l.offset().top+l.outerHeight()+g,d.find(".tipso_arrow").css({marginLeft:-p.settings.arrowWidth,marginTop:""}),i+e(d).height>f.scrollTop()+f.outerHeight()?(i=l.offset().top-e(d).height-g,d.find(".tipso_arrow").css({"border-bottom-color":"transparent","border-top-color":p.settings.background,"border-left-color":"transparent","border-right-color":"transparent"}),r(d),d.addClass("top_left_corner"),d.find(".tipso_title").addClass("top_left_corner"),d.find(".tipso_arrow").css({"border-right-color":p.settings.background}),d.removeClass("top-right top bottom left right"),d.addClass("top")):(d.find(".tipso_arrow").css({"border-top-color":"transparent","border-bottom-color":c,"border-left-color":"transparent","border-right-color":"transparent"}),r(d),d.addClass("bottom_left_corner"),d.find(".tipso_title").addClass("bottom_left_corner"),d.find(".tipso_arrow").css({"border-right-color":c}),d.removeClass("top bottom left right"),d.addClass("bottom"));break;case"top":n=l.offset().left+l.outerWidth()/2-e(d).width/2,i=l.offset().top-e(d).height-g,d.find(".tipso_arrow").css({marginLeft:-p.settings.arrowWidth,marginTop:""}),i<f.scrollTop()?(i=l.offset().top+l.outerHeight()+g,d.find(".tipso_arrow").css({"border-bottom-color":c,"border-top-color":"transparent","border-left-color":"transparent","border-right-color":"transparent"}),d.removeClass("top bottom left right"),d.addClass("bottom")):(d.find(".tipso_arrow").css({"border-top-color":p.settings.background,"border-bottom-color":"transparent","border-left-color":"transparent","border-right-color":"transparent"}),d.removeClass("top bottom left right"),d.addClass("top"));break;case"bottom":n=l.offset().left+l.outerWidth()/2-e(d).width/2,i=l.offset().top+l.outerHeight()+g,d.find(".tipso_arrow").css({marginLeft:-p.settings.arrowWidth,marginTop:""}),i+e(d).height>f.scrollTop()+f.outerHeight()?(i=l.offset().top-e(d).height-g,d.find(".tipso_arrow").css({"border-top-color":p.settings.background,"border-bottom-color":"transparent","border-left-color":"transparent","border-right-color":"transparent"}),d.removeClass("top bottom left right"),d.addClass("top")):(d.find(".tipso_arrow").css({"border-bottom-color":c,"border-top-color":"transparent","border-left-color":"transparent","border-right-color":"transparent"}),d.removeClass("top bottom left right"),d.addClass(p.settings.position));break;case"left":n=l.offset().left-e(d).width-g,i=l.offset().top+l.outerHeight()/2-e(d).height/2,d.find(".tipso_arrow").css({marginTop:-p.settings.arrowWidth,marginLeft:""}),n<f.scrollLeft()?(n=l.offset().left+l.outerWidth()+g,d.find(".tipso_arrow").css({"border-right-color":p.settings.background,"border-left-color":"transparent","border-top-color":"transparent","border-bottom-color":"transparent"}),d.removeClass("top bottom left right"),d.addClass("right")):(d.find(".tipso_arrow").css({"border-left-color":p.settings.background,"border-right-color":"transparent","border-top-color":"transparent","border-bottom-color":"transparent"}),d.removeClass("top bottom left right"),d.addClass(p.settings.position));break;case"right":n=l.offset().left+l.outerWidth()+g,i=l.offset().top+l.outerHeight()/2-e(d).height/2,d.find(".tipso_arrow").css({marginTop:-p.settings.arrowWidth,marginLeft:""}),n+g+p.settings.width>f.scrollLeft()+f.outerWidth()?(n=l.offset().left-e(d).width-g,d.find(".tipso_arrow").css({"border-left-color":p.settings.background,"border-right-color":"transparent","border-top-color":"transparent","border-bottom-color":"transparent"}),d.removeClass("top bottom left right"),d.addClass("left")):(d.find(".tipso_arrow").css({"border-right-color":p.settings.background,"border-left-color":"transparent","border-top-color":"transparent","border-bottom-color":"transparent"}),d.removeClass("top bottom left right"),d.addClass(p.settings.position))}if("top-right"===p.settings.position&&d.find(".tipso_arrow").css({"margin-left":-p.settings.width/2}),"top-left"===p.settings.position){var m=d.find(".tipso_arrow").eq(0);m.css({"margin-left":p.settings.width/2-2*p.settings.arrowWidth})}if("bottom-right"===p.settings.position){var m=d.find(".tipso_arrow").eq(0);m.css({"margin-left":-p.settings.width/2,"margin-top":""})}if("bottom-left"===p.settings.position){var m=d.find(".tipso_arrow").eq(0);m.css({"margin-left":p.settings.width/2-2*p.settings.arrowWidth,"margin-top":""})}n<f.scrollLeft()&&("bottom"===p.settings.position||"top"===p.settings.position)&&(d.find(".tipso_arrow").css({marginLeft:n-p.settings.arrowWidth}),n=0),n+p.settings.width>f.outerWidth()&&("bottom"===p.settings.position||"top"===p.settings.position)&&(a=f.outerWidth()-(n+p.settings.width),d.find(".tipso_arrow").css({marginLeft:-a-p.settings.arrowWidth,marginTop:""}),n+=a),n<f.scrollLeft()&&("left"===p.settings.position||"right"===p.settings.position||"top-right"===p.settings.position||"top-left"===p.settings.position||"bottom-right"===p.settings.position||"bottom-left"===p.settings.position)&&(n=l.offset().left+l.outerWidth()/2-e(d).width/2,d.find(".tipso_arrow").css({marginLeft:-p.settings.arrowWidth,marginTop:""}),i=l.offset().top-e(d).height-g,i<f.scrollTop()?(i=l.offset().top+l.outerHeight()+g,d.find(".tipso_arrow").css({"border-bottom-color":c,"border-top-color":"transparent","border-left-color":"transparent","border-right-color":"transparent"}),d.removeClass("top bottom left right"),r(d),d.addClass("bottom")):(d.find(".tipso_arrow").css({"border-top-color":p.settings.background,"border-bottom-color":"transparent","border-left-color":"transparent","border-right-color":"transparent"}),d.removeClass("top bottom left right"),r(d),d.addClass("top")),n+p.settings.width>f.outerWidth()&&(a=f.outerWidth()-(n+p.settings.width),d.find(".tipso_arrow").css({marginLeft:-a-p.settings.arrowWidth,marginTop:""}),n+=a),n<f.scrollLeft()&&(d.find(".tipso_arrow").css({marginLeft:n-p.settings.arrowWidth}),n=0)),n+p.settings.width>f.outerWidth()&&("left"===p.settings.position||"right"===p.settings.position||"top-right"===p.settings.position||"top-left"===p.settings.position||"bottom-right"===p.settings.position||"bottom-right"===p.settings.position)&&(n=l.offset().left+l.outerWidth()/2-e(d).width/2,d.find(".tipso_arrow").css({marginLeft:-p.settings.arrowWidth,marginTop:""}),i=l.offset().top-e(d).height-g,i<f.scrollTop()?(i=l.offset().top+l.outerHeight()+g,d.find(".tipso_arrow").css({"border-bottom-color":c,"border-top-color":"transparent","border-left-color":"transparent","border-right-color":"transparent"}),r(d),d.removeClass("top bottom left right"),d.addClass("bottom")):(d.find(".tipso_arrow").css({"border-top-color":p.settings.background,"border-bottom-color":"transparent","border-left-color":"transparent","border-right-color":"transparent"}),r(d),d.removeClass("top bottom left right"),d.addClass("top")),n+p.settings.width>f.outerWidth()&&(a=f.outerWidth()-(n+p.settings.width),d.find(".tipso_arrow").css({marginLeft:-a-p.settings.arrowWidth,marginTop:""}),n+=a),n<f.scrollLeft()&&(d.find(".tipso_arrow").css({marginLeft:n-p.settings.arrowWidth}),n=0)),d.css({left:n+p.settings.offsetX,top:i+p.settings.offsetY}),i<f.scrollTop()&&("right"===p.settings.position||"left"===p.settings.position)&&(l.tipso("update","position","bottom"),s(p)),i+e(d).height>f.scrollTop()+f.outerHeight()&&("right"===p.settings.position||"left"===p.settings.position)&&(l.tipso("update","position","top"),s(p))}var i="tipso",n={speed:400,background:"#55b555",titleBackground:"#333333",color:"#ffffff",titleColor:"#ffffff",titleContent:"",showArrow:!0,position:"top",width:200,maxWidth:"",delay:200,hideDelay:0,animationIn:"",animationOut:"",offsetX:0,offsetY:0,arrowWidth:8,tooltipHover:!1,content:null,ajaxContentUrl:null,ajaxContentBuffer:0,contentElementId:null,useTitle:!1,templateEngineFunc:null,onBeforeShow:null,onShow:null,onHide:null};t.extend(o.prototype,{init:function(){{var t=this,o=this.$element;this.doc}if(o.addClass("tipso_style").removeAttr("title"),t.settings.tooltipHover){var e=null,r=null;o.on("mouseover."+i,function(){clearTimeout(e),clearTimeout(r),r=setTimeout(function(){t.show()},150)}),o.on("mouseout."+i,function(){clearTimeout(e),clearTimeout(r),e=setTimeout(function(){t.hide()},200),t.tooltip().on("mouseover."+i,function(){t.mode="tooltipHover"}).on("mouseout."+i,function(){t.mode="show",clearTimeout(e),e=setTimeout(function(){t.hide()},200)})})}else o.on("mouseover."+i,function(){t.show()}),o.on("mouseout."+i,function(){t.hide()});t.settings.ajaxContentUrl&&(t.ajaxContent=null)},tooltip:function(){return this.tipso_bubble||(this.tipso_bubble=t('<div class="tipso_bubble"><div class="tipso_title"></div><div class="tipso_content"></div><div class="tipso_arrow"></div></div>')),this.tipso_bubble},show:function(){var o=this.tooltip(),e=this,r=this.win;e.settings.showArrow===!1?o.find(".tipso_arrow").hide():o.find(".tipso_arrow").show(),"hide"===e.mode&&(t.isFunction(e.settings.onBeforeShow)&&e.settings.onBeforeShow(e.$element,e.element,e),e.settings.size&&o.addClass(e.settings.size),e.settings.width?o.css({background:e.settings.background,color:e.settings.color,width:e.settings.width}).hide():e.settings.maxWidth?o.css({background:e.settings.background,color:e.settings.color,maxWidth:e.settings.maxWidth}).hide():o.css({background:e.settings.background,color:e.settings.color,width:200}).hide(),o.find(".tipso_title").css({background:e.settings.titleBackground,color:e.settings.titleColor}),o.find(".tipso_content").html(e.content()),o.find(".tipso_title").html(e.titleContent()),s(e),r.on("resize."+i,function(){e.settings.position=e.settings.preferedPosition,s(e)}),window.clearTimeout(e.timeout),e.timeout=null,e.timeout=window.setTimeout(function(){e.ieFade||""===e.settings.animationIn||""===e.settings.animationOut?o.appendTo("body").stop(!0,!0).fadeIn(e.settings.speed,function(){e.mode="show",t.isFunction(e.settings.onShow)&&e.settings.onShow(e.$element,e.element,e)}):o.remove().appendTo("body").stop(!0,!0).removeClass("animated "+e.settings.animationOut).addClass("noAnimation").removeClass("noAnimation").addClass("animated "+e.settings.animationIn).fadeIn(e.settings.speed,function(){t(this).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function(){t(this).removeClass("animated "+e.settings.animationIn)}),e.mode="show",t.isFunction(e.settings.onShow)&&e.settings.onShow(e.$element,e.element,e),r.off("resize."+i,null,"tipsoResizeHandler")})},e.settings.delay))},hide:function(o){var e=this,r=this.win,s=this.tooltip(),n=e.settings.hideDelay;o&&(n=0,e.mode="show"),window.clearTimeout(e.timeout),e.timeout=null,e.timeout=window.setTimeout(function(){"tooltipHover"!==e.mode&&(e.ieFade||""===e.settings.animationIn||""===e.settings.animationOut?s.stop(!0,!0).fadeOut(e.settings.speed,function(){t(this).remove(),t.isFunction(e.settings.onHide)&&"show"===e.mode&&e.settings.onHide(e.$element,e.element,e),e.mode="hide",r.off("resize."+i,null,"tipsoResizeHandler")}):s.stop(!0,!0).removeClass("animated "+e.settings.animationIn).addClass("noAnimation").removeClass("noAnimation").addClass("animated "+e.settings.animationOut).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function(){t(this).removeClass("animated "+e.settings.animationOut).remove(),t.isFunction(e.settings.onHide)&&"show"===e.mode&&e.settings.onHide(e.$element,e.element,e),e.mode="hide",r.off("resize."+i,null,"tipsoResizeHandler")}))},n)},close:function(){this.hide(!0)},destroy:function(){{var t=this.$element,o=this.win;this.doc}t.off("."+i),o.off("resize."+i,null,"tipsoResizeHandler"),t.removeData(i),t.removeClass("tipso_style").attr("title",this._title)},titleContent:function(){var t,o=this.$element,e=this;return t=e.settings.titleContent?e.settings.titleContent:o.data("tipso-title")},content:function(){var o,e=this.$element,r=this,s=this._title;return r.settings.ajaxContentUrl?r._ajaxContent?o=r._ajaxContent:(r._ajaxContent=o=t.ajax({type:"GET",url:r.settings.ajaxContentUrl,async:!1}).responseText,r.settings.ajaxContentBuffer>0?setTimeout(function(){r._ajaxContent=null},r.settings.ajaxContentBuffer):r._ajaxContent=null):r.settings.contentElementId?o=t("#"+r.settings.contentElementId).text():r.settings.content?o=r.settings.content:r.settings.useTitle===!0?o=s:"string"==typeof e.data("tipso")&&(o=e.data("tipso")),null!==r.settings.templateEngineFunc&&(o=r.settings.templateEngineFunc(o)),o},update:function(t,o){var e=this;return o?void(e.settings[t]=o):e.settings[t]}});var a=function(){var t=document.createElement("p").style,o=["ms","O","Moz","Webkit"];if(""===t.transition)return!0;for(;o.length;)if(o.pop()+"Transition"in t)return!0;return!1}();t[i]=t.fn[i]=function(e){var r=arguments;if(void 0===e||"object"==typeof e)return this instanceof t||t.extend(n,e),this.each(function(){t.data(this,"plugin_"+i)||t.data(this,"plugin_"+i,new o(this,e))});if("string"==typeof e&&"_"!==e[0]&&"init"!==e){var s;return this.each(function(){var n=t.data(this,"plugin_"+i);n||(n=t.data(this,"plugin_"+i,new o(this,e))),n instanceof o&&"function"==typeof n[e]&&(s=n[e].apply(n,Array.prototype.slice.call(r,1))),"destroy"===e&&t.data(this,"plugin_"+i,null)}),void 0!==s?s:this}}});;
/*!
 * Xbox Switcher
 * Version: 1.0
 * Author: Max López
 * Copyright © 2018 Max Arthur López Pérez - All Rights Reserved.
 */

;(function ($, window, document, undefined) {

    function Plugin(element, options) {
        var _ = this;
        _.el = element;
        _.$el = $(element);
        _.defaults = {
            on_text: '',
            off_text: '',
            on_value: 'on',
            off_value: 'off',
            readonly: false,
        };
        _.metadata = _.$el.data('switcher') || {};
        _.options = $.extend({}, _.defaults, options, _.metadata);
        _.$el.data('switcher', _.options);
        _.init();
    }

    Plugin.prototype = {
        init: function () {
            var _ = this;
            if (_.$el.parent().hasClass('xbox-sw-wrap')) {
                return;
            }
            if (_.$el.attr('type') == 'hidden' || _.$el.attr('type') == 'checkbox') {
                _.build();
            }

        },

        build: function () {
            var _ = this;
            var $input = _.$el;
            var has_icons = false;
            var html_toggle_on = '<div class="xbox-sw-toggle xbox-sw-toggle-on">';
            var html_toggle_off = '<div class="xbox-sw-toggle xbox-sw-toggle-off">';
            if (_.options.on_text !== '' && _.options.off_text !== '') {
                html_toggle_on = html_toggle_on + _.options.on_text + '</div>';
                html_toggle_off = html_toggle_off + _.options.off_text + '</div>';
            } else {
                has_icons = true;
                html_toggle_on = html_toggle_on + '<i class="icon-sw-on"></i></div>';
                html_toggle_off = html_toggle_off + '<i class="icon-sw-off"></i></div>';
            }

            var is_disabled = $input.is(':disabled') ? true : false;

            var status_classes = '';
            status_classes += _.is_on() ? 'xbox-sw-on' : 'xbox-sw-off';
            status_classes += is_disabled ? ' xbox-sw-disabled' : '';
            status_classes += has_icons ? ' xbox-sw-has-icons' : '';

            var switcher_body =
                '<div class="xbox-sw-inner ' + status_classes + '">' +
                '<div class="xbox-sw-blob"></div>' +
                html_toggle_on + html_toggle_off +
                '</div>';

            $input.wrap('<div class="xbox-sw-wrap"></div>');
            $input.parent().append(switcher_body);
            $input.parent().find('.xbox-sw-inner').addClass('xbox-sw-type-' + $input.attr('type'));
        },

        is_on: function () {
            if (this.$el.next('.xbox-sw-inner').hasClass('xbox-sw-on')) {
                return true;
            }
            if (this.$el.attr('type') == 'checkbox') {
                return this.$el.is(':checked');
            } else {
                if (this.$el.val() == this.options.on_value) {
                    return true;
                }
            }
            return false;
        },

        set_on: function () {
            var $input = $(this);
            if (!$input.parent().hasClass('xbox-sw-wrap')) {
                return;
            }
            var options = $input.data('switcher');

            if ($input.attr('type') == 'checkbox') {
                $input.prop('checked', true).attr('checked', 'checked');
            } else {
                $input.val(options.on_value);
            }

            $input.parent().find('.xbox-sw-inner').removeClass('xbox-sw-off').addClass('xbox-sw-on');

            //Eventos
            $input.trigger('changeOn');
            $input.trigger('statusChange');

            return true;
        },

        set_off: function () {
            var $input = $(this);
            if (!$input.parent().hasClass('xbox-sw-wrap')) {
                return;
            }
            var options = $input.data('switcher');

            if ($input.attr('type') == 'checkbox') {
                $input.prop('checked', false).removeAttr('checked');
            } else {
                $input.val(options.off_value);
            }

            $input.parent().find('.xbox-sw-inner').removeClass('xbox-sw-on').addClass('xbox-sw-off');

            //Eventos
            $input.trigger('changeOff');
            $input.trigger('statusChange');

            return true;
        },

        destroy: function () {
            $(this).each(function () {
                $(this).parents('.xbox-sw-wrap').children().not('input').remove();
                $(this).unwrap();
            });
            return true;
        }
    };

    //Eventos
    $(document).ready(function () {
        $(document).on('click tap', '.xbox .xbox-sw-inner:not(.xbox-sw-disabled)', function (e) {
            var $input = $(this).parent().find('input');
            if ($(this).hasClass('xbox-sw-on')) {
                $input.xboxSwitcher('set_off');
            } else {
                $input.xboxSwitcher('set_on');
            }
        });

        $(document).on('change', '.xbox .xbox-sw-wrap input', function (e) {
            if ($(this).next('.xbox-sw-inner').hasClass('xbox-sw-on')) {
                $(this).xboxSwitcher('set_off');
            } else {
                $(this).xboxSwitcher('set_on');
            }
        });
    });

    $.fn.xboxSwitcher = function (options) {
        if (Plugin.prototype[options] && options != 'init' && options != 'build' && options != 'is_on') {
            return Plugin.prototype[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) {
            return this.each(function () {
                new Plugin(this, options);
            });
        } else {
            //nothing
        }
    };

    function c(msg) {
        console.log(msg);
    }

    function cc(msg, msg2) {
        console.log(msg, msg2);
    }

})(jQuery, window, document);
;
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
    console.log('Plugin.prototype.open');
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

}(document, window, jQuery));;
/*!
 * Xbox Confirm
 * Version: 1.0
 * Author: Max López
 */

;(function ( $, window, document, undefined ) {

  function Plugin( options ) {
    var _ = this;
    _.el = '';
    _.$el = undefined;
    _.$overlay = undefined;
    _.visible = false;
    _.defaults = {
      wrap_class: '',
      title: '',
      content: '',
      hide_cancel: false,
      hide_confirm: false,
      hide_close: false,
      cancel_text: '',
      confirm_text: '',
      cancel_class: '',
      confirm_class: 'xbox-btn-blue',
      cancel_bg: '',
      confirm_bg: '',
      cancel_color: '',
      confirm_color: '',
      close_delay: -1,
      close_overlay: true,
      onOpen : null,
      onClose : null,
      onConfirm : null,
      onCancel : null,
    };
    _.options = $.extend( {}, _.defaults, options);

    _.init();

    $(window).on("resize", function () {
      if( _.visible ){
        _.center(true);
      }
    });
  }

  Plugin.prototype = {
    init : function () {
      var _ = this;
      _.build();
      _.ajax_content();
      _.open();
      _.events();
    },

    build: function(){
      var _ = this;
      var header = _.options.title === '' ? '' : '<div class="xbox-confirm-header"><h3>' + _.options.title + '</h3></div>';
      var cancel_text = _.options.cancel_text || 'Cancel';
      var confirm_text = _.options.confirm_text || 'Accept';
      var confirm_btn = _.options.hide_confirm ? '' : '<button class="xbox-confirm-btn xbox-btn" type="button"><i class="xbox-icon xbox-icon-check"></i>' + confirm_text +'</button>';
      var cancel_btn = _.options.hide_cancel ? '' : '<button class="xbox-cancel-btn xbox-btn" type="button"><i class="xbox-icon xbox-icon-close"></i>' + cancel_text +'</button>';
      var close_btn = '<span class="xbox-confirm-close-btn xbox-icon xbox-icon-times"></span>';
      var content = typeof _.options.content == 'object' ? '' : _.options.content;

      _.el =
        '<div class="xbox xbox-confirm ' + _.options.wrap_class +' ">' +
          '<div class="xbox-confirm-inner">' +
            close_btn + header +
            '<div class="xbox-confirm-content">' + content + '</div>' +
            '<div class="xbox-confirm-footer">' +
              cancel_btn + confirm_btn +
            '</div>' +
          '</div>' +
        '</div>';

      $('body').append(_.el);
      $('body').append('<div class="xbox-confirm-overlay"></div>');
      _.$el = $('body').find('.xbox-confirm');
      _.$overlay = $('body').find('.xbox-confirm-overlay');

      //Customization
      _.$el.find('.xbox-cancel-btn').addClass(_.options.cancel_class);
      _.$el.find('.xbox-confirm-btn').addClass(_.options.confirm_class);
      var cancel_css = {};
      var confirm_css = {};

      if( _.options.hide_close ){
        _.$el.find('.xbox-confirm-close-btn').hide();
      }
      if( _.options.cancel_bg ){
        cancel_css.background = _.options.cancel_bg;
      }
      if( _.options.cancel_color ){
        cancel_css.color = _.options.cancel_color;
      }
      _.$el.find('.xbox-cancel-btn').css(cancel_css);

      if( _.options.confirm_bg ){
        confirm_css.background = _.options.confirm_bg;
      }
      if( _.options.confirm_color ){
        confirm_css.color = _.options.confirm_color;
      }
      _.$el.find('.xbox-confirm-btn').css(confirm_css);
    },

    ajax_content: function(){
      var _ = this;
      if( typeof _.options.content != 'object' ){
        return;
      }
      $.ajax({
        type: 'post',
        dataType: _.options.content.dataType,
        url: _.options.content.url,
        data: _.options.content.data,
        beforeSend: function(){
          _.$el.find('.xbox-confirm-content').html("<i class='xbox-icon xbox-icon-spinner xbox-icon-spin xbox-confirm-loader'></i>");
        },
        success: function( response ) {
          if( typeof response != 'object' && _.options.content.dataType == 'html' ){
            _.$el.find('.xbox-confirm-content').append(response);
            setTimeout(function(){ _.center(true); }, 800);
          }
          if ( $.isFunction( _.options.content.onSuccess ) ) {
            _.options.content.onSuccess.call(this, response);
          }
        },
        error: function( jqXHR, textStatus, errorThrown ){
          c('#### AJAX ERROR ####');
          c('jqXHR');c(jqXHR);c('errorThrown');c(errorThrown);
        },
        complete: function( jqXHR, textStatus ){
          setTimeout(function(){ _.center(true); }, 1200);
          _.$el.find('.xbox-confirm-content > .xbox-confirm-loader').remove();
        }
      });
    },

    open : function(){
      var _ = this;
      _.$overlay.fadeIn(400);
      _.$el.addClass('xbox-confirm-open');
      _.visible = true;
      _.center();
      if ( $.isFunction( _.options.onOpen ) ) {
        _.options.onOpen.call(this);
      }
    },

    events : function(){
      var _ = this;
      if( _.options.close_overlay ){
        _.$overlay.on('click', function(event) {
          _.close(event, false);
          return false;
        });
      }
      _.$el.find('.xbox-confirm-close-btn, .xbox-cancel-btn, .xbox-confirm-btn').on('click', function(event) {
        if( $(this).hasClass('xbox-confirm-btn') ){
          _.close(event, true);
        } else {
          _.close(event, false);
        }
        return false;
      });
      if( _.options.close_delay > -1 ){
        setTimeout( function(){ _.close(event, false); }, _.options.close_delay );
      }
    },

    close : function(event, confirm){
      var _ = this;
      _.$el.addClass('xbox-confirm-close');
      _.$el.one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function(event) {
        if ( $.isFunction( _.options.onCancel ) && confirm === false ) {
          _.options.onCancel.call(this);
        }
        if ( $.isFunction( _.options.onConfirm ) && confirm ) {
          _.options.onConfirm.call(this);
        }
        if ( $.isFunction( _.options.onClose ) ) {
          _.options.onClose.call(this);
        }
        _.destroy();
      });
    },

    destroy : function(){
      var _ = this;
      _.$el.remove();
      _.$overlay.fadeOut(500).remove();
      _.visible = false;
    },

    center : function( animate ){
      animate = animate || false;
      var _ = this;
      var left = ( $(window).width() - _.$el.width() ) / 2;
      var top = ( $(window).height() - _.$el.height() ) / 2;
      var margin_top = 10;
      if( animate ){
        _.$el.stop().animate({
          'top' : (top - margin_top) + 'px',
          'margin-left' : -1*( _.$el.width() / 2 ),
        }, 300);
      } else {
        _.$el.css({
        'top' : (top - margin_top) + 'px',
        'margin-left' : -1*( _.$el.width() / 2 ),
        });
      }
    }
  };

  //Debug
  function c(msg){
    console.log(msg);
  }

  $.xboxConfirm = function ( options ) {
    new Plugin( options );
  };

})( jQuery, window, document );;
/*!
 * Xbox Image Selector
 * Version: 1.0
 * Author: Max López
 */

;(function ( $, window, document, undefined ) {

  function Plugin( element, options ) {
    var _ = this;
    _.el = element;
    _.$el = $(element);
    _.defaults = {
      width : '100px',
      height : 'auto',
      active_class : '',
      active_color : 'blue'
    };
    _.metadata = _.$el.data( 'image-selector' ) || {};
    _.options = $.extend( {}, _.defaults, options, _.metadata );
    _.$el.data('image-selector', _.options);
    _.init();
  }

  Plugin.prototype = {
    init : function () {
      var _ = this;
      if( _.$el.hasClass('xbox-image-selector') ){
        return;
      }
      _.build();
      return _;
    },

    build: function () {
      var _ = this;
      _.$el.addClass('xbox-image-selector');
      _.$el.find('input').each(function(index, item) {
        var $input = $(item);
        var src = $input.data('image');
        if( is_empty( src ) ){
          return;
        }
        if( ! $input.parent('label.no-image').length ){
          $input.hide();
          $input.after('<img src="'+ src +'">');
          $input.next('img').css({
            'max-width': _.options.width,
            'height': _.options.height,
          });
        }

        if( $input.prop('checked') ){
          $input.parent('label').addClass('checked');
          if( is_empty( _.options.active_class ) ){
            $input.next('img').css('border', '1px solid ' + _.options.active_color );
          } else {
            $input.next('img').addClass(_.options.active_class);
          }
        }
      });
    },

    active : function(){
      var $input = $(this);
      var $el = $input.closest('.xbox-image-selector');
      var options = $el.data('image-selector');

      if( options.like_checkbox ){
        if( $input.parent('label').hasClass('checked') ){
          $input.removeAttr( 'checked' ).prop('checked', false).parent('label').removeClass('checked');
          if( $input.next('img') !== undefined ){
            if( is_empty( options.active_class ) ){
              $input.next('img').css('border', '1px transparent #FFF');
            } else {
              $input.next('img').removeClass( options.active_class );
            }
          }
        } else {
          $input.attr( 'checked', 'checked' ).prop('checked', true).parent('label').addClass('checked');
          if( $input.next('img') !== undefined ){
            if( is_empty( options.active_class ) ){
              $input.next('img').css('border', '1px solid ' + options.active_color );
            } else {
              $input.next('img').addClass( options.active_class );
            }
          }
        }
      } else {
        //Disable all
        $el.find('input').removeAttr( 'checked' ).prop('checked', false);
        $el.find('label').removeClass('checked');
        //Active current
        $input.attr( 'checked', 'checked' ).prop('checked', true).parent('label').addClass('checked');

        if( $input.next('img') !== undefined ){
          if( is_empty( options.active_class ) ){
            $el.find('img').css('border', '1px transparent #FFF');
            $input.next('img').css('border', '1px solid ' + options.active_color );
          } else {
            $el.find('img').removeClass( options.active_class );
            $input.next('img').addClass( options.active_class );
          }
        }
      }
      $input.trigger( 'imgSelectorChanged' );
      return false;
    },

    destroy: function () {
      $(this).each(function() {
        $(this).removeClass('xbox-image-selector').find('img').remove();
      });
      return true;
    },

    disable_all: function () {
      var $input = $(this);
      var $el = $input.closest('.xbox-image-selector');
      var options = $el.data('image-selector');
      if( options.like_checkbox ){
        $el.find('input').removeAttr( 'checked' ).prop('checked', false);
        $el.find('label').removeClass('checked');
        if( $input.next('img') !== undefined ){
          if( is_empty( options.active_class ) ){
            $el.find('img').css('border', '1px transparent #FFF');
          } else {
            $el.find('img').removeClass( options.active_class );
          }
        }
      }
      return true;
    }

  };

  function is_empty( value ){
    return ( value === undefined || value === false || $.trim(value).length === 0 );
  }

  //Debug
  function c(msg){
    console.log(msg);
  }

  $(document).ready(function($) {
    $(document).on('click.img_selector', '.xbox-image-selector input', function(event) {
      $(this).xboxImageSelector('active');
    });
    $(document).on('img_selector_disable_all', '.xbox-image-selector input', function(event) {
      $(this).xboxImageSelector('disable_all');
    });
  });

  $.fn.xboxImageSelector = function ( options ) {
    if ( Plugin.prototype[options] && options != 'init' && options != 'build' && options != 'is_empty' ) {
      return Plugin.prototype[options].apply( this, Array.prototype.slice.call( arguments, 1) );
    } else if ( typeof options === 'object' || ! options ) {
      return this.each(function () {
        new Plugin( this, options );
      });
    } else {
      //nothing
    }
  };

})( jQuery, window, document );