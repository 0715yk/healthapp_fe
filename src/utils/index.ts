// -- 길이 관련 처리 로직 --
const SUCEED_STATUS_CODE = 2000;
const LINE_FEED = 10;
const getByteLength = (decimal: number): number => {
  return decimal >> 7 || LINE_FEED === decimal ? 2 : 1;
};

export const getByte = (str: string): number => {
  return str
    .split("")
    .map((s) => s.charCodeAt(0))
    .reduce(
      (prev, unicodeDecimalValue) => prev + getByteLength(unicodeDecimalValue),
      0
    );
};

export const checkByteLength = (
  param: string,
  min: number,
  max: number
): 2000 | 2102 | 2101 => {
  if (getByte(param) >= min && getByte(param) <= max) {
    return SUCEED_STATUS_CODE;
  } else if (getByte(param) > max) {
    return 2102;
  } else {
    return 2101;
  }
};

// -- 특수 문자 관련 처리 로직 --

const SPECIAL_CHARACTERS_REG_EXP_EXCEPT = /^[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;
export const checkSpecialCharacters = (param: string): 2000 | 2103 => {
  if (SPECIAL_CHARACTERS_REG_EXP_EXCEPT.test(param)) {
    return SUCEED_STATUS_CODE;
  } else {
    return 2103;
  }
};

// -- 공백 관련 처리 로직 --

export const checkNull = (param: string): 2000 | 2105 => {
  if (param.indexOf("　") === -1 && param.indexOf(" ") === -1) {
    return SUCEED_STATUS_CODE;
  } else {
    return 2105;
  }
};

export const ID_VALIDATION_MESSAGE = {
  2000: "",
  2101: "아이디는 최소 2자 이상, 영문은 최소 4자 이상으로 설정해주세요.",
  2102: "아이디는 한글은 최대 15자 이내, 영문은 최대 30자 이내로 설정해주세요.",
  2103: "아이디에 특수문자를 사용할 수 없습니다.",
  2104: "동일한 아이디가 존재합니다.",
  2105: "아이디에 공백을 사용할 수 없습니다.",
  // 욕설 필터링은 추후 작업(advanced)
};

export const validateUserId = (id: string): number => {
  const lengthValidationCode = checkByteLength(id, 4, 30);
  const specialCharacterValidationCode = checkSpecialCharacters(id);
  const nullValidationCode = checkNull(id);
  if (nullValidationCode !== SUCEED_STATUS_CODE) {
    return nullValidationCode;
  } else if (specialCharacterValidationCode !== SUCEED_STATUS_CODE) {
    return specialCharacterValidationCode;
  } else if (lengthValidationCode !== SUCEED_STATUS_CODE) {
    return lengthValidationCode;
  } else {
    return SUCEED_STATUS_CODE;
  }
};

export const checkPureLength = (param: string, min: number, max: number) => {
  if (param.length >= min && param.length <= max) {
    return SUCEED_STATUS_CODE;
  } else {
    return 2101;
  }
};

export const PWD_VALIDATION_MESSAGE = {
  2000: "",
  2101: "비밀번호는 최소 6자 이상, 최대 30자 이내로 작성해주세요.",
  2105: "비밀번호에 공백을 사용할 수 없습니다.",
};

export const validateUserPwd = (pwd: string): number => {
  const lengthValidationCode = checkPureLength(pwd, 6, 30);
  const nullValidationCode = checkNull(pwd);

  if (nullValidationCode !== SUCEED_STATUS_CODE) {
    return nullValidationCode;
  } else if (lengthValidationCode !== SUCEED_STATUS_CODE) {
    return lengthValidationCode;
  } else {
    return SUCEED_STATUS_CODE;
  }
};

export const NICKNAME_VALIDATION_MESSAGE = {
  2000: "",
  2101: "닉네임은 한글은 최소 1자 이상, 영문은 최소 2자 이상으로 설정해주세요.",
  2102: "닉네임은 한글은 최대 15자 이내, 영문은 최대 30자 이내로 설정해주세요.",
  2103: "닉네임에 특수문자를 사용할 수 없습니다.",
  2105: "닉네임에 공백을 사용할 수 없습니다.",
  // 욕설 필터링은 추후 작업(advanced)
};

export const validateUserNickname = (
  nickname: string
): 2000 | 2101 | 2102 | 2103 | 2105 => {
  const lengthValidationCode = checkByteLength(nickname, 2, 30);
  const specialCharacterValidationCode = checkSpecialCharacters(nickname);
  const nullValidationCode = checkNull(nickname);

  if (nullValidationCode !== SUCEED_STATUS_CODE) {
    return nullValidationCode;
  } else if (specialCharacterValidationCode !== SUCEED_STATUS_CODE) {
    return specialCharacterValidationCode;
  } else if (lengthValidationCode !== SUCEED_STATUS_CODE) {
    return lengthValidationCode;
  } else {
    return SUCEED_STATUS_CODE;
  }
};

export const validateSignupForm = (
  id: string,
  pwd: string,
  nickname: string
): string => {
  const idStatusCode = validateUserId(id) as
    | 2000
    | 2101
    | 2102
    | 2103
    | 2104
    | 2105;
  const pwdStatusCode = validateUserPwd(pwd) as 2000 | 2101 | 2105;
  const nicknameStatusCode = validateUserNickname(nickname) as
    | 2000
    | 2101
    | 2102
    | 2103
    | 2105;

  if (idStatusCode !== SUCEED_STATUS_CODE) {
    return ID_VALIDATION_MESSAGE[idStatusCode];
  } else if (pwdStatusCode !== SUCEED_STATUS_CODE) {
    return PWD_VALIDATION_MESSAGE[pwdStatusCode];
  } else if (nicknameStatusCode !== SUCEED_STATUS_CODE) {
    return NICKNAME_VALIDATION_MESSAGE[nicknameStatusCode];
  } else {
    return "";
  }
};
