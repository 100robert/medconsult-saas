// ============================================
// SERVICIO DE PAGOS
// ============================================

import { prisma } from '../config/database';
import { EstadoPago, MetodoPago } from '@prisma/client';
import {
  CreatePagoDTO,
  ProcesarPagoDTO,
  ReembolsoDTO,
  PagoFilters,
  ResumenPagos,
  NotFoundError,
  ConflictError,
  ValidationError,
  PaymentError
} from '../types';

export class PagoService {

  /**
   * Crear pago pendiente
   */
  async crear(data: CreatePagoDTO) {
    console.log('💳 Iniciando creación de pago:', data);

    // Verificar que la cita existe
    let cita;
    try {
      cita = await prisma.cita.findUnique({
        where: { id: data.idCita },
        include: {
          pago: true,
          paciente: true,
          medico: true
        }
      });
      console.log('✅ Cita encontrada para pago:', cita ? 'Sí' : 'No');
    } catch (dbError: any) {
      console.error('❌ Error buscando cita en DB:', dbError);
      throw new Error(`Error de base de datos al buscar cita: ${dbError.message}`);
    }

    if (!cita) {
      throw new NotFoundError('Cita no encontrada');
    }

    if (cita.pago) {
      throw new ConflictError('Ya existe un pago para esta cita');
    }

    if (data.monto <= 0) {
      throw new ValidationError('El monto debe ser mayor a 0');
    }

    // Calcular comisión y monto médico
    const comisionPorcentaje = 0.10; // 10% de comisión
    const comisionPlataforma = data.monto * comisionPorcentaje;
    const montoMedico = data.monto - comisionPlataforma;

    // Generar ID de transacción único
    const idTransaccion = await this.generarIdTransaccion();

    console.log('💳 Intentando guardar pago en DB:', {
      idCita: data.idCita,
      monto: data.monto,
      idTransaccion
    });

    try {
      const pago = await prisma.pago.create({
        data: {
          idCita: data.idCita,
          idPaciente: cita.idPaciente,
          idMedico: cita.idMedico,
          monto: data.monto,
          comisionPlataforma,
          montoMedico,
          moneda: data.moneda || 'USD',
          metodoPago: data.metodoPago || MetodoPago.TARJETA,
          idTransaccion,
          estado: EstadoPago.PENDIENTE,
        },
        include: {
          cita: true,
          paciente: {
            include: {
              usuario: {
                select: { nombre: true, apellido: true, correo: true }
              }
            }
          },
          medico: {
            include: {
              usuario: { select: { nombre: true, apellido: true } },
              especialidad: true
            }
          }
        }
      });
      console.log('✅ Pago guardado exitosamente:', pago.id);
      return pago;
    } catch (createError: any) {
      console.error('❌ Error creando registro de pago:', createError);
      throw new Error(`Error BD creando pago: ${createError.message}`);
    }
  }

  /**
   * Obtener pago por ID
   */
  async obtenerPorId(id: string) {
    const pago = await prisma.pago.findUnique({
      where: { id },
      include: {
        cita: true,
        paciente: {
          include: {
            usuario: {
              select: { nombre: true, apellido: true, correo: true }
            }
          }
        },
        medico: {
          include: {
            usuario: { select: { nombre: true, apellido: true } },
            especialidad: true
          }
        }
      }
    });

    if (!pago) {
      throw new NotFoundError('Pago no encontrado');
    }

    return pago;
  }

  /**
   * Obtener pago por ID de transacción
   */
  async obtenerPorTransaccion(idTransaccion: string) {
    const pago = await prisma.pago.findFirst({
      where: { idTransaccion },
      include: {
        cita: true,
        paciente: {
          include: {
            usuario: {
              select: { nombre: true, apellido: true }
            }
          }
        },
        medico: {
          include: {
            usuario: { select: { nombre: true, apellido: true } },
            especialidad: true
          }
        }
      }
    });

    if (!pago) {
      throw new NotFoundError('Pago no encontrado');
    }

    return pago;
  }

  /**
   * Procesar pago
   */
  async procesar(id: string, data: ProcesarPagoDTO) {
    const pago = await prisma.pago.findUnique({
      where: { id }
    });

    if (!pago) {
      throw new NotFoundError('Pago no encontrado');
    }

    if (pago.estado !== EstadoPago.PENDIENTE) {
      throw new ConflictError(`El pago no puede procesarse en estado ${pago.estado}`);
    }

    try {
      // Aquí iría la integración con el gateway de pagos (Stripe, PayPal, etc.)
      // Por ahora, simulamos el procesamiento
      const pagoExitoso = await this.simularProcesamiento(data);

      if (!pagoExitoso) {
        throw new PaymentError('El pago fue rechazado');
      }

      const pagoProcesado = await prisma.pago.update({
        where: { id },
        data: {
          estado: EstadoPago.COMPLETADO,
          metodoPago: data.metodoPago || pago.metodoPago,
          fechaProcesamiento: new Date(),
        },
        include: {
          paciente: {
            include: {
              usuario: {
                select: { nombre: true, apellido: true, correo: true }
              }
            }
          }
        }
      });

      return pagoProcesado;
    } catch (error) {
      // Marcar como fallido si hay error
      await prisma.pago.update({
        where: { id },
        data: {
          estado: EstadoPago.FALLIDO,
        }
      });

      throw error;
    }
  }

