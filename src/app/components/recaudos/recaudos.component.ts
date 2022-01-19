import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { recaudoDTO } from 'src/app/interfaces/recaudosDTO';
import { RecaudosService } from 'src/app/services/recaudos.service';
import { fromMatPaginator, fromMatSort, paginateRows, sortRows } from 'src/app/utils/data-utils';
import { single } from './data';

@Component({
  selector: 'app-recaudos',
  templateUrl: './recaudos.component.html',
  styleUrls: ['./recaudos.component.css']
})
export class RecaudosComponent implements OnInit {
    
  
  /* PAGINACION */
  @ViewChild(MatPaginator, { read: MatPaginator, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  
  optData = 0;

  // TODO: variables grid, filtros
  listRecaudos: Array<recaudoDTO>=[]
  
  displayedRows$: Observable<recaudoDTO[]> | undefined;
  displayedRowsOutFilters$: Observable<recaudoDTO[]> | undefined;
  displayedRowsDetalle$: Observable<recaudoDTO[]> | undefined;
  totalRows$: Observable<number> | undefined;
  length=0;
  pageSize = 5;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];

  // TODO: variables grafica
  single: any[] = [];
  view: any[] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private recaudosService: RecaudosService) {
    Object.assign(this, { single });
  }

  ngOnInit(): void {
    this.getRecaudos();
  }

  getRecaudos() {
    this.recaudosService.getRecaudos().subscribe(resp=>{
      resp.table.forEach((element: recaudoDTO) => {
        this.listRecaudos.push(element)
      });
    },error=>{

    },()=>{
      const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
      const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);

      const rows$ = of(this.listRecaudos);

      this.totalRows$ = rows$.pipe(map(rows => rows.length));
      this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
      this.displayedRowsOutFilters$ = this.displayedRows$;
    })
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
