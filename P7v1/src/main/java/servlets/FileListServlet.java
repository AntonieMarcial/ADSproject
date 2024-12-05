package servlets;

import com.google.gson.Gson;
import DB.DatabaseConnection;
import java.io.*;
import java.sql.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class FileListServlet extends HttpServlet {
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = request.getParameter("action");
        
        if ("download".equals(action)) {
            downloadFile(request, response);
        } else {
            listFiles(request, response);
        }
    }

   private void listFiles(HttpServletRequest request, HttpServletResponse response) 
        throws ServletException, IOException {
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    PrintWriter out = response.getWriter();
    List<Map<String, Object>> files = new ArrayList<>();
    Connection conn = null;

    try {
        conn = DatabaseConnection.getInstance().getConnection();
        String sql = "SELECT id, title, description, category, file_name, file_type, file_path,latitude,longitude, upload_date " +
                    "FROM media_files ORDER BY upload_date DESC";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            
            while (rs.next()) {
                Map<String, Object> file = new HashMap<>();
                file.put("id", rs.getLong("id"));
                file.put("title", rs.getString("title"));
                file.put("description", rs.getString("description"));
                file.put("category", rs.getString("category"));
                file.put("fileName", rs.getString("file_name"));
                file.put("fileType", rs.getString("file_type"));
                file.put("filePath", rs.getString("file_path"));
                Double latitude = rs.getObject("latitude", Double.class);
                Double longitude = rs.getObject("longitude", Double.class);
                file.put("latitude", latitude);
                file.put("longitude", longitude);
                file.put("uploadDate", rs.getTimestamp("upload_date").toString());
                files.add(file);
            }
        }
        
        Gson gson = new Gson();
        String jsonResponse = gson.toJson(files);
        System.out.println("Respuesta JSON: " + jsonResponse); // Para depuración
        out.println(jsonResponse);
        
    } catch (SQLException e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        out.println(new Gson().toJson(error));
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

private void downloadFile(HttpServletRequest request, HttpServletResponse response) 
        throws ServletException, IOException {
    
    String fileId = request.getParameter("id");
    Connection conn = null;
    
    try {
        conn = DatabaseConnection.getInstance().getConnection();
        String sql = "SELECT file_name, file_type, file_path FROM media_files WHERE id = ?";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, fileId);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    String fileName = rs.getString("file_name");
                    String filePath = rs.getString("file_path");
                    String fileType = rs.getString("file_type");
                    
                    // Construir la ruta completa del archivo
                    String fullPath = getServletContext().getRealPath("") + File.separator + filePath;
                    File file = new File(fullPath);
                    
                    if (file.exists()) {
                        // Configurar cabeceras para mostrar en el navegador
                        response.setContentType(fileType);
                        // Aquí está el cambio principal: "inline" en lugar de "attachment"
                        response.setHeader("Content-Disposition", "inline");
                        
                        // Enviar el archivo
                        try (FileInputStream in = new FileInputStream(file);
                             OutputStream out = response.getOutputStream()) {
                            
                            byte[] buffer = new byte[4096];
                            int length;
                            while ((length = in.read(buffer)) > 0) {
                                out.write(buffer, 0, length);
                            }
                            out.flush();
                        }
                    } else {
                        response.sendError(HttpServletResponse.SC_NOT_FOUND, "Archivo no encontrado");
                    }
                } else {
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Archivo no encontrado en la base de datos");
                }
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
        throw new ServletException("Error de base de datos", e);
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
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    public String getServletInfo() {
        return "Servlet para listar y descargar archivos";
    }
}