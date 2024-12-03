import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Eliminar = () => {
    return (
        <tr>
            <h1>ELIMINAR</h1>    
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
export default Eliminar;;