'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Star, Shield, Zap, CreditCard, Sparkles, Lock, AlertCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Alert } from '@/components/ui';
import { activatePro } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';


// funcion de pago simulada
export default function SubscriptionPage() {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [paymentData, setPaymentData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Formateo especial para número de tarjeta
        if (name === 'cardNumber') {
            // Remover espacios y caracteres no numéricos
            const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
            // Limitar a 16 dígitos
            const limited = cleaned.substring(0, 16);
            // Agregar espacio cada 4 dígitos
            const formatted = limited.match(/.{1,4}/g)?.join(' ') || limited;
            setPaymentData(prev => ({ ...prev, [name]: formatted }));
            return;
        }

        // Formateo para expiración (MM/YY)
        if (name === 'expiry') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length >= 2) {
                const formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
                setPaymentData(prev => ({ ...prev, [name]: formatted }));
            } else {
                setPaymentData(prev => ({ ...prev, [name]: cleaned }));
            }
            return;
        }

        // Formateo para CVC (solo números)
        if (name === 'cvc') {
            const cleaned = value.replace(/\D/g, '').substring(0, 4);
            setPaymentData(prev => ({ ...prev, [name]: cleaned }));
            return;
        }

        setPaymentData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectPro = () => {
        setShowPaymentForm(true);
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setPaymentError(null);

        // Simple validation
        if (!paymentData.cardNumber || !paymentData.cvc || !paymentData.expiry || !paymentData.cardName) {
            setPaymentError('Por favor complete todos los campos de pago.');
            setIsLoading(false);
            return;
        }

        try {
            // Simular procesamiento del pago (en producción sería Stripe/PayPal)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Llamar al API real para activar Pro
            const result = await activatePro();

            if (result.success) {
                // Actualizar el estado del usuario en el store
                if (user) {
                    setUser({ ...user, isPro: true });
                }

                // Guardar también en localStorage para persistencia
                localStorage.setItem('medconsult_pro', 'true');
                localStorage.setItem('medconsult_pro_date', new Date().toISOString());

                setSuccess(true);

                // Redirigir después de 2 segundos
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                setPaymentError('Error al activar la suscripción. Intenta de nuevo.');
            }
        } catch (error: any) {
            console.error('Error activando Pro:', error);
            setPaymentError(error.response?.data?.message || 'Error al procesar el pago. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        'Consultas ilimitadas por videollamada',
        'Agenda prioritaria con especialistas',
        'Reportes de salud detallados con IA',
        'Descuentos en farmacias asociadas',
        'Historial médico familiar compartido',
        'Soporte premium 24/7'
    ];

    if (showPaymentForm) {
        return (
            <div className="max-w-xl mx-auto py-12 px-4">
                <Button
                    variant="ghost"
                    onClick={() => setShowPaymentForm(false)}
                    className="mb-6 text-gray-500 hover:text-gray-900"
                >
                    ← Volver a planes
                </Button>

                <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <CardTitle className="block text-2xl font-semibold text-gray-900">Finalizar Suscripción Pro</CardTitle>
                                <CardDescription className="text-gray-600">Configura tu pago automático mensual</CardDescription>
                            </div>
                            <div className="text-right">
                                <span className="block text-3xl font-bold text-teal-700">S/ 29.99</span>
                                <span className="text-sm text-teal-600">/mes</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {paymentError && (
                            <Alert variant="error" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                {paymentError}
                            </Alert>
                        )}

                        <form onSubmit={handleSubscribe} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nombre en la tarjeta</label>
                                <Input
                                    name="cardName"
                                    placeholder="Juan Pérez"
                                    value={paymentData.cardName}
                                    onChange={handleInputChange}
                                    leftIcon={<CreditCard className="w-5 h-5 text-gray-400" />}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Número de tarjeta</label>
                                <Input
                                    name="cardNumber"
                                    placeholder="0000 0000 0000 0000"
                                    value={paymentData.cardNumber}
                                    onChange={handleInputChange}
                                    leftIcon={<CreditCard className="w-5 h-5 text-gray-400" />}
                                    maxLength={19}
                                    inputMode="numeric"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Expiración (MM/YY)</label>
                                    <Input
                                        name="expiry"
                                        placeholder="12/26"
                                        value={paymentData.expiry}
                                        onChange={handleInputChange}
                                        maxLength={5}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">CVC</label>
                                    <Input
                                        name="cvc"
                                        placeholder="123"
                                        type="password"
                                        value={paymentData.cvc}
                                        onChange={handleInputChange}
                                        maxLength={4}
                                        leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3 text-sm text-gray-600">
                                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <p>
                                    Tus pagos se procesarán de forma segura. La renovación se realizará automáticamente cada mes. Puedes cancelar en cualquier momento desde tu configuración.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-lg py-6 font-medium"
                                isLoading={isLoading}
                            >
                                Confirmar Pago S/ 29.99/mes
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-teal-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Actualiza a MedConsult Pro</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Lleva tu cuidado de salud al siguiente nivel con nuestras funciones exclusivas diseñadas para tu bienestar.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Free Plan */}
                <Card className="border-gray-200 shadow-sm opacity-60">
                    <CardHeader>
                        <CardTitle className="text-xl">Plan Básico</CardTitle>
                        <CardDescription>Para usuarios casuales</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-gray-900">Gratis</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-gray-600">
                                <Check className="w-5 h-5 text-gray-400" />
                                <span>Búsqueda de médicos</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-600">
                                <Check className="w-5 h-5 text-gray-400" />
                                <span>Agendamiento de citas básicas</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-600">
                                <Check className="w-5 h-5 text-gray-400" />
                                <span>Historial de citas básico</span>
                            </li>
                        </ul>
                        <Button className="w-full mt-8" variant="outline" disabled>
                            Plan Actual
                        </Button>
                    </CardContent>
                </Card>

                {/* Pro Plan */}
                <Card className="border-teal-200 shadow-xl relative overflow-hidden ring-2 ring-teal-500">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-teal-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                        RECOMENDADO
                    </div>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            <CardTitle className="text-2xl text-teal-700">MedConsult Pro</CardTitle>
                        </div>
                        <CardDescription>Máxima prioridad y beneficios</CardDescription>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-5xl font-bold text-gray-900">S/ 29.99</span>
                            <span className="text-gray-500">/mes</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 mb-8">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <div className="bg-teal-100 rounded-full p-1">
                                        <Check className="w-4 h-4 text-teal-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg py-6 text-lg"
                            onClick={handleSelectPro}
                        >
                            <Zap className="w-5 h-5 mr-2" />
                            Seleccionar Plan Pro
                        </Button>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Cancelación gratuita en cualquier momento. Sin permenencia.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-12 border-t border-gray-100">
                <div className="text-center p-4">
                    <div className="inline-flex p-3 bg-blue-100 rounded-xl mb-3">
                        <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Pago Seguro</h3>
                    <p className="text-sm text-gray-500">
                        Tus datos están protegidos con encriptación de grado bancario.
                    </p>
                </div>
                <div className="text-center p-4">
                    <div className="inline-flex p-3 bg-purple-100 rounded-xl mb-3">
                        <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Calidad Garantizada</h3>
                    <p className="text-sm text-gray-500">
                        Acceso a los especialistas mejor calificados de la plataforma.
                    </p>
                </div>
                <div className="text-center p-4">
                    <div className="inline-flex p-3 bg-amber-100 rounded-xl mb-3">
                        <CreditCard className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Transparencia Total</h3>
                    <p className="text-sm text-gray-500">
                        Sin cargos ocultos ni sorpresas en tu facturación mensual.
                    </p>
                </div>
            </div>
        </div>
    );
}
