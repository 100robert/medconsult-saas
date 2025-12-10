// ============================================
// SERVICIO DE MÉTRICAS DE SALUD
// ============================================

import { prisma } from '../config/database';
import { 
  CreateMetricaSaludDTO, 
  UpdateMetricaSaludDTO, 
  NotFoundError,
  ValidationError 
} from '../types';


export class MetricaSaludService {
  
  /**
   * Calcular edad a partir de fecha de nacimiento
   */
  private calcularEdad(fechaNacimiento: Date | null): number | null {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  /**
   * Calcular IMC
   */
  private calcularIMC(peso: number | undefined, altura: number | undefined): number | null {
    if (!peso || !altura || altura === 0) return null;
    return Number((peso / (altura * altura)).toFixed(2));
  }

  /**
   * Calcular ritmo cardíaco estimado
   * Fórmula: Ritmo cardíaco en reposo promedio (60-100 bpm)
   * Si hay edad: usar fórmula de ritmo cardíaco máximo (220 - edad) * 0.6-0.7
   * Valor por defecto: 72 bpm (promedio normal)
   */
  private calcularRitmoCardiaco(
    edad: number | null,
    peso?: number,
    altura?: number,
    ultimaMetrica?: any
  ): number {
    // Si hay una métrica anterior, usar un valor cercano (variación normal de ±5 bpm)
    if (ultimaMetrica?.ritmoCardiaco) {
      const variacion = Math.random() * 10 - 5; // -5 a +5
      const nuevoValor = Math.round(ultimaMetrica.ritmoCardiaco + variacion);
      // Asegurar que esté en rango normal (60-100 bpm)
      return Math.max(60, Math.min(100, nuevoValor));
    }

    // Si hay edad, calcular basado en edad
    if (edad !== null && edad > 0) {
      const ritmoMaximo = 220 - edad;
      // Ritmo en reposo es aproximadamente 60-70% del máximo
      const ritmoReposo = ritmoMaximo * 0.65;
      // Asegurar que esté en rango normal (60-100 bpm)
      return Math.max(60, Math.min(100, Math.round(ritmoReposo)));
    }

    // Valor por defecto: 72 bpm (promedio normal en reposo)
    return 72;
  }

  /**
   * Calcular presión arterial estimada
   * Valores normales: 120/80 mmHg
   * Si hay edad: ajustar ligeramente (aumenta con la edad)
   * Valor por defecto: 120/80 mmHg
   */
  private calcularPresionArterial(
    edad: number | null,
    peso?: number,
    altura?: number,
    ultimaMetrica?: any
  ): { sistolica: number; diastolica: number } {
    // Si hay una métrica anterior, usar valores cercanos
    if (ultimaMetrica?.presionSistolica && ultimaMetrica?.presionDiastolica) {
      const variacionSistolica = Math.random() * 10 - 5; // -5 a +5
      const variacionDiastolica = Math.random() * 6 - 3; // -3 a +3
      const nuevaSistolica = Math.round(ultimaMetrica.presionSistolica + variacionSistolica);
      const nuevaDiastolica = Math.round(ultimaMetrica.presionDiastolica + variacionDiastolica);
      // Asegurar rangos normales (sistólica: 90-140, diastólica: 60-90)
      return {
        sistolica: Math.max(90, Math.min(140, nuevaSistolica)),
        diastolica: Math.max(60, Math.min(90, nuevaDiastolica))
      };
    }

    // Si hay edad, ajustar ligeramente
    let sistolica = 120;
    let diastolica = 80;

    if (edad !== null && edad > 0) {
      // La presión sistólica aumenta aproximadamente 0.5 mmHg por año después de los 30
      if (edad > 30) {
        sistolica = 120 + Math.min((edad - 30) * 0.5, 20); // Máximo +20
      }
    }

    return {
      sistolica: Math.round(sistolica),
      diastolica: Math.round(diastolica)
    };
  }

  /**
   * Calcular glucosa estimada
   * Valores normales en ayunas: 70-100 mg/dL
   * Valor por defecto: 95 mg/dL (promedio normal)
   */
  private calcularGlucosa(
    edad: number | null,
    peso?: number,
    altura?: number,
    ultimaMetrica?: any
  ): number {
    // Si hay una métrica anterior, usar un valor cercano
    if (ultimaMetrica?.glucosa) {
      const variacion = Math.random() * 10 - 5; // -5 a +5
      const nuevoValor = Math.round(ultimaMetrica.glucosa + variacion);
      // Asegurar rango normal (70-100 mg/dL en ayunas)
      return Math.max(70, Math.min(100, nuevoValor));
    }

    // Si hay IMC, ajustar ligeramente (mayor IMC puede indicar mayor glucosa)
    if (peso && altura) {
      const imc = this.calcularIMC(peso, altura);
      if (imc) {
        // IMC normal (18.5-25): 85-95 mg/dL
        // IMC alto (>25): 90-100 mg/dL
        if (imc > 25) {
          const valor = Math.round(90 + Math.random() * 10); // 90-100
          return Math.max(70, Math.min(100, valor));
        } else {
          const valor = Math.round(85 + Math.random() * 10); // 85-95
          return Math.max(70, Math.min(100, valor));
        }
      }
    }

    // Valor por defecto: 95 mg/dL (promedio normal en ayunas)
    return 95;
  }

  /**
   * Crear nueva métrica de salud
   * Calcula automáticamente: ritmo cardíaco, presión arterial y glucosa
   */
  async crear(data: CreateMetricaSaludDTO) {
    console.log('📊 Creando métrica de salud para usuario:', data.idUsuario);
    console.log('📊 Datos recibidos:', data);

    // Verificar que el paciente existe y obtener datos necesarios
    let paciente = await prisma.paciente.findUnique({
      where: { idUsuario: data.idUsuario },
      include: {
        usuario: {
          select: {
            id: true,
          }
        }
      }
    });

    // Si el paciente no existe, crearlo automáticamente
    if (!paciente) {
      console.log('⚠️ Paciente no encontrado, creando perfil automáticamente...');
      
      // Verificar que el usuario existe
      const usuario = await prisma.usuario.findUnique({
        where: { id: data.idUsuario }
      });

      if (!usuario) {
        console.error('❌ Usuario no encontrado:', data.idUsuario);
        throw new NotFoundError('Usuario no encontrado');
      }

      // Crear perfil de paciente automáticamente
      paciente = await prisma.paciente.create({
        data: {
          idUsuario: data.idUsuario,
          // Dejar campos opcionales como null, el usuario puede completarlos después
        },
        include: {
          usuario: {
            select: {
              id: true,
            }
          }
        }
      });

      console.log('✅ Perfil de paciente creado automáticamente:', paciente.id);
    }

    console.log('✅ Paciente encontrado:', paciente.id);

    // Obtener última métrica para cálculos más precisos
    const ultimaMetrica = await prisma.metricaSalud.findFirst({
      where: { idPaciente: paciente.id },
      orderBy: { fechaRegistro: 'desc' },
    });

    // Calcular edad
    const edad = this.calcularEdad(paciente.fechaNacimiento);

    // Calcular métricas automáticamente
    const ritmoCardiaco = this.calcularRitmoCardiaco(
      edad,
      data.peso,
      data.altura,
      ultimaMetrica
    );

    const presionArterial = this.calcularPresionArterial(
      edad,
      data.peso,
      data.altura,
      ultimaMetrica
    );

    const glucosa = this.calcularGlucosa(
      edad,
      data.peso,
      data.altura,
      ultimaMetrica
    );

    console.log('📊 Métricas calculadas:', {
      ritmoCardiaco,
      presionArterial,
      glucosa,
      edad
    });

    try {
      const metrica = await prisma.metricaSalud.create({
        data: {
          idPaciente: paciente.id,
          // Valores calculados automáticamente
          ritmoCardiaco,
          presionSistolica: presionArterial.sistolica,
          presionDiastolica: presionArterial.diastolica,
          glucosa,
          // Valores ingresados por el paciente
          peso: data.peso,
          altura: data.altura,
          temperatura: data.temperatura,
          saturacionOxigeno: data.saturacionOxigeno,
          notas: data.notas,
          fechaRegistro: data.fechaRegistro ? new Date(data.fechaRegistro) : new Date(),
        },
        include: {
          paciente: {
            select: {
              id: true,
              idUsuario: true,
            }
          }
        }
      });

      console.log('✅ Métrica creada exitosamente:', metrica.id);
      return metrica;
    } catch (error: any) {
      console.error('❌ Error al crear métrica:', error);
      throw new ValidationError(`Error al guardar la métrica: ${error.message}`);
    }
  }

  /**
   * Obtener métricas de un paciente
   */
  async obtenerPorPaciente(idUsuario: string, limit: number = 30) {
    let paciente = await prisma.paciente.findUnique({
      where: { idUsuario }
    });

    // Si el paciente no existe, crear perfil automáticamente
    if (!paciente) {
      console.log('⚠️ Paciente no encontrado en obtenerPorPaciente, creando perfil automáticamente...');
      
      // Verificar que el usuario existe
      const usuario = await prisma.usuario.findUnique({
        where: { id: idUsuario }
      });

      if (!usuario) {
        throw new NotFoundError('Usuario no encontrado');
      }

      // Crear perfil de paciente automáticamente
      paciente = await prisma.paciente.create({
        data: {
          idUsuario: idUsuario,
        }
      });

      console.log('✅ Perfil de paciente creado automáticamente:', paciente.id);
    }

    const metricas = await prisma.metricaSalud.findMany({
      where: { idPaciente: paciente.id },
      orderBy: { fechaRegistro: 'desc' },
      take: limit,
    });

    return metricas;
  }

  /**
   * Obtener la última métrica de un paciente
   */
  async obtenerUltima(idUsuario: string) {
    let paciente = await prisma.paciente.findUnique({
      where: { idUsuario }
    });

    // Si el paciente no existe, crear perfil automáticamente
    if (!paciente) {
      console.log('⚠️ Paciente no encontrado en obtenerUltima, creando perfil automáticamente...');
      
      // Verificar que el usuario existe
      const usuario = await prisma.usuario.findUnique({
        where: { id: idUsuario }
      });

      if (!usuario) {
        throw new NotFoundError('Usuario no encontrado');
      }

      // Crear perfil de paciente automáticamente
      paciente = await prisma.paciente.create({
        data: {
          idUsuario: idUsuario,
        }
      });

      console.log('✅ Perfil de paciente creado automáticamente:', paciente.id);
    }

    const metrica = await prisma.metricaSalud.findFirst({ 
      where: { idPaciente: paciente.id },
      orderBy: { fechaRegistro: 'desc' },
    });

    return metrica;
  }

  /**
   * Actualizar métrica de salud
   * Recalcula automáticamente: ritmo cardíaco, presión arterial y glucosa
   */
  async actualizar(id: string, data: UpdateMetricaSaludDTO) {
    const metrica = await prisma.metricaSalud.findUnique({
      where: { id },
      include: {
        paciente: {
          include: {
            usuario: {
              select: {
                id: true,
              }
            }
          }
        }
      }
    });

    if (!metrica) {
      throw new NotFoundError('Métrica no encontrada');
    }

    // Obtener paciente para calcular edad
    const paciente = await prisma.paciente.findUnique({
      where: { id: metrica.idPaciente }
    });

    if (!paciente) {
      throw new NotFoundError('Paciente no encontrado');
    }

    // Obtener última métrica (excluyendo la actual) para cálculos
    const ultimaMetrica = await prisma.metricaSalud.findFirst({
      where: { 
        idPaciente: paciente.id,
        id: { not: id }
      },
      orderBy: { fechaRegistro: 'desc' },
    });

    // Calcular edad
    const edad = this.calcularEdad(paciente.fechaNacimiento);

    // Usar valores actuales o nuevos para cálculos
    // Convertir Decimal a number si es necesario
    const peso = data.peso ?? (metrica.peso ? Number(metrica.peso) : undefined);
    const altura = data.altura ?? (metrica.altura ? Number(metrica.altura) : undefined);

    // Recalcular métricas automáticamente si se actualizó peso o altura
    let ritmoCardiaco = metrica.ritmoCardiaco;
    let presionSistolica = metrica.presionSistolica;
    let presionDiastolica = metrica.presionDiastolica;
    let glucosa = metrica.glucosa ? Number(metrica.glucosa) : null;

    if (data.peso !== undefined || data.altura !== undefined) {
      const presionArterial = this.calcularPresionArterial(edad, peso, altura, ultimaMetrica);
      ritmoCardiaco = this.calcularRitmoCardiaco(edad, peso, altura, ultimaMetrica);
      presionSistolica = presionArterial.sistolica;
      presionDiastolica = presionArterial.diastolica;
      glucosa = this.calcularGlucosa(edad, peso, altura, ultimaMetrica);
    }

    const actualizada = await prisma.metricaSalud.update({
      where: { id },
      data: {
        ritmoCardiaco,
        presionSistolica,
        presionDiastolica,
        glucosa,
        peso: data.peso,
        altura: data.altura,
        temperatura: data.temperatura,
        saturacionOxigeno: data.saturacionOxigeno,
        notas: data.notas,
        fechaRegistro: data.fechaRegistro ? new Date(data.fechaRegistro) : undefined,
      },
    });

    return actualizada;
  }

  /**
   * Eliminar métrica de salud
   */
  async eliminar(id: string) {
    const metrica = await prisma.metricaSalud.findUnique({
      where: { id }
    });

    if (!metrica) {
      throw new NotFoundError('Métrica no encontrada');
    }

    await prisma.metricaSalud.delete({
      where: { id }
    });

    return { message: 'Métrica eliminada exitosamente' };
  }
}

export const metricaSaludService = new MetricaSaludService();

