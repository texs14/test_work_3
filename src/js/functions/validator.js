export const validatorInput = (value, mask, error) => {
    if(!value.match(mask)) return error;
    return "ok";
};