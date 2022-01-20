export interface recaudoDTO
{    
    recaudoId: number;
    recaudoEstacion: string
    recaudoSentido: string
    recaudoHora: number;
    recaudoCategoria: string
    recaudoCantidad?: number;
    recaudoValorTabulado?: number
}


export interface recaudoInformeDTO
{    
    recaudoHora: number,
    grupo1C: number,
    grupo1R: number,
    grupo2C: number,
    grupo2R: number,
    grupo3C: number,
    grupo3R: number
}

