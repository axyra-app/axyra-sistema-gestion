/**
 * AXYRA - Sistema de Gestión de Eventos y Calendario
 * Maneja eventos, calendarios, recordatorios, reuniones y programación
 */

class AxyraEventCalendarSystem {
  constructor() {
    this.events = [];
    this.calendars = [];
    this.reminders = [];
    this.meetings = [];
    this.resources = [];
    this.attendees = [];
    this.recurringEvents = [];
    this.timeSlots = [];
    this.availability = [];
    this.isInitialized = false;

    this.init();
  }

  init() {
    console.log('📅 Inicializando sistema de eventos y calendario...');
    this.loadEvents();
    this.loadCalendars();
    this.loadReminders();
    this.loadMeetings();
    this.loadResources();
    this.loadAttendees();
    this.loadRecurringEvents();
    this.loadTimeSlots();
    this.loadAvailability();
    this.setupEventListeners();
    this.setupDefaultData();
    this.isInitialized = true;
  }

  loadEvents() {
    try {
      const stored = localStorage.getItem('axyra_calendar_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando eventos:', error);
    }
  }

  saveEvents() {
    try {
      localStorage.setItem('axyra_calendar_events', JSON.stringify(this.events));
    } catch (error) {
      console.error('Error guardando eventos:', error);
    }
  }

