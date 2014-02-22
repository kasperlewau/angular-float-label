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
        $transclude($scope, function (clone) {
          $scope.createWrapper = function () {
            var elTag = clone[0].tagName === 'TEXTAREA' ? def.txtClass : def.inpClass;
            var html  = '<div class="' + elTag + '"></div>';
            return angular.element(html);
          };

          $scope.createLabel = function (elId, txt) {
            var html = '<label for="' + elId + '">' + txt + '</label>';
            return angular.element(html);
          };
        });
      },
      link: function (scope, el, attrs, ngModel, transclude) {
        var cEl      = null;
        var elId     = attrs.ngModel.replace('.', '-');
        var wrap     = scope.createWrapper();
        var label    = scope.createLabel(elId, attrs.floatLabel);
        var labelTxt = label[0].innerHTML

        transclude(scope, function (clone) {
          cEl = clone;
          clone[0].name = elId;
          el.after(wrap.append(clone).prepend(label));
        });

        var init = scope.$watch(attrs.ngModel, function (x) {
          var notFocused = document.activeElement !== cEl[0];
          if ( x ) {
            wrap.addClass(def.popClass);
          } else {
            if ( notFocused ) { cEl[0].value = labelTxt; }
          }
        });

        cEl.bind('focus', function () {
          wrap.addClass(def.focClass);
          if ( cEl[0].value === labelTxt ) { cEl[0].value = ""; }
        });

        cEl.bind('blur', function () {
          wrap.removeClass(def.focClass);
          if ( cEl[0].value === "" ) { cEl[0].value = labelTxt; }
          // wrapper.removeClass(def.popClass);
        });

        cEl.bind('input', function () {
          var val = cEl[0].value !== "" ? cEl[0].value : "";
          val ? wrap.addClass(def.popClass) : wrap.removeClass(def.popClass);
          scope.$apply(function () { ngModel.$setViewValue(val); });
        });
      }
    }
  });