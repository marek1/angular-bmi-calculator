/*
 * Version : 0.0.4
 * Author : Marek Sonnabend
 */
'use strict';

var bmiModule = angular.module('bmiModule', [
])
.constant('metric', ['m', 'cm', 'kg', 'g'])
.constant('imperial', ['ft', 'in', 'st', 'lb'])
.constant('imperialMetricMap', {
    'kg' : {
      'g' : 1000,
      'st' : 0.157473,
      'lb' : 2.20462
    },
    'g' : {
      'kg' : 0.001,
      'st' : 0.000157473,
      'lb' : 0.00220462
    },
    'st' : {
      'kg' : 6.35029,
      'g' : 6350.29,
      'lb' : 14
    },
    'lb' : {
      'kg' : 0.453592,
      'g' : 453.592,
      'st' : 0.0714286
    },
    'm' : {
      'cm' : 100,
      'ft' : 3.28084,
      'in' : 39.3701
    },
    'cm' : {
      'm' : 0.01,
      'ft' : 0.0328084,
      'in' : 0.393701
    },
    'ft' : {
      'm' : 0.3048,
      'cm' : 30.48,
      'in' : 12
    },
    'in' : {
      'm' : 0.0254,
      'cm' : 2.54,
      'ft' : 0.0833333
    }
  }
)
.service('BmiCalculatorService', ['imperialMetricMap', function(imperialMetricMap) {
    this.convert = function (from, to, amount) {
      if (!isNaN(amount)){
        return amount * imperialMetricMap[from][to];
      }
    };
}])
.controller('BmiCalculatorController', ['$scope', '$timeout', 'BmiCalculatorService', 'metric', 'imperial', function($scope, $timeout, BmiCalculatorService, metric, imperial) {
    //calculate BMI
    var calculate = {
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
    /*
     * set scope vars
     */
    $scope.ctrl.userData = $scope.ctrl.userData || {
        height: {
          m : 0,
          cm: 0,
          ft: 0,
          in: 0
        },
        weight: {
          kg: 0,
          g : 0,
          st: 0,
          lb: 0
        },
        unit : 'metric',
        bmi : 0
    };
    //default values for
    $scope.metricHeight = 'cm';
    $scope.metricWeight = 'kg';
    /**
     * convert ALL values
     */
    var convertEverything = function(whichUnitType, whichUnit) {
      /*
       * get whichUnitType from userdata (height and weight are important)
       */
      for (var unit in $scope.ctrl.userData[whichUnitType]) {
        /*
         * if this unit has no value we need to calculate its value
         * but only if its not the unit that is being changed
         */
        //console.log('unit : ',unit);
        if (!$scope.ctrl.userData[whichUnitType][unit] || whichUnit !== unit) {
          //console.log('has not value :/');
          /*
           * see if any other property has a value
           */
          for (var childUnit in $scope.ctrl.userData[whichUnitType]) {
            /*
             * that is not itself
             */
            if (unit!==childUnit && $scope.ctrl.userData[whichUnitType][childUnit] && !isNaN($scope.ctrl.userData[whichUnitType][childUnit])) {
              //console.log('convert from ' ,childUnit);
              if (whichUnitType === 'height') {
                //metric to metric (height)
                if ( ( unit === 'cm' || unit === 'm') && (childUnit === 'cm' || childUnit === 'm') ) {
                    $scope.ctrl.userData.height[unit] = parseFloat(BmiCalculatorService.convert(childUnit, unit, $scope.ctrl.userData.height[childUnit])).toFixed(2);
                }
                //metric to imperial (height)
                if ( ( whichUnit!=='ft' && whichUnit!=='in' ) && ( unit === 'ft' || unit === 'in' ) && ( childUnit === 'm' || childUnit === 'cm' ) ) {
                    $scope.ctrl.userData.height.ft = Math.floor(BmiCalculatorService.convert(childUnit, 'ft', $scope.ctrl.userData.height[childUnit]));
                    $scope.ctrl.userData.height.in = parseFloat(parseFloat('0.' + BmiCalculatorService.convert(childUnit, 'ft', $scope.ctrl.userData.height[childUnit]).toString().replace(',', '.').split('.')[1]) * BmiCalculatorService.convert('ft', 'in', 1)).toFixed(4);
                }
                //imperial to metric (height)
                //ONLY (!) do this conversion if the whichUnit === 'undefined' or whichUnit is of type imperial !!!
                if ( typeof  whichUnit === 'undefined' || imperial.indexOf(whichUnit)>-1 ) {
                  if ( ( unit === 'm' || unit === 'cm' ) && ( childUnit === 'ft') ) {
                      $scope.ctrl.userData.height[unit] = parseFloat(BmiCalculatorService.convert('ft', unit, parseFloat($scope.ctrl.userData.height.ft) + parseFloat(parseFloat($scope.ctrl.userData.height.in) / BmiCalculatorService.convert('ft', 'in', 1)))).toFixed(2);
                  }
                }
              }
              if (whichUnitType === 'weight') {
                //metric to metric (weight)
                if ( (unit === 'kg' || unit === 'g') && (childUnit === 'kg' || childUnit === 'g') ) {
                  //console.log('to unit : ',unit, ' from childUnit : ',childUnit, ' being ',$scope.ctrl.userData.weight[childUnit]);
                  $scope.ctrl.userData.weight[unit] = parseFloat(BmiCalculatorService.convert(childUnit, unit, $scope.ctrl.userData.weight[childUnit])).toFixed(2);
                }
                //metric to imperial(weight)
                if ( (whichUnit!=='st' && whichUnit!=='lb') && ( unit === 'st' || unit === 'lb' ) && ( childUnit === 'kg' || childUnit === 'g' ) ) {
                  $scope.ctrl.userData.weight.st = Math.floor(BmiCalculatorService.convert(childUnit, 'st', $scope.ctrl.userData.weight[childUnit]));
                  $scope.ctrl.userData.weight.lb = parseFloat(parseFloat('0.' + BmiCalculatorService.convert(childUnit, 'st', $scope.ctrl.userData.weight[childUnit]).toString().replace(',', '.').split('.')[1]) * BmiCalculatorService.convert('st', 'lb', 1)).toFixed(4);
                }
                //imperial to metric (weight)
                //ONLY (!) do this conversion if the whichUnit === 'undefined' or whichUnit is of type imperial !!!
                if ( typeof  whichUnit === 'undefined' || imperial.indexOf(whichUnit)>-1 ) {
                  if (( unit === 'kg' || unit === 'g' ) && ( childUnit === 'st')) {
                    $scope.ctrl.userData.weight[unit] = parseFloat(BmiCalculatorService.convert('st', unit, parseFloat($scope.ctrl.userData.weight.st) + parseFloat(parseFloat($scope.ctrl.userData.weight.lb) / BmiCalculatorService.convert('st', 'lb', 1)))).toFixed(2);
                  }
                }
              }
            }
          }
        }
      }
      calculate.metric();
    };
    //convert height+weight value on init
    convertEverything('height');
    convertEverything('weight');
    //called when value in input fields changes
    $scope.changedValue = function(whichUnitType, whichUnit) {
      /**
       * check if viewValue is correct
       *
       */
      var whichForm =  metric.indexOf(whichUnit) > -1 ? $scope.bmiform.metric : $scope.bmiform.imperial;
      if (typeof whichUnit !== 'undefined') {
        var viewValue = whichForm[whichUnit].$viewValue;
        if (isNaN(viewValue) || parseFloat(viewValue)<0) {
          whichForm[whichUnit].$setValidity('required', false);
        } else {
          whichForm[whichUnit].$setValidity('required', true);
          convertEverything(whichUnitType, whichUnit);
        }
      }
    };

    $scope.translate = {
      cm: function (value) {
        return value + ' cm';
      },
      kg: function (value) {
        return value + ' kg';
      },
      ft: function (value) {
        return value + ' ft';
      },
      in: function (value) {
        return value + ' in';
      },
      st: function (value) {
        return value + ' st';
      },
      lb: function (value) {
        return value + ' lb';
      }
    };

    $scope.$on("slideEnded", function(e) {
      // user finished sliding a handle
      //we have to check which value changed :
      $timeout(function() {
        convertEverything(e.targetScope.rzSliderUnitType, e.targetScope.rzSliderUnit);
      },1);
    });

}])
.directive('bmiCalculator', function() {
    return {
      restrict: 'EA',
      controller: 'BmiCalculatorController',
      controllerAs: 'ctrl',
      bindToController : true,
      scope: {
        userData: '=',
        displayType: '@'
      },
      templateUrl: 'bmi-calculator.html',
      link: function (scope, element) {
        //console.log('scope : ',scope.bmiform);
        // DOM manipulation/events here!
      }
    };
  });
