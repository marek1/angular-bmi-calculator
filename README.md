# BMI Calculator Module

To retrieve the component use bower. Thus, include this in your bower.json

    "dependencies": {
        ...
        "bmi-calculator" : "git@github.com:marek1/angular-bmi-calculator.git#x.x.x"
        ...
    }

NOTE : Change the version (x.x.x) accordingly.

Then run 

    bower install
    

To use in your project load the minified JS like so : 

    <script src="BOWER_PATH/bmi-calculator/dist/bmi-calculator.min.js"></script>

NOTE : replace BOWER_PATH/bmi-calculator with the correct path.

To load the module in your app load the module as follows : 

    angular.module('exampleApp', [
      'bmiModule'
    ])

There are two ways of using the BMI Calculator

a non-graphical way : 

     <bmi-calculator data-user-data="{ ... }" data-display-type=""></bmi-calculator>
	 
 in a graphical way (using angular slider *) :
 
     <bmi-calculator data-user-data="{ ... }" data-display-type="graphical"></bmi-calculator>

To pass data into the directive 

    data-user-data="{ ... }"

An object is expected of this structure : 

    {
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
    }

It a two-way data binding, which means that the object is kept up-to-date.


*NOTE : for the graphical way to work you need to load the **rzslider**

JS : 

    <script src="BOWER_PATH/bmi-calculator/forked_components/angularjs-slider/dist/rzslider.min.js"></script>

NOTE : replace BOWER_PATH/bmi-calculator with the correct path.

 CSS : 

    
    <link rel="stylesheet" href="BOWER_PATH/bmi-calculator/forked_components/angularjs-slider/dist/rzslider.css" />

NOTE : replace BOWER_PATH/bmi-calculator with the correct path.

and annotate it : 

    angular.module('exampleApp', [
      'bmiModule',
      'rzModule'
    ])

To see an example app go to BOWER_PATH/bmi-calculator and run 

    gulp

