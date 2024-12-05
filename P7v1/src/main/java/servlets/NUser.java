package servlets;

// Servlet que recibe los datos de un nuevo usuario y los registra en la base de datos

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import DB.DB;
import java.sql.ResultSet;


public class NUser extends HttpServlet{
    
    private PrintWriter outter; 
    
// Metodo para procesar las solicitudes POST
    @Override    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
    throws ServletException, IOException {
        try {
            DB db = new DB();
            db.setConnection("com.mysql.cj.jdbc.Driver", "jdbc:mysql://localhost/usuarios?serverTimezone=UTC");
                response.setContentType("text/html");
                String usuario = request.getParameter("name");
                String password = request.getParameter("password");
                
            // Ejecutar la consulta para registrar el usuario con executeUpdate
            int rs = db.executeUpdate("INSERT INTO login (USERNAME, PASSWORD) VALUES ('" + usuario + "', '" + password + "')");
            response.setStatus(200);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
        }
    }

}



