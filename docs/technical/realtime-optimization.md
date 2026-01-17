# Real-time Order Notifications - Performance Optimization

## Problem with 10-Second Polling

The initial implementation used **10-second polling** to check for new orders, which has significant performance issues:

### Issues:
- **Database Load**: Every user polls every 10 seconds → 6 queries/minute per user
- **Network Overhead**: Constant HTTP requests even when nothing changes
- **Scaling Problems**: 100 users = 600 queries/minute just for checking new orders
- **Not Truly Real-time**: Up to 10-second delay before notifications appear
- **Battery Drain**: Constant polling on mobile devices

## Solution: Supabase Realtime

We've implemented **Supabase Realtime** which uses PostgreSQL replication to send updates only when data actually changes.

### Benefits:
- ✅ **Event-driven**: Only triggers when a new order is INSERTed
- ✅ **Zero polling overhead**: No database queries unless data changes
- ✅ **Instant notifications**: Updates appear immediately (sub-second latency)
- ✅ **Scalable**: Works efficiently with thousands of concurrent users
- ✅ **Battery friendly**: No constant network requests

### How It Works:

1. **Client subscribes** to Postgres changes on the `orders` table
2. **Supabase Realtime** listens to PostgreSQL replication logs
3. **When a new order is INSERTed**, Supabase sends a push notification to subscribed clients
4. **Toast notification** appears instantly without any polling

### Fallback Behavior:

If Supabase Realtime is unavailable (e.g., network issues, Realtime disabled), the system automatically falls back to **30-second polling** (reduced from 10 seconds to minimize impact).

## Setup Requirements

### 1. Enable Supabase Realtime

Supabase Realtime must be enabled for the `orders` table:

1. Go to your Supabase Dashboard
2. Navigate to **Database** → **Replication**
3. Enable replication for the `orders` table
4. Or run this SQL in the Supabase SQL Editor:

```sql
-- Enable Realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
```

### 2. Verify Realtime is Working

Check the browser console when loading the dashboard:
- ✅ `Subscribed to real-time order updates` = Realtime is working
- ⚠️ `Realtime unavailable, will use polling fallback` = Falling back to polling

## Implementation Details

### Files Changed:

1. **`src/hooks/use-realtime-orders.ts`** - New hook for Realtime subscriptions
2. **`src/app/dashboard/page.tsx`** - Updated to use Realtime instead of polling
3. **`src/hooks/use-orders.ts`** - Updated to support conditional polling

### Usage:

```typescript
// In dashboard component
const { realtimeAvailable } = useRealtimeOrders();

// Orders query only polls if Realtime is unavailable
const { data } = useOrders(filters, {
  refetchInterval: realtimeAvailable ? undefined : 30000
});
```

## Performance Comparison

| Metric | 10s Polling | Supabase Realtime |
|--------|-------------|-------------------|
| Database queries (100 users) | 600/min | 0 (only on INSERT) |
| Network requests (100 users) | 600/min | 0 (only on INSERT) |
| Notification latency | 0-10 seconds | <1 second |
| Battery impact | High | Minimal |
| Scalability | Poor | Excellent |

## Monitoring

To monitor Realtime performance:

1. **Browser Console**: Check subscription status messages
2. **Supabase Dashboard**: Monitor Realtime connections under **Realtime** → **Channels**
3. **Network Tab**: Verify WebSocket connection is established (ws:// or wss://)

## Troubleshooting

### Realtime Not Working?

1. **Check Replication**: Ensure `orders` table has Realtime enabled
2. **Check Network**: Verify WebSocket connections aren't blocked
3. **Check Console**: Look for subscription error messages
4. **Fallback**: System will automatically use 30s polling if Realtime fails

### Still Seeing Polling?

If you see frequent network requests in DevTools, Realtime may not be enabled. The system will automatically fall back to polling, but you should enable Realtime for optimal performance.

## Future Enhancements

- [ ] Add Realtime for order status updates (not just new orders)
- [ ] Add Realtime for inventory low-stock alerts
- [ ] Add Realtime for shipping label generation status
- [ ] Implement connection status indicator in UI
