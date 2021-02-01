module.exports.pwStrength = (password,password2) => {

  const lowerCaseRegex = "(?=.*[a-z])";
  const upperCaseRegex = "(?=.*[A-Z])";
  const symbolsRegex = "(?=.*[^\\w\\s])";
  const numericRegex = "(?=.*[0-9])";

  let strength = {
    id: null,
    value: null,
    length: null,
    contains: [],
  }; 
  
  // Default
  let passwordContains = [];

  if (new RegExp(`^${lowerCaseRegex}`).test(password)) {
    passwordContains.push("lowercase")
  }

  if (new RegExp(`^${upperCaseRegex}`).test(password)) {
    passwordContains.push("uppercase")
  }

  if (new RegExp(`^${symbolsRegex}`).test(password)) {
    passwordContains.push("symbol")
  }

  if (new RegExp(`^${numericRegex}`).test(password)) {
    passwordContains.push("number")
  }

  const strongRegex = new RegExp(
    `^${lowerCaseRegex}${upperCaseRegex}${numericRegex}${symbolsRegex}(?=.{8,})`
  );
  const mediumRegex = new RegExp(
    `^((${lowerCaseRegex}${upperCaseRegex})|(${lowerCaseRegex}${numericRegex})|(${upperCaseRegex}${numericRegex})|(${upperCaseRegex}${symbolsRegex})|(${lowerCaseRegex}${symbolsRegex})|(${numericRegex}${symbolsRegex}))(?=.{6,})`
  );

  if (strongRegex.test(password)) {
    strength = {
      id: 2,
      value: "Strong",
    };
  } else if (mediumRegex.test(password)) {
    strength = {
      id: 1,
      value: "Medium",
    };
  } else {
    strength = {
      id: 0,
      value: "Weak",
    };
  }
  strength.length = password.length;
  strength.contains = passwordContains;
  if(strength.length > 29) {
    strength.value="Strong"
  }
  strength.valid = strength.value=="Strong" && password === password2
  strength.requires = {
    "valid" : {
      name: strength.valid ? "Password is valid" : "Password is invalid",
      valid: strength.valid
    },
    "strength" : {
      name: "Complexity",
      value: strength.value,
      valid: strength.value === "Strong"
    },
    "lowercase" : {
      name: "Lowercase characters exist",
      valid: passwordContains.includes("lowercase")
    },
    "uppercase" : {
      name: "Uppercase characters exist ",
      valid: passwordContains.includes("uppercase")
    },
    "number" : {
      name: "Numbers exist",
      valid: passwordContains.includes("number")
    },
    "symbol" : {
      name: "Symbols exist",
      valid: passwordContains.includes("symbol")
    },
    "length" : {
      name:  "Password has "+strength.length+" characters",
      valid: strength.length > 7
    },
    "match" : {
      name:  "Passwords match",
      valid: password === password2
    },
  }
  console.log(strength)
  return strength;
};
