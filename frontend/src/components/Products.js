import React from "react";
import "./Prod.css"

function Products() {

    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return (

        <div>
            <br />
            <div className="container-fluid row">
                <div className="col-md-8">
                <form action="">
                    <input className="search" type="text" placeholder="Search.." name="search" />
                    <button type ="submit">Search</button>
                </form>
                </div>
                <div className="col-md-4">
                    <ul className="lis">
                   User &nbsp;&nbsp;&nbsp;Logout
                   </ul>
                </div>
            </div>
            <br /><br />

            <div className="row">
                {arr.map(num => (

                    <div className="col-md-4">
                        <div className="card" >

                            <img className="card-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu1TflCyfWDMNu6q7hVfgolfdYix7qE377UQ&usqp=CAU" />
                            <div className="card-body">
                                <h1 className="card-title">Title</h1>
                                <p className="card-text">Ratings : </p>
                                <p className="card-text">Description</p>
                                <h5 className="card-title">Price</h5>
                            </div>
                        </div>
                    </div>

                ))
                }
            </div>

        </div>
    )

}

export default Products