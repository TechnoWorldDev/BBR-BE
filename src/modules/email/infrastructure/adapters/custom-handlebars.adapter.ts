import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as Handlebars from 'handlebars';

export class CustomHandlebarsAdapter extends HandlebarsAdapter {
  constructor() {
    super();
    
    // Register custom helpers
    Handlebars.registerHelper('formatDate', function(date: Date | string) {
      if (!date) return '';
      
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });

    Handlebars.registerHelper('formatCurrency', function(amount: number) {
      if (amount === null || amount === undefined) return '$0.00';
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    });

    Handlebars.registerHelper('multiply', function(a: number, b: number) {
      return a * b;
    });
  }
} 