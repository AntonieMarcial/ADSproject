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
import org.json.JSONArray;
import org.json.JSONObject;

public class Editar extends HttpServlet {

    private PrintWriter out;

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    out = response.getWriter();
    response.setContentType("application/json");
    response.addHeader("Access-Control-Allow-Origin", "*");

    // Leer el cuerpo de la solicitud
    StringBuilder sb = new StringBuilder();
    String line;
    while ((line = request.getReader().readLine()) != null) {
        sb.append(line);
    }

    // Convertir el cuerpo a un objeto JSON
    JSONObject jsonRequest = new JSONObject(sb.toString());

    // Obtener los parámetros del cuerpo de la solicitud
    String idEjercicio = jsonRequest.getString("idEjercicio");
    String pregunta = jsonRequest.getString("pregunta");
    String respuesta = jsonRequest.getString("respuesta");
    String drags = jsonRequest.getString("drags");  // Se espera un JSON string
    String targets = jsonRequest.getString("targets");  // Se espera un JSON string

    // Crear un objeto JSON con los nuevos valores
    JSONObject json = new JSONObject();
    json.put("id", idEjercicio);
    json.put("pregunta", pregunta);
    json.put("respuesta", respuesta);

    // Verificar que los parámetros drags y targets no sean null o vacíos
    if (drags != null && !drags.isEmpty()) {
        json.put("drags", new JSONArray(drags));  // Si drags no es null ni vacío, agregarlo como JSON array
    } else {
        json.put("drags", new JSONArray());  // Si es vacío o null, asignar un arreglo vacío
    }

    if (targets != null && !targets.isEmpty()) {
        json.put("targets", new JSONArray(targets));  // Si targets no es null ni vacío, agregarlo como JSON array
    } else {
        json.put("targets", new JSONArray());  // Si es vacío o null, asignar un arreglo vacío
    }

    String columnajson = json.toString();  // Convertir el objeto JSON a String para almacenarlo en la columna

    // Respuesta JSON para la salida
    StringBuilder responseJson = new StringBuilder();
    responseJson.append("{");

    try {
        // Establecer conexión a la base de datos
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection db = DriverManager.getConnection("jdbc:mysql://localhost/crudjson", "root", "1234");

        // Preparar la consulta para actualizar la columna `columnajson`
        String query = "UPDATE tablajson SET columnajson=? WHERE idEjercicio=?";
        PreparedStatement ps = db.prepareStatement(query);
        ps.setString(1, columnajson);  // Establecer el nuevo JSON como valor
        ps.setInt(2, Integer.parseInt(idEjercicio));  // Establecer el idEjercicio como criterio de búsqueda

        int rowsUpdated = ps.executeUpdate();
        if (rowsUpdated > 0) {
            responseJson.append("\"success\": true}");
        } else {
            responseJson.append("\"success\": false, \"message\": \"No se encontró el ejercicio con el idEjercicio proporcionado\"}");
        }

        db.close();
    } catch (Exception e) {
        e.printStackTrace();
        responseJson.append("\"success\": false, \"message\": \"Error en la base de datos\"}");
    }

    responseJson.append("}");
    out.write(responseJson.toString());
}


}
