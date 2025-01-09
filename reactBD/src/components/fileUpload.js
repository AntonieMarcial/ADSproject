import React from 'react';
import { useGeolocated } from "react-geolocated";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./../styles/styles.css";

const FileUpload = () => { // Función para subir un reporte 
  
  const [state, setState] = React.useState({ // Estado inicial de la función
    selectedFile: null,
    preview: null,
    title: '',
    description: '',
    category: '',
    uploadStatus: '',
    latitude: null,
    longitude: null,
  });

// Se obtiene la localización del usuario con la función useGeolocated de la librería react-geolocated 
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });  

  React.useEffect(() => {
    if (coords) {
      setState(prevState => ({
        ...prevState,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
    }
  }, [coords]);

  const handleFileSelect = (event) => { // Función para seleccionar un archivo y mostrar una vista previa
    const file = event.target.files[0];
    setState(prevState => ({ ...prevState, selectedFile: file }));
    
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prevState => ({ ...prevState, preview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (event) => { // Función para manejar los cambios en los campos del formulario 
    const { name, value } = event.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpload = () => { // Función para subir un archivo al servidor
    const { selectedFile, title, description, category, latitude, longitude } = state;
    
    if (!selectedFile || !title || !category) {
      setState(prevState => ({ ...prevState, uploadStatus: 'Por favor complete todos los campos requeridos' }));
      return;
    }

    const formData = new FormData(); // Se crea un objeto FormData para enviar los datos al servidor 
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('fileName', selectedFile.name);
    formData.append('fileType', selectedFile.type);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    setState(prevState => ({ ...prevState, uploadStatus: 'Subiendo archivo...' })); // Se muestra un mensaje de carga mientras se sube el archivo
    
    fetch('http://localhost:8080/P7v1/upload', { // Se hace una petición al servidor para subir el archivo
      method: 'POST',
      body: formData,
    })
    .then(response => { // Se obtiene la respuesta del servidor
      if (response.ok) return response.json(); // Si la respuesta es correcta se retorna la respuesta en formato JSON
      throw new Error('Error en la respuesta del servidor');
    })
    .then(result => { // Se muestra un mensaje de éxito y se redirige al usuario al inicio
      setState({
        selectedFile: null,
        preview: null,
        title: '',
        description: '',
        category: '',
        uploadStatus: 'Archivo subido exitosamente!',
        latitude: null,
        longitude: null,
      });
      setTimeout(() => {
        navigate('/P7v1/home');
      }, 2000);
    })
    .catch(error => {
      setState(prevState => ({ ...prevState, uploadStatus: 'Error: ' + error.message }));
    });
  };

  const { preview, uploadStatus, selectedFile, title, description, category } = state;

  return ( // Se retorna el formulario para subir un archivo al servidor 
    <div className="form-container">
    <div className="form-header">
      <h2 className="form-title">Crear nuevo reporte</h2>
      <Link to="/P7v1/home" className="back-link"><button className="form-button" >Volver al Inicio</button></Link>
    </div>
  
      <div className="form-content">
        <div className="form-group">
          <label className="form-label">Título <span className="required">*</span>:</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Ingrese el título"
            required
          />
        </div>
  
        <div className="form-group">
          <label className="form-label">Descripción:</label>
          <textarea
            name="description"
            value={description}
            onChange={handleInputChange}
            className="form-textarea"
            rows="3"
            placeholder="Ingrese una descripción (opcional)"
          />
        </div>
  
        <div className="form-group">
          <label className="form-label">Categoría <span className="required">*</span>:</label>
          <select
            name="category"
            value={category}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Seleccione una categoría</option>
            <option value="imagen">Imagen</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="documento">Documento</option>
            <option value="otros">Otros</option>
          </select>
        </div>
  
        <div className="form-group">
          <label className="form-label">Archivo <span className="required">*</span>:</label>
          <input
            type="file"
            onChange={handleFileSelect}
            accept="image/*,video/*,audio/*"
            className="form-file"
            required
          />
        </div>
  
        {preview && (
          <div className="form-preview">
            {selectedFile?.type.startsWith("image/") ? (
              <img src={preview} alt="Preview" className="preview-image" />
            ) : selectedFile?.type.startsWith("video/") ? (
              <video src={preview} controls className="preview-video" />
            ) : null}
          </div>
        )}
  
        <div className="form-group">
          <label className="form-label">Localización:</label>
          {isGeolocationAvailable ? ( // Se muestra la localización del usuario si está disponible obtenida con la librería react-geolocated
            isGeolocationEnabled ? (
              coords ? (
                <p className="form-location">
                  Latitud: {coords.latitude}, Longitud: {coords.longitude}  
                </p>
              ) : (
                <p className="form-location">Obteniendo localización...</p>
              )
            ) : (
              <p className="form-location">La geolocalización está desactivada.</p>
            )
          ) : (
            <p className="form-location">Su navegador no soporta geolocalización.</p>
          )}
        </div>
  
        <button
          onClick={handleUpload}
          className="form-button"
          disabled={!selectedFile || !title || !category}
        >
          Subir Archivo
        </button>
  
        {uploadStatus && (
          <div className="form-status">
            <p>{uploadStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
  
  
};

export default FileUpload;