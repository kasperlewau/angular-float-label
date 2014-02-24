angular.module('kl.angular-float-label', [])
  .directive('floatLabel', function ($compile) {
    var opts = {
      inpClass: 'fl-input',
      txtClass: 'fl-textarea',
      popClass: 'fl-populated',
      focClass: 'fl-focused'
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
        var notFocused = document.activeElement !== el[0];
        if ( x ) {
          el[0].value = x;
          wrapEl.addClass(opts.popClass);
        } else {
          wrapEl.removeClass(opts.popClass);
          if ( notFocused ) {
            el[0].value = labelTxt;
          }
        }
      });
    };

    var focusFn = function (wrapEl, txt) {
      wrapEl.addClass(opts.focClass);
      if ( this.value === txt ) { this.value = ""; }
    };

    var blurFn = function (wrapEl, txt) {
      wrapEl.removeClass(opts.focClass);
      if ( this.value === "" ) { this.value = txt; }
    };

    var inputFn = function (wrapEl, ngModel) {
      var val = this.value !== "" ? this.value : "";
      val ? wrapEl.addClass(opts.popClass) : wrapEl.removeClass(opts.popClass);
    };

    var linker = {
      restrict: "A",
      scope: {},
      require: 'ngModel',
      link: function (scope, el, attrs, ngModel) {
        var elId     = attrs.ngModel.replace('.', '-');
        var labelTxt = attrs.floatLabel;
        var wrapEl   = createWrap(el)(scope);
        var labelEl  = createLabel(elId, labelTxt)(scope);

        assemble(el, wrapEl, labelEl, elId);
        init(scope, el, attrs, wrapEl, labelTxt);

        el.bind('focus', focusFn.bind(el[0], wrapEl, labelTxt));
        el.bind('blur', blurFn.bind(el[0], wrapEl, labelTxt));
        el.bind('input', inputFn.bind(el[0], wrapEl, ngModel));
      }
    };

    return linker;
  })