import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ConflictException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  private rateLimiter = new RateLimiterMemory({
    points: 10, 
    duration: 60, 
  });

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const ip = req.ip || req.connection.remoteAddress; // Get the user's IP address

    try {
      await this.rateLimiter.consume(ip); // Consume 1 point per request
      return next.handle();
    } catch (e) {
      throw new ConflictException('Too many requests. Please try again later.');
    }
  }
}
