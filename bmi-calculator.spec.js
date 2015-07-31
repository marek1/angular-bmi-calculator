var userData = {
  height: {
    m : 0,
    cm: 180,
    ft: 0,
    in: 0
  },
  weight: {
    kg: 75,
    g : 0,
    st: 0,
    lb: 0
  },
  unit : 'metric'
};

describe('directive: bmi-calculator', function() {
  var element,
    scope,
    $scope,
    calculate = {
      metric: function () {
        //convert all metric values to
        if ( !$scope.ctrl.userData.weight.kg ||
          isNaN($scope.ctrl.userData.weight.kg) ||
          !$scope.ctrl.userData.height.cm ||
          isNaN($scope.ctrl.userData.height.cm) ||
          parseInt($scope.ctrl.userData.weight.kg)<=0 ||
          parseInt($scope.ctrl.userData.height.cm)<=0 ) {
          $scope.ctrl.userData.bmi = 0;
          //return $scope.ctrl.userData.bmi;
        } else {
          $scope.ctrl.userData.bmi = parseFloat(parseFloat($scope.ctrl.userData.weight.kg) / Math.pow(parseFloat(parseFloat($scope.ctrl.userData.height.cm)/100),2)).toFixed(1);
          //return $scope.ctrl.userData.bmi;
        }
      },
      imperial: function () {
        if (
          (!$scope.ctrl.userData.weight.st && !$scope.ctrl.userData.weight.lb) ||
          (isNaN($scope.ctrl.userData.weight.st) || isNaN($scope.ctrl.userData.weight.lb)) ||
          (parseInt($scope.ctrl.userData.weight.st)<=0 && parseInt($scope.ctrl.userData.weight.lb)<=0) ||
          (!$scope.ctrl.userData.height.ft && !$scope.ctrl.userData.height.in) ||
          (isNaN($scope.ctrl.userData.height.ft) || isNaN($scope.ctrl.userData.height.in)) ||
          (parseInt($scope.ctrl.userData.height.ft)<=0 && parseInt($scope.ctrl.userData.height.in)<=0)
        ) {
          $scope.ctrl.userData.bmi = 0;
          //return $scope.ctrl.userData.bmi;
        }else {
          $scope.ctrl.userData.bmi = (((parseFloat(BmiCalculatorService.convert('st', 'lb', $scope.ctrl.userData.weight.st ? $scope.ctrl.userData.weight.st : 0 ) ) + parseFloat( $scope.ctrl.userData.weight.lb ? $scope.ctrl.userData.weight.lb : 0)) * 703) /  Math.pow((parseFloat(BmiCalculatorService.convert('ft', 'in', $scope.ctrl.userData.height.ft ? $scope.ctrl.userData.height.ft : 0)) + parseFloat($scope.ctrl.userData.height.in ? $scope.ctrl.userData.height.in : 0 )),2)).toFixed(1);
          //return $scope.ctrl.userData.bmi;
        }
      }
    };

  beforeEach(module('bmiModule'));

  beforeEach(module("bmiTemplate")); // created in karma.conf.js with ngHtml2JsPreprocessor

  beforeEach(inject(function($rootScope, $compile) {

    scope = $rootScope.$new();

    element = '<bmi-calculator data-user-data="main.userData"></bmi-calculator>';

    scope.main = {};
    scope.main.userData = userData;

    element = $compile(element)(scope);

    scope.$digest();

  }));

  describe('testing bmi controller', function() {

    beforeEach(function(){
        $scope = element.isolateScope();
    });

    it("should create a ctrl object", function() {
      expect($scope.ctrl).toBeDefined();
    });

    it("should create a ctrl object with property userData", function() {
      //console.log('$scope.ctrl.userData : ',$scope.ctrl.userData);
      expect($scope.ctrl.userData).toBe(userData);
    });

    it("height should be 180 cm", function() {
      expect(parseFloat($scope.ctrl.userData.height.cm)).toBe(parseFloat(180));
    });

    it("height should be 1.80 m", function() {
      expect(parseFloat($scope.ctrl.userData.height.m)).toBe(parseFloat(1.8));
    });

    it("height should be 5 feet 10.866144 inches ", function() {
      expect(parseFloat($scope.ctrl.userData.height.ft)).toBe(parseFloat(5));
      expect(parseFloat($scope.ctrl.userData.height.in)).toBe(parseFloat(10.8661));
    });

    it("weight should be 75 kg ", function() {
      expect(parseFloat($scope.ctrl.userData.weight.kg)).toBe(parseFloat(75));
    });

    it("weight should be 75000 g ", function() {
      expect(Math.round($scope.ctrl.userData.weight.g)).toBe(parseFloat(75000));
    });

    it("weight should be 11 stones and 3.467 pounds ", function() {
      expect(parseFloat($scope.ctrl.userData.weight.st)).toBe(parseFloat(11));
      expect(parseFloat($scope.ctrl.userData.weight.lb).toFixed(4)).toBe(parseFloat(11.3459).toFixed(4));
    });

    it("BMI to be 23.1 ", function() {
      expect(parseFloat($scope.ctrl.userData.bmi)).toBe(23.1);
    });

    it("metric height to be measured in cm ", function() {
      expect($scope.metricHeight).toBe('cm');
    });

    it("metric weight to be measured in kg ", function() {
      expect($scope.metricWeight).toBe('kg');
    });

    it("change weight to 86 kg ", function() {
      $scope.ctrl.userData.weight.kg=86;
      $scope.changedValue('weight', 'kg');
      expect(parseFloat($scope.ctrl.userData.weight.kg)).toBe(parseFloat(86));
      expect(Math.round($scope.ctrl.userData.weight.g)).toBe(parseFloat(86000));
      expect(parseFloat($scope.ctrl.userData.weight.st)).toBe(parseFloat(13));
      expect(parseFloat($scope.ctrl.userData.weight.lb).toFixed(4)).toBe(parseFloat(7.5975).toFixed(4));
      expect(parseFloat($scope.ctrl.userData.bmi)).toBe(26.5);
    });

    it("change weight to 71000 g ", function() {
      $scope.ctrl.userData.weight.g=71000;
      $scope.changedValue('weight', 'g');
      expect(parseFloat($scope.ctrl.userData.weight.kg)).toBe(parseFloat(71));
      expect(Math.round($scope.ctrl.userData.weight.g)).toBe(parseFloat(71000));
      expect(parseFloat($scope.ctrl.userData.weight.st)).toBe(parseFloat(11));
      expect(parseFloat($scope.ctrl.userData.weight.lb).toFixed(4)).toBe(parseFloat(2.5282).toFixed(4));
      expect(parseFloat($scope.ctrl.userData.bmi)).toBe(21.9);
    });

    it("change weight to 10 stones 9 pound ", function() {
      $scope.ctrl.userData.weight.st=10;
      $scope.ctrl.userData.weight.lb=9;
      $scope.changedValue('weight', 'st');
      expect(parseFloat($scope.ctrl.userData.weight.kg).toFixed(2)).toBe(parseFloat(67.59).toFixed(2));
      expect(Math.round($scope.ctrl.userData.weight.g)).toBe(parseFloat(67585));
      expect(parseFloat($scope.ctrl.userData.weight.st)).toBe(parseFloat(10));
      expect($scope.ctrl.userData.weight.lb).toBe(parseFloat(9));
      expect(parseFloat($scope.ctrl.userData.bmi)).toBe(20.9);
    });


  });
});