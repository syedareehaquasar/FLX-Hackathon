import React, {useState} from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Header() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    }

    
    return (
        <div>
            <div className="header">

                <Link to="/"> <a href="#about">Logout</a></Link>
                <Link to="/user"><a href="#contact">User</a></Link>
                <Link to=""><a onClick={toggleModal}>Cart</a></Link>
                <Modal
                    isOpen={isOpen}
                    onRequestClose={toggleModal}
                    contentLabel="My dialog"

                >
                    <div onClick={toggleModal}>
                        <img src="data:image/png;base64,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" />
                        <h1>Shopping Cart is Empty</h1>
                    </div>
                </Modal>
                <div className="">
                    <form action="">
                        <input className="search" type="text" placeholder="Search.." name="search" />
                        <button type="submit">Search</button>
                    </form>
                </div>

            </div>

        </div>
    )
}

export default Header