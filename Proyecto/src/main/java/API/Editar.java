package API;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;

public class Editar extends HttpServlet {

    private PrintWriter out;

    @Override
protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    out = response.getWriter();
    
    // Leer datos JSON enviados en el cuerpo de la solicitud
    StringBuilder jsonBody = new StringBuilder();
    String line;
    while ((line = request.getReader().readLine()) != null) {
        jsonBody.append(line);
    }

    System.out.println("Datos recibidos para editar: " + jsonBody.toString());
    
    // Extraer el contenido JSON de la solicitud
    try {
        // Convertir el JSON recibido a un objeto de tipo JSONObject
        org.json.JSONObject jsonObject = new org.json.JSONObject(jsonBody.toString());
        
        // Extraer los datos del JSON
        String idEjercicio = jsonObject.getString("idEjercicio");
        String pregunta = jsonObject.getString("pregunta");
        String respuesta = jsonObject.getString("respuesta");
        org.json.JSONArray drags = jsonObject.getJSONArray("drags");  // Asegúrate de que drags sea un JSONArray
        org.json.JSONArray targets = jsonObject.getJSONArray("targets");  // Asegúrate de que targets sea un JSONArray
        
        // Actualizar los datos en la base de datos
        updatePreguntaInDB(idEjercicio, pregunta, respuesta, drags, targets);
        
        // Enviar respuesta de éxito
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.addHeader("Access-Control-Allow-Origin", "*");
        out.write("{\"message\": \"Pregunta actualizada exitosamente.\"}");
        
    } catch (Exception e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        out.write("{\"error\": \"Hubo un error al procesar la solicitud.\"}");
    }
}


    private void updatePreguntaInDB(String idEjercicio, String pregunta, String respuesta, org.json.JSONArray drags, org.json.JSONArray targets) {
    try {
        // Conectar a la base de datos
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection db = DriverManager.getConnection("jdbc:mysql://localhost/crudjson", "root", "1234");
        
        // Usamos PreparedStatement para evitar problemas con caracteres especiales
        String updateQuery = "UPDATE tablajson SET "
                + "columnajson = JSON_SET(columnajson, "
                + "'$.pregunta', ?, "
                + "'$.respuesta', ?, "
                + "'$.drags', ?, "
                + "'$.targets', ? "
                + ") WHERE idEjercicio = ?";
        
        PreparedStatement stmt = db.prepareStatement(updateQuery);
        
        // Establecer los valores en el PreparedStatement
        stmt.setString(1, pregunta);
        stmt.setString(2, respuesta);
        
        // Convertir drags y targets en formato JSON directamente
        stmt.setString(3, drags.toString());  // Convertimos el JSONArray a una cadena JSON
        stmt.setString(4, targets.toString()); // Convertimos el JSONArray a una cadena JSON
        
        // Establecemos el idEjercicio como un parámetro
        stmt.setString(5, idEjercicio);
        
        // Ejecutar la actualización
        stmt.executeUpdate();
        db.close();
    } catch (Exception e) {
        e.printStackTrace();
    }
}




  

}
