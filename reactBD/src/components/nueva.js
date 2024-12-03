import React from "react";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

class Nueva extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            pregunta: "",
            respuesta: "",
            drags: [{ imagen: "", valor: "" }],
            targets: [{ imagen: "", valor: "" }]
        };
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleArrayChange = (event, index, type) => {
        const { name, value } = event.target;
        const updatedArray = [...this.state[type]];
        updatedArray[index][name] = value;
        this.setState({ [type]: updatedArray });
    };

    addField = (type) => {
        this.setState((prevState) => ({
            [type]: [...prevState[type], { imagen: "", valor: "" }]
        }));
    };

    removeField = (type, index) => {
        const updatedArray = [...this.state[type]];
        updatedArray.splice(index, 1);
        this.setState({ [type]: updatedArray });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        // Enviar los datos al mismo lugar de donde se obtienen los datos en el componente Info
        axios.post("Nueva", this.state)  // Aquí se hace el POST a la misma API
            .then(response => {
                console.log("Pregunta creada exitosamente", response.data);
                alert("Pregunta creada exitosamente");
                // Redirigir o limpiar el formulario si es necesario
            })
            .catch(error => {
                console.error("Error al crear la pregunta", error);
                alert("Ha ocurrido un error");
            });
    };

    render() {
        const { id, pregunta, respuesta, drags, targets } = this.state;

        return (
            <div style={{ margin: "20px" }}>
                <h3>Crear Nueva Pregunta</h3>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        ID:
                        <input
                            type="text"
                            name="id"
                            value={id}
                            onChange={this.handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Pregunta:
                        <input
                            type="text"
                            name="pregunta"
                            value={pregunta}
                            onChange={this.handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Respuesta:
                        <input
                            type="text"
                            name="respuesta"
                            value={respuesta}
                            onChange={this.handleChange}
                            required
                        />
                    </label>
                    <br />
                    <h4>Opciones Drags</h4>
                    {drags.map((drag, index) => (
                        <div key={index}>
                            <label>
                                Imagen:
                                <input
                                    type="text"
                                    name="imagen"
                                    value={drag.imagen}
                                    onChange={(e) => this.handleArrayChange(e, index, "drags")}
                                    required
                                />
                            </label>
                            <label>
                                Valor:
                                <input
                                    type="text"
                                    name="valor"
                                    value={drag.valor}
                                    onChange={(e) => this.handleArrayChange(e, index, "drags")}
                                    required
                                />
                            </label>
                            <button
                                type="button"
                                onClick={() => this.removeField("drags", index)}
                                disabled={drags.length === 1}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => this.addField("drags")}>
                        Agregar Drag
                    </button>
                    <h4>Opciones Targets</h4>
                    {targets.map((target, index) => (
                        <div key={index}>
                            <label>
                                Imagen:
                                <input
                                    type="text"
                                    name="imagen"
                                    value={target.imagen}
                                    onChange={(e) => this.handleArrayChange(e, index, "targets")}
                                    required
                                />
                            </label>
                            <label>
                                Valor:
                                <input
                                    type="text"
                                    name="valor"
                                    value={target.valor}
                                    onChange={(e) => this.handleArrayChange(e, index, "targets")}
                                    required
                                />
                            </label>
                            <button
                                type="button"
                                onClick={() => this.removeField("targets", index)}
                                disabled={targets.length === 1}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => this.addField("targets")}>
                        Agregar Target
                    </button>
                    <br />
                    <button type="submit">Guardar Pregunta</button>
                </form>
                <Button
                    variant="success"
                    className="M-6">
                    <Link to={`/Proyecto/home`} className="CustomLink" >
                        CRUD
                    </Link>
                </Button>
            </div>
        );
    }
}

export default Nueva;