import { useEffect, useState } from 'react';
import 'react-phone-input-2/lib/style.css'
import { supabase } from '../supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css';
import 'swiper/css/pagination';

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);

      console.log("Now:", now.toISOString());
      console.log("Next week:", nextWeek.toISOString());

      console.log("Sono dentro useEffect()")
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date_start', now.toISOString())
        .lt('date_start', nextWeek.toISOString())
        .order('date_start', { ascending: true });

      console.log(data.map(e => e.date_start));

      if (error) {
        console.error('Error fetching events:', error.message);
      } else {
        setEvents(data);
      }
    };

    fetchUpcomingEvents();
  }, []);

  function formatEventDateRange(startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);

    const options = { weekday: 'short' };
    const weekdayStart = start.toLocaleDateString('en-US', options);
    const weekdayEnd = end.toLocaleDateString('en-US', options);

    const dayStart = start.getDate();
    const dayEnd = end.getDate();

    const timeStart = start.getHours().toString().padStart(2, '0') + '.' +
                      start.getMinutes().toString().padStart(2, '0');

    const timeEnd = end.getHours().toString().padStart(2, '0') + '.' +
                    end.getMinutes().toString().padStart(2, '0');

    const sameDay = start.toDateString() === end.toDateString();

    if (sameDay) {
      return `${dayStart} ${weekdayStart} | ${timeStart} - ${timeEnd}`;
    } else {
      return `${dayStart} ${weekdayStart} ${timeStart} - ${dayEnd} ${weekdayEnd} ${timeEnd}`;
    }
  }

  return (
    <div className="bg-green-600 pb-7 max-w-[800px] mx-auto">
      <Swiper
        slidesPerView={1} loop={true} pagination={{ clickable: true }}
        navigation={true} modules={[Pagination, Navigation]} className='mySwiper h-[300px]'>
          {events.length > 0 ? (
            events.map((event) => (
              <SwiperSlide key={event.id}>
                <div className="flex flex-col justify-center items-center h-full text-center text-white p-4">
                  <h3 className="text-2xl font-bold">{event.title}</h3>
                  <p>{formatEventDateRange(event.date_start, event.date_end)}</p>
                  <p>{event.location_name}</p>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="flex items-center justify-center h-full text-white">
                No upcoming events
              </div>
            </SwiperSlide>
          )}
      </Swiper>

      <div className='flex gap-6 my-4 mx-15'>
        <button className='bg-green-400 border-2 border-green-800 p-3 w-1/2 rounded-lg text-black'>
          Partnerships
        </button>
        <button className='bg-green-400 border-2 border-green-800 p-3 w-1/2 rounded-lg text-black'>
          My registrations
        </button>
      </div>

      <p>[Insert calendar here]</p>
    </div>
  );
}