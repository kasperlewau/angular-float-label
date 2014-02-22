angular.module('kl.angular-float-label', []).
  directive('floatLabel', function () {
    var def = {
      inpClass: 'fl-input',
      txtClass: 'fl-textarea',
      popClass: 'fl-populated',
      focClass: 'fl-focused'
    };
    return {
      restrict: "A",
      require: 'ngModel',
      transclude: 'element',
      controller: function ($scope, $element, $attrs, $transclude) {
        $scope.createWrapper = function (el) {
          var elTag = el[0].tagName === 'TEXTAREA' ? def.txtClass : def.inpClass;
          var html  = '<div class="' + elTag + '"></div>';
          return angular.element(html);
        };

        $scope.createLabel = function (elId, txt) {
          var html = '<label for="' + elId + '">' + txt + '</label>';
          return angular.element(html);
        };

        $scope.focus = function (wrap, txt) {
          wrap.addClass(def.focClass);
          if ( this.value === txt ) { this.value = ""; }
        };

        $scope.blur = function (wrap, txt) {
          wrap.removeClass(def.focClass);
          if ( this.value === "" ) { this.value = txt; }
        };

        $scope.input = function (wrap, ngModel) {
          var val = this.value !== "" ? this.value : "";
          val ? wrap.addClass(def.popClass) : wrap.removeClass(def.popClass);
          $scope.$apply(function () { ngModel.$setViewValue(val); });
        };

      },
      link: function (scope, el, attrs, ngModel, transclude) {
        var cEl      = transclude(scope, function (clone) { return clone; });
        var wrap     = scope.createWrapper(cEl);
        var label    = scope.createLabel(elId, attrs.floatLabel);
        var elId     = attrs.ngModel.replace('.', '-');
        var labelTxt = label[0].innerHTML

        var init = scope.$watch(attrs.ngModel, function (x) {
          var notFocused = document.activeElement !== cEl[0];
          if ( x ) {
            cEl[0].value = x;
            wrap.addClass(def.popClass);
          } else if ( notFocused ) {
            cEl[0].value = labelTxt;
          }
        });

        cEl[0].name = elId;
        el.after(wrap.append(cEl).prepend(label));

        cEl.bind('focus', scope.focus.bind(cEl[0], wrap, labelTxt));
        cEl.bind('blur', scope.blur.bind(cEl[0], wrap, labelTxt));
        cEl.bind('input', scope.input.bind(cEl[0], wrap, ngModel));
      }
    }
  });