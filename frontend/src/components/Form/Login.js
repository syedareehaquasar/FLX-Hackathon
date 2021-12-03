import React, {useState} from "react";
import FormSignup from "./FormSignup";
import FormLogin from "./FormLogin";

function Login() {

    const [sign, setSign] = useState(true)
    return (
        <div className="login">
            <br /><br /><br />
            {sign === true? (<FormSignup/>) : (<FormLogin />)}
          
        </div>
      );
}

export default Login