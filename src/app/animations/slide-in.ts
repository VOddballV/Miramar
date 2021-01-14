import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export const listAnimation = trigger('listAnimation', [
	transition('void => *', [ // each time the binding value changes
	  query(':enter', [
		style({ opacity: 0 }),
		stagger(100, [
		  animate('0.5s', style({ opacity: 1 }))
		])
	  ], { optional: true })
	])
  ]);

