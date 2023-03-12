import { CellPhone } from "../models/ModelAndCellphone";

class cellPhoneMiddleware {
    static verifyIfCellExists = async (req, res, next) => {
        const cell = await CellPhone.findByPk()
    }
}