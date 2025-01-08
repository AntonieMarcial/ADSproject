import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import '../styles/map-styles.css';
import '../styles/styles.css';

const MapVisualization = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  const mapStyles = {
    height: "calc(100vh - 80px)",
    width: "100%"
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:8080/P7v1/files');
      if (!response.ok) {
        throw new Error('Error al cargar los reportes');
      }
      const data = await response.json();
      setReports(data);
      
      // Calculate center based on first report or default to a specific location
      if (data && data.length > 0) {
        setCenter({
          lat: parseFloat(data[0].latitude),
          lng: parseFloat(data[0].longitude)
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando mapa...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="map-container">
      <nav className="navbar">
          <div className="navbar-container">
            <h1 className="navbar-title">Visualización en mapa</h1>
            <Link to="/P7v1/home" className="btn btn-primary">
              Volver al listado
            </Link>
          </div>
        </nav>

      <LoadScript googleMapsApiKey="AIzaSyDcXAVEXfcw5Lkma8gimZzdIUyfYX0OyxQ">
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={center}
        >
          {reports.map((report) => (
            <Marker
              key={report.id}
              position={{
                lat: parseFloat(report.latitude),
                lng: parseFloat(report.longitude)
              }}
              onClick={() => setSelectedReport(report)}
            />
          ))}

          {selectedReport && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedReport.latitude),
                lng: parseFloat(selectedReport.longitude)
              }}
              onCloseClick={() => setSelectedReport(null)}
            >
              <div>
                <h3>{selectedReport.title}</h3>
                <p><strong>Categoría:</strong> {selectedReport.category}</p>
                {selectedReport.description && (
                  <p><strong>Descripción:</strong> {selectedReport.description}</p>
                )}
                <p><strong>Fecha:</strong> {new Date(selectedReport.uploadDate).toLocaleString()}</p>
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => window.open(`http://localhost:8080/P7v1/files?action=download&id=${selectedReport.id}`, '_blank')}
                >
                  Ver Archivo
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapVisualization;