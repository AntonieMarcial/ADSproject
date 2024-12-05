import React from 'react';
import { useGeolocated } from "react-geolocated";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import 'bootstrap/dist/css/bootstrap.min.css';

const FileUpload = () => {
  const [state, setState] = React.useState({
    selectedFile: null,
    preview: null,
    title: '',
    description: '',
    category: '',
    uploadStatus: '',
    latitude: null,
    longitude: null,
  });

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

  const handleFileSelect = (event) => {
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpload = () => {
    const { selectedFile, title, description, category, latitude, longitude } = state;
    
    if (!selectedFile || !title || !category) {
      setState(prevState => ({ ...prevState, uploadStatus: 'Por favor complete todos los campos requeridos' }));
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('fileName', selectedFile.name);
    formData.append('fileType', selectedFile.type);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    setState(prevState => ({ ...prevState, uploadStatus: 'Subiendo archivo...' }));
    
    fetch('http://localhost:8080/P7v1/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Error en la respuesta del servidor');
    })
    .then(result => {
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
    })
    .catch(error => {
      setState(prevState => ({ ...prevState, uploadStatus: 'Error: ' + error.message }));
    });
  };

  const { preview, uploadStatus, selectedFile, title, description, category } = state;

  return (
    
    <div className="p-4">
      <h2 className="text-2xl mb-4">Subir Nuevo Archivo</h2>
      <Link to="/P7v1/home" className="text-blue-500">Volver al Inicio</Link>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Título*:</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Descripción:</label>
          <textarea
            name="description"
            value={description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div>
          <label className="block mb-2">Categoría*:</label>
          <select
            name="category"
            value={category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
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

        <div>
          <label className="block mb-2">Archivo*:</label>
          <input
            type="file"
            onChange={handleFileSelect}
            accept="image/*,video/*,audio/*"
            className="mb-2"
          />
        </div>

        {preview && (
          <div className="mb-4">
            {selectedFile?.type.startsWith('image/') ? (
              <img src={preview} alt="Preview" className="max-w-xs" />
            ) : selectedFile?.type.startsWith('video/') ? (
              <video src={preview} controls className="max-w-xs" />
            ) : null}
          </div>
        )}

        <div>
          <label className="block mb-2">Localización:</label>
          {isGeolocationAvailable ? (
            isGeolocationEnabled ? (
              coords ? (
                <p>
                  Latitud: {coords.latitude}, Longitud: {coords.longitude}
                </p>
              ) : (
                <p>Obteniendo localización...</p>
              )
            ) : (
              <p>La geolocalización está desactivada.</p>
            )
          ) : (
            <p>Su navegador no soporta geolocalización.</p>
          )}
        </div>

        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={!selectedFile || !title || !category}
        >
          Subir Archivo
        </button>

        {uploadStatus && (
          <div className="mt-4">
            <p>{uploadStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;