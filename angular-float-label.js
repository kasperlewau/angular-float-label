angular.module('kl.angular-float-label', [])
  .directive('floatLabel', function ($compile) {
    var opts = {
      inpClass: 'fl-input',
      txtClass: 'fl-textarea',
      popClass: 'fl-populated',
      focClass: 'fl-focused'
    };

    var controller = function ($scope, $element, $attrs) {
      var fn = $scope.fn = {};

      fn.checkPlaceholder = function () {
        return ('placeholder' in document.createElement('input'));
      };

      fn.createWrap = function (el) {
        var type = el[0].tagName === 'TEXTAREA' ? opts.txtClass : opts.inpClass;
        return $compile('<div class="' + type + '"></div>');
      };

      fn.createLabel = function (eId, txt) {
        return $compile('<label for="' + eId + '">' + txt + '</label>');
      };

      fn.assemble = function (el, wrap, label, eId) {
        el[0].name = eId;
        el.wrap(wrap);
        wrap.prepend(label);
      };

      fn.init = function (scope, el, attrs, wrap, txt) {
        return scope.$parent.$watch(attrs.ngModel, function (x) {
          x ? fn.withValue(el, wrap, x) : fn.withoutValue(el, wrap, txt);
        });
      };

      fn.withValue = function (el, wrap, val) {
        el.placeholder ? el.attr('placeholder', val) : el[0].value = val;
        wrap.addClass(opts.popClass);
      };

      fn.withoutValue = function (el, wrap, txt) {
        var notFocused  = document.activeElement !== el[0];
        wrap.removeClass(opts.popClass);
        if ( notFocused ) {
          el.placeholder ? el.attr('placeholder', txt) : el[0].value = txt;
        }
      };

      fn.focusFn = function (wrap, txt) {
        wrap.addClass(opts.focClass);
        if ( this.placeholder && this.attr('placeholder') === txt ) {
          this.attr('placeholder', '')
        } else if ( this[0].value === txt ) {
          this[0].value = "";
        }
      };

      fn.blurFn = function (wrap, txt) {
        wrap.removeClass(opts.focClass);
        if ( !this[0].value || this[0].validity.valid ) {
          if ( this.placeholder && this.attr('placeholder') === '') {
            this.attr('placeholder', txt);
          } else if ( this[0].value === '') {
            this[0].value = txt;
          }
        }
      };

      fn.inputFn = function (wrap) {
        this.attr('placeholder', '');
        val = this[0].value !== "" ? this[0].value : "";
        val ? wrap.addClass(opts.popClass) : wrap.removeClass(opts.popClass);
      };
    };

    var linker = {
      restrict: "A",
      scope: {},
      controller: controller,
      link: function (scope, el, attrs) {
        var fn = scope.fn;
        var eId      = attrs.ngModel.replace('.', '-');
        var labelTxt = attrs.floatLabel;
        var wrap     = fn.createWrap(el)(scope);
        var label    = fn.createLabel(eId, labelTxt)(scope);

        el.placeholder = fn.checkPlaceholder();
        fn.assemble(el, wrap, label, eId);
        fn.init(scope, el, attrs, wrap, labelTxt);

        el.bind('focus', fn.focusFn.bind(el, wrap, labelTxt));
        el.bind('blur',  fn.blurFn.bind(el, wrap, labelTxt));
        el.bind('input', fn.inputFn.bind(el, wrap));
      }
    };

    return linker;
  });
