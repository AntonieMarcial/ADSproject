import React from "react";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

class Editar extends React.Component {
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

    // Obtener los datos de la pregunta al montar el componente
    componentDidMount() {
        const qId = new URLSearchParams(window.location.search).get("id");
        if (qId) {
            axios.get("Pregunta?id=" + qId)
                .then(response => {
                    const question = response.data[0]; // Asumimos que es un arreglo de una sola pregunta
                    this.setState({ ...question });
                })
                .catch(error => {
                    console.error("Error al cargar la pregunta", error);
                    alert("Ha ocurrido un error al cargar la pregunta");
                });
        }
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
        
        // Crear un objeto con solo los datos necesarios para la actualización
        const { id, pregunta, respuesta, drags, targets } = this.state;
        const data = {
            idEjercicio: id, // idEjercicio en lugar de 'id' en el estado
            pregunta,
            respuesta,
            drags: JSON.stringify(drags),  // Convertir a JSON string
            targets: JSON.stringify(targets)  // Convertir a JSON string
        };
    
        // Enviar los datos al endpoint Editar para actualizar la pregunta
        axios.put("Editar", data)  // Aquí ahora estamos enviando los datos correctamente
            .then(response => {
                console.log("Pregunta actualizada exitosamente", response.data);
                alert("Pregunta actualizada exitosamente");
            })
            .catch(error => {
                console.error("Error al actualizar la pregunta", error);
                alert("Ha ocurrido un error al actualizar la pregunta");
            });
    };
    

    render() {
        const { id, pregunta, respuesta, drags, targets } = this.state;

        return (
            <div style={{ margin: "20px" }}>
                <h3>Editar Pregunta</h3>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        ID:
                        <input
                            type="text"
                            name="id"
                            value={id}
                            onChange={this.handleChange}
                            disabled
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
                    <button type="submit">Actualizar Pregunta</button>
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

export default Editar;