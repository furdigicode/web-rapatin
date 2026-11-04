# Architecture rules
- Share pure Kirim.Chat text-variable parsing and component assembly in `supabase/functions/_shared/template-variables.ts`, imported by Follow Up and edge functions, so Header and Body semantics stay consistent without server-only dependencies.
- Keep Kirim.Chat legacy header-to-body compatibility opt-in per verified template so standard Header and Body parameters remain separate.- Hourly follow-up cron (`followup-cron`) reads MySQL users with no orders; dedup via successful non-test `followup_logs` rows so each member gets one message.
