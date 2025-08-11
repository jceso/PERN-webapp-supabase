import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function EventsManagement() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location_name: "",
        location_link: "",
        mp_name: "",
        mp_link: "",
        commission: "",
        max_participants: "",
        date_start: "",
        date_end: "",
        registration_required: false,
        card_required: false,
        state: "SCHEDULED"
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const { data, error } = await supabase.from("events").select("*").order("date_start", { ascending: true });

            if (error) {
                console.error("Errore nel recupero degli eventi:", error);
                setEvents([]);
            } else
                setEvents(data || []);
            
            setLoading(false);
        };

        fetchEvents();
    }, []);

    // funzione quando si seleziona un file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setSelectedImage(file);
        // qui puoi fare altre cose, es. upload al server o anteprima
        console.log("File selezionato:", file);
        }
    };

    // Gestione inserimento evento
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { error } = await supabase.from("events").insert([{
            title: formData.title,
            description: formData.description,
            location_name: formData.location_name,
            location_link: formData.location_link,
            mp_name: formData.mp_name,
            mp_link: formData.mp_link,
            commission: formData.commission,
            max_participants: parseInt(formData.max_participants, 10) || null,
            date_start: new Date(formData.date_start).toISOString(),
            date_end: new Date(formData.date_end).toISOString(),
            registration_required: formData.registration_required,
            card_required: formData.card_required,
            state: formData.state
        },]);

        if (error)
            console.error("Errore nell'aggiungere evento:", error);
        else {
            setFormData({
                title: "",
                description: "",
                location_name: "",
                location_link: "",
                mp_name: "",
                mp_link: "",
                commission: "",
                max_participants: "",
                date_start: "",
                date_end: "",
                registration_required: false,
                card_required: false,
                state: "SCHEDULED"
            });
            setIsDialogOpen(false);

            // Ricarica eventi
            const { data } = await supabase.from("events").select("*").order("date_start", { ascending: true });
            setEvents(data || []);
        }
    };

    return (
        <div className="relative min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Events Management</h1>

            {loading ? (<p>Caricamento eventi...</p>) : events.length === 0 ? (<p>Nessun evento disponibile</p>) : (
                <ul className="space-y-3">
                    {events.map((event) => (
                        <li key={event.id} className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold text-lg">{event.title}</h2>
                                <p className="text-sm text-gray-500">
                                    {new Date(event.date_start).toLocaleString()} →{" "} {new Date(event.date_end).toLocaleString()}</p>
                                <p className="text-xs text-gray-400">{event.location_name}</p>
                            </div>
                            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                                Modifica
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Floating Button */}
            <button className='fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl'
                onClick={() => setIsDialogOpen(true)}>+</button>

            {/* Dialog */}
            {isDialogOpen && (
                <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto'>
                        <h2 className='text-xl font-bold mb-4'>Add new event</h2>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            {/* TITLE + DESCRIPTION*/}
                            {/* Title + Upload button container */}
                            <div className="flex items-center gap-2">
                                <input
                                    className='flex-grow border rounded px-3 py-2'
                                    type="text"
                                    placeholder="Name*"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required />
                                <input className='w-10 h-10 px-3 py-2 border-3 border-green-600 rounded'
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange} />
                            </div>
                            <textarea className='w-full border rounded px-3 py-2'
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value }) }
                                required />

                            {/* LOCATION + MP */}
                            <div className="relative border-2 border-gray-400 rounded-xl pt-5 px-3 pb-2 mt-4 mx-2">
                                <span className="absolute -top-3 right-15 bg-white px-2 text-sm font-medium">Places</span>

                                <div className="relative w-full border rounded-lg">
                                    <span className="absolute -top-2 left-5 bg-white px-2 text-xs text-gray-700">Location</span>
                                    <input className="w-full block px-3 py-2"
                                        type="text" placeholder="Name*"
                                        value={formData.location_name}
                                        onChange={(e) => setFormData({ ...formData, location_name: e.target.value }) }
                                        required />
                                    <input className="w-full block px-3 py-2"
                                        type="text" placeholder="Link"
                                        value={formData.location_link}
                                        onChange={(e) => setFormData({ ...formData, location_link: e.target.value }) } />
                                </div>

                                <div className="relative w-full border rounded-lg mt-3">
                                    <span className="absolute -top-2 left-5 bg-white px-2 text-xs text-gray-700">Meeting point</span>
                                    <input className="w-full block px-3 py-2"
                                        type="text" placeholder="Name"
                                        value={formData.mp_name}
                                        onChange={(e) => setFormData({ ...formData, mp_name: e.target.value }) } />
                                    <input className="w-full block px-3 py-2"
                                        type="text" placeholder="Link"
                                        value={formData.mp_link}
                                        onChange={(e) => setFormData({ ...formData, mp_link: e.target.value }) } />
                                </div>

                            </div>

                            {/* DATES & HOURS */}
                            <div className="relative border-2 border-gray-400 rounded-xl p-4 mt-4 mx-2">
                                <span className="absolute -top-3 left-15 bg-white px-2 text-sm font-medium">Dates</span>

                                <div className="flex space-x-4 w-full">
                                    <DatePicker wrapperClassName='w-1/2' className='w-full border rounded px-3 py-2'
                                        selected={formData.date_start ? new Date(formData.date_start) : null}
                                        onChange={(dateStart) => { setFormData({ ...formData, date_start: dateStart.toISOString(),
                                            date_end: formData.date_end && new Date(formData.date_end) > dateStart ? formData.date_end : dateStart.toISOString(), }); }}
                                        dateFormat="dd/MM/yyyy - HH:mm" placeholderText="Starting date"
                                        showTimeSelect timeIntervals={15} timeCaption="Time"
                                        minDate={new Date()} required />

                                    <DatePicker wrapperClassName='w-1/2' className='w-full border rounded px-3 py-2'
                                        selected={formData.date_end ? new Date(formData.date_end) : null}
                                        onChange={(dateEnd) => { setFormData({ ...formData, date_end: dateEnd.toISOString() }); }}
                                        dateFormat="dd/MM/yyyy - HH:mm" placeholderText="Ending date"
                                        showTimeSelect timeIntervals={15} timeCaption="Time"
                                        minDate={formData.date_start ? new Date(formData.date_start) : new Date()} required />
                                </div>
                            </div>

                            {/* COMMISSION + MAX PARTICIPANTS */}
                            <div className="flex gap-5 mx-7">
                                <select className='w-3/5 border rounded px-3 py-2'
                                    value={formData.commission}
                                    onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                                    required >
                                        <option value="" disabled hidden>Select commission</option>
                                        <option value="PROGETTI">PROGETTI</option>
                                        <option value="EVENTI">EVENTI</option>
                                        <option value="VIAGGI">VIAGGI</option>
                                        <option value="SPORT">SPORT</option>
                                        <option value="BEITALIAN">BEITALIAN</option>
                                        <option value="ESNcard">ESNcard</option>
                                </select>

                                <input className='w-2/5 border rounded px-3 py-2'
                                    type="number"
                                    placeholder="Max participants"
                                    value={formData.max_participants}
                                    onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })} />
                            </div>

                            {/* REGISTRATION + ESNcard */}
                            <div className="flex items-center gap-3 mt-2 mx-9">
                                <label className='flex gap-3 bg-green-100 w-1/2 border-2 border-green-500 rounded-xl p-3 font-bold'>
                                    <input
                                        type="checkbox"
                                        checked={formData.registration_required}
                                        onChange={(e) => setFormData({ ...formData, registration_required: e.target.checked }) }
                                        />Registration required</label>

                                <label className='flex gap-3 bg-green-100 w-1/2 border-2 border-green-500 rounded-xl p-3 font-bold'>
                                    <input
                                        type="checkbox"
                                        checked={formData.card_required}
                                        onChange={(e) => setFormData({ ...formData, card_required: e.target.checked }) }
                                        />ESNcard required</label>
                            </div>

                            {/* STATE */}
                            <select className='bg-green-800 w-40 border-2 border-green-300 rounded ml-30 p-4 font-semibold italic text-sm text-white'
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                value={formData.state} required >

                                <option value="SCHEDULED">SCHEDULED</option>
                                <option value="ORGANIZED">ORGANIZED</option>
                                <option value="PUBLISHABLE">PUBLISHABLE</option>
                                <option value="PUBLISHED">PUBLISHED</option>
                            </select>

                            <div className='flex justify-end space-x-2'>
                                <button className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
                                    type="button"
                                    onClick={() => setIsDialogOpen(false)}>Annulla</button>
                                <button className='px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600'
                                    type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EventsManagement;