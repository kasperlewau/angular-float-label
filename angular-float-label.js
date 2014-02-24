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

    var createLabel = function (elId, txt) {
      return $compile('<label for="' + elId + '">' + txt + '</label>');
    };

    var assemble = function (el, wrapEl, labelEl, elId) {
      el[0].name = elId;
      el.wrap(wrapEl);
      wrapEl.prepend(labelEl);
    };

    var init = function (scope, el, attrs, wrapEl, labelTxt) {
      return scope.$parent.$watch(attrs.ngModel, function (x) {
        var notFocused  = document.activeElement !== el[0];
        if ( x ) {
          el.placeholder ? el.attr('placeholder', x) : el[0].value = x;
          wrapEl.addClass(opts.popClass);
        } else {
          wrapEl.removeClass(opts.popClass);
          if ( notFocused ) {
            el.placeholder ? el.attr('placeholder', labelTxt) : el[0].value = labelTxt;
          }
        }
      });
    };

    var focusFn = function (wrapEl, txt) {
      wrapEl.addClass(opts.focClass);
      if ( this.placeholder && this.attr('placeholder') === txt ) {
        this.attr('placeholder', '')
      } else if ( this[0].value === txt ) {
        this[0].value = "";
      }
    };

    var blurFn = function (wrapEl, txt) {
      wrapEl.removeClass(opts.focClass);
      if ( this[0].validity.valid ) {
        if ( this.placeholder && this.attr('placeholder') === '') {
          this.attr('placeholder', txt);
        } else if ( this[0].value === '') {
          this[0].value = txt;
        }
      }
    };

    var inputFn = function (wrapEl) {
      this.attr('placeholder', '');
      val = this[0].value !== "" ? this[0].value : "";
      val ? wrapEl.addClass(opts.popClass) : wrapEl.removeClass(opts.popClass);
    };

    var linker = {
      restrict: "A",
      scope: {},
      link: function (scope, el, attrs) {
        var elId     = attrs.ngModel.replace('.', '-');
        var labelTxt = attrs.floatLabel;
        var wrapEl   = createWrap(el)(scope);
        var labelEl  = createLabel(elId, labelTxt)(scope);

        el.placeholder = checkPlaceholder();

        assemble(el, wrapEl, labelEl, elId);
        init(scope, el, attrs, wrapEl, labelTxt);

        el.bind('focus', focusFn.bind(el, wrapEl, labelTxt));
        el.bind('blur', blurFn.bind(el, wrapEl, labelTxt));
        el.bind('input', inputFn.bind(el, wrapEl));
      }
    };

    return linker;
  });