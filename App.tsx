import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { EventsView } from './components/EventsView';
import { ManageEvents } from './components/ManageEvents';
import { ParticipantsView } from './components/ParticipantsView';
import { CertificatesView } from './components/CertificatesView';
import { EventDetailsModal } from './components/EventDetailsModal';
import { mockEvents, mockRegistrations } from './data/mockData';
import { Event, Registration, UserRole } from './types';
import { toast, Toaster } from 'sonner';

export default function App() {
 const BACKEND_URL = import.meta.env.VITE_API_URL || "https://backend-869254969221.asia-south1.run.app";

const [file, setFile] = useState<File | null>(null);
const [uploadedUrl, setUploadedUrl] = useState<string>("");
const [uploading, setUploading] = useState(false);

const uploadFileToBackend = async () => {
  if (!file) return toast.error("Please select a file first");

  setUploading(true);
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploadedUrl(data.url);
    toast.success("File uploaded successfully!");
  } catch (err) {
    console.error(err);
    toast.error("File upload failed!");
  } finally {
    setUploading(false);
  }
};

  

    setRegistrations([...registrations, newRegistration]);
    
    // Update event registration count
    setEvents(events.map(e => 
      e.id === selectedEvent.id 
        ? { ...e, registered: e.registered + 1 }
        : e
    ));

    toast.success('Successfully registered for ' + selectedEvent.title);
    setSelectedEvent(null);
  };

  const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: `${Date.now()}`
    };
    setEvents([...events, newEvent]);
    toast.success('Event created successfully');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    toast.success('Event deleted successfully');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      <Header userRole={userRole} onToggleSidebar={toggleSidebar} />

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userRole={userRole}
          isOpen={sidebarOpen}
        />

        <main className="flex-1 lg:ml-0">
          <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
            {/* Hero */}
            <div className="hero mb-6">
              <div className="flex items-center justify-between flex-col md:flex-row gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">College Events — Discover & Register</h1>
                  <p className="mt-2 text-muted">Explore upcoming events, register quickly, and earn certificates.</p>
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => setActiveTab('events')} className="cta-btn px-4 py-2 rounded-md">Browse Events</button>
                    <button onClick={() => { setActiveTab('my-registrations'); setUserRole('student'); }} className="px-4 py-2 rounded-md border border-gray-200 bg-white">My Registrations</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm muted">Next event:</p>
                  <p className="font-semibold">Tech Symposium 2026 — 15 Mar 2026</p>
                </div>
              </div>
            </div>

            {/* Role Switcher - Demo only */}
            <div className="mb-6 flex justify-end">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex gap-1">
                <button
                  onClick={() => {
                    setUserRole('student');
                    setActiveTab('dashboard');
                  }}
                  className={`px-4 py-2 rounded-md transition-colors text-body-small ${
                    userRole === 'student'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Student View
                </button>
                <button
                  onClick={() => {
                    setUserRole('admin');
                    setActiveTab('dashboard');
                  }}
                  className={`px-4 py-2 rounded-md transition-colors text-body-small ${
                    userRole === 'admin'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Admin View
                </button>
              </div>
            </div>

            {/* Content */}
            {activeTab === 'dashboard' && (
              <Dashboard
                events={events}
                registrations={registrations}
                userRole={userRole}
              />
            )}

            {userRole === 'student' && activeTab === 'events' && (
              <EventsView
                events={events}
                onViewDetails={handleViewEventDetails}
              />
            )}

            {userRole === 'student' && activeTab === 'my-registrations' && (
              <ParticipantsView
                registrations={registrations}
              />
            )}

            {userRole === 'student' && activeTab === 'certificates' && (
              <CertificatesView
                registrations={registrations}
              />
            )}

            {userRole === 'admin' && activeTab === 'manage-events' && (
              <ManageEvents
                events={events}
                onAddEvent={handleAddEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}

            {userRole === 'admin' && activeTab === 'participants' && (
              <ParticipantsView
                registrations={registrations}
              />
            )}

            {userRole === 'admin' && activeTab === 'certificates' && (
              <CertificatesView
                registrations={registrations}
              />
            )}
          </div>
        </main>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}
