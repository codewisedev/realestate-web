const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('app/models/user');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

//TODO: Site Authorization
//* Regiser
passport.use(
	'site.register',
	new localStrategy(
		{
			usernameField: 'mobile',
			passwordField: 'password',
			passReqToCallback: true,
		},
		(req, mobile, password, done) => {
			User.findOne({ mobile: mobile }, (err, user) => {
				if (err) return done(err);
				if (user)
					return done(
						null,
						false,
						req.flash('errors', 'چنین کاربری قبلا در سایت ثبت نام کرده است'),
					);
				const newUser = new User({
					name: req.body.name,
					mobile,
					password,
				});
				newUser.save((err) => {
					if (err)
						return done(
							err,
							false,
							req.flash('errors', 'ثبت نام ناموفق، لطفا دوباره سعی کنید'),
						);
					done(null, newUser);
				});
			});
		},
	),
);

//* Login
passport.use(
	'site.login',
	new localStrategy(
		{
			usernameField: 'mobile',
			passwordField: 'password',
			passReqToCallback: true,
		},
		(req, mobile, password, done) => {
			User.findOne({ mobile: mobile }, (err, user) => {
				if (err) return done(err);
				if (!user || !user.comparePassword(password)) {
					return done(
						null,
						false,
						req.flash('errors', 'اطلاعات وارد شده مطابقت ندارد'),
					);
				}
				done(null, user);
			});
		},
	),
);
//!------------------------

//TODO: Admin Authorization

//* Login
passport.use(
	'admin.login',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true,
		},
		(req, email, password, done) => {
			User.findOne({ email: email }, (err, user) => {
				if (err) return done(err);
				if (!user || !user.comparePassword(password)) {
					return done(
						null,
						false,
						req.flash('errors', 'اطلاعات وارد شده مطابقت ندارد'),
					);
				}
				done(null, user);
			});
		},
	),
);
//!------------------------

//TODO: Agent Authorization

//* Login
passport.use(
	'agent.login',
	new localStrategy(
		{
			usernameField: 'mobile',
			passwordField: 'password',
			passReqToCallback: true,
		},
		(req, mobile, password, done) => {
			// eslint-disable-next-line no-useless-escape
			mobile = mobile.replace(/(\s|\_)/g, '');
			User.findOne({ mobile: mobile }, async (err, user) => {
				if (err) return done(err);
				if (!user || !user.comparePassword(password)) {
					return done(
						null,
						false,
						req.flash('errors', 'اطلاعات وارد شده مطابقت ندارد'),
					);
				}
				done(null, user);
			});
		},
	),
);
//!------------------------
