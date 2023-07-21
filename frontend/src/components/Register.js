import React from "react";
import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z]{1,20}$/;
const AGE_REGEX = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
const ADDRESS_REGEX = /^.{10,}$/;
const AILMENT_REGEX = /^.{20,}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [fname, setFname] = useState("");
  const [validFname, setValidFname] = useState(false);
  const [fnameFocus, setFnameFocus] = useState(false);

  const [lname, setLname] = useState("");
  const [validLname, setValidLname] = useState(false);
  const [lnameFocus, setLnameFocus] = useState(false);

  const [age, setAge] = useState("");
  const [validAge, setValidAge] = useState(false);
  const [ageFocus, setAgeFocus] = useState(false);

  const [address, setAddress] = useState("");
  const [validAddress, setValidAddress] = useState(false);
  const [addressFocus, setAddressFocus] = useState(false);

  const [ailment, setAilment] = useState("");
  const [validAilment, setValidAilment] = useState(false);
  const [ailmentFocus, setAilmentFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidFname(NAME_REGEX.test(fname));
  }, [fname]);

  useEffect(() => {
    setValidLname(NAME_REGEX.test(lname));
  }, [lname]);

  useEffect(() => {
    setValidAge(AGE_REGEX.test(age));
  }, [age]);

  useEffect(() => {
    setValidAddress(ADDRESS_REGEX.test(address));
  }, [address]);

  useEffect(() => {
    setValidAilment(AILMENT_REGEX.test(ailment));
  }, [ailment]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd, email, fname, lname, age, address, ailment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formField = new FormData();
    formField.append("username", user);
    formField.append("password", pwd);
    formField.append("email", email);
    formField.append("first_name", fname);
    formField.append("last_name", lname);
    formField.append("age", age);
    formField.append("address", address);
    formField.append("ailment", ailment);

    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/patient-create",
        data: formField,
      });
      console.log(response.data);
      console.log(response.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
      //clear input fields
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };
  return (
    <>
      {success ? (
        <section className="reg-section">
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section className="reg-section">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Registers</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">
              Username:
              <FontAwesomeIcon
                icon={faCheck}
                className={validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !user ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <label htmlFor="email">
              Email:
              <FontAwesomeIcon
                icon={faCheck}
                className={validEmail ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validEmail || !email ? "hide" : "invalid"}
              />
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              autoComplete="off"
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="emailnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id="emailnote"
              className={
                emailFocus && email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must have an @ symbol.
              <br />
              Must have a domain name.
            </p>

            <label htmlFor="fname">
              First Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={validFname ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validFname || !fname ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="fname"
              onChange={(e) => setFname(e.target.value)}
              value={fname}
              autoComplete="off"
              required
              aria-invalid={validFname ? "false" : "true"}
              aria-describedby="fnamenote"
              onFocus={() => setFnameFocus(true)}
              onBlur={() => setFnameFocus(false)}
            />
            <p
              id="fnamenote"
              className={
                fnameFocus && fname && !validFname
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must have no numerals.
              <br />
              Must be no longer than 20 characters.
            </p>

            <label htmlFor="lname">
              Last Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={validLname ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validLname || !lname ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="lname"
              onChange={(e) => setLname(e.target.value)}
              value={lname}
              autoComplete="off"
              required
              aria-invalid={validLname ? "false" : "true"}
              aria-describedby="lnamenote"
              onFocus={() => setLnameFocus(true)}
              onBlur={() => setLnameFocus(false)}
            />
            <p
              id="lnamenote"
              className={
                lnameFocus && lname && !validLname
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must have no numerals.
              <br />
              Must be no longer than 20 characters.
            </p>

            <label htmlFor="age">
              Age:
              <FontAwesomeIcon
                icon={faCheck}
                className={validAge ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validAge || !age ? "hide" : "invalid"}
              />
            </label>
            <input
              type="number"
              id="age"
              onChange={(e) => setAge(e.target.value)}
              value={age}
              required
              autoComplete="off"
              aria-invalid={validAge ? "false" : "true"}
              aria-describedby="agenote"
              onFocus={() => setAgeFocus(true)}
              onBlur={() => setAgeFocus(false)}
            />
            <p
              id="agenote"
              className={
                ageFocus && age && !validAge ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be a number between 0 and 120.
            </p>

            <label htmlFor="address">
              Address:
              <FontAwesomeIcon
                icon={faCheck}
                className={validAddress ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validAddress || !address ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              autoComplete="off"
              required
              aria-invalid={validAddress ? "false" : "true"}
              aria-describedby="addressnote"
              onFocus={() => setAddressFocus(true)}
              onBlur={() => setAddressFocus(false)}
            />
            <p
              id="addressnote"
              className={
                addressFocus && address && !validAddress
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be longer than 10 characters.
            </p>

            <label htmlFor="ailment">
              Ailment:
              <FontAwesomeIcon
                icon={faCheck}
                className={validAilment ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validAilment || !ailment ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="ailment"
              onChange={(e) => setAilment(e.target.value)}
              value={ailment}
              autoComplete="off"
              required
              aria-invalid={validAilment ? "false" : "true"}
              aria-describedby="ailmentnote"
              onFocus={() => setAilmentFocus(true)}
              onBlur={() => setAilmentFocus(false)}
            />
            <p
              id="addressnote"
              className={
                ailmentFocus && ailment && !validAilment
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be longer than 20 characters.
            </p>

            <button
              disabled={
                !validName ||
                !validPwd ||
                !validMatch ||
                !validEmail ||
                !validFname ||
                !validLname ||
                !validAge ||
                !validAddress ||
                !validAilment
                  ? true
                  : false
              }
            >
              Sign Up
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              {/*put router link here*/}
              <a href="#">Sign In</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
