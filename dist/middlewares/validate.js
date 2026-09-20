"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const errors_1 = require("../errors");
function validate(schemas) {
    return (req, _res, next) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }
            if (schemas.params) {
                req.params = schemas.params.parse(req.params);
            }
            /**
             * Mesma técnica de reatribuição já usada para params: o Zod
             * não só valida `req.query` (todos os valores chegam como
             * string, ex: "?page=2"), como TRANSFORMA via z.coerce.number()
             * — por isso reatribuímos, e não apenas validamos e descartamos.
             */
            if (schemas.query) {
                req.query = schemas.query.parse(req.query);
            }
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const details = err.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                next(new errors_1.ValidationError('Dados inválidos.', details));
                return;
            }
            next(err);
        }
    };
}
//# sourceMappingURL=validate.js.map