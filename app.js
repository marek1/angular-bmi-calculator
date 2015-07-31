'use strict';


var exampleApp = angular.module('exampleApp', [
  'bmiModule',
  'rzModule'
])
.controller('MainController', function() {
    this.userData = {
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
      unit : 'metric',
      bmi : 0
    };
});