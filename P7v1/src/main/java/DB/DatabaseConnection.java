package DB;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.io.InputStream;
import java.io.IOException;

public class DatabaseConnection {
    private static final String CONFIG_FILE = "database.properties";
    private static DatabaseConnection instance;
    private Properties props;
    
    private DatabaseConnection() {
        props = new Properties();
        loadProperties();
    }
    
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }
    
    private void loadProperties() {
        try (InputStream input = getClass().getClassLoader().getResourceAsStream(CONFIG_FILE)) {
            if (input == null) {
                throw new RuntimeException("No se puede encontrar " + CONFIG_FILE);
            }
            props.load(input);
            // Cargar el driver de MySQL
            Class.forName(props.getProperty("db.driver"));
        } catch (IOException | ClassNotFoundException ex) {
            throw new RuntimeException("Error al cargar la configuración de la base de datos", ex);
        }
    }
    
    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(
            props.getProperty("db.url"),
            props.getProperty("db.user"),
            props.getProperty("db.password")
        );
    }
    
    public void closeConnection(Connection connection) {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                // Log el error
                e.printStackTrace();
            }
        }
    }
}