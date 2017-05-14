describe('CreditCalculationService', function() {
	
	// Bundle Input CLASS
	// 	to make the tests easier to understand
	function BundleInput(BundleInputId, SelectionGroup, CostAdjustment_Fixed, CostAdjustment_PerBundle,
							RequiredBundleQuantityFrom, RequiredBundleQuantityTo, RequiredBundleInputId) {
		this.BundleInputId = BundleInputId;
		this.SelectionGroup = SelectionGroup;
		this.CostAdjustment_Fixed = CostAdjustment_Fixed
		this.CostAdjustment_PerBundle = CostAdjustment_PerBundle
		this.RequiredBundleQuantityFrom = RequiredBundleQuantityFrom;
		this.RequiredBundleQuantityTo = RequiredBundleQuantityTo;
		this.RequiredBundleInputId = RequiredBundleInputId;
	}

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

	
	it('calculates simple one-input bundle price correctly', function() {
		let mockClientBundle = {
			BundleQuantity: 3,
			Bundle: {
				BundleCost_Fixed: 500,	BundleCost_PerBundle: 200,
				BundleInputs: [
				//					ID	SelectionGroup	FixedAdj	PerBundleAdj	ReqQtyFrom	ReqQtyTo	ReqInputId
					new BundleInput(1, 	'Jon Snow', 	0, 			0, 				null, 		null, 		null)
				],
				CreditCycleBundles: [
					{ CreditCycleId: 1, CreditPercentage: 1}
				]
			},
			ClientBundleInputChoices: [],
		}
		let mockSeason = {	CreditCycles: [	{ CreditCycleId: 1}	] };
		
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(1100);
								
	})

	it('calculates simple multi-input bundle price correctly', function() {
		let mockClientBundle = {
			BundleQuantity: 2,
			Bundle: {
				BundleCost_Fixed: 500,	BundleCost_PerBundle: 200,
				BundleInputs: [
				//					ID	SelectionGroup	FixedAdj	PerBundleAdj	ReqQtyFrom	ReqQtyTo	ReqInputId
					new BundleInput(1, 	'Jon', 			20, 		0, 				null, 		null, 		null),
					new BundleInput(2, 	'Cersei', 		0, 			10, 			null, 		null, 		null),
					new BundleInput(3, 	'Arya', 		0, 			0, 				null, 		null, 		null),
				],
				CreditCycleBundles: [ { CreditCycleId: 1, CreditPercentage: 1}	]
			},
			ClientBundleInputChoices: [],
		}
		let mockSeason = {	CreditCycles: [	{ CreditCycleId: 1}	] };
		
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(940);
								
	});
	

});