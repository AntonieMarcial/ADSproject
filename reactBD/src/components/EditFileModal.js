import React from 'react';

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full m-4">
          <h2 className="text-2xl font-bold mb-4">Editar Archivo</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Título:</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={this.handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2">Descripción:</label>
              <textarea
                name="description"
                value={description}
                onChange={this.handleInputChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>

            <div>
              <label className="block mb-2">Categoría:</label>
              <select
                name="category"
                value={category}
                onChange={this.handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="imagen">Imagen</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="documento">Documento</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Cambiar archivo:</label>
              <input
                type="file"
                onChange={this.handleFileChange}
                accept="image/*,video/*,audio/*"
                className="mb-2"
              />
            </div>

            <div>
              <label className="block mb-2">Ubicación:</label>
              <input
                type="text"
                name="latitude"
                value={latitude}
                onChange={this.handleInputChange}
                placeholder="Latitud"
                className="w-1/2 p-2 border rounded"
              />
              <input 
                type="text"
                name="longitude"
                value={longitude}
                onChange={this.handleInputChange}
                placeholder="Longitud"
                className="w-1/2 p-2 border rounded"
              />
            </div>

            {preview && (
              <div className="mb-4">
                <img src={preview} alt="Preview" className="max-w-xs" />
              </div>
            )}

            {error && (
              <div className="text-red-500 mb-4">
                Error: {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={this.handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditFileModal;