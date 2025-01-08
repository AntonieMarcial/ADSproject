import React from 'react';
import EditFileModal from './EditFileModal';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import 'bootstrap/dist/css/bootstrap.min.css';

class FileList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      error: null,
      loading: true,
      editingFile: null
    };
  }

  componentDidMount() {
    this.loadFiles();
  }

  loadFiles = () => {
    fetch('http://localhost:8080/P7v1/files')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        const filesArray = Array.isArray(data) ? data : [];
        console.log('Datos recibidos:', data);
        this.setState({ files: filesArray, loading: false });
      })
      .catch(error => {
        console.error('Error al cargar archivos:', error);
        this.setState({ error: error.message, loading: false });
      });
  };

  handleEdit = (file) => {
    this.setState({ editingFile: file });
  };

  handleView = (fileId) => {
    window.open(`http://localhost:8080/P7v1/files?action=download&id=${fileId}`, '_blank');
  };

  handleDelete = (fileId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      fetch(`http://localhost:8080/P7v1/delete?id=${fileId}`, {
        method: 'POST'
      })
      .then(response => {
        if (!response.ok) throw new Error('Error al eliminar');
        return response.json();
      })
      .then(() => {
        this.loadFiles();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el archivo');
      });
    }
  };

  getCategoryColor = (category) => {
    const colors = {
      imagen: 'bg-blue-100 text-blue-800',
      video: 'bg-green-100 text-green-800',
      audio: 'bg-yellow-100 text-yellow-800',
      documento: 'bg-purple-100 text-purple-800',
      otros: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.otros;
  };

  render() {
    const { files, error, loading, editingFile } = this.state;

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!Array.isArray(files)) return <div>No hay archivos para mostrar</div>;

    return (
      <div>
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-container">
            <h1 className="navbar-title">Reportes con geolocalización</h1>
          </div>
        </nav>
    
        {/* Contenido principal */}
        <div className="container">
          {files.length === 0 ? (
            <div className="no-files">
              <p>No hay reportes registrados</p>
            </div>
          ) : (
            <div className="file-grid">
              {files.map(file => (
                <div key={file.id} className="file-card">
                  <div className="file-header">
                    <div className="file-info">
                      <h3 className="file-title">{file.title}</h3>
                      <span className={`file-category ${this.getCategoryColor(file.category)}`}>
                        {file.category}
                      </span>
                      {file.description && (
                        <p className="file-description">{file.description}</p>
                      )}
                      <div className="file-details">
                        <p>Archivo: {file.fileName}</p>
                        <p>Tipo: {file.fileType}</p>
                        <p>Subido: {new Date(file.uploadDate).toLocaleString()}</p>
                        <p>Ubicación: Latitud: {file.latitude.toString()}, Longitud: {file.longitude.toString()}</p>
                      </div>
                    </div>
                    <div className="file-actions">
                      <button
                        onClick={() => this.handleView(file.id)}
                        className="btn-view"
                      >
                        Ver Archivo Multimedia
                      </button>
                      <button
                        onClick={() => this.handleEdit(file)}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => this.handleDelete(file.id)}
                        className="btn-delete"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
    
          {editingFile && (
            <EditFileModal
              file={editingFile}
              onClose={() => this.setState({ editingFile: null })}
              onUpdate={() => {
                this.loadFiles();
                this.setState({ editingFile: null });
              }}
            />
          )}
    
          {/* Mover el botón de creación de nuevo reporte al final */}
          <div className="no-files">
            <Link to="/P7v1/UpReporte" class="floating-button">Crear Nuevo Reporte</Link>
          </div>
        </div>
      </div>
    );
    
    
    
  }
}

export default FileList;