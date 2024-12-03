package API;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class Pregunta extends HttpServlet {

    private PrintWriter out;


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        out = response.getWriter();
        String id=request.getParameter("id");
        System.out.println("id:"+id);
        response.setContentType("application/json");
        response.addHeader("Access-Control-Allow-Origin", "*");
            StringBuilder json = new StringBuilder();
            json.append("[");            
    try
    {
    Class.forName("com.mysql.cj.jdbc.Driver");
    Connection db = DriverManager.getConnection("jdbc:mysql://localhost/crudjson","root", "1234");
    Statement s = db.createStatement(); 
    ResultSet rs=s.executeQuery("select * from tablajson where IDEJERCICIO='"+id+"';");    
    if(rs.next())
    {
    String cadena=rs.getString("columnajson");
    json.append(cadena);
    }
    }
    catch(Exception e)
    {
    e.printStackTrace();
    }
    json.append("]");
    System.out.println("json:"+json.toString());        
    out.write(json.toString());
    }

}
