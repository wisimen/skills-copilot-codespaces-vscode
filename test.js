// get facebook user profile
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
