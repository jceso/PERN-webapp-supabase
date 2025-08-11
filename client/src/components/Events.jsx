import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Events() {
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchEvents = async () => {
            const now = new Date();

            setLoading(true);

            const { data, error } = await supabase.from("events").select("*")
                .gte("date_start", now.toISOString()).eq("state", "PUBLISHED")
                .order("date_start", { ascending: true });

            if (error) {
                console.error("Error fetching events:", error);
                setCalendarEvents([]);
            } else
                setCalendarEvents(data || []);

            setLoading(false);
        };

        fetchEvents();
    }, []);

    // highlight event days
    const tileClassName = ({ date }) => {
        const hasEvent = calendarEvents.some((event) =>
            new Date(event.date_start).toDateString() === date.toDateString());

        return hasEvent ? "bg-blue-300 rounded-full" : null;
    };

    // filter events for selected date
    const eventsForSelectedDate = calendarEvents.filter((event) =>
        new Date(event.date_start).toDateString() === selectedDate.toDateString());

    return (
        <div className="relative min-h-screen p-4">
            <div className="flex gap-4 mb-6">
                {/* Calendar + Selected */}
                <div className="w-2/3 bg-white rounded-lg p-4 flex gap-4">
                    {/* CALENDAR */}
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        tileClassName={tileClassName}
                        minDate={new Date()} />

                    {/* SELECTED DATE */}
                    <div className='px-3 py-2 rounded-xl border-2 border-gray-200'>
                        <h2 className="font-bold text-lg mb-2"> Events on {selectedDate.toLocaleDateString()}</h2>
                        {loading ? (<p className="text-sm text-gray-500">Loading...</p>)
                            : eventsForSelectedDate.length === 0 ? (<p className="text-sm text-gray-500">No events</p>) : (
                            
                            <ul className="space-y-2">
                                {eventsForSelectedDate.map((event) => (
                                    <li className='p-2 border rounded hover:bg-gray-50 cursor-pointer'
                                        key={event.id}>

                                        <p className="font-medium">{event.title}</p>
                                        <p className="text-xs text-gray-500">{new Date(event.date_start).toLocaleString()}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>                
                </div>

                {/* EVENTS LIST */}
                <div className="w-1/3 bg-white rounded-lg shadow p-4 overflow-y-auto">
                
                </div>
            </div>
        </div>
    );
}

export default Events;