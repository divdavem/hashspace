module.exports = function (errorsList, fileName) {
    var firstError = errorsList[0];
    var message = [firstError.description, " in ", fileName || "[anonymous file]"];
    if (firstError.line != null) {
        message.push(", line ", firstError.line, ", column ", firstError.column);
    }
    if (firstError.code) {
        message.push(": ", firstError.code);
    }
    var errorObject = new Error(message.join(""));
    errorObject.name = "HashspaceCompilerError";
    errorObject.errors = errorsList;
    errorObject.fileName = fileName;
    errorObject.line = firstError.line;
    errorObject.column = firstError.column;
    return errorObject;
};