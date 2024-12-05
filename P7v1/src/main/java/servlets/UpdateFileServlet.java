package servlets;

import DB.DatabaseConnection;
import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.MultipartConfig;
import java.math.BigDecimal;

@MultipartConfig(
    fileSizeThreshold = 1024 * 1024,    // 1 MB
    maxFileSize = 1024 * 1024 * 10,     // 10 MB
    maxRequestSize = 1024 * 1024 * 15    // 15 MB
)
public class UpdateFileServlet extends HttpServlet {
    
    private static final String UPLOAD_DIRECTORY = "uploads";
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Connection conn = null;

        try {
            // Obtener y debuggear parámetros
            String fileId = request.getPart("id").getInputStream().toString();
            String title = request.getPart("title").getInputStream().toString();
            String description = request.getPart("description").getInputStream().toString();
            String category = request.getPart("category").getInputStream().toString();
            String latitudeStr = getStringValue(request.getPart("latitude"));
            String longitudeStr = getStringValue(request.getPart("longitude"));


            
            // Debug: imprimir valores recibidos
            System.out.println("ID recibido: " + fileId);
            System.out.println("Título recibido: " + title);
            System.out.println("Descripción recibida: " + description);
            System.out.println("Categoría recibida: " + category);
            // Debug: imprimir valores recibidos
            System.out.println("Latitud recibida: " + latitudeStr);
            System.out.println("Longitud recibida: " + longitudeStr);
            // Leer los valores correctamente
            fileId = getStringValue(request.getPart("id"));
            title = getStringValue(request.getPart("title"));
            description = getStringValue(request.getPart("description"));
            category = getStringValue(request.getPart("category"));
            
            BigDecimal latitude = null;
            BigDecimal longitude = null;

            if (latitudeStr != null && !latitudeStr.trim().isEmpty()) {
                try {
                    latitude = new BigDecimal(latitudeStr);
                } catch (NumberFormatException e) {
                    throw new ServletException("Formato inválido para latitud: " + latitudeStr);
                }
            }

            if (longitudeStr != null && !longitudeStr.trim().isEmpty()) {
                try {
                    longitude = new BigDecimal(longitudeStr);
                } catch (NumberFormatException e) {
                    throw new ServletException("Formato inválido para longitud: " + longitudeStr);
                }
            }
            
            // Validar campos requeridos después de leerlos correctamente
            if (fileId == null || title == null || category == null) {
                String errorMsg = String.format("Campos requeridos faltantes - ID: %s, Title: %s, Category: %s", 
                    fileId, title, category);
                throw new ServletException(errorMsg);
            }
            
            conn = DatabaseConnection.getInstance().getConnection();
            
            // Verificar si hay un nuevo archivo
            Part filePart = request.getPart("file");
            if (filePart != null && filePart.getSize() > 0) {
                String fileName = getStringValue(request.getPart("fileName"));
                
                if (fileName == null || fileName.trim().isEmpty()) {
                    fileName = filePart.getSubmittedFileName();
                }
                
                String fileType = filePart.getContentType();
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                
                // Guardar nuevo archivo
                String uploadPath = getServletContext().getRealPath("") + File.separator + UPLOAD_DIRECTORY;
                String filePath = uploadPath + File.separator + uniqueFileName;
                
                File uploadDir = new File(uploadPath);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                
                // Obtener archivo antiguo
                String oldFilePath = null;
                try (PreparedStatement pstmt = conn.prepareStatement("SELECT file_path FROM media_files WHERE id=?")) {
                    pstmt.setString(1, fileId);
                    ResultSet rs = pstmt.executeQuery();
                    if (rs.next()) {
                        oldFilePath = rs.getString("file_path");
                    }
                }
                
                // Escribir nuevo archivo
                filePart.write(filePath);
                
                // Actualizar base de datos
                String sql = "UPDATE media_files SET title=?, description=?, category=?, file_name=?, file_type=?, file_path=?, latitude=?, longitude=? WHERE id=?";
                try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                    pstmt.setString(1, title);
                    pstmt.setString(2, description);
                    pstmt.setString(3, category);
                    pstmt.setString(4, fileName);
                    pstmt.setString(5, fileType);
                    pstmt.setString(6, UPLOAD_DIRECTORY + "/" + uniqueFileName);
                    if (latitude != null) {
                        pstmt.setBigDecimal(7, latitude);
                    } else {
                        pstmt.setNull(7, Types.DECIMAL);
                    }
                    if (longitude != null) {
                        pstmt.setBigDecimal(8, longitude);
                    } else {
                        pstmt.setNull(8, Types.DECIMAL);
                    }
                    pstmt.setString(9, fileId);
                    
                    int rowsUpdated = pstmt.executeUpdate();
                    if (rowsUpdated > 0 && oldFilePath != null) {
                        File oldFile = new File(getServletContext().getRealPath("") + File.separator + oldFilePath);
                        if (oldFile.exists()) {
                            oldFile.delete();
                        }
                    }
                }
            } else {
                // Solo actualizar metadatos
                String sql = "UPDATE media_files SET title=?, description=?, category=? WHERE id=?";
                try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                    pstmt.setString(1, title);
                    pstmt.setString(2, description);
                    pstmt.setString(3, category);
                    pstmt.setString(4, fileId);
                    pstmt.executeUpdate();
                }
            }
            
            out.println("{\"status\": \"success\", \"message\": \"Archivo actualizado correctamente\"}");
            
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

    private String getStringValue(Part part) throws IOException {
        if (part == null) return null;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(part.getInputStream()))) {
            return reader.readLine();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }
}