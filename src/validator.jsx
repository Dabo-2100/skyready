export const validateValue = (value, options = {}) => {
    let hasError = false;
    // Check if value is not null and not just spaces
    if (options.isEmail) {
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) == false) {
            hasError = true;
        }
    }

    if (options.required) {
        if (!value) {
            hasError = true;
        } else if (value && value.trim() === "") {
            hasError = true;
        }
    }

    if (options.minLength !== undefined) {
        if (!value || (value && typeof value === 'string' && value.length < options.minLength)) {
            hasError = true;
        }
    }

    if (options.isEqual !== undefined) {
        if (!value || (value != options.isEqual)) {
            hasError = true;
        }
    }

    if (options.notEqual !== undefined) {
        if (!value || (value == options.notEqual)) {
            hasError = true;
        }
    }

    if (options.greaterThan !== undefined) {
        if (!value || (value < options.greaterThan)) {
            hasError = true;
        }
    }

    if (options.arrayNotEmpty !== undefined) {
        if (value.length <= 0) {
            hasError = true;
        }
    }
    return hasError;
}

export const formCheck = (arr) => {
    let final = 0;
    arr.forEach(element => {
        final += validateValue(element.value, element.options);
    });
    return final;
}