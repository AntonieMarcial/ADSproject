import React from "react";
import { Button, Container, Table} from "react-bootstrap";
import { Link } from "react-router-dom";

class Home extends React.Component 
{
    render() {
        return (
            <Container className="MarginContainer" >
                <h1 className="AlignCenter" > CREAR, ALTAS, BAJAS Y CAMBIOS </h1>
                <hr style={{ width: "80%" }} />
                
                <Button variant="info" style={{ margin: "12px" }}>
                    <Link to="/P7v1/test" className="CustomLink">NUEVA PREGUNTA</Link>
                </Button>
                <Table striped bordered >
                    <thead>
                        <tr>
                            <th>Pregunta</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
    
                    </tbody>
                </Table>
            </Container>
        )
    }

}

export default Home;