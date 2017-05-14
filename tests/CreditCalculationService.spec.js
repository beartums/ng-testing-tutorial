describe('CreditCalculationService', function() {
	


	var creditCalculationService
		
	
	beforeEach(function() {
		module('Enrollment');
		
		// Allow Karma to run without those annoying popups
		window.onbeforeunload = function() {};
		
		inject(function(EnrollmentService)  {			
			creditCalculationService = EnrollmentService;
		});

	});
	
	it('has a calculateClientBundleCredit function', function() {
		expect(creditCalculationService.calculateClientBundleCredit).toBeTruthy();
	});


});