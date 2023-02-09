const controller = require("app/http/controllers/controller");

class handleController extends controller {
    async message(req, res, next) {
        try {
            res.locals.agentMessages = await this.model.Message.find({
                studied: {$not: {$all: [req.user._id]}},
            })
                .sort([["updatedAt", -1]])
                .populate("user")
                .exec();
            next();
        } catch (error) {
            next(error);
        }
    }

    async alert(req, res, next) {
        try {
            res.locals.alerts = await this.model.Alert.find({
                $and: [{user: req.user._id}, {status: false}],
            }).sort([["createdAt", -1]]);
            next();
        } catch (error) {
            next(error);
        }
    }

    uploadImage(req, res, next) {
        try {
            const image = req.file;
            res.json({
                uploaded: 1,
                fileName: image.originalname,
                url: `${image.destination}/${image.filename}`.substring(8),
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new handleController();
