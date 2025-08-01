"use client";
import { useUserContext } from "@/app/components/js/Wrapper";
import { postRequest } from "@/app/components/js/api_client";
import { loginUrl, signupUrl } from "@/app/components/js/config";
import { Countries } from "@/app/components/js/countries";
import showError, { showSuccess } from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";
import Link from "next/link";
import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
export default function Body() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [oNames, setONames] = useState<string>("");
  const [sName, setSName] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [role, setRole] = useState<number>(0);
  const [cryptoComapny, setCryptoComapny] = useState<string>("");
  const [country, setCountry] = useState<string>(Countries[0]);
  const [cPassword, setCPassword] = useState<string>("");
  const [check, setCheck] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { logIn, referralID } = useUserContext();
  const handle = async () => {
    setError("Please wait...");
    let stripUsername = (): string => {
      const gaps = username.split(" ");
      let striped = "";
      gaps.forEach((gap) => {
        striped += gap;
      });
      return striped;
    };
    let stripEmail = (): string => {
      const gaps = email.split(" ");
      let striped = "";
      gaps.forEach((gap) => {
        striped += gap;
      });
      return striped;
    };
    const { data, success, message } = await postRequest(signupUrl, {
      username: stripUsername().toLowerCase(),
      password,
      email: stripEmail().toLowerCase(),
      rUsername: referralID.toLowerCase(),
      sName,
      oNames,
      cryptoComapny,
      tel,
      country,
      referredBy: referralID,
    });
    if (!success) {
      showError(setError, message);
      return;
    }
    showSuccess(setError, "Registration successful");
    logIn(data);
  };
  return (
    <div>
      <h1>Create Account</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handle();
        }}
      >
        <label>Username</label>

        <input
          required
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username}
          name="username"
          placeholder="Username"
        />
        <label>Email</label>
        <input
          required
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          name="email"
          placeholder="someone@gmail.com"
        />
        <label>Password</label>
        <div>
          {!showPassword ? (
            <MdOutlineVisibilityOff
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          ) : (
            <MdOutlineVisibility
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          )}
          <input
            required
            type={showPassword ? "text" : "password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            placeholder="password"
            name="password"
          />
        </div>
        <label>Confirm Password</label>

        <div>
          {!showPassword ? (
            <MdOutlineVisibilityOff
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          ) : (
            <MdOutlineVisibility
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          )}
          <input
            required
            type={showPassword ? "text" : "password"}
            onChange={(e) => {
              setCPassword(e.target.value);
            }}
            value={cPassword}
            name="confirm password"
            placeholder="Confirm password"
          />
        </div>
        <label>Surname</label>

        <input
          required
          type="text"
          onChange={(e) => {
            setSName(() => e.target.value);
          }}
          value={sName}
          autoComplete="true"
          placeholder="Surname Name"
          name="name"
        />
        <label>Other Names</label>

        <input
          required
          type="text"
          onChange={(e) => {
            setONames(() => e.target.value);
          }}
          value={oNames}
          autoComplete="true"
          placeholder="Other Names"
          name="name"
        />
        <label>Phone Number</label>
        <input
          required
          type="number"
          onChange={(e) => {
            setTel(() => e.target.value);
          }}
          value={tel}
          autoComplete="true"
          placeholder="Phone Number"
          name="tel"
        />
        <label>Country</label>
        <select onChange={(e) => setCountry(e.target.value)} value={country}>
          {Countries.sort().map((country, i) => (
            <option key={i} value={country}>
              {country}
            </option>
          ))}
        </select>
        <label>Account Type</label>
        <select
          onChange={(e) => setRole(parseInt(e.target.value))}
          value={role}
        >
          <option value={0}>Individual</option>
          <option value={1}>Corporate</option>
        </select>
        {role == 1 && <label>Company Name</label>}
        {role == 1 && (
          <input
            required
            type="text"
            value={cryptoComapny}
            onChange={(e) => setCryptoComapny(e.target.value)}
            name="company name"
            placeholder="Company Name"
          />
        )}
        {referralID && <label>Referral ID</label>}
        {referralID && (
          <input
            required
            type="text"
            value={referralID}
            disabled={true}
            name="referral Id"
            placeholder="Referral ID"
          />
        )}
        <div>
          <input
            type="checkbox"
            id="check"
            checked={check}
            onChange={() => setCheck(!check)}
          />
          <span>
            {" "}
            I agree to <Link href={"/terms"}>terms and conditions</Link>
          </span>
        </div>

        <button disabled={password != password}>Create Account</button>
      </form>
      <div>
        <Link href={"/login"}>Login</Link>
        <Link href={"/forgotpassword"}>Forgot password</Link>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
}
