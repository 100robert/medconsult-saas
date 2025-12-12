'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    Phone,
    MessageSquare,
    FileText,
    Clock,
    User,
    Stethoscope,
    Send,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Pill,
    ClipboardList
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ConsultaDetails {
    id: string;
    estado: string;
    fechaInicio: string;
    cita: {
        id: string;
        motivo: string;
        tipo: string;
        paciente: {
            id: string;
            usuario: {
                nombre: string;
                apellido: string;
                correo: string;
            };
        };
        medico: {
            id: string;
            usuario: {
                nombre: string;
                apellido: string;
            };
            especialidad: {
                nombre: string;
            };
        };
    };
}

interface ChatMessage {
    id: string;
    sender: 'doctor' | 'patient';
    message: string;
    timestamp: Date;
}

export default function VideoConsultationPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuthStore();

    // Estados de la consulta
    const [consulta, setConsulta] = useState<ConsultaDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados de video/audio
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

    // Estados de chat
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');

    // Estados para notas médicas (solo médico)
    const [showNotes, setShowNotes] = useState(false);
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [notes, setNotes] = useState('');

    // Refs para video
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    // Timer
    const [elapsedTime, setElapsedTime] = useState(0);

    const isMedico = user?.rol === 'MEDICO';

    // Cargar datos de la consulta
    useEffect(() => {
        async function loadConsulta() {
            try {
                setLoading(true);
                const response = await api.get(`/consultas/${id}`);
                setConsulta(response.data.data || response.data);

                // Simular conexión después de cargar
                setTimeout(() => {
                    setConnectionStatus('connected');
                    setIsConnected(true);
                }, 2000);

            } catch (err: any) {
                console.error('Error cargando consulta:', err);
                setError('No se pudo cargar la información de la consulta');
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadConsulta();
        }
    }, [id]);

    // Iniciar video local
    useEffect(() => {
        async function initVideo() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                localStreamRef.current = stream;

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error('Error accediendo a cámara/micrófono:', err);
                toast.error('No se pudo acceder a la cámara o micrófono');
            }
        }

        if (isConnected) {
            initVideo();
        }

        return () => {
            // Cleanup
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [isConnected]);

    // Timer de la consulta
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isConnected) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isConnected]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoEnabled(videoTrack.enabled);
            }
        }
    };

    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setAudioEnabled(audioTrack.enabled);
            }
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const message: ChatMessage = {
            id: Date.now().toString(),
            sender: isMedico ? 'doctor' : 'patient',
            message: newMessage,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    const endConsultation = async () => {
        // Limpiar streams de video/audio
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }

        // Solo el médico puede finalizar la consulta
        if (isMedico) {
            try {
                if (diagnosis) {
                    // Si hay diagnóstico, guardar notas y finalizar
                    await api.put(`/consultas/${id}`, {
                        diagnostico: diagnosis,
                        tratamiento: treatment,
                        notas: notes,
                        estado: 'COMPLETADA'
                    });
                    toast.success('Consulta finalizada y notas guardadas');
                } else {
                    // Confirmar si quiere finalizar sin diagnóstico
                    const confirmar = confirm('¿Desea finalizar la consulta sin agregar diagnóstico?');
                    if (confirmar) {
                        await api.put(`/consultas/${id}`, {
                            estado: 'COMPLETADA'
                        });
                        toast.success('Consulta finalizada');
                    } else {
                        return; // No salir si cancela
                    }
                }
            } catch (err) {
                console.error('Error finalizando consulta:', err);
                toast.error('Error al finalizar la consulta');
                return;
            }
        } else {
            // El paciente solo sale de la sala
            toast.info('Has salido de la consulta');
        }

        router.push('/dashboard/consultations');
    };

    // Función separada para que el paciente solo salga
    const leaveConsultation = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        toast.info('Has salido de la consulta');
        router.push('/dashboard/appointments');
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Preparando sala de consulta...</p>
                </div>
            </div>
        );
    }

    if (error || !consulta) {
        return (
            <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-white text-lg">{error || 'Consulta no encontrada'}</p>
                    <button
                        onClick={() => router.push('/dashboard/consultations')}
                        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                        Volver a Consultas
                    </button>
                </div>
            </div>
        );
    }

    const otherPerson = isMedico
        ? `${consulta.cita.paciente.usuario.nombre} ${consulta.cita.paciente.usuario.apellido}`
        : `Dr. ${consulta.cita.medico.usuario.nombre} ${consulta.cita.medico.usuario.apellido}`;

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' :
                        connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                        }`} />
                    <span className="text-white font-medium">
                        {connectionStatus === 'connected' ? 'Conectado' :
                            connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
                    </span>
                    {isConnected && (
                        <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(elapsedTime)}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-white">{otherPerson}</span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isMedico ? 'bg-blue-600' : 'bg-teal-600'
                        }`}>
                        {isMedico ? <User className="w-5 h-5 text-white" /> : <Stethoscope className="w-5 h-5 text-white" />}
                    </div>
                </div>
            </div>

            {/* Main Video Area */}
            <div className="flex-1 relative overflow-hidden">
                {/* Remote Video (Full Screen) */}
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    {connectionStatus === 'connecting' ? (
                        <div className="text-center">
                            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                                {isMedico ? (
                                    <User className="w-16 h-16 text-gray-500" />
                                ) : (
                                    <Stethoscope className="w-16 h-16 text-gray-500" />
                                )}
                            </div>
                            <p className="text-gray-400">Esperando a {isMedico ? 'paciente' : 'médico'}...</p>
                            <Loader2 className="w-6 h-6 text-teal-500 animate-spin mx-auto mt-4" />
                        </div>
                    ) : (
                        // Simulated remote video placeholder
                        <div className="text-center">
                            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center mx-auto">
                                {isMedico ? (
                                    <User className="w-24 h-24 text-white" />
                                ) : (
                                    <Stethoscope className="w-24 h-24 text-white" />
                                )}
                            </div>
                            <p className="text-white text-xl mt-4 font-medium">{otherPerson}</p>
                            <p className="text-gray-400 text-sm mt-1">
                                {isMedico ? 'Paciente' : consulta.cita.medico.especialidad?.nombre || 'Médico'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Local Video (Picture in Picture) */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-xl overflow-hidden shadow-lg border-2 border-gray-600">
                    {videoEnabled ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <VideoOff className="w-8 h-8 text-gray-500" />
                        </div>
                    )}
                    <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                        Tú
                    </div>
                </div>

                {/* Chat Sidebar */}
                {showChat && (
                    <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-xl flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Chat</h3>
                            <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {chatMessages.length === 0 ? (
                                <p className="text-gray-400 text-center text-sm">No hay mensajes aún</p>
                            ) : (
                                chatMessages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === (isMedico ? 'doctor' : 'patient') ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] px-3 py-2 rounded-lg ${msg.sender === (isMedico ? 'doctor' : 'patient')
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                            }`}>
                                            <p className="text-sm">{msg.message}</p>
                                            <p className="text-xs opacity-70 mt-1">
                                                {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-4 border-t">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes Sidebar (Solo para médicos) */}
                {showNotes && isMedico && (
                    <div className="absolute top-0 left-0 w-96 h-full bg-white shadow-xl flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Notas de Consulta</h3>
                            <button onClick={() => setShowNotes(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Diagnóstico
                                </label>
                                <textarea
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                                    placeholder="Ingrese el diagnóstico..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tratamiento / Receta
                                </label>
                                <textarea
                                    value={treatment}
                                    onChange={(e) => setTreatment(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                                    placeholder="Medicamentos, dosis, indicaciones..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notas adicionales
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                                    placeholder="Observaciones, próximos pasos..."
                                />
                            </div>

                            <div className="pt-2">
                                <p className="text-xs text-gray-500">
                                    Las notas se guardarán automáticamente al finalizar la consulta.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Control Bar */}
            <div className="bg-gray-800 px-4 py-4">
                <div className="flex items-center justify-center gap-4">
                    {/* Audio Toggle */}
                    <button
                        onClick={toggleAudio}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                            }`}
                    >
                        {audioEnabled ? (
                            <Mic className="w-6 h-6 text-white" />
                        ) : (
                            <MicOff className="w-6 h-6 text-white" />
                        )}
                    </button>

                    {/* Video Toggle */}
                    <button
                        onClick={toggleVideo}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                            }`}
                    >
                        {videoEnabled ? (
                            <Video className="w-6 h-6 text-white" />
                        ) : (
                            <VideoOff className="w-6 h-6 text-white" />
                        )}
                    </button>

                    {/* Chat Toggle */}
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${showChat ? 'bg-teal-600' : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                    >
                        <MessageSquare className="w-6 h-6 text-white" />
                    </button>

                    {/* Notes Toggle (Solo médicos) */}
                    {isMedico && (
                        <button
                            onClick={() => setShowNotes(!showNotes)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${showNotes ? 'bg-teal-600' : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                        >
                            <ClipboardList className="w-6 h-6 text-white" />
                        </button>
                    )}

                    {/* End Call */}
                    <button
                        onClick={endConsultation}
                        className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
                        title={isMedico ? 'Finalizar consulta' : 'Salir de la sala'}
                    >
                        <Phone className="w-6 h-6 text-white transform rotate-135" />
                    </button>
                </div>

                {/* Consultation Info */}
                <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-400">
                    <span>Motivo: {consulta.cita.motivo || 'Consulta general'}</span>
                </div>
            </div>
        </div>
    );
}
