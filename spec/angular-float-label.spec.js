// PhantomJS hackety-hack
Function.prototype.bind || (Function.prototype.bind = function(ctx){
  return angular.bind(ctx, this);
});

describe('A test suite', function () {
  var inputEl;
  var txtEl;
  var $scope;
  beforeEach(module('kl.angular-float-label'));
  beforeEach(inject(function ($compile, $rootScope) {
    rootScope = $rootScope;
    rootScope.someModel = { name: 'asdf' };
    inputEl = angular.element('<input float-label="Asdf" ng-model="someModel.name">');
    txtEl   = angular.element('<textarea float-label="Asdf" ng-model="someModel.name">');
    $compile(inputEl)($rootScope);
    $compile(txtEl)($rootScope);
  }));

  describe('it inits', function () {
    beforeEach(function () {
      rootScope.$digest();
    });

    it('sets the value from ng-model', function () {
      expect(inputEl[0].value).to.equal(rootScope.someModel.name);
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
  });

  describe('functions', function () {
    beforeEach(function () {
      rootScope.$digest();
    });
    it('blurs', function () {
      inputEl.blur;
      console.log(inputEl);
    });
    it('inputs', function () {});
    it('focuses', function () {});
  });

});