  loadCalendars() {
    try {
      const stored = localStorage.getItem('axyra_calendar_calendars');
      if (stored) {
        this.calendars = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando calendarios:', error);
    }
  }

  saveCalendars() {
    try {
      localStorage.setItem('axyra_calendar_calendars', JSON.stringify(this.calendars));
    } catch (error) {
      console.error('Error guardando calendarios:', error);
    }
  }

  loadReminders() {
    try {
      const stored = localStorage.getItem('axyra_calendar_reminders');
      if (stored) {
        this.reminders = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando recordatorios:', error);
    }
  }

  saveReminders() {
    try {
      localStorage.setItem('axyra_calendar_reminders', JSON.stringify(this.reminders));
    } catch (error) {
      console.error('Error guardando recordatorios:', error);
    }
  }

  loadMeetings() {
    try {
      const stored = localStorage.getItem('axyra_calendar_meetings');
      if (stored) {
        this.meetings = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando reuniones:', error);
    }
  }

  saveMeetings() {
    try {
      localStorage.setItem('axyra_calendar_meetings', JSON.stringify(this.meetings));
    } catch (error) {
      console.error('Error guardando reuniones:', error);
    }
  }

  loadResources() {
    try {
      const stored = localStorage.getItem('axyra_calendar_resources');
      if (stored) {
        this.resources = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando recursos:', error);
    }
  }

  saveResources() {
    try {
      localStorage.setItem('axyra_calendar_resources', JSON.stringify(this.resources));
    } catch (error) {
      console.error('Error guardando recursos:', error);
    }
  }

  loadAttendees() {
    try {
      const stored = localStorage.getItem('axyra_calendar_attendees');
      if (stored) {
        this.attendees = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando asistentes:', error);
    }
  }

  saveAttendees() {
    try {
      localStorage.setItem('axyra_calendar_attendees', JSON.stringify(this.attendees));
    } catch (error) {
      console.error('Error guardando asistentes:', error);
    }
  }

  loadRecurringEvents() {
    try {
      const stored = localStorage.getItem('axyra_calendar_recurring_events');
      if (stored) {
        this.recurringEvents = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando eventos recurrentes:', error);
    }
  }

  saveRecurringEvents() {
    try {
      localStorage.setItem('axyra_calendar_recurring_events', JSON.stringify(this.recurringEvents));
    } catch (error) {
      console.error('Error guardando eventos recurrentes:', error);
    }
  }

  loadTimeSlots() {
    try {
      const stored = localStorage.getItem('axyra_calendar_time_slots');
      if (stored) {
        this.timeSlots = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando horarios:', error);
    }
  }

  saveTimeSlots() {
    try {
      localStorage.setItem('axyra_calendar_time_slots', JSON.stringify(this.timeSlots));
    } catch (error) {
      console.error('Error guardando horarios:', error);
    }
  }

  loadAvailability() {
    try {
      const stored = localStorage.getItem('axyra_calendar_availability');
      if (stored) {
        this.availability = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando disponibilidad:', error);
    }
  }

  saveAvailability() {
    try {
      localStorage.setItem('axyra_calendar_availability', JSON.stringify(this.availability));
    } catch (error) {
      console.error('Error guardando disponibilidad:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en eventos
    document.addEventListener('eventChanged', (event) => {
      this.handleEventChange(event.detail);
    });

    // Escuchar cambios en reuniones
    document.addEventListener('meetingChanged', (event) => {
      this.handleMeetingChange(event.detail);
    });
  }

  setupDefaultData() {
    if (this.calendars.length === 0) {
      this.calendars = [
        {
          id: 'personal',
          name: 'Personal',
          description: 'Calendario personal',
          color: '#4285f4',
          isActive: true,
        },
        {
          id: 'work',
          name: 'Trabajo',
          description: 'Calendario de trabajo',
          color: '#34a853',
          isActive: true,
        },
        {
          id: 'meetings',
          name: 'Reuniones',
          description: 'Calendario de reuniones',
          color: '#fbbc04',
          isActive: true,
        },
      ];
      this.saveCalendars();
    }

    if (this.resources.length === 0) {
      this.resources = [
        {
          id: 'room_1',
          name: 'Sala de Conferencias A',
          type: 'room',
          capacity: 10,
          location: 'Piso 1',
          amenities: ['Proyector', 'Pizarra', 'WiFi'],
          isActive: true,
        },
        {
          id: 'room_2',
          name: 'Sala de Conferencias B',
          type: 'room',
          capacity: 20,
          location: 'Piso 2',
          amenities: ['Proyector', 'Pizarra', 'WiFi', 'Video Conferencia'],
          isActive: true,
        },
        {
          id: 'car_1',
          name: 'Vehículo 1',
          type: 'vehicle',
          capacity: 4,
          location: 'Estacionamiento',
          amenities: ['Aire Acondicionado', 'Radio'],
          isActive: true,
        },
      ];
      this.saveResources();
    }
  }

  handleEventChange(change) {
    const { eventId, action, data } = change;

    switch (action) {
      case 'created':
        this.events.push(data);
        this.saveEvents();
        break;
      case 'updated':
        const eventIndex = this.events.findIndex((e) => e.id === eventId);
        if (eventIndex !== -1) {
          this.events[eventIndex] = { ...this.events[eventIndex], ...data };
          this.saveEvents();
        }
        break;
      case 'deleted':
        this.events = this.events.filter((e) => e.id !== eventId);
        this.saveEvents();
        break;
    }
  }

  handleMeetingChange(change) {
    const { meetingId, action, data } = change;

    switch (action) {
      case 'created':
        this.meetings.push(data);
        this.saveMeetings();
        break;
      case 'updated':
        const meetingIndex = this.meetings.findIndex((m) => m.id === meetingId);
        if (meetingIndex !== -1) {
          this.meetings[meetingIndex] = { ...this.meetings[meetingIndex], ...data };
          this.saveMeetings();
        }
        break;
      case 'deleted':
        this.meetings = this.meetings.filter((m) => m.id !== meetingId);
        this.saveMeetings();
        break;
    }
  }

  createEvent(eventData) {
    const event = {
      id: 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: eventData.title,
      description: eventData.description || '',
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      allDay: eventData.allDay || false,
      location: eventData.location || '',
      calendarId: eventData.calendarId || 'personal',
      attendees: eventData.attendees || [],
      reminders: eventData.reminders || [],
      isRecurring: eventData.isRecurring || false,
      recurrencePattern: eventData.recurrencePattern || null,
      status: eventData.status || 'confirmed', // confirmed, tentative, cancelled
      priority: eventData.priority || 'medium', // low, medium, high
      tags: eventData.tags || [],
      isActive: eventData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.events.push(event);
    this.saveEvents();

    console.log('✅ Evento creado:', event.title);
    return event;
  }

  createCalendar(calendarData) {
    const calendar = {
      id: 'calendar_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: calendarData.name,
      description: calendarData.description || '',
      color: calendarData.color || '#4285f4',
      isActive: calendarData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.calendars.push(calendar);
    this.saveCalendars();

    console.log('✅ Calendario creado:', calendar.name);
    return calendar;
  }

  createReminder(reminderData) {
    const reminder = {
      id: 'reminder_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      eventId: reminderData.eventId,
      title: reminderData.title,
      description: reminderData.description || '',
      reminderTime: reminderData.reminderTime,
      type: reminderData.type || 'notification', // notification, email, sms
      isActive: reminderData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.reminders.push(reminder);
    this.saveReminders();

    console.log('✅ Recordatorio creado:', reminder.title);
    return reminder;
  }

  createMeeting(meetingData) {
    const meeting = {
      id: 'meeting_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: meetingData.title,
      description: meetingData.description || '',
      startDate: meetingData.startDate,
      endDate: meetingData.endDate,
      location: meetingData.location || '',
      resourceId: meetingData.resourceId || null,
      attendees: meetingData.attendees || [],
      agenda: meetingData.agenda || [],
      meetingLink: meetingData.meetingLink || '',
      status: meetingData.status || 'scheduled', // scheduled, in_progress, completed, cancelled
      priority: meetingData.priority || 'medium',
      isActive: meetingData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.meetings.push(meeting);
    this.saveMeetings();

    console.log('✅ Reunión creada:', meeting.title);
    return meeting;
  }

  createResource(resourceData) {
    const resource = {
      id: 'resource_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: resourceData.name,
      type: resourceData.type, // room, vehicle, equipment
      capacity: resourceData.capacity || 1,
      location: resourceData.location || '',
      amenities: resourceData.amenities || [],
      isActive: resourceData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.resources.push(resource);
    this.saveResources();

    console.log('✅ Recurso creado:', resource.name);
    return resource;
  }

  createAttendee(attendeeData) {
    const attendee = {
      id: 'attendee_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      eventId: attendeeData.eventId,
      name: attendeeData.name,
      email: attendeeData.email,
      phone: attendeeData.phone || '',
      company: attendeeData.company || '',
      response: attendeeData.response || 'pending', // pending, accepted, declined, tentative
      isRequired: attendeeData.isRequired || false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.attendees.push(attendee);
    this.saveAttendees();

    console.log('✅ Asistente creado:', attendee.name);
    return attendee;
  }

  createRecurringEvent(recurringEventData) {
    const recurringEvent = {
      id: 'recurring_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: recurringEventData.title,
      description: recurringEventData.description || '',
      startDate: recurringEventData.startDate,
      endDate: recurringEventData.endDate,
      pattern: recurringEventData.pattern, // daily, weekly, monthly, yearly
      interval: recurringEventData.interval || 1,
      endRecurrence: recurringEventData.endRecurrence || null,
      daysOfWeek: recurringEventData.daysOfWeek || [],
      dayOfMonth: recurringEventData.dayOfMonth || null,
      isActive: recurringEventData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.recurringEvents.push(recurringEvent);
    this.saveRecurringEvents();

    console.log('✅ Evento recurrente creado:', recurringEvent.title);
    return recurringEvent;
  }

  createTimeSlot(timeSlotData) {
    const timeSlot = {
      id: 'slot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      resourceId: timeSlotData.resourceId,
      startTime: timeSlotData.startTime,
      endTime: timeSlotData.endTime,
      isAvailable: timeSlotData.isAvailable !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.timeSlots.push(timeSlot);
    this.saveTimeSlots();

    console.log('✅ Horario creado:', timeSlot.id);
    return timeSlot;
  }

  getEventsByDate(date) {
    const targetDate = new Date(date);
    return this.events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === targetDate.toDateString();
    });
  }

  getEventsByRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);

      return (
        (eventStart >= start && eventStart <= end) ||
        (eventEnd >= start && eventEnd <= end) ||
        (eventStart <= start && eventEnd >= end)
      );
    });
  }

  getUpcomingEvents(days = 7) {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    return this.events
      .filter((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate >= today && eventDate <= futureDate;
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }

  getCalendarStatistics() {
    const totalEvents = this.events.length;
    const totalMeetings = this.meetings.length;
    const totalCalendars = this.calendars.length;
    const totalResources = this.resources.length;
    const upcomingEvents = this.getUpcomingEvents().length;
    const todayEvents = this.getEventsByDate(new Date()).length;
    const totalAttendees = this.attendees.length;
    const confirmedAttendees = this.attendees.filter((a) => a.response === 'accepted').length;

    return {
      totalEvents,
      totalMeetings,
      totalCalendars,
      totalResources,
      upcomingEvents,
      todayEvents,
      totalAttendees,
      confirmedAttendees,
    };
  }

  showCalendarDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'calendar-dashboard';
    dashboard.innerHTML = `
      <div class="calendar-dashboard-overlay">
        <div class="calendar-dashboard-container">
          <div class="calendar-dashboard-header">
            <h3>📅 Dashboard de Calendario</h3>
            <div class="calendar-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraEventCalendarSystem.showCreateEventDialog()">Nuevo Evento</button>
              <button class="btn btn-secondary" onclick="axyraEventCalendarSystem.showCreateMeetingDialog()">Nueva Reunión</button>
              <button class="btn btn-close" onclick="document.getElementById('calendar-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="calendar-dashboard-body">
            <div class="calendar-dashboard-stats">
              ${this.renderCalendarStats()}
            </div>
            <div class="calendar-dashboard-content">
              <div class="calendar-dashboard-tabs">
                <button class="tab-btn active" data-tab="overview">Resumen</button>
                <button class="tab-btn" data-tab="events">Eventos</button>
                <button class="tab-btn" data-tab="meetings">Reuniones</button>
                <button class="tab-btn" data-tab="resources">Recursos</button>
                <button class="tab-btn" data-tab="calendar">Calendario</button>
              </div>
              <div class="calendar-dashboard-tab-content">
                <div class="tab-content active" id="overview-tab">
                  ${this.renderOverview()}
                </div>
                <div class="tab-content" id="events-tab">
                  ${this.renderEventsList()}
                </div>
                <div class="tab-content" id="meetings-tab">
                  ${this.renderMeetingsList()}
                </div>
                <div class="tab-content" id="resources-tab">
                  ${this.renderResourcesList()}
                </div>
                <div class="tab-content" id="calendar-tab">
                  ${this.renderCalendarView()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    dashboard.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(dashboard);

    // Configurar tabs
    const tabBtns = dashboard.querySelectorAll('.tab-btn');
    const tabContents = dashboard.querySelectorAll('.tab-content');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;

        tabBtns.forEach((b) => b.classList.remove('active'));
        tabContents.forEach((c) => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
      });
    });
  }

  renderCalendarStats() {
    const stats = this.getCalendarStatistics();

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalEvents}</div>
          <div class="stat-label">Total Eventos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalMeetings}</div>
          <div class="stat-label">Total Reuniones</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalCalendars}</div>
          <div class="stat-label">Total Calendarios</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalResources}</div>
          <div class="stat-label">Total Recursos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.upcomingEvents}</div>
          <div class="stat-label">Eventos Próximos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.todayEvents}</div>
          <div class="stat-label">Eventos Hoy</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalAttendees}</div>
          <div class="stat-label">Total Asistentes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.confirmedAttendees}</div>
          <div class="stat-label">Asistentes Confirmados</div>
        </div>
      </div>
    `;
  }

  renderOverview() {
    const stats = this.getCalendarStatistics();
    const upcomingEvents = this.getUpcomingEvents(7);

    return `
      <div class="overview-grid">
        <div class="overview-card">
          <h4>Eventos de Hoy</h4>
          <div class="today-events">
            <div class="event-count">${stats.todayEvents} eventos</div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Próximos Eventos</h4>
          <div class="upcoming-events">
            ${upcomingEvents
              .slice(0, 5)
              .map(
                (event) => `
              <div class="upcoming-event">
                <span class="event-time">${new Date(event.startDate).toLocaleTimeString()}</span>
                <span class="event-title">${event.title}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
        <div class="overview-card">
          <h4>Recursos Disponibles</h4>
          <div class="available-resources">
            <div class="resource-count">${stats.totalResources} recursos</div>
          </div>
        </div>
      </div>
    `;
  }

  renderEventsList() {
    const events = this.events.slice(-20); // Últimos 20 eventos

    return events
      .map(
        (event) => `
      <div class="event-card">
        <div class="event-header">
          <h5>${event.title}</h5>
          <span class="event-status status-${event.status}">${event.status}</span>
        </div>
        <div class="event-info">
          <p>${event.description}</p>
          <p>Fecha: ${new Date(event.startDate).toLocaleDateString()}</p>
          <p>Hora: ${new Date(event.startDate).toLocaleTimeString()}</p>
          <p>Ubicación: ${event.location}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderMeetingsList() {
    const meetings = this.meetings.slice(-20); // Últimas 20 reuniones

    return meetings
      .map(
        (meeting) => `
      <div class="meeting-card">
        <div class="meeting-header">
          <h5>${meeting.title}</h5>
          <span class="meeting-status status-${meeting.status}">${meeting.status}</span>
        </div>
        <div class="meeting-info">
          <p>${meeting.description}</p>
          <p>Fecha: ${new Date(meeting.startDate).toLocaleDateString()}</p>
          <p>Hora: ${new Date(meeting.startDate).toLocaleTimeString()}</p>
          <p>Ubicación: ${meeting.location}</p>
          <p>Asistentes: ${meeting.attendees.length}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderResourcesList() {
    const resources = this.resources;

    return resources
      .map(
        (resource) => `
      <div class="resource-card">
        <div class="resource-header">
          <h5>${resource.name}</h5>
          <span class="resource-type type-${resource.type}">${resource.type}</span>
        </div>
        <div class="resource-info">
          <p>Capacidad: ${resource.capacity}</p>
          <p>Ubicación: ${resource.location}</p>
          <p>Amenidades: ${resource.amenities.join(', ')}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderCalendarView() {
    const today = new Date();
    const events = this.getEventsByDate(today);

    return `
      <div class="calendar-view">
        <div class="calendar-header">
          <h4>${today.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</h4>
        </div>
        <div class="calendar-events">
          ${events
            .map(
              (event) => `
            <div class="calendar-event">
              <span class="event-time">${new Date(event.startDate).toLocaleTimeString()}</span>
              <span class="event-title">${event.title}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  showCreateEventDialog() {
    const title = prompt('Título del evento:');
    if (title) {
      const description = prompt('Descripción del evento:');
      const startDate = prompt('Fecha de inicio (YYYY-MM-DD):');
      const endDate = prompt('Fecha de fin (YYYY-MM-DD):');
      const location = prompt('Ubicación del evento:');
      this.createEvent({ title, description, startDate, endDate, location });
    }
  }

  showCreateMeetingDialog() {
    const title = prompt('Título de la reunión:');
    if (title) {
      const description = prompt('Descripción de la reunión:');
      const startDate = prompt('Fecha de inicio (YYYY-MM-DD):');
      const endDate = prompt('Fecha de fin (YYYY-MM-DD):');
      const location = prompt('Ubicación de la reunión:');
      this.createMeeting({ title, description, startDate, endDate, location });
    }
  }

  getCurrentUser() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }
}

// Inicializar sistema de calendario
let axyraEventCalendarSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraEventCalendarSystem = new AxyraEventCalendarSystem();
  window.axyraEventCalendarSystem = axyraEventCalendarSystem;
});

// Exportar para uso global
window.AxyraEventCalendarSystem = AxyraEventCalendarSystem;
