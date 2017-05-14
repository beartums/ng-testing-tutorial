// Karma configuration
// Generated on Sun May 14 2017 09:18:37 GMT+0300 (E. Africa Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
	// Must point to your website repository source folder
    basePath: 'D:/Data/GrifNas/Eric/1AF/dev/oaftrac.website/src/OAF.Website',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
     	'Scripts/jquery-2.1.1.min.js',
		'Scripts/angular.min.js',
		'Scripts/angular-route.min.js',
		'Scripts/breeze.min.js',
		'Scripts/breeze.angular.js',
		'Scripts/bootstrap.min.js',
		'Scripts/ui-bootstrap-tpls-0.12.0.min.js',
		'Scripts/localForage.js',
		'Scripts/angular-localForage.js',
		'Scripts/breeze.savequeuing.js',
		'Scripts/xeditable.min.js',
		'Scripts/anguFixedHeaderTable.js',
		'Scripts/mask.min.js',
		'Scripts/yaaas/yaaas.js',
		'Scripts/ng-lodash.min.js',

		'Library/Web/Client/OafLocationSelectorDirective.js',
		'Library/Web/Client/qImproved.js',
		
		'DistrictManagement/Mobile/Enrollment/App/*.js',
		'DistrictManagement/Mobile/Enrollment/App/**/*.js',

		// MUst point to your testing directory
		'D:/Data/UnitTests/ng-testing-tutorial/code/EnrollmentService.js',
		'D:/Data/UnitTests/ng-testing-tutorial/node_modules/angular-mocks/angular-mocks.js',
		'D:/Data/UnitTests/ng-testing-tutorial/tests/**/*.spec.js',
    ],


    // list of files to exclude
    exclude: [
		'DistrictManagement/Mobile/Enrollment/App/Services/EnrollmentService.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
