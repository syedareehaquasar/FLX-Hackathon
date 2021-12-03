import React, { useState } from "react";

function FormSignup() {

    const [values, setValues] = useState({

        user: "",
        email: "",
        pwd1: "",
        pwd2: ""
    });

    const handleChange= (e) =>{

        const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    }

    const handleSubmit = (e) => {

        e.preventDefault();
    }

    return (
        <div className="signup">
            <br/><br/>
            <h1>Login</h1>
            <br/>
            <form className="form">
                
                <div className="form-inputs">
                    <label className="form-label" htmlFor="email">
                    
                        <input className="form-input"
                            type="text"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={values.email}
                            autoComplete="off"
                        />
                    
                        
                    </label>
                </div>
                <br />
                <div className="form-inputs">
                    <label className="form-label" htmlFor="pwd1">
                    
                        <input className="form-input"
                            type="password"
                            placeholder="Enter New Password"
                            name="pwd1"
                            onChange={handleChange}
                            value={values.pwd1}
                            autoComplete="off"
                        />
    
                        
                    </label>
                </div>
                <br />

                
                <br /><br />
                <button className="form-input-btn" type="submit">Login</button>
                <span className='form-input-login'>
                    Don't have an account? Signup <a href='#'>here</a>
                </span>
            </form>
            <br/>
        </div>
    )
}

export default FormSignup