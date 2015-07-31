# BMI Calculator Module

I *suggest* you create a folder named forked_components (same directory as bower_components) where you keep (and change) this module.
   
To clone the current version : 

    git clone git@git.xx-well.local:welldoo-angular-modules/welldoo-bmi-calculator.git

To use in your project load the minified JS like so : 

    <script src="YOUR_PATH_TO_BMI_CALCULATOR/dist/bmi-calculator.min.js"></script>

NOTE : replace YOUR_PATH_TO_BMI_CALCULATOR with the correct path.

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

    <script src="YOUR_PATH_TO_BMI_CALCULATOR/forked_components/angularjs-slider/dist/rzslider.min.js"></script>

NOTE : replace YOUR_PATH_TO_BMI_CALCULATOR with the correct path.

 CSS : 

    
    <link rel="stylesheet" href="YOUR_PATH_TO_BMI_CALCULATOR/forked_components/angularjs-slider/dist/rzslider.css" />

NOTE : replace YOUR_PATH_TO_BMI_CALCULATOR with the correct path.

and annotate it : 

    angular.module('exampleApp', [
      'bmiModule',
      'rzModule'
    ])

To see an example app go to YOUR_PATH_TO_BMI_CALCULATOR and run 

    gulp

