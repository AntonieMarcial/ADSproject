package servlets;

import DB.DatabaseConnection;
import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class DeleteFileServlet extends HttpServlet {
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Connection conn = null;

        try {
            String fileId = request.getParameter("id");
            if (fileId == null) {
                throw new ServletException("ID requerido");
            }

            conn = DatabaseConnection.getInstance().getConnection();
            
            // Obtener ruta del archivo antes de eliminar
            String filePath = null;
            try (PreparedStatement pstmt = conn.prepareStatement("SELECT file_path FROM media_files WHERE id = ?")) {
                pstmt.setString(1, fileId);
                ResultSet rs = pstmt.executeQuery();
                if (rs.next()) {
                    filePath = rs.getString("file_path");
                }
            }

            // Eliminar registro de la base de datos
            try (PreparedStatement pstmt = conn.prepareStatement("DELETE FROM media_files WHERE id = ?")) {
                pstmt.setString(1, fileId);
                int result = pstmt.executeUpdate();
                
                if (result > 0 && filePath != null) {
                    // Eliminar archivo físico
                    File file = new File(getServletContext().getRealPath("") + File.separator + filePath);
                    if (file.exists()) {
                        file.delete();
                    }
                    out.println("{\"status\": \"success\", \"message\": \"Archivo eliminado correctamente\"}");
                } else {
                    throw new ServletException("No se encontró el archivo");
                }
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"status\": \"error\", \"message\": \"" + e.getMessage() + "\"}");
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }
}