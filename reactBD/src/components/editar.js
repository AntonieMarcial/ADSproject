import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Editar = () => {
    return (
        <tr>
            <h1>EDITAR</h1>    
            <td className="AlignCenter">
                <Button
                    variant="success"
                    className="M-6">
                    <Link to={`/Proyecto/home`} className="CustomLink" >
                        CRUD
                    </Link>
                </Button>
            </td>
        </tr>
    )
}
export default Editar;;