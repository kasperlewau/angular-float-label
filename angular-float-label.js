angular.module('kl.angular-float-label', [])
  .directive('floatLabel', function ($compile) {
    var opts = {
      inpClass: 'fl-input',
      txtClass: 'fl-textarea',
      popClass: 'fl-populated',
      focClass: 'fl-focused'
    };

    var checkPlaceholder = function () {
      return ('placeholder' in document.createElement('input'));
    };

    var createWrap = function (el) {
      var type = el[0].tagName === 'TEXTAREA' ? opts.txtClass : opts.inpClass;
      return $compile('<div class="' + type + '"></div>');
    };

    var createLabel = function (eId, txt) {
      return $compile('<label for="' + eId + '">' + txt + '</label>');
    };

    var assemble = function (el, wrap, label, eId) {
      el[0].name = eId;
      el.wrap(wrap);
      wrap.prepend(label);
    };

    var init = function (scope, el, attrs, wrap, txt) {
      return scope.$parent.$watch(attrs.ngModel, function (x) {
        x ? withValue(el, wrap, x) : withoutValue(el, wrap, txt);
      });
    };

    var withValue = function (el, wrap, val) {
      el.placeholder ? el.attr('placeholder', val) : el[0].value = val;
      wrap.addClass(opts.popClass);
    };

    var withoutValue = function (el, wrap, txt) {
      var notFocused  = document.activeElement !== el[0];
      wrap.removeClass(opts.popClass);
      if ( notFocused ) {
        el.placeholder ? el.attr('placeholder', txt) : el[0].value = txt;
      }
    };

    var focusFn = function (wrap, txt) {
      wrap.addClass(opts.focClass);
      if ( this.placeholder && this.attr('placeholder') === txt ) {
        this.attr('placeholder', '')
      } else if ( this[0].value === txt ) {
        this[0].value = "";
      }
    };

    var blurFn = function (wrap, txt) {
      wrap.removeClass(opts.focClass);
      if ( !this[0].value || this[0].validity.valid ) {
        if ( this.placeholder && this.attr('placeholder') === '') {
          this.attr('placeholder', txt);
        } else if ( this[0].value === '') {
          this[0].value = txt;
        }
      }
    };

    var inputFn = function (wrap) {
      this.attr('placeholder', '');
      val = this[0].value !== "" ? this[0].value : "";
      val ? wrap.addClass(opts.popClass) : wrap.removeClass(opts.popClass);
    };

    var linker = {
      restrict: "A",
      scope: {},
      link: function (scope, el, attrs) {
        var eId      = attrs.ngModel.replace('.', '-');
        var labelTxt = attrs.floatLabel;
        var wrap     = createWrap(el)(scope);
        var label    = createLabel(eId, labelTxt)(scope);

        el.placeholder = checkPlaceholder();
        assemble(el, wrap, label, eId);
        init(scope, el, attrs, wrap, labelTxt);

        el.bind('focus', focusFn.bind(el, wrap, labelTxt));
        el.bind('blur', blurFn.bind(el, wrap, labelTxt));
        el.bind('input', inputFn.bind(el, wrap));
      }
    };

    return linker;
  });