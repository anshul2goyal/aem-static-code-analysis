describe('function validate email exist',function(){
	it('function must exist',function(){
		populateEmailForBrexit.should.exist;
	});
	
	it('must return valid email address for correct input',function(){
		assert.equal(populateEmailForBrexit('http://www.test.com?email=test@test.com'),'test@test.com');
	});
});