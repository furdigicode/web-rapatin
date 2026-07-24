Generate a new MCP_ADMIN_API_KEY

1. Use the secrets generator to mint a new cryptographically random value for `MCP_ADMIN_API_KEY` (64 characters) and store it in the project's Supabase secrets.
2. The new key will take effect immediately for the `mcp-blog` Edge Function; no code changes are required because the function already reads `MCP_ADMIN_API_KEY` from environment variables.
3. Optionally redeploy the `mcp-blog` Edge Function to ensure the runtime picks up the rotated secret cleanly.
4. Inform the user that the old key is invalidated as soon as the new one is stored, so any connected MCP clients must be updated with the new key.

No file edits or database migrations are needed.