var CustomValidator = /** @class */ (function () {
    function CustomValidator() {
    }
    CustomValidator.emailDomain = function (domainName) {
        return function (control) {
            var email = control.value;
            var domain = email.substring(email.lastIndexOf('@') + 1);
            if (email === '' || domain.toLowerCase() === domainName.toLowerCase()) {
                return null;
            }
            else {
                return { 'emailDomain': true };
            }
        };
    };
    return CustomValidator;
}());
export { CustomValidator };
//# sourceMappingURL=custom.validator.js.map