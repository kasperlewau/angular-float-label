angular.module('kl.angular-float-label', []).
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
        var wrapper   = angular.element(scope.createWrapper());
        var label     = angular.element(scope.createLabel());
        var labelText = label[0].innerHTML;

        var wrap = function (elem, wrapper) {
          wrapper = wrapper || document.createElement('div');
          if (elem.nextSibling) {
            elem.parentNode.insertBefore(wrapper, elem.nextSibling);
          } else {
            elem.parentNode.appendChild(wrapper);
          }
          return wrapper.appendChild(elem);
        };

        // Slightly less yuck than the setTimeout() version.
        // Still not super happy about this though..
        var unbindInit = scope.$watch(attrs.ngModel, function (x) {
          !x ? el[0].value = labelText : wrapper.addClass(def.popClass);
        });

        // Setup the DOM. Should probably move this into a compile() function.
        wrapper.prepend(label);
        wrap(el[0], wrapper[0]);

        // Move the label out of the input on focus.
        // Set the input value to empty if it equals the label (init).
        el.bind('focus', function () {
          // unbind the initial watcher.
          unbindInit();
          wrapper.addClass(def.focClass);
          if ( el[0].value === labelText ) { el[0].value = ""; }
        });

        // Move the label into the input on focus if no value is set.
        el.bind('blur', function () {
          wrapper.removeClass(def.focClass);
          if ( el[0].value === "" ) {
            el[0].value = labelText;
            wrapper.removeClass(def.popClass);
          }
        });

        // Send input value to the model.
        el.bind('input', function () {
          var val = el[0].value !== "" ? el[0].value : "";
          wrapper.addClass(def.popClass);
          scope.$apply(function () {
            ngModel.$setViewValue(val);
          });
        });
      }
    }
  });