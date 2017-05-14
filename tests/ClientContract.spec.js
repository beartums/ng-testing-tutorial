describe('Client Management Controller', function() {
	var createController, scope;

	beforeEach(function() {
		module('Enrollment');
	
		inject(function($rootScope, $controller)  {
			scope = $rootScope.$new();
			
			createController = function() {
				return $controller('ClientManagementController as vm', {
					'$scope': scope
					});
			}
		});
	});
	it('Has a default sortColumn', function() {
		var controller=createController();
		expect(scope.vm.sortColumn).toEqual('ClientId');
	});
	if('Finds a client by partial name', function() {
		var sc = { client: { FirstName: 'john', LastName: 'Snow', ClientId: 12345}};
		scope.vm.searchString = 's';
		expect(filterClients(sc)).toEqual(true);
	});
});