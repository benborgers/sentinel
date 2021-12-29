# Sentinel

Sentinel is my own little alternative to [Sentry](https://sentry.io), written with [Remix](https://remix.run).

Errors are reported via a `POST` request to `/report`, with a JSON body of this type:

```typescript
{
  appName: string;
  message: string;
  stack: string;
  metadata?: object;
}
```
