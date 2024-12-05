package servlets;

import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;
import DB.DatabaseConnection;

@MultipartConfig(
    fileSizeThreshold = 1024 * 1024, // 1 MB
    maxFileSize = 1024 * 1024 * 10,  // 10 MB
    maxRequestSize = 1024 * 1024 * 15 // 15 MB
)
public class FileUploadServlet extends HttpServlet {
    private static final String UPLOAD_DIRECTORY = "uploads";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        Connection conn = null;
        PrintWriter out = response.getWriter();
        
        try {
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String category = request.getParameter("category");
            String latitudeStr = request.getParameter("latitude");
            String longitudeStr = request.getParameter("longitude");
            
            if (title == null || title.trim().isEmpty() || category == null || category.trim().isEmpty()) {
                throw new ServletException("Título y categoría son obligatorios");
            }

            Float latitude = null;
            Float longitude = null;
            
            if (latitudeStr != null && !latitudeStr.trim().isEmpty()) {
                latitude = Float.parseFloat(latitudeStr);
            }
            if (longitudeStr != null && !longitudeStr.trim().isEmpty()) {
                longitude = Float.parseFloat(longitudeStr);
            }
            
            Part filePart = request.getPart("file");
            String fileName = request.getParameter("fileName");
            String fileType = request.getParameter("fileType");
            
            // Generar nombre único para el archivo
            String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
            String uploadPath = getServletContext().getRealPath("") + File.separator + UPLOAD_DIRECTORY;
            
            // Crear directorio si no existe
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            
            // Guardar archivo
            String filePath = uploadPath + File.separator + uniqueFileName;
            filePart.write(filePath);
            
            // Guardar en base de datos
            conn = DatabaseConnection.getInstance().getConnection();
            String sql = "INSERT INTO media_files (title, description, category, file_name, file_type, file_path, latitude, longitude, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
            
            try (PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                pstmt.setString(1, title);
                pstmt.setString(2, description);
                pstmt.setString(3, category);
                pstmt.setString(4, fileName);
                pstmt.setString(5, fileType);
                pstmt.setString(6, UPLOAD_DIRECTORY + "/" + uniqueFileName);
                
                if (latitude != null) {
                    pstmt.setFloat(7, latitude);
                } else {
                    pstmt.setNull(7, Types.FLOAT);
                }
                
                if (longitude != null) {
                    pstmt.setFloat(8, longitude);
                } else {
                    pstmt.setNull(8, Types.FLOAT);
                }
                
                int affectedRows = pstmt.executeUpdate();
                
                if (affectedRows > 0) {
                    try (ResultSet rs = pstmt.getGeneratedKeys()) {
                        if (rs.next()) {
                            long fileId = rs.getLong(1);
                            out.println("{\"status\": \"success\", \"fileId\": " + fileId + "}");
                        }
                    }
                }
            }
            
        } catch (Exception e) {
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
}