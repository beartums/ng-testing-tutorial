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

	var creditCalculationService, dataservice, hashtableService;
	
	// Allow spying to replace returned data
	var mockWhere = {
		where: function() {}
	}
	
	// Mocking hasthtable service
	var mockHashtableService = {
		get: function() {
			return mockWhere;
		}
	};
	
	beforeEach(function() {
		module('Enrollment')
		
		// Tell it to use the Mock service in place of the real one
		module({'HashtableService': mockHashtableService});
		
		// Allow Karma to run without those annoying popups
		window.onbeforeunload = function() {};
		
		inject(function(EnrollmentService)  {			
			creditCalculationService = EnrollmentService;
		});
		inject(function(HashtableService)  {			
			hashtableService = HashtableService;
		});
	});
	
	it('has a calculateClientBundleCredit function', function() {
		expect(creditCalculationService.calculateClientBundleCredit).toBeTruthy();
	});

	it('calculates simple one-input bundle price correctly', function() {
		let mockCreditCycleBundles = [	{ CreditCycleId: 1, CreditPercentage: 1} ];
		let mockSeason = { }

		let mockCreditCycles = [ { CreditCycleId: 1} ] ;
		let mockClientBundle = { BundleQuantity: 3 };
		let mockBundle = { BundleCost_Fixed: 500,	BundleCost_PerBundle: 200 };
		let mockBundleInputs = [
				//					ID	SelectionGroup	FixedAdj	PerBundleAdj	ReqQtyFrom	ReqQtyTo	ReqInputId
					new BundleInput(1, 	'Jon Snow', 	0, 			0, 				null, 		null, 		null)
		];
		let	mockClientBundleInputChoices = [];
		
		spyOn(mockWhere,'where').and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(1100);
								
	})

	it('calculates simple multi-input bundle price correctly', function() {
		let mockCreditCycleBundles = [	{ CreditCycleId: 1, CreditPercentage: 1} ];
		let mockSeason = { }

		let mockCreditCycles = [ { CreditCycleId: 1} ] ;
		let mockClientBundle = { BundleQuantity: 2 };
		let mockBundle = { BundleCost_Fixed: 500,	BundleCost_PerBundle: 200 };
		let mockBundleInputs = [
				//					ID	SelectionGroup	FixedAdj	PerBundleAdj	ReqQtyFrom	ReqQtyTo	ReqInputId
					new BundleInput(1, 	'Jon', 			20, 		0, 				null, 		null, 		null),
					new BundleInput(2, 	'Cersei', 		0, 			10, 			null, 		null, 		null),
					new BundleInput(3, 	'Arya', 		0, 			0, 				null, 		null, 		null),
				];
		let	mockClientBundleInputChoices = [];
		
		spyOn(mockWhere,'where').and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(940);
								
	});
	
	it('calculates simple one-input, multi-year bundle price correctly', function() {
		let mockBundleInputs = [
				//					ID	SelectionGroup	FixedAdj	PerBundleAdj	ReqQtyFrom	ReqQtyTo	ReqInputId
					new BundleInput(1, 	'Jon Snow', 	0, 			0, 				null, 		null, 		null)
				]
		let mockClientBundle = { BundleQuantity: 3 };
		let mockBundle = { BundleCost_Fixed: 500,	BundleCost_PerBundle: 200 };
		let mockCreditCycleBundles = [ { CreditCycleId: 1, CreditPercentage: .5}	];
		let mockSeason = {	CreditCycles: [	{ CreditCycleId: 1}	] };
		let mockCreditCycles = [ { CreditCycleId: 1} ];
		let mockClientBundleInputChoices = [];
		
				var whereSpy = spyOn(mockWhere,'where').and
			.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(550);
								
	});
		
	it('calculates simple multi-input, multi-year bundle price correctly', function() {
		let mockBundleInputs = 	[
				//					ID	SelectionGroup	FixedAdj	PerBundleAdj	ReqQtyFrom	ReqQtyTo	ReqInputId
					new BundleInput(1, 	'Jon', 			20, 		0, 				null, 		null, 		null),
					new BundleInput(2, 	'Cersei', 		0, 			10, 			null, 		null, 		null),
					new BundleInput(3, 	'Arya', 		0, 			0, 				null, 		null, 		null),
				];
		let mockClientBundle = { BundleQuantity: 2 };
		let mockBundle = { BundleCost_Fixed: 500,	BundleCost_PerBundle: 200 };
		let mockCreditCycleBundles = [ { CreditCycleId: 1, CreditPercentage: .25}	];
		let mockSeason = {	CreditCycles: [	{ CreditCycleId: 1}	] };
		let mockCreditCycles = [ { CreditCycleId: 1} ];
		let mockClientBundleInputChoices = [];
		
		var whereSpy = spyOn(mockWhere,'where').and
			.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(235);
								
	})

	it('calculates Required-Quantity, one-year bundle price correctly', function() {
		let mockBundleInputs =  [
				//					ID	SelectionGroup	FixedAdj	PerBundleAdj	ReqQtyFrom	ReqQtyTo	ReqInputId
					new BundleInput(1, 	'Jon', 			10, 		30, 				1, 			2, 			null),
					new BundleInput(2, 	'Cersei', 		0, 			20, 				3,	 		4,	 		null),
					new BundleInput(3, 	'Arya', 		0, 			10, 				5, 			6,	 		null),
				];
		let mockClientBundle = { BundleQuantity: 2 };
		let mockBundle = { BundleCost_Fixed: 500,	BundleCost_PerBundle: 200 };
		let mockCreditCycleBundles = [ { CreditCycleId: 1, CreditPercentage: 1}	];
		let mockSeason = {	CreditCycles: [	{ CreditCycleId: 1}	] };
		let mockCreditCycles = [ { CreditCycleId: 1} ];
		let mockClientBundleInputChoices = [];
		
		var whereSpy = spyOn(mockWhere,'where').and
			.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(970);

		mockClientBundle.BundleQuantity = 3;
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(1160);

		mockClientBundle.BundleQuantity = 6;
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(1760);	
		// there is no bucket for this, so no input is added to the calculation

		mockClientBundle.BundleQuantity = 8;
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(2100);	
		// this tests the calculation when there is a reqFrom qty, but no ReqTo qty (should catch everythign GE ReqFromQty)

		mockClientBundle.BundleQuantity = 8;
		mockBundleInputs.push(new BundleInput(4,'Hound', 0, 5, 7, null, null));
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(2140);
		
	});

	it('calculates price for one-year bundles using Input Choices', function() {
		
		let mockBundleInputs = [
				//					ID	SelectionGroup	FixedAdj	PerBundleAdj	ReqQtyFrom	ReqQtyTo	ReqInputId
					new BundleInput(1, 	'Jon', 			10, 		30, 			null, 			null, 			null),
					new BundleInput(2, 	'Jon', 			0, 			20, 			null,	 		null,	 		null),
					new BundleInput(3, 	'Jon', 			0, 			10, 			null, 			null,	 		null),
				];
		let mockClientBundle = { BundleQuantity: 2 };
		let mockBundle = { BundleCost_Fixed: 500,	BundleCost_PerBundle: 200 };
		let mockCreditCycleBundles = [ { CreditCycleId: 1, CreditPercentage: 1}	];
		let mockSeason = {	CreditCycles: [	{ CreditCycleId: 1}	] };
		let mockCreditCycles = [ { CreditCycleId: 1} ];
		let mockClientBundleInputChoices = [	{ 	SelectionGroup: 'Jon' }];

		// Select first bundle input
		// 500 + 200 * 2 + 10 + 30 * 2
		var whereSpy = spyOn(mockWhere,'where').and
			.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices, mockBundleInputs[0])
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(970);
		
		// Select second bundle input
		// 500 + 200 * 2 + 0 + 20 * 2
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices, mockBundleInputs[1])
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(940);

		// Select third bundle input
		// 500 + 200 * 2 + 0 + 10 * 2
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices, mockBundleInputs[2])
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(920);

		// Select no input choices
		// Error: No selection group defined
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,[])
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(900);
	});
	it('calculates price for one-year bundles with conditionally required inputs referring to SELECTED input', function() {
		
		let mockBundleInputs = [
				//					ID	SelectionGroup	FixedAdj	PerBundleAdj	ReqQtyFrom	ReqQtyTo	ReqInputId
					new BundleInput(1, 	'Jon', 			10, 		30, 			null, 			null, 			null),
					new BundleInput(2, 	'Jon', 			0, 			20, 			null,	 		null,	 		null),
					new BundleInput(5, 	'Jon', 			0, 			100, 			null,	 		null,	 		null),
					new BundleInput(3, 	'Cersei', 		0, 			10, 			null, 			null,	 		1),
					new BundleInput(4, 	'Arya', 		50, 		50, 			null, 			null,	 		2),
				];
		let mockClientBundle = { BundleQuantity: 2 };
		let mockBundle = { BundleCost_Fixed: 500,	BundleCost_PerBundle: 200 };
		let mockCreditCycleBundles = [ { CreditCycleId: 1, CreditPercentage: 1}	];
		let mockSeason = {	CreditCycles: [	{ CreditCycleId: 1}	] };
		let mockCreditCycles = [ { CreditCycleId: 1} ];
		let mockClientBundleInputChoices = [	{ 	SelectionGroup: 'Jon' }];
		
		// 1st bundle input
		// 500 + 200 * 2 + 10 + 30 * 2 + 10*2
		var whereSpy = spyOn(mockWhere,'where').and
			.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices, mockBundleInputs[0])
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(990);
		
		// second bundle input
		// 500 + 200 * 2 + 0 + 20 * 2 + 150
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices, mockBundleInputs[1])
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(1090);

		// third bundle input
		// 500 + 200 * 2 + 100*2
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices, mockBundleInputs[2])
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(1100);

	});
	it('calculates price for one-year bundles with nested conditionally required inputs referring to SELECTED input', function() {
		
		let mockBundleInputs = [
				//					ID	SelectionGroup	FixedAdj	PerBundleAdj	ReqQtyFrom	ReqQtyTo	ReqInputId
					new BundleInput(1, 	'Jon', 			10, 		30, 			null, 			null, 			null),
					new BundleInput(2, 	'Jon', 			0, 			20, 			null,	 		null,	 		null),
					new BundleInput(5, 	'Jon', 			0, 			100, 			null,	 		null,	 		null),
					new BundleInput(3, 	'Cersei', 		0, 			10, 			null, 			null,	 		4),
					new BundleInput(4, 	'Arya', 		50, 		50, 			null, 			null,	 		2),
				];
		let mockClientBundle = { BundleQuantity: 2 };
		let mockBundle = { BundleCost_Fixed: 500,	BundleCost_PerBundle: 200 };
		let mockCreditCycleBundles = [ { CreditCycleId: 1, CreditPercentage: 1}	];
		let mockSeason = {	CreditCycles: [	{ CreditCycleId: 1}	] };
		let mockCreditCycles = [ { CreditCycleId: 1} ];
		let mockClientBundleInputChoices = [	{ 	SelectionGroup: 'Jon' }];
		
		// select 1st bundle input
		// 500 + 200 * 2 + 10 + 30 * 2 
		var whereSpy = spyOn(mockWhere,'where').and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices, mockBundleInputs[0])
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(970);
		
		// select 2nd bundle input
		// 500 + 200 * 2 + 0 + 20 * 2 + 50 + 50 * 2 + 10 * 2
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices, mockBundleInputs[1])
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(1110);

		// 3rd bundle input;
		// 500 + 200 * 2 + 100*2
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices, mockBundleInputs[2])
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(1100);

	});
	it('calculates price for one-year bundles with conditionally required inputs referring to min/max input', function() {
		
		let mockBundleInputs = [
				//					ID	SelectionGroup	FixedAdj	PerBundleAdj	ReqQtyFrom	ReqQtyTo	ReqInputId
					new BundleInput(1, 	'Jon', 			10, 		30, 			null, 			2, 				null),
					new BundleInput(2, 	'Robb', 		0, 			20, 			3,	 			4,	 			null),
					new BundleInput(5, 	'Jaime', 		0, 			100, 			5,	 			6,	 			null),
					new BundleInput(3, 	'Cersei', 		0, 			10, 			null, 			null,	 		2),
					new BundleInput(4, 	'Arya', 		50, 		50, 			null, 			null,	 		5),
				];
		let mockClientBundle = { BundleQuantity: 2 };
		let mockBundle = { BundleCost_Fixed: 500, BundleCost_PerBundle: 200 };
		let mockCreditCycleBundles = [ { CreditCycleId: 1, CreditPercentage: 1}	];
		let mockClientBundleInputChoices = [];
		let mockSeason = { SeasonId: 1 };
		let mockCreditCycles = [ { CreditCycleId: 1} ];
		
		// 500 + 200 * 2 + 10 + 30 * 2 
		var whereSpy = spyOn(mockWhere,'where').and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(970);
		
		mockClientBundle.BundleQuantity = 3;
		// 500 + 200 * 3 + 0 + 20 * 3 + 10 * 3
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(1190);

		mockClientBundle.BundleQuantity = 5;
		// 500 + 200 * 5 + 100 * 5 + 50 + 50 * 5
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(2300);

		mockClientBundle.BundleQuantity = 8;
		// 500 + 200 * 8 + 0
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(2100);

	});
	it('calculates price for one-year bundles for inputs with RequiredBundleInputId and min/max quantities', function() {
		
		let mockBundleInputs = [
				//					ID	SelectionGroup	FixedAdj	PerBundleAdj	ReqQtyFrom	ReqQtyTo	ReqInputId
					new BundleInput(1, 	'Jon', 			10, 		30, 			null, 			2, 				null),
					new BundleInput(2, 	'Robb', 		0, 			20, 			3,	 			4,	 			null),
					new BundleInput(5, 	'Jaime', 		0, 			100, 			5,	 			6,	 			null),
					new BundleInput(3, 	'Cersei', 		0, 			10, 			3, 				3,	 			2),
					new BundleInput(4, 	'Arya', 		50, 		50, 			null, 			null,	 		5),
				];
		let mockClientBundle = { BundleQuantity: 2 };
		let mockBundle = { BundleCost_Fixed: 500,	BundleCost_PerBundle: 200 };
		let mockClientBundleInputChoices = [];
		let mockSeason = { SeasonId: 1 };
		let mockCreditCycleBundles = [ { CreditCycleId: 1, CreditPercentage: 1 } ];
		let mockCreditCycles = [ { CreditCycleId: 1 } ];
		
		// 500 + 200 * 2 + 10 + 30 * 2 
		var whereSpy = spyOn(mockWhere,'where').and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(970);
		
		mockClientBundle.BundleQuantity = 3;
		// 500 + 200 * 3 + 0 + 20 * 3 + 10 * 3
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(1190);

		mockClientBundle.BundleQuantity = 4;
		// 500 + 200 * 4 + 0 + 20 * 4
		whereSpy.and.returnValues(mockCreditCycles,mockBundle,mockBundleInputs,mockCreditCycleBundles,mockClientBundleInputChoices)
		expect(creditCalculationService.calculateClientBundleCredit(mockClientBundle, mockSeason)).toEqual(1380);

	});

});