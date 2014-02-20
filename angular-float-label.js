angular.module('kasperlewau.angular-float-label', []).
  directive('floatLabel', function () {
    var def = { popClass: 'fl-populated', focClass: 'fl-focused' };
    return {
      restrict: "A",
      require: 'ngModel',
      replace: true,
      controller: function ($scope, $element, $attrs) {
        // Set the name of the input field
        $element[0].name = $attrs.ngModel.replace('.', '-');

        // Create a wrapping div for styling purposes.
        $scope.createWrapper = function () {
          var klass = $element[0].nodeName === "TEXTAREA" ? 'fl-textarea' : 'fl-input';
          var wrap  = document.createElement('div');
          wrap.classList.add(klass);
          return wrap;
        };

        // Create a label with the for pointed to the input field.
        $scope.createLabel = function () {
          var label        = document.createElement('label');
          label.htmlFor    = $element[0].name;
          label.innerHTML  = $attrs.floatLabel;
          return label;
        };

      },
      link: function (scope, el, attrs, ngModel) {
        var position  = el.parent();
        var wrap      = angular.element(scope.createWrapper());
        var label     = angular.element(scope.createLabel());
        var labelText = label[0].innerHTML;

        // Massive fucking YUCK. This needs to go ASAP!
        // Sorry-ass hack for the NaN $viewValues on init.
        setTimeout(function () {
          !ngModel.$viewValue ? el[0].value = labelText : wrap.addClass(def.popClass);
        }, 1);

        // Setup the DOM. Should probably move this into a compile() function.
        wrap.append(label);
        wrap.append(el);
        angular.element(position).append(wrap);

        // Move the label out of the input on focus.
        // Set the input value to empty if it equals the label (init).
        el.bind('focus', function () {
          wrap.addClass(def.focClass);
          if ( el[0].value === labelText ) { el[0].value = ""; }
        });

        // Move the label into the input on focus if no value is set.
        el.bind('blur', function () {
          wrap.removeClass(def.focClass);
          if ( el[0].value === "" ) {
            el[0].value = labelText;
            wrap.removeClass(def.popClass);
          }
        });

        // Send input value to the model.
        el.bind('input', function () {
          var val = el[0].value !== "" ? el[0].value : "";
          wrap.addClass(def.popClass);
          scope.$apply(function () {
            ngModel.$setViewValue(val);
          });
        });
      }
    }
  });
