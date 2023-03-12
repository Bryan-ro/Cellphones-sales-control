const { CellPhone } = require("../models/ModelAndCellphone");

class CellPhoneMiddleware {
    static verifyIfCellPhoneExists = async (req, res, next) => {
        const { imei } = req.body;

        const cellPhone = await CellPhone.findOne({ where: { imei } });

        if(cellPhone) {
            return res.status(409).json({ error: "The cell phone already exists." })
        }

        return next();      
    }
}


module.exports = CellPhoneMiddleware;
