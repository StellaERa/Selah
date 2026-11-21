import { Injectable, LoggerService } from '@nestjs/common';
import { mkdirSync } from 'node:fs';
import * as winston from 'winston';
import { LogContext } from '../types/trace-context.interface';
import { SecretsMaskingService } from '../../config/secrets-masking.service';

/**
 * Structured logging service using Winston
 * Integrates with distributed tracing for contextual logging
 */
@Injectable()
export class LoggingService implements LoggerService {
  private logger: winston.Logger;
  private requestContextStorage = new Map<string, LogContext>();

  constructor(private readonly secretsMaskingService: SecretsMaskingService) {
    mkdirSync('logs', { recursive: true });
    this.initializeLogger();
  }

  /**
   * Initialize Winston logger with structured format
   */
  private initializeLogger() {
    const customFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
      winston.format.printf(
        ({ level, message, timestamp, traceId, spanId, ...meta }) => {
          const context: Record<string, unknown> = {
            level,
            timestamp,
            message: this.sanitizeLogValue(message),
            ...(this.sanitizeLogValue(meta) as Record<string, unknown>),
          };
          if (traceId) context.traceId = traceId;
          if (spanId) context.spanId = spanId;
          return JSON.stringify(context);
        },
      ),
    );

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: customFormat,
      defaultMeta: {
        service: process.env.SERVICE_NAME || 'stellara-backend',
      },
      transports: [
        // Console transport for development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        // File transport for all logs
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 10485760, // 10MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 10485760, // 10MB
          maxFiles: 10,
        }),
      ],
    });
  }

  /**
   * Set request context for correlation across logs
   */
  setRequestContext(traceId: string, context: LogContext) {
    this.requestContextStorage.set(traceId, context);
  }

  /**
   * Get request context by trace ID
   */
  getRequestContext(traceId: string): LogContext | undefined {
    return this.requestContextStorage.get(traceId);
  }

  /**
   * Clear request context
   */
  clearRequestContext(traceId: string) {
    this.requestContextStorage.delete(traceId);
  }

  /**
   * Log info level message with context
   */
  info(message: string, context?: LogContext | Record<string, any>) {
    this.logger.info(message, context);
  }

  /**
   * Log an error using the Nest LoggerService signature.
   */
  error(message: any, ...optionalParams: any[]): void {
    this.write('error', message, optionalParams);
  }

  /**
   * Log a warning using the Nest LoggerService signature.
   */
  warn(message: any, ...optionalParams: any[]): void {
    this.write('warn', message, optionalParams);
  }

  /**
   * Log a debug message using the Nest LoggerService signature.
   */
  debug(message: any, ...optionalParams: any[]): void {
    this.write('debug', message, optionalParams);
  }

  /**
   * Log a message using the Nest LoggerService signature.
   */
  log(message: any, ...optionalParams: any[]): void {
    this.write('info', message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): void {
    this.write('verbose', message, optionalParams);
  }

  fatal(message: any, ...optionalParams: any[]): void {
    this.write('error', message, optionalParams);
  }

  private write(level: string, message: any, optionalParams: unknown[]) {
    const meta: Record<string, unknown> = {};
    for (const [index, param] of optionalParams.entries()) {
      if (typeof param === 'string') {
        meta[index === 0 && optionalParams.length > 1 ? 'stack' : 'context'] =
          param;
      } else if (param instanceof Error) {
        meta.error = param;
      } else if (param && typeof param === 'object' && !Array.isArray(param)) {
        Object.assign(meta, param);
      }
    }

    this.logger.log(level, message, meta);
  }

  private sanitizeLogValue(
    value: unknown,
    fieldName?: string,
    seen = new WeakSet<object>(),
  ): unknown {
    if (
      fieldName &&
      /password|passwd|secret|token|authorization|cookie|credential|private.?key|public.?key|mnemonic|seed|signature|api.?key|email|phone|address|wallet|user.?id|(?:^|_)ip(?:$|_)/i.test(
        fieldName,
      )
    ) {
      return '[REDACTED]';
    }

    if (typeof value === 'string') {
      return this.secretsMaskingService.mask(value);
    }

    if (value instanceof Error) {
      return this.sanitizeLogValue({
        name: value.name,
        message: value.message,
        stack: value.stack,
      });
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
      const sanitized = value.map((item) =>
        this.sanitizeLogValue(item, undefined, seen),
      );
      seen.delete(value);
      return sanitized;
    }

    if (value !== null && typeof value === 'object') {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
      const sanitized = Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
          key,
          this.sanitizeLogValue(item, key, seen),
        ]),
      );
      seen.delete(value);
      return sanitized;
    }

    return value;
  }

  /**
   * Get underlying Winston logger instance
   */
  getLogger(): winston.Logger {
    return this.logger;
  }
}
