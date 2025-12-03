'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Video, MapPin, User, Check } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Alert } from '@/components/ui';

interface Doctor {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  precio: number;
}

interface TimeSlot {
  hora: string;
  disponible: boolean;
}

// Mock data
const mockDoctors: Doctor[] = [
  { id: '1', nombre: 'Carlos', apellido: 'Mendoza', especialidad: 'Cardiología', precio: 50 },
  { id: '2', nombre: 'María', apellido: 'García', especialidad: 'Dermatología', precio: 45 },
  { id: '3', nombre: 'Pedro', apellido: 'Ramírez', especialidad: 'Medicina General', precio: 35 },
];

const timeSlots: TimeSlot[] = [
  { hora: '09:00', disponible: true },
  { hora: '09:30', disponible: true },
  { hora: '10:00', disponible: false },
  { hora: '10:30', disponible: true },
  { hora: '11:00', disponible: true },
  { hora: '11:30', disponible: false },
  { hora: '14:00', disponible: true },
  { hora: '14:30', disponible: true },
  { hora: '15:00', disponible: true },
  { hora: '15:30', disponible: false },
  { hora: '16:00', disponible: true },
  { hora: '16:30', disponible: true },
];

function NewAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorIdParam = searchParams.get('doctorId');

  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<'VIDEOCONSULTA' | 'PRESENCIAL'>('VIDEOCONSULTA');
  const [motivo, setMotivo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (doctorIdParam) {
      const doctor = mockDoctors.find((d) => d.id === doctorIdParam);
      if (doctor) {
        setSelectedDoctor(doctor);
        setStep(2);
      }
    }
  }, [doctorIdParam]);

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simular API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSuccess(true);
    // Redirect after success
    setTimeout(() => {
      router.push('/dashboard/appointments');
    }, 2000);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">¡Cita Agendada!</h2>
            <p className="text-gray-600 mt-2">
              Tu cita ha sido agendada exitosamente. Recibirás una confirmación por email.
            </p>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
              <p><strong>Médico:</strong> Dr. {selectedDoctor?.nombre} {selectedDoctor?.apellido}</p>
              <p><strong>Fecha:</strong> {selectedDate && new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <p><strong>Hora:</strong> {selectedTime}</p>
              <p><strong>Tipo:</strong> {appointmentType === 'VIDEOCONSULTA' ? 'Videoconsulta' : 'Presencial'}</p>
            </div>
            <Link href="/dashboard/appointments">
              <Button className="mt-6">Ver Mis Citas</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/appointments">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendar Nueva Cita</h1>
          <p className="text-gray-600">Paso {step} de 4</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full ${
              s <= step ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Selecciona un Médico</CardTitle>
            <CardDescription>Elige el especialista para tu consulta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setStep(2);
                  }}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Dr. {doctor.nombre} {doctor.apellido}
                        </p>
                        <p className="text-sm text-blue-600">{doctor.especialidad}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900">${doctor.precio}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Date */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Selecciona una Fecha</CardTitle>
            <CardDescription>
              Médico: Dr. {selectedDoctor?.nombre} {selectedDoctor?.apellido}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableDates.map((date) => {
                const dateObj = new Date(date);
                const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'short' });
                const dayNum = dateObj.getDate();
                const month = dateObj.toLocaleDateString('es-ES', { month: 'short' });
                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setStep(3);
                    }}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      selectedDate === date
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm text-gray-500 capitalize">{dayName}</p>
                    <p className="text-2xl font-bold text-gray-900">{dayNum}</p>
                    <p className="text-sm text-gray-500 capitalize">{month}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Atrás
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Time */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Selecciona un Horario</CardTitle>
            <CardDescription>
              {selectedDate && new Date(selectedDate).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.hora}
                  onClick={() => {
                    if (slot.disponible) {
                      setSelectedTime(slot.hora);
                      setStep(4);
                    }
                  }}
                  disabled={!slot.disponible}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    !slot.disponible
                      ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : selectedTime === slot.hora
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Clock className={`w-4 h-4 mx-auto mb-1 ${!slot.disponible ? 'text-gray-300' : ''}`} />
                  <p className="font-medium">{slot.hora}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Atrás
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmar Cita</CardTitle>
            <CardDescription>Revisa los detalles y confirma tu cita</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Summary */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Médico</p>
                    <p className="font-medium">Dr. {selectedDoctor?.nombre} {selectedDoctor?.apellido}</p>
                    <p className="text-sm text-blue-600">{selectedDoctor?.especialidad}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-medium">
                      {selectedDate && new Date(selectedDate).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Hora</p>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Consulta
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setAppointmentType('VIDEOCONSULTA')}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      appointmentType === 'VIDEOCONSULTA'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Video className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium">Videoconsulta</p>
                    <p className="text-sm text-gray-500">Online desde tu casa</p>
                  </button>
                  <button
                    onClick={() => setAppointmentType('PRESENCIAL')}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      appointmentType === 'PRESENCIAL'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium">Presencial</p>
                    <p className="text-sm text-gray-500">En el consultorio</p>
                  </button>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de la consulta
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Describe brevemente el motivo de tu consulta..."
                />
              </div>

              {/* Price */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-gray-900">Total a pagar</p>
                <p className="text-2xl font-bold text-blue-600">${selectedDoctor?.precio}</p>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Atrás
                </Button>
                <Button onClick={handleSubmit} isLoading={isLoading}>
                  Confirmar y Pagar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function NewAppointmentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <NewAppointmentContent />
    </Suspense>
  );
}