  /**
   * Reembolsar pago
   */
  async reembolsar(id: string, data: ReembolsoDTO) {
    const pago = await prisma.pago.findUnique({
      where: { id }
    });

    if (!pago) {
      throw new NotFoundError('Pago no encontrado');
    }

    if (pago.estado !== EstadoPago.COMPLETADO) {
      throw new ConflictError('Solo se pueden reembolsar pagos completados');
    }

    if (data.monto > Number(pago.monto)) {
      throw new ValidationError('El monto de reembolso no puede ser mayor al monto pagado');
    }

    // Aquí iría la lógica de reembolso con el gateway de pagos
    const reembolso = await prisma.pago.update({
      where: { id },
      data: {
        estado: EstadoPago.REEMBOLSADO,
        montoReembolsado: data.monto,
        razonReembolso: data.motivo,
      }
    });

    return reembolso;
  }

  /**
   * Cancelar pago pendiente
   */
  async cancelar(id: string, motivo: string) {
    const pago = await prisma.pago.findUnique({
      where: { id }
    });

    if (!pago) {
      throw new NotFoundError('Pago no encontrado');
    }

    if (pago.estado !== EstadoPago.PENDIENTE) {
      throw new ConflictError('Solo se pueden cancelar pagos pendientes');
    }

    const cancelado = await prisma.pago.update({
      where: { id },
      data: {
        estado: EstadoPago.FALLIDO,
        razonReembolso: `Cancelado: ${motivo}`,
      }
    });

    return cancelado;
  }

  /**
   * Obtener pagos de un paciente
   */
  async obtenerPorPaciente(idPaciente: string, filtros: PagoFilters = {}) {
    const { estado, metodoPago, fechaDesde, fechaHasta, page = 1, limit = 10 } = filtros;
    const skip = (page - 1) * limit;

    const where: any = { idPaciente };

    if (estado) where.estado = estado;
    if (metodoPago) where.metodoPago = metodoPago;
    if (fechaDesde || fechaHasta) {
      where.fechaCreacion = {};
      if (fechaDesde) where.fechaCreacion.gte = fechaDesde;
      if (fechaHasta) where.fechaCreacion.lte = fechaHasta;
    }

    const [pagos, total] = await Promise.all([
      prisma.pago.findMany({
        where,
        include: {
          cita: true,
          medico: {
            include: {
              usuario: { select: { nombre: true, apellido: true } },
              especialidad: true
            }
          }
        },
        orderBy: { fechaCreacion: 'desc' },
        skip,
        take: limit,
      }),
      prisma.pago.count({ where })
    ]);

    return {
      data: pagos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtener pagos de un médico
   */
  async obtenerPorMedico(idMedico: string, filtros: PagoFilters = {}) {
    const { estado, metodoPago, fechaDesde, fechaHasta, page = 1, limit = 10 } = filtros;
    const skip = (page - 1) * limit;

    const where: any = { idMedico };

    if (estado) where.estado = estado;
    if (metodoPago) where.metodoPago = metodoPago;
    if (fechaDesde || fechaHasta) {
      where.fechaCreacion = {};
      if (fechaDesde) where.fechaCreacion.gte = fechaDesde;
      if (fechaHasta) where.fechaCreacion.lte = fechaHasta;
    }

    const [pagos, total] = await Promise.all([
      prisma.pago.findMany({
        where,
        include: {
          cita: true,
          paciente: {
            include: {
              usuario: { select: { nombre: true, apellido: true } }
            }
          }
        },
        orderBy: { fechaCreacion: 'desc' },
        skip,
        take: limit,
      }),
      prisma.pago.count({ where })
    ]);

    return {
      data: pagos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtener resumen de pagos
   */
  async obtenerResumen(idMedico?: string, fechaDesde?: Date, fechaHasta?: Date): Promise<ResumenPagos> {
    const where: any = {};

    if (idMedico) where.idMedico = idMedico;
    if (fechaDesde || fechaHasta) {
      where.fechaCreacion = {};
      if (fechaDesde) where.fechaCreacion.gte = fechaDesde;
      if (fechaHasta) where.fechaCreacion.lte = fechaHasta;
    }

    // Obtener totales
    const [completados, pendientes, reembolsados, porMetodo] = await Promise.all([
      prisma.pago.aggregate({
        where: { ...where, estado: EstadoPago.COMPLETADO },
        _sum: { monto: true },
        _count: true
      }),
      prisma.pago.aggregate({
        where: { ...where, estado: EstadoPago.PENDIENTE },
        _sum: { monto: true },
        _count: true
      }),
      prisma.pago.aggregate({
        where: { ...where, estado: EstadoPago.REEMBOLSADO },
        _sum: { montoReembolsado: true },
        _count: true
      }),
      prisma.pago.groupBy({
        by: ['metodoPago'],
        where: { ...where, estado: EstadoPago.COMPLETADO },
        _sum: { monto: true },
        _count: true
      })
    ]);

    return {
      totalRecaudado: Number(completados._sum.monto) || 0,
      totalPendiente: Number(pendientes._sum.monto) || 0,
      totalReembolsado: Number(reembolsados._sum?.montoReembolsado) || 0,
      cantidadTransacciones: completados._count + pendientes._count,
      porMetodoPago: porMetodo.map(p => ({
        metodo: p.metodoPago,
        total: Number(p._sum.monto) || 0,
        cantidad: p._count
      }))
    };
  }

  /**
   * Generar ID de transacción único
   */
  private async generarIdTransaccion(): Promise<string> {
    const fecha = new Date();
    const year = fecha.getFullYear().toString().slice(-2);
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    return `PAY-${year}${month}${day}-${random}`;
  }

  /**
   * Simular procesamiento de pago (placeholder para integración real)
   */
  private async simularProcesamiento(_data: ProcesarPagoDTO): Promise<boolean> {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simular 95% de éxito
    return Math.random() > 0.05;
  }
}

export const pagoService = new PagoService();
