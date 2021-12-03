import React, { useState } from "react";

function FormSignup() {

    const [values, setValues] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange= (e) =>{
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        // console.warn(values);
        // email, password, confirmPassword, fullname, phone
        // console.warn(JSON.stringify(values));
        e.preventDefault();
        const item = JSON.stringify(values)
        console.warn(item);
        fetch("http://localhost:5000/customerAuth/signup", {
            method: "POST",
            // mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: item,
        }).then(response => response.json())
        .then(json => console.log(json)).then(result => localStorage.setItem("x-access-token", JSON.stringify(result)))
        .catch(error => console.log('Authorization failed : ' + error.message));
    }

    return (
        <div >
                <div className="form-inputs">
                    <label className="form-label" htmlFor="email">

                        <input className="form-input"
                            type="text"
                            placeholder="Email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            autoComplete="off"
                        />


                    </label>
                </div>
                <br />

                <div className="form-inputs">
                    <label className="form-label" htmlFor="phone">

                        <input className="form-input"
                            type="String"
                            placeholder="Enter Phone no."
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            autoComplete="off"
                        />


                    </label>
                </div>
                <br />

                <div className="form-inputs">
                    <label className="form-label" htmlFor="password">

                        <input className="form-input"
                            type="password"
                            placeholder="Enter New Password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            autoComplete="off"
                        />


                    </label>
                </div>
                <br /><br />
        </div>
    )
}

export default FormSignup