import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // assicurati di avere questa configurazione

const Navbar = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const getUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Errore nel recuperare il ruolo:", error);
        } else {
            console.log(data.role)
          setRole(data.role);
        }
      } else {
        console.log("ciao errore")
      }
    };

    getUserRole();
  }, []);

  return (
    <nav className="bg-green-800 shadow-md px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      <div className="text-xl font-bold text-blue-600">
        <Link to="/">MyWebApp</Link>
      </div>

      <div className="space-x-4 text-sm font-medium text-gray-700">
        <Link to='/events' className="hover:text-blue-600">Events</Link>

        {(role === "newbie" || role === "staff" || role === "buddy_matcher" || role === "admin") && (
          <Link to='/events-staff' className="hover:text-blue-600">Events management</Link>
        )}

        {(role === "staff" || role === "buddy_matcher" || role === "admin") && (
          <>
            <Link className="hover:text-blue-600">Partnership management</Link>
            <Link className="hover:text-blue-600">Users management</Link>
          </>
        )}

        {(role === "buddy_matcher" || role === "admin") && (
          <Link className="hover:text-blue-600">Buddy management</Link>
        )}

        {role === "admin" && (
          <Link className="hover:text-blue-600">Backend entrance</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;