'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Star, Shield, Zap, CreditCard, Sparkles, Lock, AlertCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Alert } from '@/components/ui';

export default function SubscriptionPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const [paymentData, setPaymentData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
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

        // Simulación de proceso de pago
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
        // Simulación exitosa
        alert('¡Suscripción a MedConsult Pro activada con éxito! Pagos automáticos configurados.');
        router.push('/dashboard');
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

                <Card className="border-teal-200 shadow-xl ring-1 ring-teal-100">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl text-teal-800">Finalizar Suscripción Pro</CardTitle>
                                <CardDescription>Configura tu pago automático mensual</CardDescription>
                            </div>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-teal-700">$9.99</span>
                                <span className="text-xs text-teal-600">/mes</span>
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
                                className="w-full bg-teal-600 hover:bg-teal-700 text-lg py-6"
                                isLoading={isLoading}
                            >
                                Pagar y Suscribirse
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
                            <span className="text-5xl font-bold text-gray-900">$9.99</span>
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
