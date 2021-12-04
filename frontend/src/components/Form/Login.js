import React, { useState } from "react";
import FormSignup from "./FormLogin";
import FormLogin from "./FormSign";
import {Link} from "react-router-dom"

function Login() {

    const [sign, setSign] = useState(true)
    const [btnTxt, setBtn] = useState("Login")
    const [spnTxt, setSpn] = useState("Don't Have an Account ? Signup ")

   

    const handleChange = () => {

        setSign(!sign)

        if (sign === true) {

            setBtn("Login")
            setSpn("Don't Have an Account ? Signup ")
        }
        else {

            setBtn("Signup")
            setSpn("Already Have an Account ? Login ")
        }
    }
    return (
        <div className="login">
            <br /><br /><br />
            <div className="row">
                <div className="col-md-6">

                    <div className="signup">
                        <h1>{btnTxt}</h1>
                        <br />
                        <form className="form">

                            {sign === true ? (<FormLogin />) : (<FormSignup />)}

                            <button className="form-input-btn" type="submit" ><Link to="/products">{btnTxt}</Link></button>
                            <span className='form-input-login'>
                                {spnTxt}   <a href='#' onClick={handleChange}>here</a>
                            </span>
                        </form>
                        <br />
                    </div>
                </div>
                <div className="col-md-6">
                    <img src="https://static.vecteezy.com/system/resources/thumbnails/001/925/914/small_2x/online-library-concept-free-vector.jpg" />
                </div>
            </div>
            

        </div>
    );
}

export default Login