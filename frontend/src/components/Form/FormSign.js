import React, { useState } from "react";

function FormLogin() { 

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


    return (
        <div>
        
                <div className="form-inputs">
                    <label className="form-label" htmlFor="user">
                        
                        
                        <input className="form-input"
                            type="text"
                            placeholder="User Name"
                            name="user"
                            onChange={handleChange}
                            value={values.user}
                            autoComplete="off"
                        />
                    
                        
                    </label>
                </div>
                <br />
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
                            placeholder="Enter Password"
                            name="pwd1"
                            onChange={handleChange}
                            value={values.pwd1}
                            autoComplete="off"
                        />
    
                        
                    </label>
                </div>
                <br />

                <div className="form-inputs">
                    <label className="form-label" htmlFor="pwd2">
    
                        
                        <input className="form-input"
                            type="password"
                            placeholder="Confirm Password"
                            name="pwd2"
                            onChange={handleChange}
                            value={values.pwd2}
                            autoComplete="off"
                        />
        
                        
                    </label>
                </div>
                <br /><br />
                
        </div>
    )
}

export default FormLogin