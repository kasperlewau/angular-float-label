// PhantomJS hackety-hack
Function.prototype.bind || (Function.prototype.bind = function (ctx) {
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
      inputEl[0].parentNode.tagName.should.equal('DIV');
    });

    it('wraps with textarea', function () {
      txtEl[0].parentNode.classList.contains('fl-textarea').should.be.true;
    });

    it('wraps with input', function () {
      inputEl[0].parentNode.classList.contains('fl-input').should.be.true;
    });

    it('has a label', function () {
      inputEl[0].previousSibling.tagName.should.equal('LABEL');
    });

    describe('with value', function () {
      beforeEach(function () {
        rootScope.someModel = { name: 'asdf' };
        rootScope.$digest();
      });

      it('sets the value from ng-model', function () {
        inputEl[0].value.should.equal(rootScope.someModel.name);
      });

      it('has the popClass', function () {
        inputEl[0].parentNode.classList.contains('fl-populated').should.be.true;
      });

      it('sets the placeholder', function () {
        inputEl.attr('placeholder').should.equal(rootScope.someModel.name);
      });
    });

    describe('without value', function () {
      beforeEach(function () {
        rootScope.$digest();
      });

      it('sets the value from ng-model', function () {
        inputEl[0].value.should.equal('');
      });

      it('doesnt have the popClass', function () {
        inputEl[0].parentNode.classList.contains('fl-populated').should.be.false;
      });

      it('sets the placeholder', function () {
        inputEl.attr('placeholder').should.equal("Asdf");
      });
    });
  });

  describe('functions', function () {
    beforeEach(function () {
      rootScope.$digest();
    });

    describe('checkPlaceholder', function () {
      it('is defined', function () {
        inputEl.isolateScope().fn.checkPlaceholder.should.be.defined;
      });
    });

    describe('input fn', function () {
      it('is defined', function () {
        inputEl.isolateScope().fn.inputFn.should.be.defined;
      });

      it('gets called on input', function () {
        var spy = sinon.spy(inputEl.isolateScope().fn, 'inputFn');
        inputEl.triggerHandler('input');
        spy.should.have.been.called();
      });

      // expect value to be empty string if there is no value
      // expect wrap to set/remove the populated class
    });

    describe('focus fn', function () {
      it('is defined', function () {
        inputEl.isolateScope().fn.focusFn.should.be.defined;
      });

      it('gets called on focus', function () {
        var spy = sinon.spy(inputEl.isolateScope().fn, 'focusFn');
        inputEl.triggerHandler('focus');
        spy.should.have.been.called();
      });

      // expect wrap to get the focus class
      // expect placeholder to be empty string if placeholder equals attrs.floatLabel
    });

    describe('blur fn', function () {
      it('is defined', function () {
        inputEl.isolateScope().fn.blurFn.should.be.defined;
      });

      it('gets called on blur', function () {
        var spy = sinon.spy(inputEl.isolateScope().fn, 'blurFn');
        inputEl.triggerHandler('blur');
        spy.should.have.been.called();
      });

      // expect wrap to lose the focus class
      // expect placeholder to be attrs.floatLabel if placeholder equals empty string && this[0].validity.valid
    });
  });
});
