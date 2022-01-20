import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { recaudoDTO, recaudoInformeDTO } from 'src/app/interfaces/recaudosDTO';
import { RecaudosService } from 'src/app/services/recaudos.service';
import { fromMatPaginator, fromMatSort, paginateRows, sortRows } from 'src/app/utils/data-utils';
import { multi } from './data';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-recaudos',
  templateUrl: './recaudos.component.html',
  styleUrls: ['./recaudos.component.css']
})
export class RecaudosComponent implements OnInit {
    
  
  /* PAGINACION */
  @ViewChild(MatPaginator, { read: MatPaginator, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatSort, { static: false }) sortDetalle: MatSort;
  @ViewChild(MatMenuTrigger, { static: true }) menu_1: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: true }) menu_2: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: true }) menu_3: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: true }) menu_4: MatMenuTrigger;

  optData = 0;

  // TODO: variables grid, filtros
  listRecaudos: Array<recaudoDTO>=[]
  listRecaudosAUX: Array<recaudoDTO>
  
  displayedRows$: Observable<recaudoDTO[]> | undefined;
  displayedRowsOutFilters$: Observable<recaudoDTO[]> | undefined;
  displayedRowsDetalle$: Observable<recaudoDTO[]> | undefined;
  totalRows$: Observable<number> | undefined;
  length=0;
  nRecaudos=0;
  pageSize = 5;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];


  /*Filtros*/
  filterDateEnd_1
  filterDate_1;
  filterDateIni_1;
  filterEndIni_1;
  filterSelected_1 = "1";
  filterInputValueEnd_1 = "";
  filterInputValueIni_1 = "";
  filterInputValue_1 = "";
  display_1 = true;

  
  display_2 = true;
  dataType_2 = "date";
  filterDate_2;
  filterDateIni_2;
  filterDateEnd_2;
  filterSelected_2 = "1";
  filterInputValueEnd_2 = "";
  filterInputValueIni_2 = "";
  filterInputValue_2 = "";

  
  display_3 = true;
  dataType_3 = "date";
  filterDate_3;
  filterDateIni_3;
  filterDateEnd_3;
  filterSelected_3 = "1";
  filterInputValueEnd_3 = "";
  filterInputValueIni_3 = "";
  filterInputValue_3 = "";

  
  display_4 = true;
  dataType_4 = "date";
  filterDate_4;
  filterDateIni_4;
  filterDateEnd_4;
  filterSelected_4 = "1";
  filterInputValueEnd_4 = "";
  filterInputValueIni_4 = "";
  filterInputValue_4 = "";

  /*Filtros*/

  /* grid informe */
  listRecaudosInforme: Array<recaudoInformeDTO>=[]
  listRecaudosInformeAUX: Array<recaudoInformeDTO>

  /* cantidades */
  cantTotalG1=0;
  cantTotalG2=0;
  cantTotalG3=0;
  recaudoTotalG1=0;
  recaudoTotalG2=0;
  recaudoTotalG3=0;

  // TODO: variables grafica
  multi: any[];
  view: any[] = [700, 400];


   // options
   showXAxis: boolean = true;
   showYAxis: boolean = true;
   gradient: boolean = true;
   showLegend: boolean = true;
   showXAxisLabel: boolean = true;
   xAxisLabel: string = 'Horas';
   showYAxisLabel: boolean = true;
   yAxisLabel: string = 'Numero de vehiculos';
   legendTitle: string = 'Vehiculos';
 
   colorScheme = {
     domain: ['#5AA454', '#C7B42C', '#AAAAAA']
   };

  constructor(private recaudosService: RecaudosService) {
    Object.assign(this, { multi })
  }

  ngOnInit(): void {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Bienvenido',
      showConfirmButton: false,
      timer: 2500
    })
    this.getRecaudos();
    this.getInformeRecaudos();
  }

  getRecaudos() {
    this.recaudosService.getRecaudos().subscribe(resp=>{
      resp.table.forEach((element: recaudoDTO) => {
        this.listRecaudos.push(element)
      });
      this.nRecaudos=this.listRecaudos.length;
    },error=>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Hubo un error al conectarse al servicio"
      });
    },()=>{
      const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
      const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);

      const rows$ = of(this.listRecaudos);

      this.totalRows$ = rows$.pipe(map(rows => rows.length));
      this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
      this.displayedRowsOutFilters$ = this.displayedRows$;
    })
  }

  getInformeRecaudos() {
    this.recaudosService.getInformeRecaudos().subscribe(resp=>{
      resp.table.forEach((element: recaudoInformeDTO) => {
        this.listRecaudosInforme.push(element)
      });
    },error=>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Hubo un error al conectarse al servicio"
      });
    },()=>{
      this.multi=[]
      let multiItem
      this.listRecaudosInforme.forEach(element => {      
        this.cantTotalG1+=element.grupo1C;
        this.cantTotalG2+=element.grupo2C;
        this.cantTotalG3+=element.grupo3C;
        this.recaudoTotalG1+=element.grupo1R;
        this.recaudoTotalG2+=element.grupo2R;
        this.recaudoTotalG3+=element.grupo3R;

        if(element.recaudoHora<13){
          multiItem = 
            {
              "name": element.recaudoHora,
              "series": [
                {
                  "name": "carros",
                  "value": element.grupo1C+element.grupo2C+element.grupo3C
                }
              ]
            };
          this.multi.push(multiItem)
        }
      });
    })
  }

  filterHora(condicion: string, param?: any, paramIni?: any, paramEnd?: any) {
   // this.loaderService.display(true);
    if (this.listRecaudosAUX == undefined) {

      this.listRecaudosAUX = [];
      this.listRecaudosAUX = this.listRecaudos;
    }
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);


    switch (condicion) {
      case "1": {
        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoHora == param);

        break;
      }
      case "2": {
        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoHora.toString().includes(param));

        break;
      }
      case "3": {


        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoHora != param);
        break;

      }
      case "4": {
        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoHora >= paramIni && y.recaudoHora <= paramEnd);

        break;
      }
      case "5": {
        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoHora < param);
        break;
      }
      case "6": {
        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoHora > param);
        break;
      }
      default: {
        this.listRecaudos = this.listRecaudosAUX;
        this.displayedRows$ = this.displayedRowsOutFilters$;
        break;
      }
    }

    const rows$ = of(this.listRecaudos);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
    this.menu_1.closeMenu();
    //this.loaderService.display(false);

  }

  filterEstacion(condicion: string, param?: any, paramIni?: any, paramEnd?: any) {
    // this.loaderService.display(true);


    if (this.listRecaudosAUX == undefined) {

      this.listRecaudosAUX = [];
      this.listRecaudosAUX = this.listRecaudos;
    } 
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);


    switch (condicion) {
      case "1": {
        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoEstacion.toUpperCase() == param.toUpperCase());
        break;
      }
      case "2": {
        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoEstacion.toUpperCase().includes(param.toUpperCase()));
        break;
      }
      case "3": {

        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoEstacion.toUpperCase() != param.toUpperCase());
        break;

      }

      default: {
        this.listRecaudos = this.listRecaudosAUX;
        this.displayedRows$ = this.displayedRowsOutFilters$;
        break;
      }
    }

    const rows$ = of(this.listRecaudos);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
    this.menu_4.closeMenu();
    // this.loaderService.display(false);

  }

  filterSentido(condicion: string, param?: any, paramIni?: any, paramEnd?: any) {
    // this.loaderService.display(true);


    if (this.listRecaudosAUX == undefined) {

      this.listRecaudosAUX = [];
      this.listRecaudosAUX = this.listRecaudos;
    } 
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);


    switch (condicion) {
      case "1": {
        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoSentido.toUpperCase() == param.toUpperCase());
        break;
      }
      case "2": {
        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoSentido.toUpperCase().includes(param.toUpperCase()));
        break;
      }
      case "3": {

        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoSentido.toUpperCase() != param.toUpperCase());
        break;

      }

      default: {
        this.listRecaudos = this.listRecaudosAUX;
        this.displayedRows$ = this.displayedRowsOutFilters$;
        break;
      }
    }

    const rows$ = of(this.listRecaudos);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
    this.menu_4.closeMenu();
    // this.loaderService.display(false);

  }

  filterCategoria(condicion: string, param?: any, paramIni?: any, paramEnd?: any) {
    // this.loaderService.display(true);


    if (this.listRecaudosAUX == undefined) {

      this.listRecaudosAUX = [];
      this.listRecaudosAUX = this.listRecaudos;
    } 
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);


    switch (condicion) {
      case "1": {
        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoCategoria.toUpperCase() == param.toUpperCase());
        break;
      }
      case "2": {
        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoCategoria.toUpperCase().includes(param.toUpperCase()));
        break;
      }
      case "3": {

        this.listRecaudos = this.listRecaudos.filter(y => y.recaudoCategoria.toUpperCase() != param.toUpperCase());
        break;

      }

      default: {
        this.listRecaudos = this.listRecaudosAUX;
        this.displayedRows$ = this.displayedRowsOutFilters$;
        break;
      }
    }

    const rows$ = of(this.listRecaudos);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
    this.menu_4.closeMenu();
    // this.loaderService.display(false);

  }



  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
