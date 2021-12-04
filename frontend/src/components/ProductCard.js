import React from "react";
import "./Card.css"

function ProductCard() {

    return ( 

        <div className="wrapper row">
            <div className="col-md-6 product-img">
            <img src="data:image/jpeg;base64,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" height="420" width="100%" />
            </div>
            <div className="col-md-6 product-info">
                <div className="product-text">
                    <h1>Gulliver's Travel</h1>
                    <h2>Jonathan Swift</h2>
                    <p>Gulliver's Travels, or Travels into Several Remote Nations of the World. In Four Parts. By Lemuel Gulliver, First a Surgeon, and then a Captain of Several Ships is a 1726 prose satire by the Irish writer and clergyman Jonathan Swift, satirising both human nature and the 'travellers' tales' literary subgenre. </p>
                </div>
                <div className="product-price-btn">
                    <p><span>30</span>$</p>
                    <br/><br/>
                    <button type="button">buy now</button>
                </div>
            </div>
        </div>
        
    )

}

export default ProductCard;