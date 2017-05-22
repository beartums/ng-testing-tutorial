(function () {

    angular.module('Enrollment').factory('EnrollmentService',
        ['$q', '$timeout', 'Options', 'HashtableService',  EnrollmentService]);

    function EnrollmentService($q, $timeout, options, ht) {

    	//return the functions that we want to expose
    	var functions = {
    		createClientBundleInputChoices: function (districtId, dataservice, clientBundleInputChoicesToCreate, clientBundle) {
    			var clientBundleInputChoices = [];

    			//Iterate through each item provided in the array provided
    			angular.forEach(clientBundleInputChoicesToCreate, function (clientBundleInputChoiceToCreate, index) {
    				var clientBundleInputChoiceBase = {
    					DistrictId: -1,
    					BundleInputId: -1,
    					ClientBundleId: -1
    				};

    				console.log('Data passed in: ');
    				console.log(clientBundle);

    				clientBundleInputChoiceBase.DistrictId = clientBundle.DistrictId;
    				clientBundleInputChoiceBase.ClientBundleId = clientBundle.ClientBundleId;
    				clientBundleInputChoiceBase.BundleInputId = clientBundleInputChoiceToCreate.selection;

    				var clientBundleInputChoice = dataservice.createNewClientBundleInputChoice(clientBundleInputChoiceBase);

    				console.log('created a new client bundle input choice thing');
    				console.log(clientBundleInputChoice);
    			});

    			//dataservice.saveChanges();
    			return clientBundleInputChoices;
    		},

    		createClientBundle: function (dataservice, clientBundleToCreate) {

    			//logic to create a new client bundle based on the parameters that we pass in
    			var clientBundle = dataservice.createNewClientBundle(clientBundleToCreate);

    			return clientBundle;
    		},

    		//Calculate the total credit of a bundle
    		calculateClientBundleCredit: function (clientBundle, season, cbics) {
					// clientBundle is required.  cbics and season can be pulled from dataservice
					// but we must allow for cbics to be passed so that pricing while in edit mode
					// works

    			var bundleQuantity = clientBundle.BundleQuantity || 0;
    			if (bundleQuantity === 0) return 0;

					var cb = clientBundle

    			var creditCycles = ht.get('creditCycles').where(['DistrictId', 'SeasonId'], [season.DistrictId, season.SeasonId]);

    			var bundle = ht.get('bundles').where(['DistrictId', 'BundleId'], [cb.DistrictId, cb.BundleId]);
					if (!bundle) return 0;	 // when doing data entry

					var bundleInputs = ht.get('bundleInputs').where(['DistrictId', 'BundleId'], [cb.DistrictId, cb.BundleId]);
					var creditCycleBundles = ht.get('creditCycleBundles').where(['DistrictId', 'BundleId'], [cb.DistrictId, cb.BundleId]);
					var clientBundleInputChoices = cbics || ht.get('clientBundleInputChoices').where(['DistrictId', 'ClientBundleId'], [cb.DistrictId, cb.ClientBundleId]);


    			// Maps selection group names to the objects that contain
    			//	input: the Input Entity which will be used for pricing (none if there is none for this selectin group)
    			//  inputCount: Number of Inputs available for this selectionGroup
    			//  error: any error message
    			//  msg: any other message
    			var selectionGroupMap = {};	// reference of selection groups chosen

    			// First, add all unique selectionGroups to the map, with a count of inputs for each group
    			// (count>1 means that a ClientBundleInputChoice MUST be made)
    			angular.forEach(bundleInputs, function (bi) {
    				if (!selectionGroupMap[bi.SelectionGroup]) selectionGroupMap[bi.SelectionGroup] = { input: null, inputCount: 0 };
    				selectionGroupMap[bi.SelectionGroup].inputCount += 1;
    			});

    			// For all ClientBundleInputChoices, add the selected bundleInput to the map
    			angular.forEach(clientBundleInputChoices, function (cbic) {  // include all input choices
    				var bundleInput = ht.get('BundleInputs')
							.where(['DistrictId', 'BundleInputId'], [cbic.DistrictId, cbic.BundleInputId])
    				if (!selectionGroupMap[bundleInput.SelectionGroup]) {
    					selectionGroupMap[bundleInput.SelectionGroup] = { inputCount: 0, err: 'Invalid CBIC SelectionGroup' };
    				}
    				selectionGroupMap[bundleInput.SelectionGroup].input = bundleInput;
    			});

    			// Collect the inputs requiring other inputs for a third iteration through
    			var inputsRequiringInputs = [];

    			// Collect all the inputs that do NOT have a CBIC or Required input as long as they meet
    			// Min/Max conditional requirements.  Lean input==null if it should not be included in pricing
    			angular.forEach(bundleInputs, function (bi) {
    				var sg = selectionGroupMap[bi.SelectionGroup];
    				if (bi.RequiredBundleInputId) {
    					sg.msg = 'Requires unincluded inputId ' + bi.RequiredBundleInputId;
    					inputsRequiringInputs.push(bi);
    				} else if (!sg.input && sg.inputCount > 1) { // The selection group for this item has no input
    					sg.error = "Required selection not made";
    				} else if (!sg.input && sg.inputCount === 1) {
    					var reqMinQty = bi.RequiredBundleQuantityFrom || -99999999;
    					var reqMaxQty = bi.RequiredBundleQuantityTo || 999999999;
    					if (bundleQuantity <= reqMaxQty && bundleQuantity >= reqMinQty) {
    						sg.input = bi;
    					} else {
    						sg.msg = "Bundle quantitiy outside of required Min/Max"; // NOT an error
    					}
    				}
    			});

    			// Now that all the other inputs are included, we can see if the inputs
    			// requiring other inputs are to be included.  This must be run until no
    			// more required inputs are added because an added input might be required by
    			// a previous input
    			do {
    				var remainingInputs = []; // to hold no-added inputs so the iterator is respected
    				var requiredInputAdded = false;
    				angular.forEach(inputsRequiringInputs,
	                    function (iri, iriIdx) {
	                    	let sg = getChildObject(selectionGroupMap, 'input.BundleInputId', iri.RequiredBundleInputId);
	                    	if (sg) {
	                    		let minQty = iri.RequiredBundleQuantityFrom || -99999999;
	                    		let maxQty = iri.RequiredBundleQuantityFrom || 99999999
	                    		if (bundleQuantity >= minQty && bundleQuantity <= maxQty) {
	                    			selectionGroupMap[iri.SelectionGroup].msg = null;
	                    			selectionGroupMap[iri.SelectionGroup].input = iri;
	                    			requiredInputAdded = true;
	                    		} else {
	                    			selectionGroupMap[iri.SelectionGroup].msg =
										'required BundleId ' + iri.RequiredBundleInputId + ' included, but quanity requirements not met';
	                    		}
	                    	} else {
	                    		remainingInputs.push(iri);
	                    	}
	                    });
    				inputsRequiringInputs = remainingInputs;
    			} while (requiredInputAdded);

    			// Calculate price
    			// ... get bundle costs
    			var bundleCost = 0;
    			var bundleCostFixed = bundle.BundleCost_Fixed || 0;
    			var bundleCostIncremental = bundle.BundleCost_PerBundle || 0;

    			bundleCost += bundleCostFixed;
    			bundleCost += bundleCostIncremental * bundleQuantity;

    			// .. add the adjustments for included bundleInputs
    			angular.forEach(selectionGroupMap,
                    function (sgObj, sgName) {
                    	if (sgObj.input) {
                    		var fixed = sgObj.input.CostAdjustment_Fixed;
                    		var perBundle = sgObj.input.CostAdjustment_PerBundle;
                    		sgObj.cost = fixed + perBundle * bundleQuantity;
                    		bundleCost += sgObj.cost;
                    	} else {
                    		sgObj.cost = 0;
                    	}
                    });

    			//Adjust for credit cycle allocation percentage
    			var creditCycle = creditCycles[0];
    			var creditCycleBundle = $.grep(creditCycleBundles, function (ccb) { return ccb.CreditCycleId === creditCycle.CreditCycleId; })[0];

    			bundleCost = creditCycleBundle.CreditPercentage * bundleCost;
    			return bundleCost;

    		},

    	};

    	return functions;

    	// Within the parent object, find the first-level child object that has the
    	// passed property and value
    	// myObj = { foo: { name: 'a', id: 1}, bar: { name: 'b', id:2} }
    	// getChildObject(myObj, 'id', 1) // returns the child object foo
    	//
    	// this is used during the processing of inputsrequiringinputs to lookup a
    	// selectiongroup that has resolved to a specific bundleinput id
    	function getChildObject(parentObject, childObjectProperty, childObjectValue) {
    		for (let prop in parentObject) {
    			let childObject = parentObject[prop];
    			if (getValueFromPropertyPath(childObject, childObjectProperty) == childObjectValue) return childObject;
    		}
    		return null;
    	}

    	// Get a property value from a nested object using the property path
    	// myObject = { foo: { bar: 1, baz: 2} }
    	// getValueFromPropertyPath(myObject,'foo.bar')	 // returns '1'
    	function getValueFromPropertyPath(object, path) {
    		let props = path.split('.');
    		return props.reduce(function (obj, prop) {
    			if (!obj) return null;
    			return obj[prop];
    		}, object);
    	}
    }
})();
