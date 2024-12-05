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
      

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">Archivos Multimedia</h2>
        <Link to="/P7v1/UpReporte" className="CustomLink"> Crear Nuevo Reporte</Link>
        {files.length === 0 ? (
          
          <div className="text-center text-gray-500">No hay archivos subidos
          <Link to="/P7v1/UpReporte" className="CustomLink"> Crear Nuevo Reporte</Link>
          </div>

        ) : (
          <div className="grid gap-6">
            {files.map(file => (
              <div key={file.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{file.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${this.getCategoryColor(file.category)} mb-3`}>
                      {file.category}
                    </span>
                    {file.description && (
                      <p className="text-gray-600 mb-3">{file.description}</p>
                    )}
                    <div className="text-sm text-gray-500">
                      <p>Archivo: {file.fileName}</p>
                      <p>Tipo: {file.fileType}</p>
                      <p>Subido: {new Date(file.uploadDate).toLocaleString()}</p>
                      <p>Ubicación: Latitud:{file.latitude}, Longitud:{file.longitude}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => this.handleView(file.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Ver Archivo Multimedia
                    </button>
                    <button
                      onClick={() => this.handleEdit(file)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => this.handleDelete(file.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
      </div>
    );
  }
}

export default FileList;