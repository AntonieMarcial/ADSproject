// Servlet para el login de usuario 
package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import DB.DatabaseConnection;

public class Login extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        String usuario = request.getParameter("User");
        String password = request.getParameter("password");
        PrintWriter out = response.getWriter();
        
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        
        try {
            DatabaseConnection dbConnection = DatabaseConnection.getInstance();
            conn = dbConnection.getConnection();
            
            String sql = "SELECT * FROM login WHERE USERNAME = ? AND PASSWORD = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, usuario);
            pstmt.setString(2, password);
            
            rs = pstmt.executeQuery();
            
            if (rs.next()) {
                out.println("yes");
            } else {
                out.println("no");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            out.println("Error en la base de datos");
        } finally {
            try {
                if (rs != null) rs.close();
                if (pstmt != null) pstmt.close();
                if (conn != null) DatabaseConnection.getInstance().closeConnection(conn);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}