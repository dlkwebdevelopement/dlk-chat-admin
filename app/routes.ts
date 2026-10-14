import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('login', 'routes/login.tsx'),
  route('branding', 'routes/branding.tsx'),
  route('employees', 'routes/employees.tsx'),
  route('customers', 'routes/customers.tsx'),
  route('groups', 'routes/groups.tsx'),
  route('meetings', 'routes/meetings.tsx'),
  route('reports', 'routes/reports.tsx'),
  route('notifications', 'routes/notifications.tsx'),
  route('settings', 'routes/settings.tsx'),
] satisfies RouteConfig;
