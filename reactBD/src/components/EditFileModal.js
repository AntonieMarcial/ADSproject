import React from 'react';
import "./../styles/stylesEdit.css"

class EditFileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.file.title,
      description: props.file.description || '',
      category: props.file.category,
      latitude: props.file.latitude,
      longitude: props.file.longitude,
      newFile: null,
      preview: null,
      error: null
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      this.setState({ newFile: file });
      
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.setState({ preview: reader.result });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  handleSubmit = () => {
    const { title, description, category,latitude,longitude, newFile } = this.state;
    const { file } = this.props;
    
    const formData = new FormData();
    formData.append('id', file.id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    
    if (newFile) {
      formData.append('file', newFile);
      formData.append('fileName', newFile.name); // Agregamos el nombre del nuevo archivo
    }

    console.log('Enviando datos:', formData);

    fetch('http://localhost:8080/P7v1/update', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) throw new Error('Error al actualizar');
      return response.json();
    })
    .then(data => {
      this.props.onUpdate();
      this.props.onClose();
    })
    .catch(error => {
      this.setState({ error: error.message });
    });
  };

  render() {
    const { title, description, category, preview,latitude,longitude ,error } = this.state;
    const { file, onClose } = this.props;

    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <h2 className="modal-title">Editar Archivo</h2>
          
          <div className="form-group">
            <label htmlFor="title" className="form-label">Título:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={this.handleInputChange}
              className="form-input"
            />
          </div>
    
          <div className="form-group">
            <label htmlFor="description" className="form-label">Descripción:</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={this.handleInputChange}
              className="form-input"
              rows="4"
            />
          </div>
    
          <div className="form-group">
            <label htmlFor="category" className="form-label">Categoría:</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={this.handleInputChange}
              className="form-input"
            >
              <option value="imagen">Imagen</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="documento">Documento</option>
              <option value="otros">Otros</option>
            </select>
          </div>
    
          <div className="form-group">
            <label htmlFor="file" className="form-label">Cambiar archivo:</label>
            <input
              type="file"
              id="file"
              onChange={this.handleFileChange}
              accept="image/*,video/*,audio/*"
              className="file-input"
            />
          </div>
    
          <div className="location-group">
            <div className="form-group">
              <label htmlFor="latitude" className="form-label">Latitud:</label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                value={latitude}
                onChange={this.handleInputChange}
                placeholder="Latitud"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="longitude" className="form-label">Longitud:</label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                value={longitude}
                onChange={this.handleInputChange}
                placeholder="Longitud"
                className="form-input"
              />
            </div>
          </div>
    
          {preview && (
            <div className="preview">
              <img src={preview} alt="Preview" className="preview-img" />
            </div>
          )}
    
          {error && (
            <div className="error-message">
              Error: {error}
            </div>
          )}
    
          <div className="modal-footer">
            <button
              onClick={onClose}
              className="btn-cancel"
            >
              Cancelar
            </button>
            <button
              onClick={this.handleSubmit}
              className="btn-save"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    );
    
    
    
  }
}

export default EditFileModal;