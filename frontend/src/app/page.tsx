'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Calendar, 
  Shield, 
  Video, 
  Clock, 
  Star, 
  Users, 
  CheckCircle, 
  Sparkles, 
  Heart, 
  Activity, 
  Zap,
  Stethoscope,
  Award,
  MessageCircle
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const features = [
    {
      icon: Video,
      title: 'Consultas Online',
      description: 'Conecta con médicos en tiempo real desde cualquier lugar del mundo.',
      color: 'bg-teal-600',
    },
    {
      icon: Calendar,
      title: 'Agenda Inteligente',
      description: 'Sistema de citas con recordatorios automáticos y gestión sencilla.',
      color: 'bg-emerald-600',
    },
    {
      icon: Shield,
      title: '100% Seguro',
      description: 'Tus datos médicos están protegidos con encriptación de última generación.',
      color: 'bg-amber-500',
    },
    {
      icon: Clock,
      title: 'Atención 24/7',
      description: 'Acceso a médicos las 24 horas, los 7 días de la semana.',
      color: 'bg-slate-600',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Pacientes Felices' },
    { value: '500+', label: 'Médicos Certificados' },
    { value: '98%', label: 'Satisfacción' },
    { value: '4.9', label: 'Calificación' },
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Paciente',
      image: 'MG',
      text: 'Increíble plataforma. Pude consultar con un cardiólogo en menos de 10 minutos desde mi casa.',
      rating: 5,
    },
    {
      name: 'Dr. Carlos Ruiz',
      role: 'Cardiólogo',
      image: 'CR',
      text: 'Como médico, esta herramienta me permite atender a más pacientes de manera eficiente.',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      role: 'Paciente',
      image: 'AM',
      text: 'La mejor inversión en mi salud. Los recordatorios y el historial médico son muy útiles.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MedConsult</span>
            </motion.div>
            
            <nav className="hidden md:flex items-center gap-8">
              {['Características', 'Cómo Funciona', 'Testimonios'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
            
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                href="/login"
                className="hidden sm:inline-flex text-gray-700 hover:text-teal-600 font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm"
              >
                Comenzar Gratis
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen pt-32 lg:pt-40 pb-20 bg-teal-600">
        {/* Floating blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 bg-white/20 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-20 right-1/4 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              className="text-center lg:text-left text-white"
              initial="hidden"
              animate="show"
              variants={container}
            >
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-6"
                variants={item}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">+50,000 consultas realizadas</span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
                variants={item}
              >
                Tu salud, <br className="hidden sm:block" />
                <span className="text-teal-100">
                  sin complicaciones
                </span>
              </motion.h1>
              
              <motion.p 
                className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0"
                variants={item}
              >
                Conecta con médicos especialistas en minutos. Agenda citas, recibe diagnósticos y gestiona tu salud desde cualquier lugar.
              </motion.p>
              
              <motion.div 
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={item}
              >
                <Link href="/register">
                  <motion.button
                    className="group inline-flex items-center justify-center bg-white text-teal-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl transition-all"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Comenzar Ahora
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <motion.a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl text-lg font-semibold border border-white/30 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Video className="mr-2 w-5 h-5" />
                  Ver Demo
                </motion.a>
              </motion.div>
              
              {/* Social proof */}
              <motion.div 
                className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
                variants={item}
              >
                <div className="flex -space-x-3">
                  {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                    <motion.div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center text-white text-xs font-bold"
                      initial={{ scale: 0, x: -20 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      {letter}
                    </motion.div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-white/70 mt-1">
                    <span className="font-semibold text-white">4.9/5</span> de más de 10,000 pacientes
                  </p>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Hero Card */}
            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl" />
              <div className="glass-card-light p-8 relative">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Próxima Consulta</p>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">Dr. Carlos Mendoza</h3>
                  </div>
                  <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                    Confirmada
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg">
                    <span className="text-4xl">👨‍⚕️</span>
                  </div>
                  <div>
                    <p className="text-teal-600 font-semibold">Cardiología</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">(124)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl border border-white/50">
                    <div className="w-10 h-10 bg-teal-600/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-semibold text-gray-900">Miércoles, 15 de Enero</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl border border-white/50">
                    <div className="w-10 h-10 bg-slate-600/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hora</p>
                      <p className="font-semibold text-gray-900">10:00 AM - 10:30 AM</p>
                    </div>
                  </div>
                </div>
                
                <motion.button 
                  className="w-full btn-primary flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Video className="w-5 h-5" />
                  Unirse a la Consulta
                </motion.button>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -bottom-6 -left-6 glass-card-light p-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Diagnóstico</p>
                    <p className="font-semibold text-gray-900">Completado</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -top-4 -right-4 glass-card-light p-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-600/10 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tiempo de espera</p>
                    <p className="font-semibold text-emerald-600">~2 min</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                variants={item}
              >
                <motion.div 
                  className="glass-card-light p-6"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <p className="text-4xl font-bold text-teal-600">{stat.value}</p>
                  <p className="text-gray-600 mt-2 font-medium">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="características" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-teal-600/10 text-teal-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Características
            </span>
            <h2 className="text-4xl font-bold text-gray-900">
              Todo lo que necesitas para tu{' '}
              <span className="text-teal-600">salud</span>
            </h2>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
              Una plataforma completa diseñada para hacer tu experiencia médica más simple y efectiva.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={index} 
                  className="group"
                  variants={item}
                >
                  <motion.div 
                    className="glass-card-light p-8 h-full text-center"
                    whileHover={{ scale: 1.03, y: -8 }}
                  >
                    <div className={`w-16 h-16 rounded-2xl ${feature.color} mx-auto flex items-center justify-center shadow-lg mb-6 group-hover:shadow-xl transition-shadow`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-teal-600/10 text-teal-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Cómo Funciona
            </span>
            <h2 className="text-4xl font-bold text-gray-900">
              Tres pasos para cuidar tu{' '}
              <span className="text-teal-600">salud</span>
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
          >
            {[
              { step: '01', title: 'Regístrate', desc: 'Crea tu cuenta gratuita en menos de 2 minutos.', icon: Users },
              { step: '02', title: 'Busca un médico', desc: 'Encuentra el especialista perfecto para ti.', icon: Stethoscope },
              { step: '03', title: 'Consulta', desc: 'Conéctate por video o chat con tu médico.', icon: MessageCircle },
            ].map((stepItem, index) => {
              const Icon = stepItem.icon;
              return (
                <motion.div 
                  key={index}
                  className="relative"
                  variants={item}
                >
                  <motion.div 
                    className="glass-card-light p-8 text-center h-full"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-teal-600 mx-auto flex items-center justify-center shadow-lg mb-6">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-sm font-bold text-teal-600">Paso {stepItem.step}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{stepItem.title}</h3>
                    <p className="text-gray-600">{stepItem.desc}</p>
                  </motion.div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-teal-600/30" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-teal-600/10 text-teal-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Award className="w-4 h-4" />
              Testimonios
            </span>
            <h2 className="text-4xl font-bold text-gray-900">
              Lo que dicen nuestros{' '}
              <span className="text-teal-600">usuarios</span>
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={item}
              >
                <motion.div 
                  className="glass-card-light p-8 h-full"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
                      {testimonial.image}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            ¿Listo para cuidar tu salud?
          </motion.h2>
          <motion.p 
            className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Únete a más de 50,000 pacientes que ya confían en MedConsult para gestionar su salud.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/register">
              <motion.button
                className="inline-flex items-center gap-2 bg-white text-teal-700 px-10 py-5 rounded-2xl text-lg font-bold hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                Comenzar Gratis
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MedConsult</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                La plataforma líder en telemedicina. Conectamos pacientes con los mejores especialistas del país.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Médicos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© 2025 MedConsult. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
