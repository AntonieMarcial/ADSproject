import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./components/home";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/styles.css";
import Login from "./components/login";
import User from "./components/user";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import FileUpload from "./components/fileUpload";
import ListReporte from "./components/fileList";
import EditFileModal from "./components/EditFileModal";

const App = () => {
    return ( 
        <div className="app-container"> 

            <Switch>
                <Route exact path="/P7v1">
                    <Login />
                </Route>
                <Route exact path="/P7v1/home">
                    <ListReporte />
                </Route>
                <Route exact path="/P7v1/UpReporte">
                    <div className="upload-container">
                        <FileUpload />
                    </div>
                </Route>
                <Route exact path="/P7v1/test">
                    <div className="upload-container">
                        <User />
                    </div>
                </Route>

                <Route exact path="/P7v1/EditRepote">
                    <div className="upload-container">
                        <EditFileModal />
                    </div>
                </Route>
                <Route path="*">
                    <div className="error-container">
                        <h1>RECURSO NO ENCONTRADO</h1>
                        <p>Ruta actual: {window.location.pathname}</p>
                    </div>
                </Route>
            </Switch>
        </div>
    );
}

export default App;