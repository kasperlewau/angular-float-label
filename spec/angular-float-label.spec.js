// PhantomJS hackety-hack
Function.prototype.bind || (Function.prototype.bind = function(ctx){
  return angular.bind(ctx, this);
});

// Test
describe('angular-float-label', function () {
  var txtEl   = null;
  var inputEl = null;

  beforeEach(module('kl.angular-float-label'));

  beforeEach(inject(function ($compile, $rootScope) {
    rootScope = $rootScope;
    txtEl   = angular.element('<textarea float-label="Asdf" ng-model="someModel.name">');
    inputEl = angular.element('<input float-label="Asdf" ng-model="someModel.name">');
    $compile(inputEl)($rootScope);
    $compile(txtEl)($rootScope);
  }));

  describe('it inits', function () {
    beforeEach(function () {
      rootScope.$digest();
    });

    it('wraps', function () {
      expect(inputEl[0].parentNode.tagName).to.equal('DIV');
    });

    it('wraps with textarea', function () {
      expect(txtEl[0].parentNode.classList.contains('fl-textarea')).to.be.true;
    });

    it('wraps with input', function () {
      expect(inputEl[0].parentNode.classList.contains('fl-input')).to.be.true;
    });

    it('has a label', function () {
      expect(inputEl[0].previousSibling.tagName).to.equal('LABEL');
    });

    describe('with value', function () {
      beforeEach(function () {
        rootScope.someModel = { name: 'asdf' };
        rootScope.$digest();
      });

      it('sets the value from ng-model', function () {
        expect(inputEl[0].value).to.equal(rootScope.someModel.name);
      });

      it('has the popClass', function () {
        expect(inputEl[0].parentNode.classList.contains('fl-populated')).to.be.true;
      });

      it('sets the placeholder', function () {
        expect(inputEl.attr('placeholder')).to.equal(rootScope.someModel.name);
      });
    });

    describe('without value', function () {
      beforeEach(function () {
        rootScope.$digest();
      });

      it('sets the value from ng-model', function () {
        expect(inputEl[0].value).to.equal('');
      });

      it('doesnt have the popClass', function () {
        expect(inputEl[0].parentNode.classList.contains('fl-populated')).to.be.false;
      });

      it('sets the placeholder', function () {
        // expect(inputEl.attr('placeholder')).to.equal( /* labelTxt */ );
      });
    });
  });

  describe('functions', function () {
    beforeEach(function () {
      rootScope.$digest();
    });

    it('has an input function', function () {
      expect(inputEl.isolateScope().fn.inputFn).to.be.defined;
    });

    it('has a focus function', function () {
      expect(inputEl.isolateScope().fn.focusFn).to.be.defined;
    });

    it('has a blur function', function () {
      expect(inputEl.isolateScope().fn.blurFn).to.be.defined;
    });
  });
});