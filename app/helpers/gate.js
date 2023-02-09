//TODO: Create ACL with connect-roles

const ConnectRoles = require('connect-roles');
const Permission = require('app/models/permission');

//* Create gate for access list
let gate = new ConnectRoles({
	failureHandler: function (req, res, action) {
		let accept = req.headers.accept || '';
		res.status(403);
		if (accept.indexOf('html')) res.render('errors/403', { action });
		else res.json("Access Denied - You don't have permission to: " + action);
	},
});

const permissions = async () => {
	return await Permission.find({});
};

permissions().then((permissions) => {
	permissions.forEach((permission) => {
		gate.use(permission.label, (req) => {
			return req.isAuthenticated()
				? req.user.hasPermission(permission._id)
				: false;
		});
	});
});

module.exports = gate;
